// Uji kompatibilitas UCI + adaptor bot untuk Josep.
// Jalankan: node tests/unit/josep-uci.mjs
// Catatan: bagian adaptor memakai waktu nyata 2,3 dtk per langkah, jadi total uji ~1 menit.
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../public/vendor/chess-engines");
const require = createRequire(import.meta.url);
const Uci = require(path.join(DIR, "josep-uci.js"));
const Ref = require(path.join(DIR, "agus-uci.js"));   // mesin LAIN, dipakai sebagai wasit legalitas langkah

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.error("GAGAL:", m) } };
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(fn, ms = 6000) { const t = Date.now(); while (Date.now() - t < ms) { if (fn()) return true; await sleep(5) } return false }

const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
function mk() { const lines = []; const e = Uci.create(l => lines.push(l)); return { e, lines, cmd: c => e.command(c) } }
function refIllegal(startFen, moves) {   // true jika mesin wasit menolak daftar langkah
  const lines = []; const r = Ref.create(l => lines.push(l));
  r.command(startFen ? "position fen " + startFen + " moves " + moves.join(" ") : "position startpos moves " + moves.join(" "));
  return lines.some(l => l.includes("ERROR"));
}

/* ---------- 1. UCI murni ---------- */
{ const { lines, cmd } = mk();
  cmd("uci"); ok(lines[0].startsWith("id name") && lines.includes("uciok") && lines.some(l => l.startsWith("id author")), "handshake uci");
  ok(lines.some(l => l.startsWith("option name ThinkTime")), "option ThinkTime");
  lines.length = 0; cmd("isready"); ok(lines[0] === "readyok", "isready");
  cmd("ucinewgame"); cmd("position startpos moves e2e4 e7e5 g1f3");
  lines.length = 0; cmd("d"); ok(lines[0] === "info string fen rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", "position startpos moves -> " + lines[0]);
}
// perft: kebenaran pembangkit langkah mesin + pemuat FEN (hak rokade, en passant, promosi)
{ const { lines, cmd } = mk(); const P = (fen, d) => { lines.length = 0; cmd("position fen " + fen); cmd("go perft " + d); return +lines.find(l => l.includes("perft")).split(" ").pop() };
  ok(P(START, 4) === 197281, "perft startpos d4");
  ok(P("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", 3) === 97862, "perft kiwipete d3");
  ok(P("8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", 4) === 43238, "perft pos3 d4");
  ok(P("r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", 3) === 9467, "perft pos4 d3");
  ok(P("rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", 3) === 62379, "perft pos5 d3");
}
// hash FEN-loader harus sama dengan hash hasil make() (repetisi/TT bergantung padanya)
{ const seqs = [
    "e2e4 e7e5 g1f3 b8c6 f1c4 g8f6 e1g1",                       // rokade
    "e2e4 a7a6 e4e5 d7d5",                                       // double push -> ep tersedia
    "e2e4 a7a6 e4e5 d7d5 e5d6 e7e6",                             // en passant dieksekusi
    "d2d4 g8f6 c1g5 e7e6 b1c3 f8b4 d1d3 e8g8 e1c1",              // rokade panjang, hak rokade berubah
    "a2a4 b7b5 a4b5 a7a6 b5a6 c8b7 a6b7 g8f6 b7a8q"              // promosi dengan tangkapan
  ];
  for (const s of seqs) {
    const A = mk(); A.cmd("position startpos moves " + s); A.lines.length = 0; A.cmd("d");
    const fen = A.lines[0].replace("info string fen ", ""), keyA = A.lines[1];
    const B = mk(); B.cmd("position fen " + fen); B.lines.length = 0; B.cmd("d");
    ok(B.lines[0] === "info string fen " + fen && B.lines[1] === keyA, "hash FEN == hash make(): " + s + " | " + A.lines[1] + " vs " + B.lines[1]);
  }
}
// go movetime -> info + bestmove legal, dan waktu dihormati
async function bm(setup, goCmd, wait = 8000) { const t = mk(); setup.forEach(c => t.cmd(c)); t.lines.length = 0; t.cmd(goCmd); await until(() => t.lines.some(l => l.startsWith("bestmove")), wait); return t }
{ const t0 = Date.now(); const t = await bm(["position fen r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7"], "go movetime 500"); const dt = Date.now() - t0;
  const b = t.lines.find(l => l.startsWith("bestmove"));
  ok(!!b, "bestmove diterima"); ok(t.lines.some(l => /^info depth \d+ score (cp|mate) -?\d+ nodes \d+ nps \d+ time \d+ pv /.test(l)), "format info");
  ok(dt >= 150 && dt < 1200, "go movetime 500 menghormati waktu (" + dt + " ms)");
}
// mat dalam 1 (Qh5xf7#) & skor mate
{ const t = await bm(["position fen r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4"], "go movetime 500");
  const b = t.lines.find(l => l.startsWith("bestmove")); ok(b.startsWith("bestmove h5f7"), "mat 1 langkah: " + b);
  ok(t.lines.some(l => l.includes("score mate 1")), "skor mate 1");
}
// ratu digantung: harus ditangkap (putih dan hitam -> kedua warna)
{ const t = await bm(["position fen 4k3/8/8/3q4/8/8/8/3RK3 w - - 0 1"], "go movetime 400");
  ok(t.lines.find(l => l.startsWith("bestmove")).startsWith("bestmove d1d5"), "putih: ambil ratu gratis");
  const u = await bm(["position fen 3rk3/8/8/3Q4/8/8/8/4K3 b - - 0 1"], "go movetime 400");
  ok(u.lines.find(l => l.startsWith("bestmove")).startsWith("bestmove d8d5"), "hitam: ambil ratu gratis");
}
// go depth, wtime/btime, go polos (2300 ms bawaan), langkah tunggal tanpa pencarian
{ const t = await bm(["position fen r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7"], "go depth 3"); ok(t.lines.some(l => l.startsWith("info depth 3 ")) && t.lines.some(l => l.startsWith("bestmove")), "go depth 3"); }
{ const t0 = Date.now(); const t = await bm(["position fen r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7"], "go wtime 3000 btime 3000 winc 0 binc 0"); const dt = Date.now() - t0;
  ok(t.lines.some(l => l.startsWith("bestmove")) && dt < 1500, "go wtime/btime (" + dt + " ms)"); }
{ const t0 = Date.now(); const t = await bm(["position fen r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7"], "go", 10000); const dt = Date.now() - t0;
  ok(t.lines.some(l => l.startsWith("bestmove")) && dt > 1500 && dt < 3600, "go polos = ~2300 ms (" + dt + " ms)"); }
{ const t0 = Date.now(); const t = await bm(["position fen 7k/8/8/8/8/pp4q1/P7/7K w - - 0 1"], "go movetime 2300"); const dt = Date.now() - t0;   // satu-satunya langkah legal: a2b3
  ok(t.lines.includes("bestmove a2b3") && t.lines.includes("info string satu-satunya langkah legal") && dt < 200, "satu langkah legal -> langsung tanpa pencarian (" + dt + " ms)"); }
