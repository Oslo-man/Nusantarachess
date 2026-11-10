"use strict";
/* =====================================================================
   Agus — Elo 1600 — mesin catur + protokol UCI
   ---------------------------------------------------------------------
   SUMBER MESIN: mesin_catur_super_chaos_perbaikan_chrome.html
   Bagian di bawah yang berjudul "MESIN" diambil dari HTML tersebut
   (representasi papan 0x88, pembangkit langkah, negamax alpha-beta +
   PVS, iterative deepening, quiescence, tabel transposisi, killer
   moves, evaluasi "Super Chaos"). Logika pencarian & evaluasi TIDAK
   diubah. Yang dibuang dari HTML: seluruh kode UI/DOM (papan klik,
   tombol, status, riwayat langkah, prompt promosi).

   Perubahan kecil pada mesin (hanya yang dibutuhkan UCI):
     - tulisan ke DOM (#depth, #thinking) di chooseMove -> diganti
       callback "info" UCI;
     - batas node (go nodes N) ditambahkan pada pemeriksaan timeout;
     - batas waktu 600 ms milik HTML dijadikan opsi UCI MaxThinkTime
       (default tetap 600), sehingga kekuatan bawaan mesin tidak berubah.

   LAPISAN UCI (baru): uci, isready, ucinewgame, setoption, position
   (startpos|fen ... moves ...), go (movetime, wtime/btime/winc/binc,
   movestogo, depth, nodes, infinite, searchmoves), stop, quit,
   plus ekstensi debug: d, perft N.
   Balasan: id, option, uciok, readyok, info ..., bestmove <m> [ponder <m>].

   Dipakai dua cara:
     1) langsung sebagai Web Worker UCI murni
          w = new Worker("vendor/chess-engines/agus-uci.js");
          w.postMessage("uci"); // -> "id name ...", "uciok"
     2) lewat agus.js (adaptor protokol bot NusantaraChess) yang
        meng-importScripts berkas ini dan berbicara UCI dengannya.
   ===================================================================== */
