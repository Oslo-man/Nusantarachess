"use strict";
const crypto = require("crypto");

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function isProd() {
  return process.env.NODE_ENV === "production" || !!process.env.VERCEL;
}

function sendJson(res: SrvRes, status: any, body: any) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function trustProxy() {
  return !!process.env.VERCEL || process.env.TRUST_PROXY === "1";
}
function clientIp(req: SrvReq) {
  if (trustProxy()) {
    const xff = req.headers["x-forwarded-for"];
    if (typeof xff === "string" && xff.length > 0) {
      const parts = xff.split(",");
      const last = parts[parts.length - 1].trim();
      if (last) return last.slice(0, 64);
    }
    const real = req.headers["x-real-ip"];
    if (typeof real === "string" && real) return real.trim().slice(0, 64);
  }
  return (req.socket && req.socket.remoteAddress) || "unknown";
}

function sha256Hex(s: any) {
  return crypto.createHash("sha256").update(String(s)).digest("hex");
}

function securityHeaders(req: SrvReq, res: SrvRes, next: SrvNext) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  res.setHeader("Cache-Control", "no-store");
  if (isProd()) {
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains");
  }
  next();
}

const DEV_ORIGIN_RE = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|10(\.\d{1,3}){3}|192\.168(\.\d{1,3}){2}|172\.(1[6-9]|2\d|3[01])(\.\d{1,3}){2})(:\d{1,5})?$/;

