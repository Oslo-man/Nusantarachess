import ts from "typescript"; import fs from "node:fs"; import os from "node:os"; import path from "node:path"; import { createRequire } from "node:module"; import { fileURLToPath } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "rs-"));
for (const f of ["server/lib/review-scoring", "server/lib/brilliant-rating"]) {
  const out = ts.transpileModule(fs.readFileSync(path.join(ROOT, f + ".ts"), "utf8"), { compilerOptions: { module: "commonjs", target: "es2020" } }).outputText;
  fs.writeFileSync(path.join(tmp, path.basename(f) + ".js"), out);
}
const rules = ts.transpileModule(fs.readFileSync(path.join(ROOT, "shared/chess-rules.ts"), "utf8"), { compilerOptions: { module: "commonjs", target: "es2020" } }).outputText;
fs.writeFileSync(path.join(tmp, "chess-rules.js"), rules);
const require = createRequire(path.join(tmp, "x.js"));
const { ChessGame, fromAlgebraic } = require("./chess-rules.js");
const rs = require("./review-scoring.js");
let fails = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fails++; };

const g = ChessGame.fromFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
const ucis = "e2e4 e7e5 g1f3 b8c6 f1c4 g8f6 d2d4 e5d4 e1g1 f6e4 f1e1 d7d5 c4d5 d8d5 b1c3 d5a5".split(" ");
const fens = [g.toFEN()], moves = [], evals = [0], bestUci = []; let ev = 0;
for (const u of ucis) {
  const from = fromAlgebraic(u.slice(0, 2)), to = fromAlgebraic(u.slice(2, 4));
  const m = g.legalMovesFor(from).find((x) => x.to === to); const cap = g.pieceAt(to);
  bestUci.push(u); g.applyMove(m);
  moves.push({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: null, captured: !!cap, capturedType: cap ? cap.type : null });
  fens.push(g.toFEN()); ev += moves.length % 2 ? 10 : -20; evals.push(ev);
}
const r = rs.analyzeGame({ fens, moves, evals, bestUci, bookPlies: 2, isCustomStart: false });
ok(r.reviewData.length === ucis.length, "satu klasifikasi per langkah");
ok(r.reviewData[0].cat === "book" && r.reviewData[1].cat === "book", "dua langkah pertama = book (daftar pembukaan lokal)");
ok(r.accuracy.w > 90 && r.accuracy.w <= 100, "akurasi dari win% (langkah terbaik semua -> mendekati 100): " + r.accuracy.w);
ok(r.estimatedRating.w >= 500 && r.estimatedRating.w <= 3000, "rating kurva lama, tidak melebihi 3000 (" + r.estimatedRating.w + ")");
const order = { opening: 0, middlegame: 1, endgame: 2 };
ok(r.phases.every((p, i) => i === 0 || order[p] >= order[r.phases[i - 1]]), "fase hanya maju: opening -> middlegame -> endgame");
ok(r.phaseAccuracy.w.opening.grade !== null, "fase dinilai bila >= 3 langkah");
ok(r.phaseAccuracy.w.endgame.grade === null && r.phaseAccuracy.w.endgame.accuracy === null, "fase < 3 langkah tidak dinilai");
const hits = fens.map((_, i) => i >= 1 && i <= 6);
const rb = rs.analyzeGame({ fens, moves, evals, bestUci, bookHits: hits, bookPlies: 0, isCustomStart: false });
ok(rb.reviewData.slice(0, 6).every((d) => d.cat === "book") && rb.reviewData[6].cat !== "book", "bookHits cloud menandai langkah 1-6 sebagai book, langkah 7 tidak");
const rc = rs.analyzeGame({ fens, moves, evals, bestUci, bookHits: hits, bookPlies: 0, isCustomStart: true });
ok(rc.reviewData[0].cat !== "book", "posisi awal kustom: bookHits cloud diabaikan");
const br = require("./brilliant-rating.js");
const j = rs.classifySingleMove({ fenBefore: fens[0], fenAfter: fens[1], moverColor: "w", isBest: true, isBook: false, move: moves[0], staticEval: ["cp", "-20"], previousStaticEvals: [["cp", "20"]] });
ok(j.cat === "best", "live-judge: langkah terbaik -> best (" + j.cat + ")");
const bl = rs.classifySingleMove({ fenBefore: fens[0], fenAfter: fens[1], moverColor: "w", isBest: false, isBook: false, move: moves[0], staticEval: ["cp", "900"], previousStaticEvals: [["cp", "30"]] });
ok(bl.cat === "blunder", "live-judge: kehilangan ~9 pion -> blunder (" + bl.cat + ")");
ok(typeof j.sacrifice === "boolean" && r.reviewData.every((d) => typeof d.sacrifice === "boolean"), "flag sacrifice (boolean) di live-judge dan analyzeGame");

