"use strict";
const express = require("express");
const router = express.Router();

const crypto = require("crypto");
const usersRepo = require("../lib/users-repo");
const { hashPassword, verifyPassword, burnPasswordCheck, signToken, verifyToken, hashToken } = require("../lib/auth");
const security = require("../lib/security");
const requireAuth = require("../lib/require-auth");
const { protectedTierKeyForBase } = require("../lib/level-tiers");
const oneTimeKeys = require("../lib/one-time-keys");
const { isValidCountryCode } = require("../lib/countries");
const { PLAYER_ELO_MIN, PLAYER_ELO_MAX } = require("../lib/elo-ranges");

const USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/;

const PASSWORD_MAX_REGISTER = 128;
const PASSWORD_MAX_LOGIN = 256;

const MIN15 = 15 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const registerLimiter = security.limit({
  name: "register", windowMs: HOUR,
  rulesFor: (req: SrvReq) => [{ key: "ip:" + security.clientIp(req), max: 10 }]
});
const guestLimiter = security.limit({
  name: "guest", windowMs: HOUR,
  rulesFor: (req: SrvReq) => [{ key: "ip:" + security.clientIp(req), max: 30 }]
});
const loginLimiter = security.limit({
  name: "login", windowMs: MIN15,
  rulesFor: (req: SrvReq) => {
    const rules = [{ key: "ip:" + security.clientIp(req), max: 20 }];
    const u = req.body && req.body.username;
    if (typeof u === "string" && u.length > 0) rules.push({ key: "user:" + u.toLowerCase().slice(0, 64), max: 10 });
    return rules;
  }
});
const keyGuessLimiter = security.keyGuessLimiter;

function publicUser(u: any) {
  const { passHash, ...rest } = u;
  return rest;
}

router.post("/register", registerLimiter, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const { username, password, country } = req.body || {};
    if (typeof username !== "string" || !USERNAME_RE.test(username)) {
      return res.status(400).json({ error: "Username harus 3-20 karakter, huruf/angka/underscore saja." });
    }
    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ error: "Password minimal 6 karakter." });
    }
    if (password.length > PASSWORD_MAX_REGISTER) {
      return res.status(400).json({ error: "Password maksimal " + PASSWORD_MAX_REGISTER + " karakter." });
    }
    if (country !== undefined && country !== null && country !== "" && !isValidCountryCode(country)) {
      return res.status(400).json({ error: "Negara tidak valid." });
    }
    if (await usersRepo.usernameTaken(username)) {
      return res.status(409).json({ error: "Username sudah dipakai." });
    }
    const passHash = hashPassword(password);
    const user = await usersRepo.createUser(username, passHash, typeof country === "string" ? country : "");
    const token = signToken(user.id, user.username);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err: any) {
    next(err);
  }
});

router.post("/guest", guestLimiter, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    let user = null;
    for (let attempt = 0; attempt < 5 && !user; attempt++) {
      const candidate = "Tamu" + crypto.randomInt(10000000, 99999999);
      if (await usersRepo.usernameTaken(candidate)) continue;
      const randomPassword = crypto.randomBytes(24).toString("hex");
      const passHash = hashPassword(randomPassword);
      try {
        user = await usersRepo.createGuestUser(candidate, passHash);
      } catch (e: any) {
        user = null;
      }
    }
    if (!user) {
      return res.status(500).json({ error: "Gagal membuat sesi tamu. Coba lagi." });
    }
    const token = signToken(user.id, user.username);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err: any) {
    next(err);
  }
});

router.post("/login", loginLimiter, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const { username, password } = req.body || {};
    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Username dan password wajib diisi." });
    }
    const genericError = { error: "Username atau password salah." };
    if (username.length > 64 || password.length > PASSWORD_MAX_LOGIN) {
      return res.status(401).json(genericError);
    }
    const row = await usersRepo.findByUsername(username);
    if (!row) {
      burnPasswordCheck(password);
      security.securityLog("login_failed", req, { userHash: security.shortHash(username.toLowerCase()), reason: "unknown_user" });
      return res.status(401).json(genericError);
    }
    if (!verifyPassword(password, row.passHash)) {
      security.securityLog("login_failed", req, { userHash: security.shortHash(username.toLowerCase()), reason: "bad_password" });
      return res.status(401).json(genericError);
    }

    const token = signToken(row.id, row.username);
    res.json({ token, user: publicUser(row) });
  } catch (err: any) {
    next(err);
  }
});

router.get("/me", requireAuth, (req: SrvReq, res: SrvRes) => {
  res.json({ user: req.user });
});

router.post("/logout", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const payload = verifyToken(req.authToken);
    const expMs = payload && typeof payload.exp === "number" ? payload.exp * 1000 : Date.now() + 30 * 24 * 3600 * 1000;
    await usersRepo.revokeToken(hashToken(req.authToken), expMs);
    res.json({ ok: true });
  } catch (err: any) {
    next(err);
  }
});

const ELO_MIN = PLAYER_ELO_MIN, ELO_MAX = PLAYER_ELO_MAX;
const LEVEL_ONLY_ONCE_KEYS = ["levelChosen", "eloBullet", "eloBlitz", "eloRapid", "puzzleRating"];

const START_LEVEL_BASES = [1400, 1800, 2200, 2500, 2700, 3000, 3100];

const LEVEL_KEY_ERRORS: Record<string, any> = {
  invalid: "Kode salah untuk level ini.",
  wrong_type: "Kode ini bukan untuk level ini.",
  used: "Kode ini sudah pernah dipakai."
};

