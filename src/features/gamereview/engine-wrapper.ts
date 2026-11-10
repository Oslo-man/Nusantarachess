(function () {
"use strict";

let engine: any = null, engineReady = false;
const engineQueue: any[] = [];
let current: any = null;

const SF_BASE = "/vendor/stockfish/";
const SF_URL = "https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js";
let SF_MODE = (location.protocol === "http:" || location.protocol === "https:") ? "nnue-local" : "asm-cdn";

function makeSF() {
  if (SF_MODE === "nnue-local") {
    try { return new Worker(SF_BASE + "stockfish-18-lite-single.js"); } catch (e) { SF_MODE = "wasm-local"; }
  }
  if (SF_MODE === "wasm-local") {
    try { return new Worker(SF_BASE + "stockfish.wasm.js"); } catch (e) { SF_MODE = "asm-cdn"; }
  }
  return new Worker(URL.createObjectURL(new Blob([`importScripts('${SF_URL}');`], { type: "application/javascript" })));
}
let fallbackConsent: any = null;
function stepDownMode(failedMode: string): boolean {
  if (SF_MODE !== failedMode) return true;
  if (SF_MODE === "nnue-local") {
    if (fallbackConsent === null) {
      try {
        fallbackConsent = confirm("Stockfish 18 (mesin utama) gagal dimuat atau terlalu lama merespons.\n\nGanti ke Stockfish 10 yang lebih lemah? Analisis bisa kurang akurat dan label langkah bisa berbeda.\n\nOK = ganti ke Stockfish 10\nBatal = jangan ganti");
      } catch (e) { fallbackConsent = true; }
    }
    if (!fallbackConsent) return false;
    SF_MODE = "wasm-local"; return true;
  }
  if (SF_MODE === "wasm-local") { SF_MODE = "asm-cdn"; return true; }
  return false;
}
const SF_LABEL: Record<string, any> = { "nnue-local": "Stockfish 18", "wasm-local": "Stockfish 10", "asm-cdn": "Stockfish 10 asm" };
let engineInitTimer: any = null;

function initEngine() {
  try {
    engine = makeSF();
  } catch (e) { setStatus("Mesin gagal dimuat"); return; }
  clearTimeout(engineInitTimer);
  engineInitTimer = setTimeout(() => {
    if (engineReady) return;
    if (!stepDownMode(SF_MODE)) return;
    console.warn("engine slow to init — falling back to " + SF_MODE);
    try { engine && engine.terminate(); } catch (e) {} engine = null; initEngine();
  }, 8000);
  engine.onmessage = onEngineMsg;
  engine.onerror = (e: any) => {
    console.error("engine error", e.message || e);
    if (!engineReady) {
      if (!stepDownMode(SF_MODE)) {
        try { engine && engine.terminate(); } catch (err) {}
        clearTimeout(engineInitTimer); engine = null;
        setStatus("Mesin gagal dimuat");
        return;
      }
    }
    setStatus("Terjadi kesalahan pada mesin — memuat ulang…");
    recoverEngine();
  };
  engine.postMessage("uci");
  engine.postMessage("isready");
  engineMpv = 1;
}
function recoverEngine() {
  try { engine && engine.terminate(); } catch (e) {}
  clearTimeout(watchdog); clearTimeout(stopTimer);
  engineReady = false; engine = null; engineMpv = 0;
  const inflight = current; current = null;
  if (inflight && !inflight.cancelled && inflight.onDone) safeCall(inflight.onDone, null, inflight.last || {}, inflight.lastByPv || {});
  setTimeout(initEngine, 300);
}
function safeCall(fn: any, ...args: any[]) { try { return fn(...args); } catch (e) { console.error("[engine] callback error", e); } }

async function cloudBook(fens: any, maxPlies: number, timeoutMs: number, signal?: any) {
  const out: boolean[] = new Array(fens.length).fill(false);
  const last = Math.min(fens.length - 1, maxPlies);
  if (last < 1 || typeof fetch !== "function") return out;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  if (signal) { if (signal.aborted) ctl.abort(); else signal.addEventListener("abort", () => ctl.abort(), { once: true }); }
  const hit: boolean[] = new Array(last + 1).fill(false);
  let next = 1;
  async function worker() {
    while (next <= last && !ctl.signal.aborted) {
      const i = next++;
      try {
        const r = await fetch("https://lichess.org/api/cloud-eval?multiPv=1&fen=" + encodeURIComponent(fens[i]), { signal: ctl.signal, headers: { Accept: "application/json" } });
        hit[i] = r.ok;
      } catch (e) { }
    }
  }
  try { await Promise.all([worker(), worker(), worker(), worker()]); } finally { clearTimeout(timer); }
  for (let i = 1; i <= last; i++) { if (!hit[i]) break; out[i] = true; }
  return out;
}

function analyzePool(fens: any, depth: any, mpv: any, onProgress: any, preset: any, ctl?: any) {
  const total = fens.length;
  const results = new Array(total);
  const requeue: any[] = [];
  let next = 0, filled = 0;
  const workers = new Set();
  const POOL = Math.max(1, Math.min((navigator.hardwareConcurrency || 2) - 1, 12, total));

  if (preset) for (let i = 0; i < total; i++) { if (preset[i]) { results[i] = preset[i]; filled++; } }
  for (let i = 0; i < total; i++) {
    if (results[i]) continue;
    try {
      const gg = new Chess(fens[i]);
      if (gg.game_over()) { results[i] = { ev: gg.in_checkmate() ? (gg.turn() === "w" ? -100000 : 100000) : 0, bm: null, second: null, se: gg.in_checkmate() ? ["mate"] : ["cp", "0"] }; filled++; }
    } catch (e) {}
  }

  return new Promise(resolve => {
    let cancelled = false;
    if (ctl) ctl.cancel = () => { cancelled = true; workers.forEach(w => { try { (w as any).terminate(); } catch (e) {} }); workers.clear(); resolve(null); };
    if (filled >= total) { onProgress && onProgress(filled, total); resolve(results); return; }
    function record(i: any, val: any) { if (results[i] !== undefined) return false; results[i] = val; filled++; onProgress && onProgress(filled, total); return true; }
    function done() { workers.forEach(w => { try { (w as any).terminate(); } catch (e) {} }); resolve(results); }
    function feed(w: any) {
      let i = -1;
      if (requeue.length) i = requeue.shift();
      else { while (next < total && results[next] !== undefined) next++; if (next < total) i = next++; }
      if (cancelled) return;
      if (i < 0) { try { w.terminate(); } catch (e) {} workers.delete(w); return; }
      w.__idx = i; w.__byPv = {}; w.__raw = {};
      w.postMessage("position fen " + fens[i]);
      w.postMessage("go depth " + depth);
      clearTimeout(w.__wd);
      w.__wd = setTimeout(() => {
        requeue.push(i); try { w.terminate(); } catch (e) {} workers.delete(w); if (!cancelled) spawn();
      }, (mpv > 1 ? 22000 : 15000) + Math.max(0, depth - 16) * 4000);
    }
    function handler(w: any) { return (e: any) => {
      const line = typeof e.data === "string" ? e.data : "";
      if (line === "readyok") { w.__ok = true; feed(w); return; }
      if (line.startsWith("info") && line.includes(" pv ")) {
        const idx = (line.match(/ multipv (\d+)/) || [])[1] || "1";
        const mate = line.match(/score mate (-?\d+)/), cp = line.match(/score cp (-?\d+)/);
        w.__byPv[idx] = mate ? (+mate[1] > 0 ? 100000 : -100000) : (cp ? +cp[1] : 0);
        w.__raw[idx] = mate ? ["mate", String(+mate[1])] : ["cp", String(cp ? +cp[1] : 0)];
        w.__bm = (line.match(/ pv (\S+)/) || [])[1] || w.__bm;
      } else if (line.startsWith("bestmove")) {
        clearTimeout(w.__wd);
        const i = w.__idx, turn = fens[i].split(" ")[1], sign = turn === "b" ? -1 : 1;
        const bm = line.split(/\s+/)[1];
        const s1 = w.__byPv["1"], s2 = w.__byPv["2"];
        record(i, { ev: sign * (s1 !== undefined ? s1 : 0), bm: (bm && bm !== "(none)") ? bm : null, second: s2 !== undefined ? sign * s2 : null, se: (w.__raw && w.__raw["1"]) || ["cp", "0"], se2: (w.__raw && w.__raw["2"]) || null });
        if (filled >= total) { done(); return; }
        feed(w);
      }
    }; }
    function spawn() {
      if (cancelled) return;
      let w; const wMode = SF_MODE; try { w = makeSF(); } catch (e) { return; }
      (w as any).__byPv = {}; w.onmessage = handler(w);
      w.onerror = () => {
        if (!(w as any).__ok && !stepDownMode(wMode)) {
          cancelled = true; workers.forEach(x => { try { (x as any).terminate(); } catch (e) {} }); workers.clear();
          setStatus("Mesin gagal dimuat"); resolve(null); return;
        }
        if ((w as any).__idx !== undefined && results[(w as any).__idx] === undefined) requeue.push((w as any).__idx); try { w.terminate(); } catch (e) {} workers.delete(w); if (filled < total && !cancelled) spawn(); };
      workers.add(w);
      w.postMessage("uci");
      w.postMessage("setoption name MultiPV value " + mpv);
      w.postMessage("isready");
    }
    for (let k = 0; k < POOL; k++) spawn();
  });
}
function onEngineMsg(e: any) {
  const line = typeof e.data === "string" ? e.data : "";
  if (line === "readyok" || line.startsWith("uciok")) {
    if (!engineReady) {
      engineReady = true; clearTimeout(engineInitTimer);
      setStatus("Mesin siap · " + (SF_LABEL[SF_MODE] || SF_MODE));
      pump();
      const hook = (window.NusantaraChess.gameReviewEngine || {}).onReady;
      if (typeof hook === "function") safeCall(hook);
    }
    return;
  }
  if (!current) return;
  if (line.startsWith("info") && line.includes(" pv ")) {
    if (current.cancelled) return;
    const m = {};
    const dM = line.match(/ depth (\d+)/); if (dM) (m as any).depth = +dM[1];
    const cpM = line.match(/score cp (-?\d+)/); const mateM = line.match(/score mate (-?\d+)/);
    if (mateM) { (m as any).mate = +mateM[1]; } else if (cpM) { (m as any).cp = +cpM[1]; }
    if (/ (lowerbound|upperbound)( |$)/.test(line)) (m as any).bound = true;
    const pvM = line.match(/ pv (.+)$/); if (pvM) (m as any).pv = pvM[1].trim().split(/\s+/);
    const mpvM = line.match(/ multipv (\d+)/); const idx = mpvM ? +mpvM[1] : 1;
    if (idx === 1) current.last = m;
    current.lastByPv = current.lastByPv || {};
    current.lastByPv[idx] = m;
    armWatchdog();
    if (current.onInfo) safeCall(current.onInfo, m, current.lastByPv, idx);
  } else if (current.infinite && line.startsWith("info")) {
    armWatchdog();
  } else if (line.startsWith("bestmove")) {
    finishCurrent(line.split(/\s+/)[1]);
  }
}
let watchdog: any = null, stopTimer: any = null, engineMpv = 0;
function armWatchdog() { clearTimeout(watchdog); watchdog = setTimeout(() => { console.warn("engine silent — restarting"); setStatus("Mesin tidak merespons — memuat ulang…"); recoverEngine(); }, (current && current.infinite) ? 30000 : 14000); }
function finishCurrent(bm: any) {
  if (!current) return;
  clearTimeout(watchdog); clearTimeout(stopTimer);
  const done = current; current = null;
  try {
    if (!done.cancelled && done.onDone) safeCall(done.onDone, bm, done.last || {}, done.lastByPv || {});
  } finally { pump(); }
}
function analyze(fen: any, depth: any, onInfo: any, onDone: any, multipv?: any) {
  engineQueue.length = 0;
  engineQueue.push({ fen, depth, infinite: !depth, onInfo, onDone, multipv: Math.max(1, Math.min(5, multipv || 3)) });
  if (!current) { pump(); return; }
  if (!current.cancelled) {
    current.cancelled = true;
    try { engine.postMessage("stop"); } catch (e) {}
    clearTimeout(stopTimer);
    stopTimer = setTimeout(() => { if (current && current.cancelled) { console.warn("engine ignored stop — restarting"); recoverEngine(); } }, 2500);
  }
}
function pump() {
  if (!engineReady || current || !engineQueue.length) return;
  current = engineQueue.shift();
  current.lastByPv = {};
  if (current.multipv !== engineMpv) { engine.postMessage("setoption name MultiPV value " + current.multipv); engineMpv = current.multipv; }
  engine.postMessage("position fen " + current.fen);
  engine.postMessage(current.infinite ? "go infinite" : "go depth " + current.depth);
  armWatchdog();
}
function stopAnalysis() {
  engineQueue.length = 0;
  if (!current || current.cancelled) return;
  current.cancelled = true;
  try { engine.postMessage("stop"); } catch (e) {}
  clearTimeout(stopTimer);
  stopTimer = setTimeout(() => { if (current && current.cancelled) { console.warn("engine ignored stop — restarting"); recoverEngine(); } }, 2500);
}
function setStatus(s: any) {
  const el = document.getElementById("engineStatus");
  if (el) { el.textContent = s; return; }
  if (/gagal dimuat/i.test(s)) {
    const pv = document.getElementById("pvText");
    if (pv) pv.textContent = s + " — analisis tidak tersedia. Periksa koneksi lalu muat ulang halaman.";
  }
}

window.NusantaraChess = window.NusantaraChess || {};
window.NusantaraChess.gameReviewEngine = {
  initEngine, recoverEngine, analyze, stopAnalysis, analyzePool, cloudBook,
  setStatus,
  isReady: () => engineReady,
  getLabel: () => SF_LABEL[SF_MODE] || SF_MODE
};

})();