const rate = (b, a, extra = {}) => br.rateMove({ staticEval: ["cp", String(-a)], previousStaticEvals: [["cp", String(b)]], isBest: false, sacrifice: false, isBook: false, trivialRecap: false, endgame: false, secondScore: null, ...extra });
ok(rate(0, -50) === "good", "seimbang, turun 0,5 pion (~4,6%) -> good (" + rate(0, -50) + ")");
ok(rate(0, -100) === "inaccuracy", "seimbang, turun 1,0 pion (~9,1%) -> inaccuracy (" + rate(0, -100) + ")");
ok(rate(0, -200) === "mistake", "seimbang, turun 2,0 pion (~17,6%) -> mistake (" + rate(0, -200) + ")");
ok(rate(0, -250) === "blunder", "seimbang, turun 2,5 pion (~21,5%) -> blunder (" + rate(0, -250) + ")");
ok(rate(0, -400) === "blunder", "seimbang, turun 4,0 pion (~31%) -> blunder (" + rate(0, -400) + ")");
ok(rate(1200, 1000) === "excellent", "+12 -> +10 (win% ~98,8 -> ~97,5) -> excellent, bukan good/inaccuracy (" + rate(1200, 1000) + ")");
ok(rate(1200, 800) === "good", "+12 -> +8 (~3,8%) baru good (" + rate(1200, 800) + ")");
ok(rate(-900, -1100) === "excellent", "-9 -> -11 (sudah kalah) -> excellent (" + rate(-900, -1100) + ")");
ok(rate(0, -20) === "excellent", "seimbang, turun 0,2 pion di opening -> excellent, bukan best (" + rate(0, -20) + ")");

ok(rate(0, 0, { isBest: true }) === "best", "langkah #1 -> best");
ok(rate(0, -5) === "excellent", "bukan #1, selisih ~0,1% di opening/seimbang -> excellent (" + rate(0, -5) + ")");
ok(rate(0, -5, { endgame: true }) === "best", "toleransi <=0,5% di endgame -> best");
ok(rate(1500, 1498) === "best", "toleransi <=0,5% di posisi menentukan -> best (" + rate(1500, 1498) + ")");
ok(rate(0, -10, { endgame: true }) === "excellent", "toleransi tidak melebar: selisih ~0,9% di endgame -> excellent (" + rate(0, -10, { endgame: true }) + ")");

ok(rate(0, 0, { isBest: true, secondScore: ["cp", "-400"] }) === "great", "#1 dan terbaik-kedua jatuh ~31% -> great (" + rate(0, 0, { isBest: true, secondScore: ["cp", "-400"] }) + ")");
ok(rate(0, 0, { isBest: true, secondScore: ["cp", "-10"] }) === "best", "terbaik-kedua nyaris sama -> best, bukan great");
ok(rate(0, 0, { isBest: true, secondScore: ["cp", "-400"], trivialRecap: true }) === "best", "rekapture rutin tidak pernah great");
ok(rate(0, 0, { isBest: false, secondScore: ["cp", "-400"] }) === "excellent", "great butuh langkah #1");
ok(rate(0, 300, { isBest: true, secondScore: ["cp", "-150"] }) === "great", "langkah sulit yang memenangkan (selisih >=10%, sesudah >= +2) -> great (" + rate(0, 300, { isBest: true, secondScore: ["cp", "-150"] }) + ")");

ok(rate(50, 200, { isBest: true, sacrifice: true }) === "brilliant", "sacrifice terbaik, +0,5 -> +2,0 -> brilliant (" + rate(50, 200, { isBest: true, sacrifice: true }) + ")");
ok(rate(50, 200, { isBest: false, sacrifice: true }) === "brilliant", "sacrifice hampir terbaik (<=2%) -> brilliant");
ok(rate(0, 100, { isBest: true, sacrifice: true }) === "best", "sesudah belum +1,5 -> best");
ok(rate(450, 600, { isBest: true, sacrifice: true }) === "best", "sebelumnya sudah > +3 -> bukan brilliant");
ok(rate(50, 200, { isBest: true, sacrifice: true, isBook: true }) === "book", "langkah buku tidak pernah brilliant");
ok(rate(0, 0, { isBest: true, sacrifice: false }) === "best", "tanpa sacrifice tidak brilliant");
ok(br.rateMove({ staticEval: ["cp", "-100000"].slice(0, 1).concat(["-100000"]), previousStaticEvals: [["cp", "100"]], isBest: true, sacrifice: true, isBook: false, trivialRecap: false, endgame: false, secondScore: null }) === "brilliant", "sacrifice yang memaksa mat -> brilliant");