(function (global) {

function createAgusUci(emit) {

  /* ===================================================================
     MESIN  (dari mesin_catur_super_chaos_perbaikan_chrome.html)
     =================================================================== */
  const dirs = { n: [-33, -31, -18, -14, 14, 18, 31, 33], b: [-17, -15, 15, 17], r: [-16, -1, 1, 16], k: [-17, -16, -15, -1, 1, 15, 16, 17] };
  const vals = { p: 100, n: 320, b: 335, r: 500, q: 950, k: 20000 };
  const on = i => i >= 0 && i < 128 && !(i & 0x88), color = p => !p || p === "." ? 0 : p === p.toUpperCase() ? 1 : -1;
  const sq = i => "abcdefgh"[i & 7] + (8 - (i >> 4)), idx = s => (8 - +s[1]) * 16 + "abcdefgh".indexOf(s[0]);
  const initial = () => { let b = Array(128).fill("."); const rows = ["rnbqkbnr", "pppppppp", "........", "........", "........", "........", "PPPPPPPP", "RNBQKBNR"]; for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) b[r * 16 + f] = rows[r][f]; return { b, t: 1, c: 15, ep: -1, half: 0, full: 1 } };
  let tt = new Map(), nodes = 0, stopAt = 0, nodeLimit = Infinity, killers = Array.from({ length: 80 }, () => ["", ""]);

  function attacked(s, target, by) {
    for (let f = 0; f < 128; f++) {
      if (!on(f) || color(s.b[f]) !== by) continue; let p = s.b[f].toLowerCase();
      if (p === "p") { if (target === f - 16 * by - 1 || target === f - 16 * by + 1) return true; continue }
      for (let d of (dirs[p] || dirs.k)) { for (let t = f + d; on(t); t += d) { if (t === target) return true; if (s.b[t] !== "." || p === "n" || p === "k") break } }
    } return false
  }
  function check(s, side = s.t) { let k = s.b.indexOf(side === 1 ? "K" : "k"); return attacked(s, k, -side) }
  function clone(s) { return { b: s.b.slice(), t: s.t, c: s.c, ep: s.ep, half: s.half, full: s.full } }
  function apply(s, m) {
    let [f, t, promo, flag] = m, b = s.b.slice(), piece = b[f], cap = b[t], c = s.c; b[f] = "."; b[t] = promo ? (s.t === 1 ? promo.toUpperCase() : promo) : piece;
    if (flag === "ep") b[t + 16 * s.t] = ".";
    if (flag === "castle") { let rf = t > f ? f + 3 : f - 4, rt = t > f ? f + 1 : f - 1; b[rt] = b[rf]; b[rf] = "." }
    if (piece === "K") c &= ~3; if (piece === "k") c &= ~12;
    const rb = { 119: 1, 112: 2, 7: 4, 0: 8 }; if (piece.toLowerCase() === "r") c &= ~(rb[f] || 0); if (cap.toLowerCase() === "r") c &= ~(rb[t] || 0);
    return { b, t: -s.t, c, ep: piece.toLowerCase() === "p" && Math.abs(t - f) === 32 ? (t + f) / 2 : -1, half: piece.toLowerCase() === "p" || cap !== "." || flag === "ep" ? 0 : s.half + 1, full: s.full + (s.t === -1 ? 1 : 0) }
  }
  function pseudo(s) {
    let out = []; for (let f = 0; f < 128; f++) {
      if (!on(f) || color(s.b[f]) !== s.t) continue; let p = s.b[f].toLowerCase();
      const add = (t, flag = "") => { if (s.b[t].toLowerCase() === "k") return; if (p === "p" && (t >> 4 === 0 || t >> 4 === 7)) for (let q of ["q", "r", "b", "n"]) out.push([f, t, q, flag]); else out.push([f, t, "", flag]) };
      if (p === "p") {
        let t = f - 16 * s.t; if (on(t) && s.b[t] === ".") { add(t); let u = t - 16 * s.t; if ((s.t === 1 ? f >> 4 === 6 : f >> 4 === 1) && s.b[u] === ".") add(u) }
        for (let d of [-1, 1]) { let u = t + d; if (!on(u)) continue; if (color(s.b[u]) === -s.t) add(u); else if (u === s.ep && s.b[u] === "." && s.b[u + 16 * s.t] === (s.t === 1 ? "p" : "P")) add(u, "ep") }
      } else {
        for (let d of (dirs[p] || dirs.k)) for (let t = f + d; on(t); t += d) { if (color(s.b[t]) === s.t) break; add(t); if (s.b[t] !== "." || p === "n" || p === "k") break }
        let home = s.t === 1 ? 116 : 4, rook = s.t === 1 ? "R" : "r", bits = s.t === 1 ? [1, 2] : [4, 8]; if (p === "k" && f === home && !check(s)) {
          if ((s.c & bits[0]) && s.b[f + 3] === rook && s.b[f + 1] === "." && s.b[f + 2] === "." && !attacked(s, f + 1, -s.t) && !attacked(s, f + 2, -s.t)) add(f + 2, "castle");
          if ((s.c & bits[1]) && s.b[f - 4] === rook && s.b[f - 1] === "." && s.b[f - 2] === "." && s.b[f - 3] === "." && !attacked(s, f - 1, -s.t) && !attacked(s, f - 2, -s.t)) add(f - 2, "castle")
        }
      }
    } return out
  }
  function legal(s) { return pseudo(s).filter(m => !check(apply(s, m), s.t)) }
  function key(m) { return sq(m[0]) + sq(m[1]) + m[2] }
  function poskey(s) { return s.b.join("") + s.t + s.c + s.ep }
  function insufficient(s) { let a = []; for (let i = 0; i < 128; i++) if (on(i) && s.b[i] !== "." && !["k"].includes(s.b[i].toLowerCase())) a.push(s.b[i].toLowerCase()); return !a.length || (a.length === 1 && ["b", "n"].includes(a[0])) }
  function evaluate(s) {
    const weights = { pawn: 0.72, king: 0.48, center: 1.55, activity: 1.7, passed: 1.65, shield: 0.48, attack: 2.0 };
    let score = 0, phase = 0, files = Array.from({ length: 2 }, () => Array(8).fill(0)), king = [-1, -1], minor = [0, 0];
    for (let i = 0; i < 128; i++) {
      if (!on(i)) continue; let p = s.b[i]; if (p === ".") continue; let c = color(p), side = c === 1 ? 0 : 1, t = p.toLowerCase(), r = 7 - (i >> 4), f = i & 7, center = 3.5 - Math.abs(3.5 - f) + 3.5 - Math.abs(3.5 - r);
      let v = vals[t]; if (t === "k") { king[side] = i; continue } phase += ({ q: 4, r: 2, b: 1, n: 1 }[t] || 0);
      let positional = 0; if (t === "p") { files[side][f]++; positional += ((c === 1 ? r : 7 - r) * 7 + center * 3) * weights.pawn; if (r === 6 && c === 1 || r === 1 && c === -1) positional += 12 * weights.passed }
      if (t === "n" || t === "b") { minor[side]++; positional += center * (t === "n" ? 7 : 4) * weights.activity * weights.center }
      if (t === "q") positional += center * 1.5 * weights.activity * weights.center;
      if (t === "r" && files[side][f] === 0) positional += 8;
      score += c * (v + positional)
    }
    for (let side = 0; side < 2; side++) {
      let c = side === 0 ? 1 : -1; for (let f = 0; f < 8; f++) if (files[side][f]) { if (files[side][f] > 1) score -= c * 13; let enemy = files[1 - side][f]; if (!enemy) { let passed = true; for (let ff = Math.max(0, f - 1); ff <= Math.min(7, f + 1); ff++) for (let rr = 0; rr < 8; rr++) { let p = s.b[rr * 16 + ff]; if (p === (side === 0 ? "p" : "P") && (side === 0 ? rr < (king[side] >> 4) : rr > (king[side] >> 4))) passed = false } if (passed) score += c * 18 * weights.passed } }
      if (king[side] >= 0) {
        let kf = king[side] & 7, kr = king[side] >> 4, shield = 0, pressure = 0;
        for (let ff = Math.max(0, kf - 1); ff <= Math.min(7, kf + 1); ff++) {
          let rr = kr + (side === 0 ? -1 : 1);
          if (on(rr * 16 + ff) && s.b[rr * 16 + ff] === (side === 0 ? "P" : "p")) shield++;
        }
        for (let rr = Math.max(0, kr - 1); rr <= Math.min(7, kr + 1); rr++) {
          for (let ff = Math.max(0, kf - 1); ff <= Math.min(7, kf + 1); ff++) {
            let target = rr * 16 + ff;
            if (target !== king[side] && attacked(s, target, -c)) pressure++;
          }
        }
        score += c * (shield * 12 * weights.shield - pressure * 5 * weights.king * weights.attack);
      }
      score += c * minor[side] * 4 * weights.activity
    }
    return s.t === 1 ? score : -score
  }
  function moveScore(s, m, ttmove, ply) { let k = key(m), p = s.b[m[0]], cap = s.b[m[1]], v = 0; if (k === ttmove) v += 1000000; if (cap !== "." || m[3] === "ep") v += 10000 + vals[cap.toLowerCase() || "p"] - vals[p.toLowerCase()] / 10; if (m[2]) v += 8000; if (k === killers[ply]?.[0]) v += 5000; else if (k === killers[ply]?.[1]) v += 4000; return v }
  function ordered(s, ms, ttmove, ply) { return ms.sort((a, b) => moveScore(s, b, ttmove, ply) - moveScore(s, a, ttmove, ply)) }
  function qsearch(s, alpha, beta, ply) { nodes++; if ((nodes & 31) === 0 && (performance.now() > stopAt || nodes > nodeLimit)) throw "timeout"; let stand = evaluate(s); if (stand >= beta) return beta; if (stand > alpha) alpha = stand; let ms = ordered(s, legal(s).filter(m => s.b[m[1]] !== "." || m[3] === "ep" || m[2]), "", ply); for (let m of ms) { let score = -qsearch(apply(s, m), -beta, -alpha, ply + 1); if (score >= beta) return beta; if (score > alpha) alpha = score } return alpha }
  function search(s, depth, alpha, beta, ply) {
    nodes++; if ((nodes & 31) === 0 && (performance.now() > stopAt || nodes > nodeLimit)) throw "timeout"; if (s.half >= 100 || insufficient(s)) return 0; if (ply >= 64) return evaluate(s); let incheck = check(s); if (depth <= 0 && !incheck) return qsearch(s, alpha, beta, ply);
    let orig = alpha, k = poskey(s), entry = tt.get(k), ttmove = entry?.move || ""; if (entry && entry.depth >= depth && ply > 0) { if (entry.flag === 0) return entry.score; if (entry.flag === 1 && entry.score <= alpha) return entry.score; if (entry.flag === 2 && entry.score >= beta) return entry.score }
    let ms = ordered(s, legal(s), ttmove, ply); if (!ms.length) return incheck ? -30000 + ply : 0; let best = -32000, bestMove = "";
    for (let j = 0; j < ms.length; j++) {
      let m = ms[j], child = apply(s, m), score; if (j === 0) score = -search(child, depth - 1, -beta, -alpha, ply + 1); else { score = -search(child, depth - 1, -alpha - 1, -alpha, ply + 1); if (score > alpha && score < beta) score = -search(child, depth - 1, -beta, -alpha, ply + 1) }
      if (score > best) { best = score; bestMove = key(m) } if (score > alpha) alpha = score; if (alpha >= beta) { if (s.b[m[1]] === ".") { let k2 = key(m); if (k2 !== killers[ply][0]) { killers[ply][1] = killers[ply][0]; killers[ply][0] = k2 } } break }
    }
    tt.set(k, { depth, score: best, move: bestMove, flag: best <= orig ? 1 : best >= beta ? 2 : 0 }); if (tt.size > 120000) tt.clear(); return best
  }
  /* Satu iterasi kedalaman d di akar (isi loop `for d` pada chooseMove
     asli dari HTML). Mengembalikan {move, val}; melempar "timeout". */
  function rootIteration(s, ms, d) {
    let a = -32000, b = 32000, root = ordered(s, ms.slice(), "", 0), local = root[0], val = -32000;
    for (let m of root) { let sc = -search(apply(s, m), d - 1, -b, -a, 1); if (sc > val) { val = sc; local = m } if (sc > a) a = sc }
    return { move: local, val };
  }

  /* ===================================================================
     LAPISAN UCI
     =================================================================== */
  const ENGINE_NAME = "Agus (Super Chaos)";
  const ENGINE_AUTHOR = "NusantaraChess";
  const MAX_DEPTH = 30;               // batas d pada chooseMove asli
  const INFINITE_SLICE_MS = 1500;     // batas waktu per iterasi saat "go infinite"
  const opts = { MaxThinkTime: 600 }; // 600 ms = batas bawaan mesin di HTML

  let game = initial();               // posisi saat ini
  let positionOk = true;              // false bila "position" terakhir gagal
  let current = null;                 // pencarian yang sedang berjalan
  let quit = false;

  const out = line => { try { emit(line) } catch (e) { } };

  function parseFen(fen) {
    const parts = String(fen).trim().split(/\s+/);
    if (parts.length < 4) throw new Error("FEN harus punya minimal 4 bagian");
    const rows = parts[0].split("/");
    if (rows.length !== 8) throw new Error("FEN harus punya 8 baris");
    const b = Array(128).fill("."); let wk = 0, bk = 0;
    for (let r = 0; r < 8; r++) {
      let f = 0;
      for (const ch of rows[r]) {
        if (/[1-8]/.test(ch)) { f += +ch; continue }
        if (!/[prnbqkPRNBQK]/.test(ch)) throw new Error("karakter bidak tidak valid: " + ch);
        if (f > 7) throw new Error("baris " + (8 - r) + " kelebihan kotak");
        if (ch === "K") wk++; if (ch === "k") bk++;
        if ((ch === "p" || ch === "P") && (r === 0 || r === 7)) throw new Error("pion di baris pertama/terakhir");
        b[r * 16 + f++] = ch;
      }
      if (f !== 8) throw new Error("baris " + (8 - r) + " tidak berjumlah 8 kotak");
    }
    if (wk !== 1 || bk !== 1) throw new Error("harus tepat satu raja per warna");
    if (parts[1] !== "w" && parts[1] !== "b") throw new Error("giliran harus w atau b");
    let c = 0; const cs = parts[2];
    if (cs !== "-") { for (const ch of cs) { const bit = { K: 1, Q: 2, k: 4, q: 8 }[ch]; if (!bit) throw new Error("hak rokade tidak valid"); c |= bit } }
    let ep = -1;
    if (parts[3] !== "-") {
      if (!/^[a-h][36]$/.test(parts[3])) throw new Error("kotak en passant tidak valid");
      ep = idx(parts[3]);
    }
    const half = parts[4] !== undefined ? parseInt(parts[4], 10) : 0, full = parts[5] !== undefined ? parseInt(parts[5], 10) : 1;
    if (isNaN(half) || half < 0 || isNaN(full) || full < 1) throw new Error("penghitung langkah tidak valid");
    return { b, t: parts[1] === "w" ? 1 : -1, c, ep, half, full };
  }
  function toFen(s) {
    let rows = [];
    for (let r = 0; r < 8; r++) { let row = "", e = 0; for (let f = 0; f < 8; f++) { const p = s.b[r * 16 + f]; if (p === ".") e++; else { if (e) { row += e; e = 0 } row += p } } if (e) row += e; rows.push(row) }
    let cs = (s.c & 1 ? "K" : "") + (s.c & 2 ? "Q" : "") + (s.c & 4 ? "k" : "") + (s.c & 8 ? "q" : "");
    return rows.join("/") + " " + (s.t === 1 ? "w" : "b") + " " + (cs || "-") + " " + (s.ep >= 0 ? sq(s.ep) : "-") + " " + s.half + " " + s.full;
  }
  function findMove(s, str) {
    str = String(str).trim();
    if (!/^[a-h][1-8][a-h][1-8][qrbnQRBN]?$/.test(str)) return null;
    const want = str.slice(0, 4) + str.slice(4).toLowerCase();
    return legal(s).find(m => key(m) === want) || null;
  }
  function setPosition(tokens) {
    // tokens = bagian setelah kata "position"
    let s, i = 0;
    try {
      if (tokens[0] === "startpos") { s = initial(); i = 1 }
      else if (tokens[0] === "fen") {
        let j = 1, f = []; while (j < tokens.length && tokens[j] !== "moves") f.push(tokens[j++]);
        s = parseFen(f.join(" ")); i = j;
      } else throw new Error("position harus 'startpos' atau 'fen'");
      if (tokens[i] === "moves") {
        for (let k = i + 1; k < tokens.length; k++) {
          const m = findMove(s, tokens[k]);
          if (!m) throw new Error("langkah ilegal: " + tokens[k]);
          s = apply(s, m);
        }
      } else if (i < tokens.length) throw new Error("token tak dikenal: " + tokens[i]);
    } catch (e) {
      positionOk = false;
      out("info string ERROR: " + e.message);
      return;
    }
    game = s; positionOk = true;
  }

  function scoreString(val) {
    if (Math.abs(val) > 29000) {
      const plies = 30000 - Math.abs(val), n = Math.ceil(plies / 2);
      return "mate " + (val > 0 ? n : -n);
    }
    return "cp " + Math.round(val);
  }
  function extractPv(s, first, maxLen) {
    const pv = [key(first)]; let st = apply(s, first); const seen = new Set();
    while (pv.length < maxLen) {
      const k = poskey(st); if (seen.has(k)) break; seen.add(k);
      const e = tt.get(k); if (!e || !e.move) break;
      const m = findMove(st, e.move); if (!m) break;
      pv.push(key(m)); st = apply(st, m);
    }
    return pv;
  }

  function finishSearch(sr) {
    if (current !== sr) return;
    if (sr.timer) { clearTimeout(sr.timer); sr.timer = null }
    current = null;
    let line = "bestmove " + key(sr.best);
    if (sr.pv && sr.pv.length > 1) line += " ponder " + sr.pv[1];
    out(line);
  }

  function stepSearch(sr) {
    sr.timer = null;
    if (current !== sr) return;
    if (sr.stopRequested) return finishSearch(sr);
    if (sr.waiting) return;                 // "infinite" yang sudah mentok: tunggu stop
    if (sr.depth > sr.maxDepth) {
      if (sr.infinite) { sr.waiting = true; return }
      return finishSearch(sr);
    }
    const d = sr.depth;
    try {
      stopAt = sr.infinite ? performance.now() + INFINITE_SLICE_MS : sr.deadline;
      nodeLimit = sr.nodeLimit;
      const r = rootIteration(sr.s, sr.ms, d);
      sr.best = r.move; sr.val = r.val; sr.completed = d;
      sr.pv = extractPv(sr.s, r.move, d + 4);
      const t = Math.max(1, Math.round(performance.now() - sr.t0));
      out("info depth " + d + " score " + scoreString(r.val) + " nodes " + nodes + " nps " + Math.round(nodes * 1000 / t) + " time " + t + " pv " + sr.pv.join(" "));
      if (Math.abs(r.val) > 29000 && !sr.infinite) return finishSearch(sr);   // mat ditemukan (sama seperti HTML)
      if (sr.ms.length === 1 && !sr.infinite) return finishSearch(sr);        // satu-satunya langkah
    } catch (e) {
      if (e !== "timeout") {
        out("info string ERROR: " + (e && e.message ? e.message : e));
        return finishSearch(sr);
      }
      if (sr.infinite) { sr.waiting = true; return }
      return finishSearch(sr);               // waktu/node habis: pakai hasil iterasi lengkap terakhir
    }
    if (!sr.infinite && performance.now() > sr.deadline) return finishSearch(sr);
    if (nodes > sr.nodeLimit) return finishSearch(sr);
    sr.depth++;
    sr.timer = setTimeout(() => stepSearch(sr), 0);   // beri kesempatan "stop" diproses
  }

  function go(tokens) {
    if (current) { out("info string search already running"); return }
    if (!positionOk) { out("info string ERROR: posisi tidak valid"); out("bestmove 0000"); return }
    const lim = { infinite: false, depth: MAX_DEPTH, nodes: Infinity, movetime: -1, wtime: -1, btime: -1, winc: 0, binc: 0, movestogo: 0, searchmoves: [] };
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i], n = +tokens[i + 1];
      switch (t) {
        case "infinite": lim.infinite = true; break;
        case "ponder": lim.infinite = true; break;
        case "depth": if (!isNaN(n)) lim.depth = Math.max(1, Math.min(64, n | 0)), lim.depthSet = true; i++; break;
        case "nodes": if (!isNaN(n)) lim.nodes = Math.max(1, n); i++; break;
        case "movetime": if (!isNaN(n)) lim.movetime = Math.max(1, n); i++; break;
        case "wtime": case "btime": case "winc": case "binc": case "movestogo": if (!isNaN(n)) lim[t] = n; i++; break;
        case "searchmoves": while (i + 1 < tokens.length && /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(tokens[i + 1])) lim.searchmoves.push(tokens[++i]); break;
        default: break;
      }
    }
    const s = clone(game);
    let ms = legal(s);
    if (lim.searchmoves.length) { const f = ms.filter(m => lim.searchmoves.includes(key(m))); if (f.length) ms = f }
    if (!ms.length) { out("bestmove 0000"); return }

    // Waktu berpikir. Batas maksimum = MaxThinkTime (600 ms seperti HTML).
    const cap = opts.MaxThinkTime;
    let think = Infinity;
    if (!lim.infinite) {
      if (lim.movetime > 0) think = Math.min(lim.movetime, cap);
      else if ((s.t === 1 ? lim.wtime : lim.btime) >= 0) {
        const my = s.t === 1 ? lim.wtime : lim.btime, inc = s.t === 1 ? lim.winc : lim.binc;
        const share = my / (lim.movestogo > 0 ? Math.min(lim.movestogo, 40) : 30) + inc * 0.75;
        think = Math.max(10, Math.min(cap, share, Math.max(10, my - 50)));
      } else if (!lim.depthSet && lim.nodes === Infinity) think = cap;     // "go" polos
    }
    nodes = 0; tt.clear();                 // tt.clear() juga dilakukan chooseMove asli
    const t0 = performance.now();
    const sr = {
      s, ms, t0, depth: 1, maxDepth: lim.infinite ? 64 : lim.depth, infinite: lim.infinite,
      deadline: think === Infinity ? Infinity : t0 + think, nodeLimit: lim.nodes,
      best: ms[0], pv: null, val: 0, completed: 0, timer: null, stopRequested: false, waiting: false
    };
    current = sr;
    out("info string Agus mulai mencari" + (think === Infinity ? "" : " (maks. " + Math.round(think) + " ms)"));
    sr.timer = setTimeout(() => stepSearch(sr), 0);
  }

  function stop() { if (current) { current.stopRequested = true; if (current.timer) { clearTimeout(current.timer); current.timer = null } finishSearch(current) } }

  function perft(s, d) { if (d === 0) return 1; const ms = legal(s); if (d === 1) return ms.length; let n = 0; for (const m of ms) n += perft(apply(s, m), d - 1); return n }

  function setOption(tokens) {
    const vi = tokens.indexOf("value");
    const name = tokens.slice(tokens[0] === "name" ? 1 : 0, vi < 0 ? tokens.length : vi).join(" ").toLowerCase();
    const value = vi < 0 ? "" : tokens.slice(vi + 1).join(" ");
    if (name === "maxthinktime") { const v = parseInt(value, 10); if (!isNaN(v)) opts.MaxThinkTime = Math.max(50, Math.min(10000, v)) }
    else if (name === "clear hash") { tt.clear() }
    else out("info string option tidak dikenal: " + name);
  }

  function newGame() {
    stop(); tt.clear(); killers = Array.from({ length: 80 }, () => ["", ""]);
    game = initial(); positionOk = true;
  }

  function command(line) {
    if (quit) return;
    const lines = String(line).split(/\r?\n/);
    for (const l of lines) {
      const tokens = l.trim().split(/\s+/).filter(Boolean);
      if (!tokens.length) continue;
      const cmd = tokens[0], rest = tokens.slice(1);
      switch (cmd) {
        case "uci":
          out("id name " + ENGINE_NAME);
          out("id author " + ENGINE_AUTHOR);
          out("option name MaxThinkTime type spin default 600 min 50 max 10000");
          out("option name Clear Hash type button");
          out("uciok"); break;
        case "isready": out("readyok"); break;
        case "ucinewgame": newGame(); break;
        case "setoption": setOption(rest); break;
        case "position": if (current) stop(); setPosition(rest); break;
        case "go":
          if (rest[0] === "perft") { const d = Math.max(1, parseInt(rest[1], 10) || 1); const n = perft(clone(game), d); out("info string perft " + d + " " + n); break }
          go(rest); break;
        case "stop": stop(); break;
        case "ponderhit": break;
        case "d": out("info string fen " + toFen(game)); break;
        case "quit": stop(); quit = true; break;
        default: out("info string perintah tidak dikenal: " + cmd);
      }
    }
  }

  return {
    command,
    isSearching: () => !!current,
    getFen: () => toFen(game),
    name: ENGINE_NAME
  };
}

/* ---- ekspor ---------------------------------------------------------- */
global.AgusUCI = { create: createAgusUci };
if (typeof module === "object" && module && module.exports) module.exports = global.AgusUCI;

/* ---- mode Web Worker UCI murni (kecuali dipakai via agus.js) --------- */
if (typeof WorkerGlobalScope !== "undefined" && typeof self !== "undefined" && self instanceof WorkerGlobalScope && !self.AGUS_UCI_EMBEDDED) {
  const eng = createAgusUci(line => self.postMessage(line));
  self.onmessage = e => { try { eng.command(String(e.data)) } catch (err) { self.postMessage("info string ERROR: " + (err && err.message ? err.message : err)) } };
}

})(typeof self !== "undefined" ? self : globalThis);
