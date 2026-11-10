"use strict";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const SECRET_PATH = path.join(__dirname, "..", "data", ".jwt-secret");

function loadOrCreateSecret() {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim().length > 0) {
    return process.env.JWT_SECRET.trim();
  }
  try {
    if (fs.existsSync(SECRET_PATH)) {
      return fs.readFileSync(SECRET_PATH, "utf8").trim();
    }
  } catch (e: any) { }
  const secret = crypto.randomBytes(48).toString("hex");
  const dir = path.dirname(SECRET_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SECRET_PATH, secret, { mode: 0o600 });
  return secret;
}

const JWT_SECRET = loadOrCreateSecret();

const TOKEN_TTL = process.env.JWT_TTL || "14d";
const TOKEN_ALG = "HS256";
const TOKEN_ISSUER = "nusantarachess";

function hashPassword(plain: any) {
  return bcrypt.hashSync(plain, 10);
}

function verifyPassword(plain: any, hash: any) {
  return bcrypt.compareSync(plain, hash);
}

let dummyHash: any = null;
function burnPasswordCheck(plain: any) {
  try {
    if (!dummyHash) dummyHash = bcrypt.hashSync(crypto.randomBytes(16).toString("hex"), 10);
    bcrypt.compareSync(typeof plain === "string" ? plain : "", dummyHash);
  } catch (e: any) { }
}

function signToken(userId: any, username: any) {
  return jwt.sign(
    { sub: userId, username: username },
    JWT_SECRET,
    { algorithm: TOKEN_ALG, expiresIn: TOKEN_TTL, issuer: TOKEN_ISSUER, jwtid: crypto.randomUUID() }
  );
}

function verifyToken(token: any) {
  try {
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: [TOKEN_ALG] });
    if (payload && payload.iss !== undefined && payload.iss !== TOKEN_ISSUER) return null;
    return payload;
  } catch (e: any) {
    return null;
  }
}

function hashToken(token: any) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

module.exports = { hashPassword, verifyPassword, burnPasswordCheck, signToken, verifyToken, hashToken };
