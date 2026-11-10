import ts from "typescript"; import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const tr = (s) => ts.transpileModule(s, { compilerOptions: { target: "es2020" } }).outputText;
const rd = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const window = { NusantaraChess: {} };
new Function("window", tr(rd("shared/i18n-en-exact.ts")) + tr(rd("shared/i18n-en-patterns.ts")) + tr(rd("shared/i18n-en.ts")))(window);
const src = rd("shared/i18n.ts");
const a = src.indexOf("var EXACT"), b = src.indexOf("function translateCore"), end = src.indexOf("\nfunction ", b + 10);
const translate = new Function("DICT", tr(src.slice(a, end)) + ";return translateCore;")(window.NusantaraChess.i18nDict);
const cases = {
  "Analisis Game": "Analyze Game", "Analisis Game Baru": "Analyze New Game", "Pilih Game": "Choose Game", "Ringkasan": "Summary",
  "Langkah": "Moves", "Tipe Analisis": "Analysis Type", "Dasar": "Basic", "Kustom": "Custom", "Kedalaman (Depth)": "Depth",
  "Daftar permainan": "List games", "Analisis": "Analyze", "Menganalisis": "Analyzing", "Mengambil API": "Fetching API",
  "Tampilkan panah": "Show arrows", "Jumlah panah": "Number of arrows", "Kedalaman analisis langsung": "Live analysis depth",
  "Masukkan pengguna Chess.com di sini": "Enter Chess.com username here", "Tempel kode PGN di sini": "Paste PGN code here",
  "e4 adalah Terbaik": "e4 is Best", "Nf3 adalah langkah Bagus": "Nf3 is a Great move", "Promosi ke Menteri": "Promote to Queen",
  "Pembukaan · Putih": "Opening · White", "12 langkah dihitung pada fase ini": "12 moves counted in this phase",
  "Mei": "May", "Agu": "Aug", "Januari": "January", "Tidak ada permainan di bulan ini...": "No games this month...",
  "Pemain": "Player", "Akurasi": "Accuracy", "Putih": "White", "Hitam": "Black", "Pengaturan": "Settings", "Balik papan": "Flip board"
};
let fails = 0;
for (const [id, en] of Object.entries(cases)) { const got = translate(id, 0); if (got !== en) { fails++; console.log("FAIL", JSON.stringify(id), "->", JSON.stringify(got), "(harap", JSON.stringify(en) + ")"); } }
const files = [...fs.readdirSync(path.join(ROOT, "src/app/pages/gamereview")).filter((f) => f.endsWith(".tsx")).map((f) => "src/app/pages/gamereview/" + f)];
const idw = /\b(Pilih|Analisis|Langkah|Ringkasan|Pemain|Pengaturan|Balik|Memuat|Mengambil|Masukkan|Kecepatan|Panah|Daftar|Muat|Salin|Bagikan|permainan|Permainan|Pembukaan|Kedalaman|Putar|Tutup|Batal|Tampilkan|Jumlah|Menganalisis)\b/;
let missing = 0;
for (const f of files) {
  const s = rd(f).replace(/\/\*[\s\S]*?\*\//g, "");
  const texts = [...s.matchAll(/>([^<>{}]+)</g)].map((m) => m[1]).concat([...s.matchAll(/(?:placeholder|title|aria-label)="([^"]+)"/g)].map((m) => m[1]));
  for (const t0 of texts) { const t = t0.replace(/\s+/g, " ").trim(); if (t.length < 2 || !idw.test(t)) continue; if (translate(t, 0) === t) { missing++; console.log("TANPA TERJEMAHAN:", f.split("/").pop(), "-", t); } }
}
console.log(fails || missing ? "GAGAL" : "SEMUA LULUS");
process.exit(fails || missing ? 1 : 0);
