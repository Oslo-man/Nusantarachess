"use strict";
/* =====================================================================
   Ilham — mesin catur "Agresif / Taktikal" + protokol UCI
   ---------------------------------------------------------------------
   MESIN : ilham-engine.js — diambil APA ADANYA (tanpa perubahan) dari
           mesin_catur_agresif_taktikal_v2.html (blok <script id="eng-agr">):
           papan 0x88, PVS + TT, null-move/RFP/futility/LMP/LMR, SEE,
           quiescence, evaluasi tapered, riwayat pengulangan, buku
           pembukaan. Mesin itu punya API sendiri (searchBest, fromFEN,
           applyMove, ...) dan protokol worker sendiri ({type:'search'}),
           BUKAN UCI. Berkas ini adalah lapisan UCI di atas API tersebut.

   LAPISAN UCI: uci, isready, ucinewgame, setoption (OwnBook, Clear Hash),
   position (startpos|fen ... moves ...), go (movetime, wtime/btime/
   winc/binc/movestogo, depth, nodes, infinite), stop, quit, serta
   ekstensi debug: d, go perft N.
   Balasan: id, option, uciok, readyok, info ..., bestmove <m> [ponder <m>].
   Riwayat posisi dari "position ... moves ..." diteruskan ke mesin agar
   deteksi pengulangan langkah bekerja.

   Dipakai dua cara:
     1) Web Worker UCI murni:  new Worker("vendor/chess-engines/ilham-uci.js")
     2) lewat ilham.js (adaptor protokol bot NusantaraChess).
   ===================================================================== */
