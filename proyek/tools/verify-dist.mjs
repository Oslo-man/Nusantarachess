#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const vercel = process.argv.includes("--vercel");
const must = [
  vercel ? "spa.html" : "index.html", "manifest.json", "favicon.svg",
  "app/main.js",
  "shared/language.js", "shared/i18n.js", "shared/i18n-en.js", "shared/api-client.js", "shared/site-nav.js",
  "styles/tokens.css",
  "vendor/chess-engines/chess.min.js"
];
const miss = must.filter((f) => !fs.existsSync(path.join(DIST, f)));
if (vercel && !fs.existsSync(path.join(ROOT, "api/ssr/_lib/app-render.cjs"))) miss.push("(root)/api/ssr/_lib/app-render.cjs");
if (miss.length) { console.error("[verify-dist] berkas wajib tidak ada:", miss.join(", ")); process.exit(1); }
if (vercel && fs.existsSync(path.join(DIST, "index.html"))) {
  console.error("[verify-dist] dist/index.html masih ada pada build Vercel: rute \"/\" akan dilayani berkas statis, bukan SSR.");
  process.exit(1);
}
const sfNeeded = ["stockfish-18-lite-single.js", "stockfish-18-lite-single.wasm"];
const sfDir = path.join(DIST, "vendor", "stockfish");
const sfMiss = sfNeeded.filter((f) => !fs.existsSync(path.join(sfDir, f)));
if (sfMiss.length) {
  const present = fs.existsSync(sfDir) ? fs.readdirSync(sfDir).filter((f) => !f.startsWith(".")) : [];
  console.warn("[verify-dist] PERINGATAN: berkas Stockfish tidak ada di dist/vendor/stockfish/: " + sfMiss.join(", ") + ".\n" +
    "  Yang ada sekarang: " + (present.length ? present.join(", ") : "(kosong)") + ".\n" +
    "  Taruh berkas di public/vendor/stockfish/ dengan nama persis di atas (pasangan .js dan .wasm harus sama), lalu build ulang. " +
    "Tanpa itu mode Bermain vs Bot gagal memuat Stockfish.");
}
console.log(`[verify-dist] OK (${must.length} berkas wajib ada${vercel ? ", mode Vercel" : ""})`);