function allowedOrigins() {
  return (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((s: any) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

function isOriginAllowed(origin: any) {
  const list = allowedOrigins();
  if (list.length === 0) return true;
  if (list.indexOf(origin) !== -1) return true;
  if (!isProd() && DEV_ORIGIN_RE.test(origin)) return true;
  return false;
}

function corsOptions() {
  const list = allowedOrigins();
  return {
    origin: list.length === 0
      ? "*"
      : function (origin: any, cb: any) { cb(null, !origin || isOriginAllowed(origin)); },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 600
  };
}

function originGuard(req: SrvReq, res: SrvRes, next: SrvNext) {
  if (SAFE_METHODS.has(req.method)) return next();
  const origin = req.headers.origin;
  if (typeof origin === "string" && origin && !isOriginAllowed(origin)) {
    securityLog("origin_blocked", req, { origin: origin });
    return sendJson(res, 403, { error: "Asal permintaan tidak diizinkan." });
  }
  next();
}

function jsonContentGuard(req: SrvReq, res: SrvRes, next: SrvNext) {
  if (SAFE_METHODS.has(req.method)) return next();
  const len = parseInt(req.headers["content-length"] || "0", 10);
  const chunked = !!req.headers["transfer-encoding"];
  if ((len > 0 || chunked) && !/^application\/json\s*(;|$)/i.test(req.headers["content-type"] || "")) {
    return sendJson(res, 415, { error: "Content-Type harus application/json." });
  }
  next();
}

const memBuckets = new Map();
const MEM_MAX_KEYS = 20000;

function sweepMemory(now: any) {
  for (const entry of memBuckets) {
    if (entry[1].resetAt <= now) memBuckets.delete(entry[0]);
  }
  if (memBuckets.size > MEM_MAX_KEYS) memBuckets.clear();
}

function memoryHit(key: any, windowMs: any) {
  const now = Date.now();
  let b = memBuckets.get(key);
  if (!b || b.resetAt <= now) {
    b = { hits: 0, resetAt: now + windowMs };
    memBuckets.set(key, b);
    if (memBuckets.size > MEM_MAX_KEYS) sweepMemory(now);
  }
  b.hits += 1;
  return b;
}

async function dbHit(bucketId: any, windowMs: any) {
  const db = require("./db");
  await db.ensureSchema();
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const { rows } = await db.query(
    `INSERT INTO rate_limits (bucket, window_start, hits) VALUES ($1, $2, 1)
     ON CONFLICT (bucket, window_start) DO UPDATE SET hits = rate_limits.hits + 1
     RETURNING hits`,
    [sha256Hex(bucketId).slice(0, 40), windowStart]
  );
  if (Math.random() < 0.02) {
    db.query("DELETE FROM rate_limits WHERE window_start < $1", [now - 24 * 3600 * 1000]).catch(() => {});
  }
  return { hits: Number(rows[0].hits), resetAt: windowStart + windowMs };
}

let lastLimiterErrorLog = 0;
function logLimiterError(e: any) {
  const now = Date.now();
  if (now - lastLimiterErrorLog < 60000) return;
  lastLimiterErrorLog = now;
  console.error("[rate-limit] Penghitung database gagal, memakai cadangan memori:", redact(e && e.message));
}

function sendRateLimited(res: SrvRes, resetAt: any) {
  const retry = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  res.setHeader("Retry-After", String(retry));
  sendJson(res, 429, {
    error: "Terlalu banyak percobaan. Coba lagi dalam beberapa saat.",
    code: "RATE_LIMITED",
    retryAfter: retry
  });
}

async function consume(req: SrvReq, res: SrvRes, opts: any) {
  const useDb = opts.shared !== false && !!process.env.DATABASE_URL;
  let blockedUntil = null;
  for (const rule of opts.rules) {
    const id = opts.name + ":" + rule.key;
    let hits, resetAt;
    if (useDb) {
      try {
        const r = await dbHit(id, opts.windowMs);
        hits = r.hits; resetAt = r.resetAt;
      } catch (e: any) {
        logLimiterError(e);
        const b = memoryHit(id, opts.windowMs);
        hits = b.hits; resetAt = b.resetAt;
      }
    } else {
      const b = memoryHit(id, opts.windowMs);
      hits = b.hits; resetAt = b.resetAt;
    }
    if (hits > rule.max) blockedUntil = blockedUntil === null ? resetAt : Math.max(blockedUntil, resetAt);
  }
  if (blockedUntil !== null) {
    securityLog("rate_limited", req, { limiter: opts.name });
    sendRateLimited(res, blockedUntil);
    return false;
  }
  return true;
}

function limit(opts: any) {
  return function (req: SrvReq, res: SrvRes, next: SrvNext) {
    Promise.resolve()
      .then(() => opts.rulesFor(req))
      .then((rules) => consume(req, res, { name: opts.name, windowMs: opts.windowMs, shared: opts.shared, rules: rules }))
      .then((ok) => { if (ok) next(); })
      .catch(next);
  };
}

const KEY_GUESS_WINDOW_MS = 15 * 60 * 1000;
const KEY_GUESS_RULES = (req: SrvReq) => [
  { key: "user:" + (req.user ? req.user.id : "anon"), max: 10 },
  { key: "ip:" + clientIp(req), max: 30 }
];
const keyGuessLimiter = limit({ name: "keyguess", windowMs: KEY_GUESS_WINDOW_MS, rulesFor: KEY_GUESS_RULES });

const apiLimiter = limit({
  name: "api",
  windowMs: 60 * 1000,
  shared: false,
  rulesFor: (req: SrvReq) => [{ key: "ip:" + clientIp(req), max: 600 }]
});

function notFound(req: SrvReq, res: SrvRes) {
  sendJson(res, 404, { error: "Endpoint tidak ditemukan." });
}

function redact(s: any) {
  return String(s == null ? "" : s)
    .replace(/postgres(?:ql)?:\/\/[^\s'"]+/gi, "postgres://[redacted]")
    .replace(/(password|passwd|secret|token|authorization)(["']?\s*[=:]\s*["']?)([^\s&"',}]+)/gi, "$1$2[redacted]")
    .slice(0, 4000);
}

function errorHandler(err: any, req: SrvReq, res: SrvRes, next: SrvNext) {
  if (res.headersSent) return next(err);
  const type = err && err.type;
  if (type === "entity.parse.failed") return sendJson(res, 400, { error: "Body request bukan JSON yang valid." });
  if (type === "entity.too.large") return sendJson(res, 413, { error: "Body request terlalu besar." });
  if (type === "encoding.unsupported" || type === "charset.unsupported") return sendJson(res, 415, { error: "Encoding body tidak didukung." });
  if (type === "request.aborted" || type === "stream.encoding.set") return sendJson(res, 400, { error: "Permintaan tidak valid." });
  try {
    const path = String(req.originalUrl || req.url || "").split("?")[0];
    console.error("[server error]", req.method, path, redact(err && (err.stack || err.message || err)));
  } catch (e: any) { }
  sendJson(res, 500, { error: "Terjadi kesalahan di server." });
}

function securityLog(event: any, req: SrvReq, extra: any) {
  try {
    const entry: Record<string, any> = { ts: new Date().toISOString(), type: "security", event: event };
    if (req) {
      entry.ip = clientIp(req);
      if (req.user && req.user.id !== undefined) entry.userId = req.user.id;
    }
    if (extra) {
      for (const k of Object.keys(extra)) {
        const v = extra[k];
        if (typeof v === "string") entry[k] = v.replace(/[\r\n]/g, " ").slice(0, 80);
        else if (typeof v === "number" || typeof v === "boolean") entry[k] = v;
      }
    }
    console.warn(JSON.stringify(entry));
  } catch (e: any) { }
}

function shortHash(s: any) {
  return sha256Hex(s).slice(0, 12);
}

let warned = false;
function warnInsecureConfig() {
  if (warned) return;
  warned = true;
  const msgs = [];
  const otk = process.env.ONE_TIME_KEY_SECRET;
  if (!(typeof otk === "string" && otk.length >= 16)) {
    msgs.push("ONE_TIME_KEY_SECRET belum diisi (atau < 16 karakter): server MENOLAK semua kunci Master/Grandmaster/Super Grandmaster/Admin sampai nilai acak diisi (dan disamakan dengan key-generator).");
  }
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret.trim().length < 32) {
    msgs.push("JWT_SECRET terlalu pendek (<32 karakter). Pakai string acak minimal 48 byte hex.");
  }
  if (isProd() && allowedOrigins().length === 0) {
    msgs.push("CORS_ORIGINS belum diisi: API menerima permintaan dari SEMUA asal. Isi dengan domain frontend, mis. https://nusantara-chess.vercel.app");
  }
  msgs.forEach((m) => console.warn("[SECURITY WARNING] " + m));
}

const IMAGE_DATA_URL_RE = /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+\/]+={0,2}$/;

function isSafeImageDataUrl(v: any, maxChars: any) {
  return typeof v === "string" && v.length > 0 && v.length <= (maxChars || 100000) && IMAGE_DATA_URL_RE.test(v);
}

function cleanDisplayText(v: any, max: any) {
  if (typeof v !== "string") return "";
  return v
    .replace(/[\u0000-\u001F\u007F\u2028\u2029]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max || 40);
}

function escapeLike(s: any) {
  return String(s).replace(/[\\%_]/g, "\\$&");
}

function pgnTag(v: any) {
  return String(v == null ? "" : v)
    .replace(/[\r\n\u2028\u2029]+/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');
}

module.exports = {
  isProd, trustProxy, clientIp, sendJson, sha256Hex, shortHash,
  securityHeaders, corsOptions, isOriginAllowed, originGuard, jsonContentGuard,
  consume, limit, apiLimiter, memoryHit,
  KEY_GUESS_WINDOW_MS, KEY_GUESS_RULES, keyGuessLimiter,
  notFound, errorHandler, redact,
  securityLog, warnInsecureConfig,
  isSafeImageDataUrl, cleanDisplayText, escapeLike, pgnTag
};