(function (global) {

var engineApi = null;
function loadEngine() {
  if (engineApi) return engineApi;
  if (typeof require === "function" && typeof module === "object" && module && module.exports) {
    engineApi = require("./ilham-engine.js");           // Node (tes)
  } else {                                              // Web Worker
    var prev = global.module;
    global.module = { exports: {} };                    // mesin mengekspor API lewat module.exports
    try { importScripts("ilham-engine.js"); engineApi = global.module.exports }
    finally { if (prev === undefined) delete global.module; else global.module = prev }
  }
  if (!engineApi || typeof engineApi.searchBest !== "function") throw new Error("ilham-engine.js gagal dimuat");
  return engineApi;
}

function createIlhamUci(emit) {
  var api = loadEngine();
  var ENGINE_NAME = "Ilham (Agresif/Taktikal)";
  var ENGINE_AUTHOR = "NusantaraChess";
  var MATE = 32000;
  var INFINITE_SLICE_START = 300, INFINITE_SLICE_MAX = 4000;
  var opts = { OwnBook: true };

  var pos = api.initial(), hist = [api.positionKey(pos)], positionOk = true;
  var current = null, quit = false;

  var out = function (line) { try { emit(line) } catch (e) { } };

  /* ---------- posisi ---------- */
  function findMove(p, str) {
    str = String(str).trim();
    if (!/^[a-h][1-8][a-h][1-8][qrbnQRBN]?$/.test(str)) return null;
    var want = str.slice(0, 4) + str.slice(4).toLowerCase(), ms = api.legalMoves(p);
    for (var i = 0; i < ms.length; i++) if (api.moveToUci(ms[i]) === want) return ms[i];
    return null;
  }
  function parseFenLenient(fen) {
    try { return api.fromFEN(fen) }
    catch (e) {
      var t = String(fen).trim().split(/\s+/);
      if (t.length >= 4 && t[3] !== "-") {                 // coba lagi tanpa kotak en passant yang janggal
        t[3] = "-";
        var p = api.fromFEN(t.join(" "));
        out("info string peringatan: kotak en passant pada FEN diabaikan");
        return p;
      }
      throw e;
    }
  }
  function setPosition(tokens) {
    var p, h, i = 0;
    try {
      if (tokens[0] === "startpos") { p = api.initial(); i = 1 }
      else if (tokens[0] === "fen") {
        var j = 1, f = []; while (j < tokens.length && tokens[j] !== "moves") f.push(tokens[j++]);
        p = parseFenLenient(f.join(" ")); i = j;
      } else throw new Error("position harus 'startpos' atau 'fen'");
      h = [api.positionKey(p)];
      if (tokens[i] === "moves") {
        for (var k = i + 1; k < tokens.length; k++) {
          var m = findMove(p, tokens[k]);
          if (!m) throw new Error("langkah ilegal: " + tokens[k]);
          p = api.applyMove(p, m); h.push(api.positionKey(p));
        }
      } else if (i < tokens.length) throw new Error("token tak dikenal: " + tokens[i]);
    } catch (e) {
      positionOk = false;
      out("info string ERROR: " + (e && e.message ? e.message : e));
      return;
    }
    pos = p; hist = h; positionOk = true;
  }

  /* ---------- keluaran ---------- */
  function scoreString(v) {
    if (Math.abs(v) > MATE - 100) { var n = Math.ceil((MATE - Math.abs(v)) / 2); return "mate " + (v > 0 ? n : -n) }
    return "cp " + Math.round(v);
  }
  function infoLine(i, pv) {
    var ms = Math.max(1, Math.round(i.ms || 1));
    return "info depth " + i.depth + (i.selDepth ? " seldepth " + i.selDepth : "") + " score " + scoreString(i.score) +
      " nodes " + i.nodes + " nps " + Math.round((i.nodes || 0) * 1000 / ms) + " time " + ms + (pv && pv.length ? " pv " + pv.join(" ") : "");
  }

  /* ---------- satu pencarian sinkron memakai API mesin ---------- */
  function runSearch(sr, ms, extra) {
    var o = { ms: ms, book: opts.OwnBook && !sr.infinite };
    if (sr.nodeLimit) o.nodes = sr.nodeLimit;
    if (extra) for (var k in extra) o[k] = extra[k];
    var t0 = Date.now();
    var m = api.searchBest(sr.pos, sr.maxDepth, sr.hist, o);
    var st = api.getState();
    if (m && st.lastMoveSource === "book") {
      var u = api.moveToUci(m);
      out("info string buku pembukaan: " + ((st.lastSearchDiagnostics && st.lastSearchDiagnostics.openingName) || ""));
      out("info depth 0 score cp 0 nodes 0 nps 0 time 1 pv " + u);
      return { move: m, pv: [u], depth: 0 };
    }
    var pv = st.pv && st.pv.length ? st.pv : (m ? [api.moveToUci(m)] : []);
    return { move: m, pv: pv, depth: st.lastDepth, score: st.score, nodes: st.nodes, ms: Date.now() - t0 };
  }
  function validated(sr, m) {
    var ms = api.legalMoves(sr.pos);
    if (m) { var u = api.moveToUci(m); for (var i = 0; i < ms.length; i++) if (api.moveToUci(ms[i]) === u) return ms[i] }
    return ms[0] || null;
  }

  function finish(sr) {
    if (current !== sr) return;
    if (sr.timer) { clearTimeout(sr.timer); sr.timer = null }
    current = null;
    var m = validated(sr, sr.best);
    if (!m) { out("bestmove 0000"); return }
    var line = "bestmove " + api.moveToUci(m);
    if (sr.pv && sr.pv.length > 1 && sr.pv[0] === api.moveToUci(m)) line += " ponder " + sr.pv[1];
    out(line);
  }

  function stepFinite(sr) {
    sr.timer = null;
    if (current !== sr) return;
    if (sr.stopRequested) return finish(sr);
    sr.started = true;
    try {
      var r = runSearch(sr, sr.ms, {
        onInfo: function (i) { out(infoLine(i)) }
      });
      sr.best = r.move; sr.pv = r.pv;
      if (r.depth > 0) out(infoLine({ depth: r.depth, score: r.score, nodes: r.nodes, ms: r.ms }, r.pv));
    } catch (e) { out("info string ERROR: " + (e && e.message ? e.message : e)) }
    finish(sr);
  }

  // "go infinite": mesin berjalan sinkron, jadi analisis dipotong menjadi irisan
  // waktu (analyze:true => tidak berhenti dini) agar "stop" sempat diproses.
  function stepInfinite(sr) {
    sr.timer = null;
    if (current !== sr) return;
    if (sr.stopRequested) return finish(sr);
    if (sr.waiting) return;
    sr.started = true;
    var ms = Math.min(INFINITE_SLICE_START * Math.pow(2, sr.slice++), INFINITE_SLICE_MAX);
    try {
      var r = runSearch(sr, ms, {
        analyze: true,
        onInfo: function (i) { if (i.depth > sr.reported) { sr.reported = i.depth; out(infoLine(i)) } }
      });
      if (r.move) { sr.best = r.move; sr.pv = r.pv }
      if (r.depth > 0) out(infoLine({ depth: r.depth, score: r.score, nodes: r.nodes, ms: r.ms }, r.pv));
      if (r.depth >= sr.maxDepth || Math.abs(r.score) > MATE - 100) { sr.waiting = true; return }
    } catch (e) { out("info string ERROR: " + (e && e.message ? e.message : e)); sr.waiting = true; return }
    sr.timer = setTimeout(function () { stepInfinite(sr) }, 0);
  }

  function go(tokens) {
    if (current) { out("info string search already running"); return }
    if (!positionOk) { out("info string ERROR: posisi tidak valid"); out("bestmove 0000"); return }
    var lim = { infinite: false, depth: 0, nodes: 0, movetime: -1, wtime: -1, btime: -1, winc: 0, binc: 0, movestogo: 0 };
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i], n = +tokens[i + 1];
      if (t === "infinite" || t === "ponder") lim.infinite = true;
      else if (t === "depth") { if (!isNaN(n)) lim.depth = Math.max(1, Math.min(api.DEPTH, n | 0)); i++ }
      else if (t === "nodes") { if (!isNaN(n)) lim.nodes = Math.max(1, n); i++ }
      else if (t === "movetime") { if (!isNaN(n)) lim.movetime = Math.max(1, n); i++ }
      else if (t === "wtime" || t === "btime" || t === "winc" || t === "binc" || t === "movestogo") { if (!isNaN(n)) lim[t] = n; i++ }
      else if (t === "searchmoves") { out("info string searchmoves tidak didukung mesin ini, diabaikan"); while (i + 1 < tokens.length && /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(tokens[i + 1])) i++ }
    }
    var legal = api.legalMoves(pos);
    if (!legal.length) { out("bestmove 0000"); return }

    var ms;
    if (lim.movetime > 0) ms = lim.movetime;
    else if ((pos.side === "w" ? lim.wtime : lim.btime) >= 0) {
      var my = pos.side === "w" ? lim.wtime : lim.btime, inc = pos.side === "w" ? lim.winc : lim.binc;
      var share = my / (lim.movestogo > 0 ? Math.min(lim.movestogo, 40) : 30) + inc * 0.75;
      ms = Math.max(10, Math.min(share, Math.max(10, my - 50)));
    } else if (lim.depth || lim.nodes) ms = 1e9;           // dibatasi kedalaman / node saja
    else ms = api.SEARCH_TIME_MS;                          // "go" polos: waktu bawaan mesin

    var sr = {
      pos: pos, hist: hist.slice(), ms: ms, infinite: lim.infinite,
      maxDepth: lim.depth || api.DEPTH, nodeLimit: lim.nodes, best: legal[0], pv: null,
      timer: null, stopRequested: false, started: false, waiting: false, slice: 0, reported: 0
    };
    current = sr;
    out("info string Ilham mulai mencari" + (lim.infinite ? " (infinite)" : " (maks. " + Math.round(ms >= 1e9 ? 0 : ms) + " ms)"));
    sr.timer = setTimeout(function () { (sr.infinite ? stepInfinite : stepFinite)(sr) }, 0);
  }

  function stop() {
    var sr = current; if (!sr) return;
    sr.stopRequested = true;
    if (sr.timer) { clearTimeout(sr.timer); sr.timer = null }
    if (!sr.started) {                                      // belum sempat mencari: cari singkat agar bestmove tetap bermakna
      try { var r = runSearch(sr, 30, { analyze: false }); if (r.move) { sr.best = r.move; sr.pv = r.pv } } catch (e) { }
    }
    finish(sr);
  }

  function setOption(tokens) {
    var vi = tokens.indexOf("value");
    var name = tokens.slice(tokens[0] === "name" ? 1 : 0, vi < 0 ? tokens.length : vi).join(" ").toLowerCase();
    var value = vi < 0 ? "" : tokens.slice(vi + 1).join(" ").toLowerCase();
    if (name === "ownbook") opts.OwnBook = value === "true";
    else if (name === "clear hash") api.newGame();
    else out("info string option tidak dikenal: " + name);
  }

  function newGame() { stop(); api.newGame(); pos = api.initial(); hist = [api.positionKey(pos)]; positionOk = true }

  function command(line) {
    if (quit) return;
    var lines = String(line).split(/\r?\n/);
    for (var li = 0; li < lines.length; li++) {
      var tokens = lines[li].trim().split(/\s+/).filter(Boolean);
      if (!tokens.length) continue;
      var cmd = tokens[0], rest = tokens.slice(1);
      switch (cmd) {
        case "uci":
          out("id name " + ENGINE_NAME);
          out("id author " + ENGINE_AUTHOR);
          out("option name OwnBook type check default true");
          out("option name Clear Hash type button");
          out("uciok"); break;
        case "isready": out("readyok"); break;
        case "ucinewgame": newGame(); break;
        case "setoption": setOption(rest); break;
        case "position": if (current) stop(); setPosition(rest); break;
        case "go":
          if (rest[0] === "perft") { var d = Math.max(1, parseInt(rest[1], 10) || 1); out("info string perft " + d + " " + api.perft(pos, d)); break }
          go(rest); break;
        case "stop": stop(); break;
        case "ponderhit": break;
        case "d": out("info string fen " + api.toFEN(pos)); break;
        case "quit": stop(); quit = true; break;
        default: out("info string perintah tidak dikenal: " + cmd);
      }
    }
  }

  return { command: command, isSearching: function () { return !!current }, getFen: function () { return api.toFEN(pos) }, name: ENGINE_NAME };
}

/* ---- ekspor ---------------------------------------------------------- */
global.IlhamUCI = { create: createIlhamUci };
if (typeof module === "object" && module && module.exports) module.exports = global.IlhamUCI;

/* ---- mode Web Worker UCI murni (kecuali dipakai via ilham.js) --------- */
if (typeof WorkerGlobalScope !== "undefined" && typeof self !== "undefined" && self instanceof WorkerGlobalScope && !self.ILHAM_UCI_EMBEDDED) {
  var eng = createIlhamUci(function (line) { self.postMessage(line) });
  self.onmessage = function (e) { try { eng.command(String(e.data)) } catch (err) { self.postMessage("info string ERROR: " + (err && err.message ? err.message : err)) } };
}

})(typeof self !== "undefined" ? self : globalThis);