// buku pembukaan: dari posisi awal langsung menjawab, dan dapat dimatikan
{ const t0 = Date.now(); const t = await bm(["position startpos"], "go movetime 2300"); const dt = Date.now() - t0;
  ok(t.lines.some(l => l === "info string buku pembukaan") && dt < 200, "buku pembukaan langsung (" + dt + " ms)"); }
{ const t = await bm(["setoption name OwnBook value false", "position startpos"], "go movetime 300"); ok(!t.lines.some(l => l === "info string buku pembukaan"), "OwnBook false -> mencari"); }
{ const t = await bm(["position startpos moves a2a3"], "go movetime 300"); ok(!t.lines.some(l => l === "info string buku pembukaan"), "keluar buku -> mencari"); }
// promosi, en passant, rokade lewat position moves
{ const t = mk(); t.cmd("position fen 8/P6k/8/8/8/8/8/K7 w - - 0 1 moves a7a8q"); t.lines.length = 0; t.cmd("d"); ok(t.lines[0].startsWith("info string fen Q7/7k"), "promosi via moves: " + t.lines[0]);
  t.cmd("position startpos moves e2e4 a7a6 e4e5 d7d5 e5d6"); t.lines.length = 0; t.cmd("d"); ok(t.lines[0].includes("rnbqkbnr/1pp1pppp/p2P4/8/8/8/PPPP1PPP/RNBQKBNR"), "en passant: " + t.lines[0]);
  t.cmd("position startpos moves e2e4 e7e5 g1f3 b8c6 f1c4 g8f6 e1g1"); t.lines.length = 0; t.cmd("d"); ok(t.lines[0].includes("RNBQ1RK1"), "rokade: " + t.lines[0]);
}
// promosi menjadi bawah (e7e8n) diproses mesin
{ const t = mk(); t.cmd("position fen 8/4P1k1/8/8/8/8/8/K7 w - - 0 1 moves e7e8n"); t.lines.length = 0; t.cmd("d"); ok(t.lines[0].startsWith("info string fen 4N3/6k1"), "promosi kuda: " + t.lines[0]); }
// go infinite + stop
{ const t = mk(); t.cmd("position fen r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7"); t.lines.length = 0; t.cmd("go infinite"); await sleep(1200);
  ok(!t.lines.some(l => l.startsWith("bestmove")), "infinite belum mengirim bestmove"); ok(t.e.isSearching(), "sedang mencari"); ok(t.lines.some(l => l.startsWith("info depth")), "infinite mengirim info");
  t.cmd("stop"); ok(t.lines.some(l => l.startsWith("bestmove ")) && !t.e.isSearching(), "stop -> bestmove"); }
