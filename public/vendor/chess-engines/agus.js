"use strict";
/* =====================================================================
   Agus — Elo 1600 — adaptor Web Worker untuk bot NusantaraChess
   ---------------------------------------------------------------------
   Protokol yang dipakai bot (sama dengan ilham.js / adit.js / dimas.js /
   fahriengine.js, lihat src/features/bot/04-eval-engine.ts):
     "go"              -> permainan baru
     "position <fen>"  -> muat posisi
     "<uci>" (e2e4)    -> langkah pemain, diterapkan ke papan worker
     "search <ms>"     -> cari 1 langkah (ms diabaikan, selalu 1000 ms); balas "pv ..." lalu "e2e4"
     "analyze"         -> cari terus-menerus; kirim "pv ..."
   Error dikirim sebagai "message <teks>".

   Mesin sebenarnya ada di agus-uci.js (mesin dari HTML + protokol
   UCI). Berkas ini TIDAK punya logika catur: semua pesan bot
   diterjemahkan menjadi perintah UCI (uci / isready / ucinewgame /
   position ... moves ... / go movetime|infinite / stop) dan balasan UCI
   (info ..., bestmove ...) diterjemahkan kembali ke format bot.
   ===================================================================== */
self.AGUS_UCI_EMBEDDED = true;
importScripts("agus-uci.js");

(function () {
  const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const UCI_MOVE = /^[a-h][1-8][a-h][1-8][qrbn]?$/;
  const MOVETIME_MS = 1000;   // 1 detik per langkah

  let base = "startpos";   // "startpos" | "fen <fen>"
  let moves = [];          // langkah UCI sejak `base`
  let mode = "idle";       // "idle" | "search" | "analyze"
  let lastInfo = null;     // info UCI terakhir {depth, score, pv}
  let uciok = false, readyok = false;
  const queue = [];

  const engine = self.AgusUCI.create(onEngineLine);

  function uci(cmd) { engine.command(cmd) }

  function sendPosition() {
    uci("position " + base + (moves.length ? " moves " + moves.join(" ") : ""));
  }

  function parseInfo(line) {
    const t = line.split(/\s+/), r = {};
    const d = t.indexOf("depth"); if (d >= 0) r.depth = parseInt(t[d + 1], 10);
    const s = t.indexOf("score");
    if (s >= 0) r.score = t[s + 1] === "mate" ? "#" + t[s + 2] : t[s + 2];
    const p = t.indexOf("pv"); if (p >= 0) r.pv = t.slice(p + 1);
    return r;
  }
  function pvText(info, fallbackMove) {
    const pv = info && info.pv && info.pv.length ? info.pv.join(" ") : fallbackMove;
    return "pv Ply:" + (info ? info.depth : 0) + " Score:" + (info ? info.score : 0) + " " + pv;
  }

  function onEngineLine(line) {
    if (line === "uciok") { uciok = true; return }
    if (line === "readyok") { readyok = true; flush(); return }
    if (line.indexOf("info string ERROR") === 0) {
      mode = "idle";
      postMessage("message " + line.slice("info string ERROR:".length).trim());
      return;
    }
    if (line.indexOf("info ") === 0) {
      if (line.indexOf("info string") === 0) return;
      const info = parseInfo(line);
      if (info.pv) {
        lastInfo = info;
        if (mode === "analyze") postMessage(pvText(info, ""));
      }
      return;
    }
    if (line.indexOf("bestmove") === 0) {
      const best = line.split(/\s+/)[1];
      if (mode === "search") {
        mode = "idle";
        if (!best || best === "0000") { postMessage("message Tidak ada langkah legal"); return }
        postMessage(pvText(lastInfo, best));
        postMessage(best);
        // Bot tidak mengirim ulang langkah mesin -> worker menerapkannya sendiri.
        moves.push(best);
      }
      return;
    }
  }

  function handle(data) {
    if (data === "go") {
      mode = "idle"; uci("stop");
      base = "startpos"; moves = []; lastInfo = null;
      uci("ucinewgame");
      sendPosition();
    } else if (/^position/.test(data)) {
      mode = "idle"; uci("stop");
      const fen = data.slice(8).trim();
      base = "fen " + (fen || START_FEN); moves = []; lastInfo = null;
      sendPosition();
    } else if (/^search/.test(data)) {
      // Angka ms dari bot diabaikan: Agus selalu 1000 ms (lihat MOVETIME_MS).
      mode = "search"; lastInfo = null;
      sendPosition();
      uci("go movetime " + MOVETIME_MS);
    } else if (data === "analyze") {
      mode = "analyze"; lastInfo = null;
      sendPosition();
      uci("go infinite");
    } else if (UCI_MOVE.test(data)) {
      // Langkah pemain. Hentikan pencarian yang sedang jalan (jika ada),
      // lalu terapkan langkah dan validasi lewat "position ... moves ...".
      mode = "idle"; uci("stop");
      moves.push(data.toLowerCase());
      sendPosition();
    }
  }

  function flush() { while (queue.length) handle(queue.shift()) }

  // Handshake UCI: uci -> uciok, isready -> readyok.
  uci("uci");
  uci("isready");

  self.onmessage = function (e) {
    const data = e.data;
    if (typeof data !== "string") return;
    try {
      if (!readyok) queue.push(data); else handle(data);
    } catch (err) {
      postMessage("message " + (err && err.message ? err.message : err));
    }
  };
  flush();
})();