router.post("/verify-level-password", requireAuth, keyGuessLimiter, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const body = req.body || {};
    const base = typeof body.base === "number" ? body.base : parseInt(body.base, 10);
    const password = body.password;
    const tierKey = protectedTierKeyForBase(base);
    if (!tierKey) {
      return res.json({ valid: false, reason: "invalid" });
    }
    const check = await oneTimeKeys.checkKey(typeof password === "string" ? password : "", tierKey);
    if (!check.ok) return res.json({ valid: false, reason: check.reason });
    res.json({ valid: true });
  } catch (err: any) {
    next(err);
  }
});

router.patch("/me", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const body = req.body || {};
    const allowedKeys = ["profilePhoto", "levelChosen", "eloBullet", "eloBlitz", "eloRapid", "puzzleRating"];
    const patch: Record<string, any> = {};
    for (const key of allowedKeys) {
      if (Object.prototype.hasOwnProperty.call(body, key)) patch[key] = body[key];
    }
    if (Object.prototype.hasOwnProperty.call(body, "levelPassword")) {
      const allowed = await security.consume(req, res, { name: "keyguess", windowMs: security.KEY_GUESS_WINDOW_MS, rules: security.KEY_GUESS_RULES(req) });
      if (!allowed) return;
    }
    let tierKey = null;
    let pendingKey = null;

    const triesToSetLevel = LEVEL_ONLY_ONCE_KEYS.some(k => Object.prototype.hasOwnProperty.call(patch, k));
    if (triesToSetLevel) {
      if (req.user.levelChosen) {
        return res.status(403).json({
          error: "Level awal/Elo hanya bisa ditetapkan sekali dan sudah pernah dipilih.",
          code: "LEVEL_ALREADY_CHOSEN"
        });
      }
      if (Object.prototype.hasOwnProperty.call(patch, "levelChosen") && patch.levelChosen !== true && patch.levelChosen !== 1) {
        return res.status(400).json({ error: "levelChosen tidak valid." });
      }
      patch.levelChosen = true;
      const presentEloValues: any[] = [];
      for (const eloKey of ["eloBullet", "eloBlitz", "eloRapid", "puzzleRating"]) {
        if (Object.prototype.hasOwnProperty.call(patch, eloKey)) {
          const v = patch[eloKey];
          if (typeof v !== "number" || !Number.isFinite(v) || v < ELO_MIN || v > ELO_MAX) {
            return res.status(400).json({ error: eloKey + " harus angka antara " + ELO_MIN + " dan " + ELO_MAX + "." });
          }
          presentEloValues.push(v);
        }
      }
      if (presentEloValues.length > 0 &&
          (presentEloValues.some(v => v !== presentEloValues[0]) || START_LEVEL_BASES.indexOf(presentEloValues[0]) === -1)) {
        return res.status(400).json({ error: "Level awal tidak valid." });
      }

      const baseToCheck = presentEloValues.length > 0 ? presentEloValues[0] : undefined;
      tierKey = baseToCheck !== undefined ? protectedTierKeyForBase(baseToCheck) : null;
      if (tierKey) {
        const levelPassword = body.levelPassword;
        const check = await oneTimeKeys.checkKey(typeof levelPassword === "string" ? levelPassword : "", tierKey);
        if (!check.ok) {
          return res.status(403).json({ error: LEVEL_KEY_ERRORS[check.reason] || LEVEL_KEY_ERRORS.invalid });
        }
        pendingKey = check.normalized;
      }
    }

    if (typeof patch.profilePhoto === "string" && patch.profilePhoto.length > 100000) {
      return res.status(413).json({ error: "Foto profil terlalu besar." });
    }
    if (Object.prototype.hasOwnProperty.call(patch, "profilePhoto")) {
      const photo = patch.profilePhoto;
      if (photo !== "" && !security.isSafeImageDataUrl(photo, 100000)) {
        return res.status(400).json({ error: "Format foto profil tidak valid (PNG/JPEG/WebP)." });
      }
    }
    if (Object.prototype.hasOwnProperty.call(body, "username")) {
      if (req.user.isGuest) {
        return res.status(403).json({ error: "Akun tamu tidak dapat mengganti nama." });
      }
      if (typeof body.username !== "string" || !USERNAME_RE.test(body.username)) {
        return res.status(400).json({ error: "Username harus 3-20 karakter, huruf/angka/underscore saja." });
      }
      if (body.username !== req.user.username) {
        const allowedRename = await security.consume(req, res, { name: "rename", windowMs: HOUR, rules: [{ key: "user:" + req.user.id, max: 10 }] });
        if (!allowedRename) return;
        if (await usersRepo.usernameTaken(body.username)) {
          return res.status(409).json({ error: "Username sudah dipakai." });
        }
        try {
          await usersRepo.updateUsername(req.user.id, body.username);
        } catch (err: any) {
          if (err && err.code === "23505") return res.status(409).json({ error: "Username sudah dipakai." });
          throw err;
        }
      }
    }
    if (pendingKey) {
      const consumed = await oneTimeKeys.consumeKey(pendingKey, tierKey, req.user.id);
      if (!consumed) return res.status(403).json({ error: LEVEL_KEY_ERRORS.used });
    }
    let updated;
    try {
      updated = await usersRepo.updateUser(req.user.id, patch);
    } catch (err: any) {
      if (pendingKey) await oneTimeKeys.releaseKey(pendingKey, req.user.id);
      throw err;
    }
    res.json({ user: updated });
  } catch (err: any) {
    next(err);
  }
});

module.exports = router;
