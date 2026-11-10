"use strict";
const crypto = require("crypto");
const db = require("./db");

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CHECK_LEN = 8;

const MIN_SECRET_LEN = 16;
let warnedNoSecret = false;

const KEY_SPECS: Record<string, any> = {
  master:      { prefix: "MST", payload: [5, 5, 5],    check: [8] },
  grandmaster: { prefix: "GMR", payload: [4, 4, 4, 4], check: [4, 4] },
  supergm:     { prefix: "SGM", payload: [8, 8],       check: [8] },
  admin:       { prefix: "ADM", payload: [6, 6, 6],    check: [4, 4] }
};

(function buildPatterns() {
  const grp = (n: any) => "[" + ALPHABET + "]{" + n + "}";
  for (const type of Object.keys(KEY_SPECS)) {
    const s = KEY_SPECS[type];
    s.re = new RegExp("^" + s.prefix + "-" + s.payload.map(grp).join("-") + "-" + s.check.map(grp).join("-") + "$");
  }
})();

// TIDAK ada rahasia bawaan: bila ONE_TIME_KEY_SECRET kosong / < 16 karakter, semua kunci ditolak.
function resolveSecret(): string | null {
  const envVal = process.env.ONE_TIME_KEY_SECRET;
  if (typeof envVal === "string" && envVal.length >= MIN_SECRET_LEN) return envVal;
  if (!warnedNoSecret) {
    warnedNoSecret = true;
    console.error("[one-time-keys] ONE_TIME_KEY_SECRET kosong atau < " + MIN_SECRET_LEN + " karakter: SEMUA kunci Master/Grandmaster/Super GM/Admin ditolak sampai env ini diisi.");
  }
  return null;
}

function computeCheck(type: any, payload: any, secret: string) {
  const mac = crypto.createHmac("sha256", secret).update(type + ":" + payload).digest();
  let out = "";
  for (let i = 0; i < CHECK_LEN; i++) out += ALPHABET[mac[i] & 31];
  return out;
}

function parseKey(input: any) {
  if (typeof input !== "string" || input.length === 0 || input.length > 100) return null;
  const secret = resolveSecret();
  if (secret === null) return null;
  const k = input.trim().toUpperCase();
  for (const type of Object.keys(KEY_SPECS)) {
    const spec = KEY_SPECS[type];
    if (!spec.re.test(k)) continue;
    const parts = k.split("-");
    const n = spec.payload.length;
    const payload = parts.slice(1, 1 + n).join("");
    const check = parts.slice(1 + n).join("");
    const expected = computeCheck(type, payload, secret);
    const a = Buffer.from(check);
    const b = Buffer.from(expected);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) return { type, normalized: k };
    return null;
  }
  return null;
}

function keyHash(normalized: any) {
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

async function checkKey(input: any, expectedType: any) {
  const parsed = parseKey(input);
  if (!parsed) return { ok: false, reason: "invalid" };
  if (parsed.type !== expectedType) return { ok: false, reason: "wrong_type" };
  await db.ensureSchema();
  const { rows } = await db.query("SELECT 1 FROM one_time_keys WHERE key_hash = $1", [keyHash(parsed.normalized)]);
  if (rows.length > 0) return { ok: false, reason: "used" };
  return { ok: true, normalized: parsed.normalized, type: parsed.type };
}

async function consumeKey(normalized: any, type: any, userId: any) {
  await db.ensureSchema();
  const { rowCount } = await db.query(
    `INSERT INTO one_time_keys (key_hash, key_type, used_by, used_at)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (key_hash) DO NOTHING`,
    [keyHash(normalized), type, userId, Date.now()]
  );
  return rowCount === 1;
}

async function releaseKey(normalized: any, userId: any) {
  try {
    await db.query("DELETE FROM one_time_keys WHERE key_hash = $1 AND used_by = $2", [keyHash(normalized), userId]);
  } catch (e: any) {
    console.error("[one-time-keys] Gagal mengembalikan kunci setelah error:", e.message);
  }
}

module.exports = { KEY_SPECS, ALPHABET, parseKey, computeCheck, checkKey, consumeKey, releaseKey };