// penanganan error
{ const t = mk(); t.cmd("position startpos moves e2e5"); ok(t.lines.some(l => l.startsWith("info string ERROR")), "langkah ilegal dilaporkan");
  t.lines.length = 0; t.cmd("go movetime 100"); ok(t.lines.includes("bestmove 0000"), "go pada posisi rusak -> bestmove 0000");
  t.lines.length = 0; t.cmd("position fen bukan fen"); ok(t.lines.some(l => l.includes("ERROR")), "FEN rusak");
  t.lines.length = 0; t.cmd("position fen 7k/8/8/8/8/8/8/K7 b - - 0 1"); t.cmd("go movetime 100"); await sleep(200); ok(t.lines.some(l => l.startsWith("bestmove") && l !== "bestmove 0000"), "FEN valid pulih");
  t.lines.length = 0; t.cmd("position fen 7k/5Q2/6K1/8/8/8/8/8 b - - 0 1"); t.cmd("go movetime 100"); ok(t.lines.includes("bestmove 0000"), "skakmat/stalemate -> bestmove 0000");
  t.lines.length = 0; t.cmd("position fen 4k3/8/8/8/8/8/8/R3K2R w KQkq - 0 1"); t.cmd("d"); ok(t.lines.some(l => l.startsWith("info string fen") && l.includes(" KQ ") ), "hak rokade lawan tanpa benteng dibuang: " + t.lines.join("|"));
  t.lines.length = 0; t.cmd("position fen 4k3/8/8/8/8/8/8/4K3 w KQkq - 0 1"); t.cmd("d"); ok(t.lines.some(l => l.includes(" - 0 1")), "hak rokade tanpa benteng dibuang");
  t.lines.length = 0; t.cmd("position fen 4k3/8/8/8/8/8/4R3/4K3 w - - 0 1"); t.cmd("position fen 4k3/4R3/8/8/8/8/8/4K3 w - - 0 1"); ok(t.lines.some(l => l.includes("ERROR")), "raja yang tidak jalan sedang skak ditolak");
}
// permainan penuh Josep vs Josep di lapisan UCI: semua langkah harus legal menurut mesin LAIN (agus-uci)
{ const moves = []; let illegal = false, endedAt = -1; const t0 = Date.now();
  const e = Uci.create(() => { }); const lines = []; const g = Uci.create(l => lines.push(l));
  for (let ply = 0; ply < 60; ply++) {
    lines.length = 0; g.command("position startpos" + (moves.length ? " moves " + moves.join(" ") : "")); g.command("setoption name OwnBook value " + (ply < 8 ? "true" : "false")); g.command("go movetime 60 depth 14");
    if (!await until(() => lines.some(l => l.startsWith("bestmove")), 3000)) { illegal = true; break }
    const m = lines.find(l => l.startsWith("bestmove")).split(" ")[1];
    if (m === "0000") { endedAt = ply; break }
    moves.push(m);
    if (refIllegal(null, moves)) { illegal = true; console.error("langkah ilegal:", m, "setelah", moves.slice(0, -1).join(" ")); break }
  }
  ok(!illegal && moves.length >= 40, "partai Josep vs Josep legal: " + moves.length + " ply (" + (Date.now() - t0) + " ms)" + (endedAt >= 0 ? ", selesai di ply " + endedAt : ""));
}
// dua warna dari posisi non-awal, divalidasi mesin lain
{ const fen = "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7"; const moves = []; let illegal = false;
  const g = Uci.create(() => { }); const lines = []; const h = Uci.create(l => lines.push(l));
  for (let ply = 0; ply < 40; ply++) {
    lines.length = 0; h.command("position fen " + fen + (moves.length ? " moves " + moves.join(" ") : "")); h.command("go movetime 60 depth 14");
    if (!await until(() => lines.some(l => l.startsWith("bestmove")), 3000)) { illegal = true; break }
    const m = lines.find(l => l.startsWith("bestmove")).split(" ")[1]; if (m === "0000") break; moves.push(m);
    if (refIllegal(fen, moves)) { illegal = true; console.error("langkah ilegal (FEN):", m); break }
  }
  ok(!illegal && moves.length >= 30, "partai dari FEN, putih & hitam legal: " + moves.length + " ply");
}

