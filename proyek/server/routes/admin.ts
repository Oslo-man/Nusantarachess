"use strict";
const express = require("express");
const router = express.Router();

const requireAuth = require("../lib/require-auth");
const usersRepo = require("../lib/users-repo");
const security = require("../lib/security");
const oneTimeKeys = require("../lib/one-time-keys");
const { isValidCountryCode, DEFAULT_COUNTRY_CODE } = require("../lib/countries");

const { PLAYER_ELO_MIN, PLAYER_ELO_MAX, UCI_ELO_MIN, UCI_ELO_MAX } = require("../lib/elo-ranges");

const OFFICIAL_TITLES = ["CM", "NM", "FM", "IM", "GM", "WCM", "WFM", "WIM", "WGM"];

const AVATAR_DATA_URL_RE = /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+\/=]+$/;
const AVATAR_MAX_CHARS = 100000;

function requireAdminUnlocked(req: SrvReq, res: SrvRes, next: SrvNext) {
  if (!req.user.isAdminUnlocked) {
    return res.status(403).json({ error: "Fitur admin belum dibuka. Masukkan kode akses terlebih dahulu." });
  }
  next();
}

const KEY_ERRORS: Record<string, any> = {
  invalid: "Kode akses salah.",
  wrong_type: "Kode ini bukan untuk fitur ini.",
  used: "Kode ini sudah pernah dipakai."
};

router.post("/verify", requireAuth, security.keyGuessLimiter, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const code = (req.body || {}).code;
    const check = await oneTimeKeys.checkKey(typeof code === "string" ? code : "", "admin");
    if (!check.ok) {
      return res.status(403).json({ valid: false, error: KEY_ERRORS[check.reason] || KEY_ERRORS.invalid });
    }
    if (req.user.isAdminUnlocked) {
      return res.status(409).json({
        valid: false,
        code: "ADMIN_ALREADY_UNLOCKED",
        error: "Fitur admin sudah aktif di akun ini. Kode tidak dipakai."
      });
    }
    const consumed = await oneTimeKeys.consumeKey(check.normalized, "admin", req.user.id);
    if (!consumed) {
      return res.status(403).json({ valid: false, error: KEY_ERRORS.used });
    }
    let updated;
    try {
      updated = await usersRepo.adminUpdateUser(req.user.id, { isAdminUnlocked: true });
    } catch (err: any) {
      await oneTimeKeys.releaseKey(check.normalized, req.user.id);
      throw err;
    }
    res.json({ valid: true, user: updated });
  } catch (err: any) {
    next(err);
  }
});

router.patch("/elo", requireAuth, requireAdminUnlocked, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const body = req.body || {};
    const patch: Record<string, any> = {};
    for (const key of ["eloBullet", "eloBlitz", "eloRapid"]) {
      if (!Object.prototype.hasOwnProperty.call(body, key)) continue;
      const v = body[key];
      if (typeof v !== "number" || !Number.isFinite(v)) {
        return res.status(400).json({ error: key + " harus berupa angka." });
      }
      patch[key] = Math.max(PLAYER_ELO_MIN, Math.min(PLAYER_ELO_MAX, Math.round(v)));
    }
    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ error: "Tidak ada field Elo yang dikirim (eloBullet/eloBlitz/eloRapid)." });
    }
    const updated = await usersRepo.adminUpdateUser(req.user.id, patch);
    res.json({ user: updated });
  } catch (err: any) {
    next(err);
  }
});

router.patch("/elo-protection", requireAuth, requireAdminUnlocked, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const enabled = !!(req.body || {}).enabled;
    const updated = await usersRepo.adminUpdateUser(req.user.id, { eloProtected: enabled });
    res.json({ user: updated });
  } catch (err: any) {
    next(err);
  }
});

