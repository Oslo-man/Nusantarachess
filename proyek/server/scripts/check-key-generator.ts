"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { webcrypto } = require("crypto");

const HTML = path.join(__dirname, "..", "..", "keygeneratora1b2", "index.html");
const html = fs.readFileSync(HTML, "utf8");
const m = /<script>([\s\S]*?)<\/script>/.exec(html);
if (!m) { console.error("Tidak menemukan <script> di " + HTML); process.exit(1); }

function stub(): any {
  const store = Object.create(null);
  const fn = function () {};
  const p = new Proxy(fn, {
    get(_, k) {
      if (k === Symbol.toPrimitive) return () => "";
      if (k in store) return store[k];
      if (k === "length") return 0;
      if (k === "then") return undefined;
      return stub();
    },
    set(_, k, v) { store[k] = v; return true; },
    apply() { return stub(); }
  });
  return p;
}
const sandbox: Record<string, any> = {
  window: null,
  document: new Proxy({}, { get: () => stub() }),
  navigator: {},
  crypto: webcrypto,
  TextEncoder, Uint8Array, Uint32Array, DataView, Blob, URL,
  setTimeout, clearTimeout, parseInt, String, Object, RegExp, Math, Date, JSON, Error, Promise
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(m![1], sandbox, { filename: "keygeneratora1b2/index.html" });
const gen = sandbox.__keyGen;
if (!gen) { console.error("Hook window.__keyGen tidak ditemukan di generator."); process.exit(1); }

const oneTimeKeys = require("../lib/one-time-keys");
let failures = 0;
function fail(msg: any) { failures++; console.error("GAGAL: " + msg); }

const selfTest = gen.selfTest();
if (selfTest.length) fail("uji bawaan generator: " + selfTest.join(", "));

const SECRETS = [
  { name: "kustom (>= 16 karakter)", env: "rahasia-uji-kustom-1234567890", entered: "rahasia-uji-kustom-1234567890" },
  { name: "kustom panjang + unicode", env: "é-unicode-rahasia-panjang-123", entered: "é-unicode-rahasia-panjang-123" }
];
const PER_TYPE = 300;
const originalEnv = process.env.ONE_TIME_KEY_SECRET;

for (const s of SECRETS) {
  process.env.ONE_TIME_KEY_SECRET = s.env;
  const effective = gen.effectiveSecret(s.entered);
  if (effective === null) { fail(s.name + ": generator menolak rahasia yang valid"); continue; }
  const seen = new Set();
  for (const type of gen.TYPE_ORDER) {
    for (let i = 0; i < PER_TYPE; i++) {
      const key = gen.generateKey(type, effective);
      if (seen.has(key)) fail(s.name + ": kunci ganda " + key);
      seen.add(key);
      const parsed = oneTimeKeys.parseKey(key);
      if (!parsed) { fail(s.name + ": server menolak kunci " + type + " " + key); continue; }
      if (parsed.type !== type) fail(s.name + ": " + key + " dibaca server sebagai " + parsed.type + ", bukan " + type);
      if (parsed.normalized !== key) fail(s.name + ": normalisasi berbeda untuk " + key);
      const idx = key.indexOf("-") + 1;
      const swapped = key.slice(0, idx) + (key[idx] === "A" ? "B" : "A") + key.slice(idx + 1);
      if (oneTimeKeys.parseKey(swapped)) fail(s.name + ": kunci yang diubah masih diterima: " + swapped);
    }
  }
  console.log("ok  " + s.name + ": " + seen.size + " kunci unik diterima server sesuai jenisnya");
}

// Tanpa rahasia bawaan: generator menolak rahasia pendek, dan server menolak SEMUA kunci bila env kosong/pendek/berbeda.
for (const bad of ["", "pendek", "x".repeat(15)]) {
  if (gen.effectiveSecret(bad) !== null) fail("generator menerima rahasia tidak valid: '" + bad + "'");
}
const signer = "rahasia-uji-kustom-1234567890";
for (const [label, envVal] of [["env kosong", undefined], ["env pendek", "pendek"], ["env berbeda", "rahasia-lain-yang-berbeda-987654"]] as Array<[string, string | undefined]>) {
  if (envVal === undefined) delete process.env.ONE_TIME_KEY_SECRET; else process.env.ONE_TIME_KEY_SECRET = envVal;
  for (const type of gen.TYPE_ORDER) {
    const key = gen.generateKey(type, signer);
    if (oneTimeKeys.parseKey(key)) fail(label + ": server menerima kunci " + type + " " + key);
  }
  console.log("ok  " + label + ": server menolak semua kunci");
}
if (originalEnv === undefined) delete process.env.ONE_TIME_KEY_SECRET; else process.env.ONE_TIME_KEY_SECRET = originalEnv;

if (failures) { console.error("\n" + failures + " pemeriksaan gagal."); process.exit(1); }
console.log("\nGenerator kompatibel dengan verifier server.");
process.exit(0);
