#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { webcrypto, createHmac, randomBytes } from "node:crypto";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "keygeneratora1b2/index.html"), "utf8");
const m = /<script>([\s\S]*?)<\/script>/.exec(html);
if (!m) { console.error("keygeneratora1b2/index.html belum dibangun (npm run build:key-generator)"); process.exit(1); }
const sandbox = { window: null, crypto: webcrypto, TextEncoder, Uint8Array, Uint32Array, DataView };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(m[1], sandbox);
const gen = sandbox.__keyGen;
let failures = 0;
const fail = (msg) => { failures++; console.error("GAGAL: " + msg); };

if (!gen) { console.error("window.__keyGen tidak ada"); process.exit(1); }
const self = gen.selfTest();
if (self.length) fail("selfTest: " + self.join(", "));

for (const bad of ["", "pendek", "x".repeat(15), null, undefined]) if (gen.effectiveSecret(bad) !== null) fail("effectiveSecret menerima rahasia tidak valid: " + String(bad));
let threw = false; try { gen.generateKey("master", "pendek"); } catch { threw = true; }
if (!threw) fail("generateKey tidak menolak rahasia pendek");

const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const secrets = [gen.SELF_TEST_SECRET, "rahasia-uji-kustom-1234567890", "x".repeat(100), "é-unicode-rahasia-panjang-123"];
let cases = 0;
for (const s of secrets) for (const t of gen.TYPE_ORDER) {
  const len = gen.SPECS[t].payloadLen;
  for (let i = 0; i < 300; i++) {
    const rb = randomBytes(len);
    let payload = "";
    for (let k = 0; k < len; k++) payload += ALPHA[rb[k] & 31];
    const mac = createHmac("sha256", s).update(t + ":" + payload).digest();
    let expected = "";
    for (let k = 0; k < 8; k++) expected += ALPHA[mac[k] & 31];
    if (gen.computeCheck(t, payload, s) !== expected) fail("computeCheck " + t + " " + payload);
    cases++;
    const key = gen.generateKey(t, s);
    const v = gen.verifyLikeServer(key, s);
    if (!v || v.type !== t || v.normalized !== key) fail("verify " + key);
    const idx = key.indexOf("-") + 1;
    const tampered = key.slice(0, idx) + (key[idx] === "A" ? "B" : "A") + key.slice(idx + 1);
    if (gen.verifyLikeServer(tampered, s)) fail("kunci yang diubah diterima: " + tampered);
  }
}
console.log((failures ? "GAGAL" : "OK") + " - " + cases + " kode cek cocok dengan HMAC-SHA256 Node; " + (cases) + " kunci dibuat+diverifikasi");
process.exit(failures ? 1 : 0);
