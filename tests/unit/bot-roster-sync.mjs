#!/usr/bin/env node
// Memeriksa bahwa daftar bot sama di tiga tempat yang tidak bisa saling impor:
//   1. src/app/pages/bot/bot-roster.ts   (React: kartu + dropdown)
//   2. src/features/bot/01-state-config.ts (skrip lama: g_characterInfo, g_characterAvatars)
//   3. server/routes/practice.ts          (PRACTICE_OPPONENTS, project Vercel terpisah)
// ERROR (exit 1): id atau Elo tidak sama. PERINGATAN (exit 0): perbedaan avatar.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

// Ambil isi blok "<penanda> ... };" agar regex tidak menangkap bagian lain berkas.
function block(src, marker) {
  const start = src.indexOf(marker);
  if (start < 0) throw new Error("penanda tidak ditemukan: " + marker);
  const end = src.indexOf("\n};", start);
  if (end < 0) throw new Error("akhir blok tidak ditemukan: " + marker);
  return src.slice(start, end);
}

// 1. roster React
const rosterSrc = read("src/app/pages/bot/bot-roster.ts");
const roster = {};
for (const m of rosterSrc.matchAll(/\{\s*id:\s*"(\w+)",\s*name:\s*"[^"]*",\s*elo:\s*(\d+)(?:,\s*image:\s*"(\w+)")?\s*\}/g)) {
  roster[m[1]] = { elo: Number(m[2]), image: m[3] || null };
}

// 2. skrip lama
const stateSrc = read("src/features/bot/01-state-config.ts");
const info = {};
for (const m of block(stateSrc, "var g_characterInfo").matchAll(/(\w+):\s*\{\s*name:\s*"[^"\d]*?\s*(\d+)"\s*\}/g)) {
  info[m[1]] = Number(m[2]);
}
const avatars = {};
for (const m of block(stateSrc, "var g_characterAvatars").matchAll(/(\w+):\s*"images\/(\w+)\.svg"/g)) {
  avatars[m[1]] = m[2];
}

// 3. server
const serverSrc = read("server/routes/practice.ts");
const server = {};
for (const m of block(serverSrc, "const PRACTICE_OPPONENTS").matchAll(/(\w+):\s*\{\s*name:\s*"[^"]*",\s*elo:\s*(\d+)\s*\}/g)) {
  // fahri memakai level tunggal bersarang: "3: { ... }"
  server[m[1] === "3" ? "fahri" : m[1]] = Number(m[2]);
}

const errors = [];
const warnings = [];
const ids = new Set([...Object.keys(roster), ...Object.keys(info), ...Object.keys(server)]);

for (const id of [...ids].sort()) {
  const where = [];
  if (!(id in roster)) where.push("bot-roster.ts");
  if (!(id in info)) where.push("g_characterInfo");
  if (!(id in server)) where.push("practice.ts");
  if (where.length) errors.push(`bot "${id}" tidak ada di: ${where.join(", ")}`);

  const elos = { "bot-roster.ts": roster[id]?.elo, g_characterInfo: info[id], "practice.ts": server[id] };
  const known = Object.values(elos).filter((v) => v !== undefined);
  if (new Set(known).size > 1) errors.push(`Elo "${id}" berbeda: ${JSON.stringify(elos)}`);

  // Kartu memakai images/<image || id>.svg; game harus memakai berkas yang sama.
  const img = roster[id] ? (roster[id].image || id) : null;
  if (img && avatars[id] !== img) {
    warnings.push(`avatar "${id}": roster memakai "${img}.svg", g_characterAvatars ${avatars[id] ? `memakai "${avatars[id]}.svg"` : "tidak punya entri (jatuh ke gambar bawaan)"}`);
  }
}

console.log(`[bot-roster-sync] ${ids.size} bot diperiksa: ${[...ids].sort().join(", ")}`);
for (const w of warnings) console.log("  PERINGATAN: " + w);
for (const e of errors) console.log("  ERROR: " + e);
if (errors.length) {
  console.log(`[bot-roster-sync] GAGAL (${errors.length} error)`);
  process.exit(1);
}
console.log(`[bot-roster-sync] OK (id dan Elo konsisten${warnings.length ? `, ${warnings.length} peringatan avatar` : ""})`);