router.post("/custom-opponent", requireAuth, requireAdminUnlocked, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const body = req.body || {};
    const name = security.cleanDisplayText(body.name, 40);
    if (!name || name === "__proto__" || name === "constructor" || name === "prototype") {
      return res.status(400).json({ error: "Nama lawan custom wajib diisi." });
    }
    const elo = typeof body.elo === "number" ? Math.round(body.elo) : NaN;
    if (!Number.isFinite(elo) || elo < UCI_ELO_MIN || elo > UCI_ELO_MAX) {
      return res.status(400).json({ error: "Elo lawan custom harus angka antara " + UCI_ELO_MIN + " dan " + UCI_ELO_MAX + "." });
    }
    const rawTitle = typeof body.title === "string" ? body.title.trim().toUpperCase() : "";
    if (rawTitle && OFFICIAL_TITLES.indexOf(rawTitle) === -1) {
      return res.status(400).json({ error: "Gelar lawan custom tidak valid. Pilih salah satu: " + OFFICIAL_TITLES.join(", ") + "." });
    }
    const title = rawTitle;
    const avatar = typeof body.avatar === "string" && body.avatar ? (security.cleanDisplayText(body.avatar, 8) || "🤖") : "🤖";
    let country = DEFAULT_COUNTRY_CODE;
    if (body.country !== undefined && body.country !== null && body.country !== "") {
      if (!isValidCountryCode(body.country)) {
        return res.status(400).json({ error: "Negara lawan custom tidak valid." });
      }
      country = body.country;
    }
    const customOpponent = { name, elo, title, avatar, country };
    const patch: Record<string, any> = { customOpponent: JSON.stringify(customOpponent) };

    let previous = null;
    try { previous = req.user.customOpponent ? JSON.parse(req.user.customOpponent) : null; } catch (e: any) { previous = null; }
    const renamed = !!(previous && previous.name && previous.name !== name);
    if (body.avatarImage !== undefined && body.avatarImage !== null && body.avatarImage !== "") {
      const avatarImage = body.avatarImage;
      if (typeof avatarImage !== "string" || !AVATAR_DATA_URL_RE.test(avatarImage)) {
        return res.status(400).json({ error: "Format foto lawan custom tidak valid (PNG/JPEG/WebP)." });
      }
      if (avatarImage.length > AVATAR_MAX_CHARS) {
        return res.status(413).json({ error: "Foto terlalu besar." });
      }
      const overrides = parseBotAvatarOverrides(req.user);
      overrides[name] = avatarImage;
      if (renamed) delete overrides[previous.name];
      patch.botAvatarOverrides = JSON.stringify(overrides);
    } else if (renamed) {
      const overrides = parseBotAvatarOverrides(req.user);
      if (overrides[previous.name] && !overrides[name]) {
        overrides[name] = overrides[previous.name];
        delete overrides[previous.name];
        patch.botAvatarOverrides = JSON.stringify(overrides);
      }
    }

    const updated = await usersRepo.adminUpdateUser(req.user.id, patch);
    res.json({ user: updated });
  } catch (err: any) {
    next(err);
  }
});

router.delete("/custom-opponent", requireAuth, requireAdminUnlocked, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const patch: Record<string, any> = { customOpponent: "" };
    let previous = null;
    try { previous = req.user.customOpponent ? JSON.parse(req.user.customOpponent) : null; } catch (e: any) { previous = null; }
    if (previous && previous.name) {
      const overrides = parseBotAvatarOverrides(req.user);
      if (overrides[previous.name]) {
        delete overrides[previous.name];
        patch.botAvatarOverrides = JSON.stringify(overrides);
      }
    }
    const updated = await usersRepo.adminUpdateUser(req.user.id, patch);
    res.json({ user: updated });
  } catch (err: any) {
    next(err);
  }
});

function parseBotAvatarOverrides(user: any) {
  if (!user.botAvatarOverrides) return {};
  try {
    const parsed = JSON.parse(user.botAvatarOverrides);
    return (parsed && typeof parsed === "object" && !Array.isArray(parsed)) ? parsed : {};
  } catch (e: any) {
    return {};
  }
}

module.exports = router;
