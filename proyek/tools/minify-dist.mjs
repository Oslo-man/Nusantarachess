#!/usr/bin/env node
// Pengganti obfuscate-dist.mjs: TANPA obfuscation. Hanya minify ringan (buang komentar + whitespace,
// nama variabel tidak diubah) untuk skrip fitur di dist/shared dan dist/features, ditambah:
//  - penjaga domain kedua di shared/api-client.js (kalau ANTI_CLONE tidak "0"),
//  - pemeriksaan bahwa sourcemap / komentar sumber tidak bocor ke dist/.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { resolveAntiClone, checkHost } from "./anti-clone-hosts.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const kb = (n) => (n / 1024).toFixed(0) + " KB";
const rel = (p) => path.relative(DIST, p).split(path.sep).join("/");

if (process.env.MINIFY === "0") {
  console.log("[minify] DILEWATI (MINIFY=0) - dist/ berisi kode yang dapat dibaca!");
  process.exit(0);
}
if (!fs.existsSync(DIST)) { console.error("[minify] dist/ tidak ada - jalankan build dulu."); process.exit(1); }

const { transform } = await import("esbuild");

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name.endsWith(".js")) out.push(full);
  }
  return out;
}

const anti = resolveAntiClone(ROOT);
const guardPrelude = () => `;(${checkHost.toString()})(${JSON.stringify(anti.hosts)});\n`;

const files = [...walk(path.join(DIST, "shared")), ...walk(path.join(DIST, "features"))];
let before = 0, after = 0, n = 0;

for (const f of files) {
  const r = rel(f);
  let code = fs.readFileSync(f, "utf8");
  if (!code.trim()) continue;
  if (r === "shared/api-client.js" && anti.enabled) code = guardPrelude() + code;
  // Hanya whitespace + komentar: nama variabel/top-level tidak disentuh, jadi aman untuk
  // skrip klasik yang dimuat ulang atau digabung oleh loader rute.
  let out = (await transform(code, { minifyWhitespace: true, legalComments: "none", target: "es2020" })).code;
  if (!/[;}]\s*$/.test(out)) out = out.replace(/\s*$/, ";\n"); // aman bila loader menyambung beberapa berkas
  try { new vm.Script(out, { filename: r }); } catch (e) { throw new Error(`sintaks tidak valid setelah minify (${r}): ${e.message}`); }
  fs.writeFileSync(f, out);
  before += code.length; after += out.length; n++;
}
console.log(`[minify] ${n} berkas (shared/ + features/) ${kb(before)} -> ${kb(after)}`);

const leaks = [];
for (const f of [...walk(path.join(DIST, "app")), ...files]) {
  const code = fs.readFileSync(f, "utf8");
  if (/sourceMappingURL=/.test(code)) leaks.push(rel(f) + " (sourceMappingURL)");
  if (/\/\*[\s\S]{0,200}={6,}/.test(code) || /^\s*\/\/ .*[A-Za-z]{4,}/m.test(code)) leaks.push(rel(f) + " (komentar sumber)");
}
const maps = (function findMaps(d, out = []) {
  for (const e of fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }) : []) {
    const full = path.join(d, e.name);
    if (e.isDirectory()) findMaps(full, out); else if (e.name.endsWith(".map")) out.push(rel(full));
  }
  return out;
})(DIST);
if (leaks.length || maps.length) {
  console.error("[minify] GAGAL: sumber masih terbaca di dist/:\n  " + [...leaks, ...maps.map((m) => m + " (sourcemap)")].join("\n  "));
  process.exit(1);
}
console.log("[minify] OK" + (anti.enabled ? `; penjaga domain kedua di shared/api-client.js untuk: ${anti.hosts.join(", ")}` : "; penjaga domain NONAKTIF (ANTI_CLONE=0)"));
