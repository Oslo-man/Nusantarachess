// Uji kompatibilitas UCI + adaptor bot untuk Agus.
// Jalankan: node tests/unit/agus-uci.mjs
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../public/vendor/chess-engines");
const require = createRequire(import.meta.url);
const Uci = require(path.join(DIR, "agus-uci.js"));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.error("GAGAL:", m) } };
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(fn, ms = 5000) { const t = Date.now(); while (Date.now() - t < ms) { if (fn()) return true; await sleep(5) } return false }

/* ---------- 1. UCI murni ---------- */
function mk() { const lines = []; const e = Uci.create(l => lines.push(l)); return { e, lines, cmd: c => e.command(c) } }
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

{ const { lines, cmd } = mk();
  cmd("uci"); ok(lines[0].startsWith("id name") && lines.includes("uciok") && lines.some(l => l.startsWith("id author")), "handshake uci");
  ok(lines.some(l => l.startsWith("option name MaxThinkTime")), "option MaxThinkTime");
  lines.length = 0; cmd("isready"); ok(lines[0] === "readyok", "isready");
  cmd("setoption name MaxThinkTime value 300"); cmd("ucinewgame"); cmd("position startpos moves e2e4 e7e5 g1f3");
  lines.length = 0; cmd("d"); ok(lines[0] === "info string fen rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", "position startpos moves -> " + lines[0]);
}
// perft (kebenaran pembangkit langkah)
{ const { lines, cmd } = mk(); const P = (fen, d) => { lines.length = 0; cmd("position fen " + fen); cmd("go perft " + d); return +lines.find(l => l.includes("perft")).split(" ").pop() };
  ok(P(START, 4) === 197281, "perft startpos d4");
  ok(P("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", 3) === 97862, "perft kiwipete d3");
  ok(P("8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", 4) === 43238, "perft pos3 d4");
  ok(P("r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", 3) === 9467, "perft pos4 d3");
}
// go movetime -> info + bestmove legal
async function bm(setup, goCmd, wait = 4000) { const t = mk(); setup.forEach(c => t.cmd(c)); t.lines.length = 0; t.cmd(goCmd); await until(() => t.lines.some(l => l.startsWith("bestmove")), wait); return t }
{ const t = await bm(["position startpos"], "go movetime 300");
  const b = t.lines.find(l => l.startsWith("bestmove"));
  ok(!!b, "bestmove diterima"); ok(t.lines.some(l => /^info depth \d+ score (cp|mate) -?\d+ nodes \d+ nps \d+ time \d+ pv /.test(l)), "format info");
  const legalStart = ["a2a3","a2a4","b2b3","b2b4","c2c3","c2c4","d2d3","d2d4","e2e3","e2e4","f2f3","f2f4","g2g3","g2g4","h2h3","h2h4","b1a3","b1c3","g1f3","g1h3"];
  ok(legalStart.includes(b.split(" ")[1]), "bestmove legal: " + b);
}
// mat dalam 1 (Qh5xf7#) & skor mate
{ const t = await bm(["position fen r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4"], "go movetime 500");
  const b = t.lines.find(l => l.startsWith("bestmove")); ok(b.startsWith("bestmove h5f7"), "mat 1 langkah: " + b);
  ok(t.lines.some(l => l.includes("score mate 1")), "skor mate 1");
}
// bidak digantung: mesin harus menangkap ratu
{ const t = await bm(["position fen 4k3/8/8/3q4/8/8/8/3RK3 w - - 0 1"], "go movetime 400");
  ok(t.lines.find(l => l.startsWith("bestmove")).startsWith("bestmove d1d5"), "ambil ratu gratis");
}
// go depth, go nodes, wtime/btime, searchmoves
{ const t = await bm(["position startpos"], "go depth 3"); ok(t.lines.some(l => l.startsWith("info depth 3 ")) && t.lines.some(l => l.startsWith("bestmove")), "go depth 3"); }
{ const t = await bm(["position startpos"], "go nodes 3000"); ok(t.lines.some(l => l.startsWith("bestmove")), "go nodes"); }
{ const t0 = Date.now(); const t = await bm(["position startpos"], "go wtime 2000 btime 2000 winc 0 binc 0"); ok(t.lines.some(l => l.startsWith("bestmove")) && Date.now() - t0 < 1500, "go wtime/btime"); }
{ const t = await bm(["position startpos"], "go movetime 200 searchmoves a2a3 h2h3"); const m = t.lines.find(l => l.startsWith("bestmove")).split(" ")[1]; ok(["a2a3", "h2h3"].includes(m), "searchmoves: " + m); }
// promosi, en passant, rokade lewat position moves
{ const t = mk(); t.cmd("position fen 8/P6k/8/8/8/8/8/K7 w - - 0 1 moves a7a8q"); t.lines.length = 0; t.cmd("d"); ok(t.lines[0].startsWith("info string fen Q7/7k"), "promosi via moves: " + t.lines[0]);
  t.cmd("position startpos moves e2e4 a7a6 e4e5 d7d5 e5d6"); t.lines.length = 0; t.cmd("d"); ok(t.lines[0].includes("rnbqkbnr/1pp1pppp/p2P4/8/8/8/PPPP1PPP/RNBQKBNR"), "en passant: " + t.lines[0]);
  t.cmd("position startpos moves e2e4 e7e5 g1f3 b8c6 f1c4 g8f6 e1g1"); t.lines.length = 0; t.cmd("d"); ok(t.lines[0].includes("RNBQ1RK1"), "rokade: " + t.lines[0]);
}
// go infinite + stop
{ const t = mk(); t.cmd("position startpos"); t.lines.length = 0; t.cmd("go infinite"); await sleep(700);
  ok(!t.lines.some(l => l.startsWith("bestmove")), "infinite belum mengirim bestmove"); ok(t.e.isSearching(), "sedang mencari");
  t.cmd("stop"); ok(t.lines.some(l => l.startsWith("bestmove ")) && !t.e.isSearching(), "stop -> bestmove"); }