/* ---------- 2. Adaptor protokol bot (josep.js) ---------- */
function makeWorker() {
  const out = []; const sandbox = { out };
  sandbox.self = sandbox; sandbox.postMessage = m => out.push(m);
  sandbox.importScripts = f => vm.runInContext(fs.readFileSync(path.join(DIR, f), "utf8"), ctx, { filename: f });
  sandbox.performance = performance; sandbox.setTimeout = setTimeout; sandbox.clearTimeout = clearTimeout;
  const ctx = vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(DIR, "josep.js"), "utf8"), ctx, { filename: "josep.js" });
  return { out, post: d => sandbox.onmessage({ data: d }), sandbox };
}
const isMove = s => /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(s);
const MID = "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7";   // di luar buku
{ // bot main putih -> Josep (hitam) menjawab; waktu tetap ~2,3 dtk walau bot mengirim "search 50"
  const w = makeWorker(); w.post("go"); w.post("position " + MID); w.post("c1g5");
  const t0 = Date.now(); w.post("search 50");
  ok(await until(() => w.out.some(isMove), 8000), "adaptor membalas langkah"); const dt = Date.now() - t0;
  ok(dt > 1500 && dt < 3600, "waktu berpikir ~2,3 dtk walau diminta 50 ms (" + dt + " ms)");
  ok(w.out.some(m => /^pv Ply:\d+ Score:/.test(m)), "adaptor mengirim pv");
  ok(!w.out.some(m => /^(info|bestmove|uciok|readyok|id )/.test(m)), "tidak ada baris UCI mentah bocor ke bot");
  ok(!w.out.some(m => m.startsWith("message")), "tidak ada pesan error");
  const reply = w.out.find(isMove);
  ok(!refIllegal(MID, ["c1g5", reply]), "balasan hitam legal: " + reply);
}
{ // satu "search" = satu pencarian; position/langkah pemain tidak memicu pencarian
  const w = makeWorker(); w.post("go"); w.post("position " + MID); w.post("c1g5"); w.post("h7h6"); await sleep(300);
  ok(w.out.length === 0, "tanpa 'search' worker diam (tidak ada pemanggilan mesin)");
}
{ // bot main hitam: worker mulai dari posisi awal & Josep jalan dulu sebagai putih (buku -> langsung)
  const w = makeWorker(); w.post("go"); w.post("position " + START); const t0 = Date.now(); w.post("search 2000");
  ok(await until(() => w.out.some(isMove)), "Josep membuka sebagai putih"); ok(Date.now() - t0 < 300, "pembukaan dari buku langsung");
  ok(["e2e4", "d2d4", "g1f3", "c2c4"].includes(w.out.find(isMove)), "langkah buku: " + w.out.find(isMove));
}
{ // posisi FEN kustom: Josep hitam & putih, ambil ratu gratis; langkah ilegal / FEN rusak => message
  const w = makeWorker(); w.post("position 4k3/8/8/3q4/8/8/8/3RK3 w - - 0 1"); w.post("search 300");
  ok(await until(() => w.out.some(isMove)), "FEN kustom (putih)"); ok(w.out.find(isMove) === "d1d5", "ambil ratu via adaptor (putih)");
  const wb = makeWorker(); wb.post("position 3rk3/8/8/3Q4/8/8/8/4K3 b - - 0 1"); wb.post("search 300");
  ok(await until(() => wb.out.some(isMove)), "FEN kustom (hitam)"); ok(wb.out.find(isMove) === "d8d5", "ambil ratu via adaptor (hitam)");
  const w2 = makeWorker(); w2.post("go"); w2.post("e2e5");
  ok(await until(() => w2.out.some(m => m.startsWith("message"))), "langkah ilegal -> message");
  const w3 = makeWorker(); w3.post("position bukan-fen"); ok(await until(() => w3.out.some(m => m.startsWith("message"))), "FEN rusak -> message");
}
{ // analyze: hanya pv, tidak pernah langkah polos; dihentikan oleh position berikutnya
  const w = makeWorker(); w.post("position " + MID); w.post("analyze"); await sleep(1500);
  ok(w.out.some(m => m.startsWith("pv ")), "analyze mengirim pv"); ok(!w.out.some(isMove), "analyze tidak mengirim langkah polos");
  w.post("position " + MID); await sleep(100); ok(!w.out.some(isMove), "analyze dihentikan tanpa langkah bocor");
}
{ // posisi tanpa langkah legal
  const w = makeWorker(); w.post("position 7k/5Q2/6K1/8/8/8/8/8 b - - 0 1"); w.post("search 200");
  ok(await until(() => w.out.some(m => m.startsWith("message"))), "tanpa langkah legal -> message");
}
{ // pergantian game: "go" lalu "position" baru, worker tetap sinkron
  const w = makeWorker(); w.post("go"); w.post("position " + START); w.post("e2e4"); w.post("search 2000");
  ok(await until(() => w.out.some(isMove)), "game 1: balasan hitam dari buku");
  w.out.length = 0; w.post("go"); w.post("position " + START); w.post("search 2000");
  ok(await until(() => w.out.some(isMove)), "game 2 (go baru): Josep membuka lagi"); ok(!w.out.some(m => m.startsWith("message")), "game 2 tanpa error");
}
{ // beberapa ply Josep vs Josep lewat adaptor, saling sinkron, semua langkah legal menurut mesin LAIN
  const a = makeWorker(), b = makeWorker(); a.post("go"); b.post("go"); a.post("position " + MID); b.post("position " + MID);
  const moves = []; let illegal = false;
  for (let ply = 0; ply < 6 && !illegal; ply++) {
    const w = ply % 2 ? b : a, o = ply % 2 ? a : b; w.out.length = 0; w.post("search 2300");
    if (!await until(() => w.out.some(m => isMove(m) || m.startsWith("message")), 8000)) { illegal = true; break }
    const m = w.out.find(x => isMove(x) || x.startsWith("message")); if (!isMove(m)) break;
    moves.push(m);
    if (refIllegal(MID, moves)) { illegal = true; console.error("langkah ilegal:", m, moves.join(" ")); break }
    o.post(m);
  }
  ok(!illegal && moves.length === 6, "6 ply Josep vs Josep via adaptor legal (" + moves.length + ")");
}

console.log(`\nJosep UCI: ${pass} lulus, ${fail} gagal`);
process.exit(fail ? 1 : 0);
