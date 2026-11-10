import ts from "typescript"; import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const code = ts.transpileModule(fs.readFileSync(path.join(ROOT, "src/features/gamereview/engine-wrapper.ts"), "utf8"), { compilerOptions: { target: "es2020" } }).outputText;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fails++; };

function setup({ failFiles, answer }) {
  const created = []; const els = { pvText: { textContent: "" } }; let asked = 0;
  class Worker {
    constructor(url) {
      this.url = url; this.dead = false; created.push(url);
      this.fails = failFiles.some((f) => String(url).includes(f));
      if (this.fails) setTimeout(() => { if (!this.dead && this.onerror) this.onerror({ message: "Unexpected token '<'" }); }, 3);
    }
    emit(l) { setTimeout(() => { if (!this.dead && !this.fails && this.onmessage) this.onmessage({ data: l }); }, 1); }
    postMessage(c) {
      if (c === "uci") this.emit("uciok"); else if (c === "isready") this.emit("readyok");
      else if (c.startsWith("go")) { this.emit("info depth 8 multipv 1 score cp 20 nodes 1 pv e2e4 e7e5"); this.emit("bestmove e2e4"); }
    }
    terminate() { this.dead = true; }
  }
  const win = { NusantaraChess: {} };
  const document = { getElementById: (id) => els[id] || null };
  function Chess() { this.game_over = () => false; this.in_checkmate = () => false; this.turn = () => "w"; }
  globalThis.confirm = () => { asked++; return answer; };
  const fn = new Function("window", "document", "Worker", "navigator", "location", "URL", "Blob", "console", "Chess", code);
  fn(win, document, Worker, { hardwareConcurrency: 4 }, { protocol: "http:" }, { createObjectURL: () => "blob:x" }, function () {}, { log() {}, warn() {}, error() {} }, Chess);
  return { E: win.NusantaraChess.gameReviewEngine, created, els, asked: () => asked };
}
const FENS = ["a w - - 0 1", "b w - - 0 1", "c w - - 0 1", "d w - - 0 1"];

(async () => {
  let t = setup({ failFiles: ["stockfish-18-lite-single.js"], answer: true });
  t.E.initEngine(); await sleep(700);
  ok(t.asked() === 1, "setuju: ditanya tepat sekali (" + t.asked() + ")");
  ok(t.E.isReady() && t.E.getLabel() === "Stockfish 10", "setuju: mesin siap dengan label Stockfish 10 (" + t.E.getLabel() + ")");
  ok(t.created.some((u) => String(u).includes("/vendor/stockfish/stockfish.wasm.js")), "setuju: mencoba stockfish.wasm.js lokal");

  t = setup({ failFiles: ["stockfish-18-lite-single.js"], answer: false });
  t.E.initEngine(); await sleep(150);
  const n = t.created.length; await sleep(150);
  ok(t.asked() === 1, "tolak: ditanya sekali (" + t.asked() + ")");
  ok(!t.E.isReady() && t.E.getLabel() === "Stockfish 18", "tolak: tetap Stockfish 18, tidak siap (" + t.E.getLabel() + ")");
  ok(t.created.length === n && t.created.length === 1 && !t.created.some((u) => String(u).includes("wasm.js") || String(u) === "blob:x"), "tolak: tidak ada upaya mesin lain / tanpa percobaan berulang (" + t.created.length + " worker)");
  ok(/gagal dimuat/i.test(t.els.pvText.textContent), "tolak: pesan gagal dimuat ditampilkan");

  t = setup({ failFiles: ["stockfish-18-lite-single.js", "stockfish.wasm.js"], answer: true });
  t.E.initEngine(); await sleep(1400);
  ok(t.asked() === 1, "setuju + berkas lokal kedua gagal: tetap ditanya sekali (" + t.asked() + ")");
  ok(t.E.isReady() && t.E.getLabel() === "Stockfish 10 asm", "turun sampai CDN: label Stockfish 10 asm (" + t.E.getLabel() + ")");

  t = setup({ failFiles: ["stockfish-18-lite-single.js"], answer: false });
  const r4 = await t.E.analyzePool(FENS, 8, 1, () => {}, null, {});
  ok(r4 === null, "pool tolak: pemindaian dibatalkan (hasil null)");
  ok(t.asked() === 1, "pool tolak: ditanya sekali walau banyak worker gagal (" + t.asked() + ")");
  const nw = t.created.length; await sleep(100);
  ok(t.created.length === nw && nw <= 4, "pool tolak: tidak ada respawn tanpa henti (" + nw + " worker)");

  t = setup({ failFiles: ["stockfish-18-lite-single.js"], answer: true });
  const r5 = await t.E.analyzePool(FENS, 8, 1, () => {}, null, {});
  ok(Array.isArray(r5) && r5.length === FENS.length && r5.every((x) => x && x.bm === "e2e4"), "pool setuju: semua posisi terisi");
  ok(t.asked() === 1 && t.E.getLabel() === "Stockfish 10", "pool setuju: ditanya sekali, mode jadi Stockfish 10 (" + t.asked() + ", " + t.E.getLabel() + ")");

  t = setup({ failFiles: [], answer: false });
  t.E.initEngine(); await sleep(100);
  ok(t.asked() === 0 && t.E.isReady() && t.E.getLabel() === "Stockfish 18", "mesin utama sehat: tidak ada dialog, label Stockfish 18");
  console.log(fails ? "GAGAL: " + fails : "SEMUA LULUS"); process.exit(fails ? 1 : 0);
})();