// error handling
{ const t = mk(); t.cmd("position startpos moves e2e5"); ok(t.lines.some(l => l.startsWith("info string ERROR")), "langkah ilegal dilaporkan");
  t.lines.length = 0; t.cmd("go movetime 100"); ok(t.lines.includes("bestmove 0000"), "go pada posisi rusak -> bestmove 0000");
  t.lines.length = 0; t.cmd("position fen bukan fen"); ok(t.lines.some(l => l.includes("ERROR")), "FEN rusak");
  t.lines.length = 0; t.cmd("position fen 7k/8/8/8/8/8/8/K7 b - - 0 1"); t.cmd("go movetime 100"); await sleep(150); ok(t.lines.some(l => l.startsWith("bestmove")), "FEN valid pulih");
  t.lines.length = 0; t.cmd("position fen 7k/5Q2/6K1/8/8/8/8/8 b - - 0 1"); t.cmd("go movetime 100"); ok(t.lines.includes("bestmove 0000"), "skakmat/stalemate -> bestmove 0000");
}

/* ---------- 2. Adaptor protokol bot (agus.js) ---------- */
function makeWorker() {
  const out = []; const sandbox = { out };
  sandbox.self = sandbox; sandbox.postMessage = m => out.push(m);
  sandbox.importScripts = f => vm.runInContext(fs.readFileSync(path.join(DIR, f), "utf8"), ctx, { filename: f });
  sandbox.performance = performance; sandbox.setTimeout = setTimeout; sandbox.clearTimeout = clearTimeout;
  const ctx = vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(DIR, "agus.js"), "utf8"), ctx, { filename: "agus.js" });
  return { out, post: d => sandbox.onmessage({ data: d }), sandbox };
}
const isMove = s => /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(s);
{ const w = makeWorker();
  w.post("go"); w.post("position " + START);
  w.post("e2e4"); w.post("search 400");
  ok(await until(() => w.out.some(isMove)), "adaptor membalas langkah");
  ok(w.out.some(m => /^pv Ply:\d+ Score:/.test(m)), "adaptor mengirim pv");
  ok(!w.out.some(m => /^(info|bestmove|uciok|readyok|id )/.test(m)), "tidak ada baris UCI mentah bocor ke bot");
  const reply = w.out.find(isMove);
  // lanjutkan: pemain main lagi, worker harus tetap sinkron (tanpa "message")
  const legalReplies = ["a7a6","a7a5","b7b6","b7b5","c7c6","c7c5","d7d6","d7d5","e7e6","e7e5","f7f6","f7f5","g7g6","g7g5","h7h6","h7h5","b8a6","b8c6","g8f6","g8h6"];
  ok(legalReplies.includes(reply), "balasan hitam legal: " + reply);
  w.out.length = 0; w.post("d2d4"); w.post("search 300");
  ok(await until(() => w.out.some(isMove)), "langkah kedua");
  ok(!w.out.some(m => m.startsWith("message")), "tidak ada pesan error");
}
{ // bot main hitam: worker mulai dari posisi awal & Agus jalan dulu
  const w = makeWorker(); w.post("go"); w.post("position " + START); w.post("search 300");
  ok(await until(() => w.out.some(isMove)), "Agus membuka sebagai putih");
}
{ // posisi FEN kustom + langkah ilegal => message
  const w = makeWorker(); w.post("position 4k3/8/8/3q4/8/8/8/3RK3 w - - 0 1"); w.post("search 300");
  ok(await until(() => w.out.some(isMove)), "FEN kustom"); ok(w.out.find(isMove) === "d1d5", "ambil ratu via adaptor");
  const w2 = makeWorker(); w2.post("go"); w2.post("e2e5");
  ok(await until(() => w2.out.some(m => m.startsWith("message"))), "langkah ilegal -> message");
  const w3 = makeWorker(); w3.post("position bukan-fen"); ok(await until(() => w3.out.some(m => m.startsWith("message"))), "FEN rusak -> message");
}
{ // analyze: hanya pv, tidak pernah langkah polos
  const w = makeWorker(); w.post("position " + START); w.post("analyze"); await sleep(800);
  ok(w.out.some(m => m.startsWith("pv ")), "analyze mengirim pv"); ok(!w.out.some(isMove), "analyze tidak mengirim langkah polos");
  w.post("position " + START); await sleep(50); ok(!w.out.some(isMove), "analyze dihentikan tanpa langkah bocor");
}
{ // posisi tanpa langkah legal
  const w = makeWorker(); w.post("position 7k/5Q2/6K1/8/8/8/8/8 b - - 0 1"); w.post("search 200");
  ok(await until(() => w.out.some(m => m.startsWith("message"))), "tanpa langkah legal -> message");
}
{ // permainan penuh Agus vs Agus lewat adaptor (semua langkah harus legal menurut mesin lain)
  const a = makeWorker(), b = makeWorker(); a.post("go"); b.post("go"); a.post("position " + START); b.post("position " + START);
  const ref = Uci.create(() => { }); let moves = [], illegal = false;
  for (let ply = 0; ply < 24 && !illegal; ply++) {
    const w = ply % 2 ? b : a, o = ply % 2 ? a : b; w.out.length = 0; w.post("search 80");
    if (!await until(() => w.out.some(m => isMove(m) || m.startsWith("message")))) { illegal = true; break }
    const m = w.out.find(x => isMove(x) || x.startsWith("message")); if (!isMove(m)) break;
    const lines = []; const r = Uci.create(l => lines.push(l)); r.command("position startpos moves " + [...moves, m].join(" "));
    if (lines.some(l => l.includes("ERROR"))) { illegal = true; console.error("langkah ilegal:", m, moves.join(" ")); break }
    moves.push(m); o.post(m);
  }
  ok(!illegal && moves.length >= 20, "24 ply Agus vs Agus legal (" + moves.length + ")");
}

console.log(`\nAgus UCI: ${pass} lulus, ${fail} gagal`);
process.exit(fail ? 1 : 0);
