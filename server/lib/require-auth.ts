"use strict";
const { verifyToken, hashToken } = require("./auth");
const usersRepo = require("./users-repo");

async function requireAuth(req: SrvReq, res: SrvRes, next: SrvNext) {
  const header = req.headers["authorization"] || "";
  const match = /^Bearer\s+(.+)$/.exec(header);
  if (!match) {
    return res.status(401).json({ error: "Tidak ada token sesi (header Authorization hilang).", code: "SESSION_INVALID" });
  }
  const token = match[1];
  const payload = verifyToken(token);
  if (!payload || !Number.isInteger(payload.sub)) {
    return res.status(401).json({ error: "Token sesi tidak valid atau kedaluwarsa. Silakan login lagi.", code: "SESSION_INVALID" });
  }
  try {
    const user = await usersRepo.findAuthById(payload.sub, hashToken(token));
    if (!user) {
      return res.status(401).json({ error: "Akun tidak ditemukan (mungkin sudah dihapus).", code: "SESSION_INVALID" });
    }
    if (user.revoked) {
      return res.status(401).json({ error: "Sesi sudah berakhir. Silakan login lagi.", code: "SESSION_INVALID" });
    }
    delete user.revoked;
    req.user = user;
    req.authToken = token;
    next();
  } catch (err: any) {
    next(err);
  }
}

module.exports = requireAuth;