const rm = br.rateMove({ staticEval: ["cp", "-100"], previousStaticEvals: [["cp", "500"], ["cp", "0"]], isBest: false, sacrifice: false, isBook: false, trivialRecap: false, endgame: false, secondScore: null });
ok(rm === "miss", "kesalahan lawan tidak dimanfaatkan -> miss (" + rm + ")");
const rm2 = br.rateMove({ staticEval: ["cp", "-100"], previousStaticEvals: [["cp", "500"]], isBest: false, sacrifice: false, isBook: false, trivialRecap: false, endgame: false, secondScore: null });
ok(rm2 !== "miss", "tanpa riwayat lawan -> bukan miss (" + rm2 + ")");
const rm3 = br.rateMove({ staticEval: ["cp", "-100"], previousStaticEvals: [["cp", "30"], ["cp", "0"]], isBest: false, sacrifice: false, isBook: false, trivialRecap: false, endgame: false, secondScore: null });
ok(rm3 !== "miss", "lawan tidak membuat kesalahan -> bukan miss (" + rm3 + ")");
const mm = br.rateMove({ staticEval: ["cp", "-100"], previousStaticEvals: [["mate", "2"]], isBest: false, sacrifice: false, isBook: false, trivialRecap: false, endgame: false, secondScore: null });
ok(mm === "miss", "mat yang terlewat -> miss (" + mm + ")");
ok(br.rateMove({ staticEval: ["mate", "1"], previousStaticEvals: [["mate", "3"]], isBest: false, sacrifice: false, isBook: false, trivialRecap: false, endgame: false, secondScore: null }) !== "miss", "tetap mengejar mat -> bukan miss");

const evB = evals.slice(); evB[3] = evB[2] - 600;
const rbl = rs.analyzeGame({ fens, moves, evals: evB, bestUci: bestUci.map((u, i) => i === 2 ? "a2a3" : u), bookPlies: 0, isCustomStart: true });
ok(rbl.reviewData[2].cat === "blunder", "analyzeGame: langkah yang melepas 6 pion -> blunder (" + rbl.reviewData[2].cat + ")");
ok(rbl.moveAccuracy[2] < 20 && rbl.moveAccuracy[0] > 90, "akurasi langkah blunder rendah, langkah baik tinggi (" + Math.round(rbl.moveAccuracy[2]) + " vs " + Math.round(rbl.moveAccuracy[0]) + ")");
ok(rbl.accuracy.w < r.accuracy.w, "blunder menurunkan akurasi permainan (" + rbl.accuracy.w.toFixed(1) + " < " + r.accuracy.w.toFixed(1) + ")");
ok(rs.estEloOf(50) === 500 && rs.estEloOf(100) <= 3000 && rs.estEloOf(100) > 2000 && rs.estEloOf(null) === null, "rating: kurva lama mulai 500 (akurasi 50), maks 3000 (" + rs.estEloOf(100) + ")");
ok(rs.estEloOf(0) === 500, "rating tidak turun di bawah 500 untuk akurasi <= 50");

const ga = rs.analyzeGame({ fens: [fens[0], fens[1]], moves: [moves[0]], evals: [0, 0], bestUci: [bestUci[0]], secondEvals: [-400], bookPlies: 0, isCustomStart: true });
ok(ga.reviewData[0].cat === "great", "analyzeGame: secondEvals (Putih) -> terbaik-kedua jauh lebih buruk -> great (" + ga.reviewData[0].cat + ")");
const gb = rs.analyzeGame({ fens: [fens[0], fens[1]], moves: [moves[0]], evals: [0, 0], bestUci: [bestUci[0]], secondEvals: [null], bookPlies: 0, isCustomStart: true });
ok(gb.reviewData[0].cat === "best", "secondEvals null -> best (" + gb.reviewData[0].cat + ")");
const lj = rs.classifySingleMove({ fenBefore: fens[0], fenAfter: fens[1], moverColor: "w", isBest: true, isBook: false, move: moves[0], staticEval: ["cp", "0"], previousStaticEvals: [["cp", "0"]], secondScore: ["cp", "-400"] });
ok(lj.cat === "great", "live-judge: secondScore -> great (" + lj.cat + ")");
const mt = (b, a, isBest = false) => br.rateMove({ staticEval: a, previousStaticEvals: [b], isBest, sacrifice: false, isBook: false, trivialRecap: false, endgame: false, secondScore: null });
ok(mt(["mate", "3"], ["mate", "-2"]) === "best", "mat-in-3 -> mat-in-3 (jarak tetap, posisi menentukan) -> best (" + mt(["mate", "3"], ["mate", "-2"]) + ")");
ok(mt(["mate", "3"], ["mate", "-4"]) === "good", "mat-in-3 diperpanjang jadi 5 -> good (delay mate) (" + mt(["mate", "3"], ["mate", "-4"]) + ")");
ok(mt(["mate", "3"], ["mate", "-4"], true) === "best", "langkah #1 mesin tidak terkena aturan delay");
ok(mt(["mate", "-5"], ["mate", "5"]) === "best", "dimat-in-5, bertahan maksimal (posisi menentukan) -> best (" + mt(["mate", "-5"], ["mate", "5"]) + ")");
ok(mt(["mate", "-5"], ["mate", "2"]) === "good", "dimat-in-5, mempercepat jadi 2 -> good (" + mt(["mate", "-5"], ["mate", "2"]) + ")");
ok(mt(["mate", "3"], ["mate", "2"]) === "blunder", "dari mat menang jadi dimat -> blunder (" + mt(["mate", "3"], ["mate", "2"]) + ")");
console.log(fails ? "GAGAL: " + fails : "SEMUA LULUS");
process.exit(fails ? 1 : 0);
