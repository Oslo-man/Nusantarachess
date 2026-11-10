"use strict";
const { ChessGame, fromAlgebraic, algebraic } = require("./chess-rules");
const brilliant = require("./brilliant-rating");

const PVAL: Record<string, any> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

const CATS = {
  brilliant:  { label: "Brilian",      group: "good" },
  great:      { label: "Bagus",        group: "good" },
  best:       { label: "Terbaik",      group: "good" },
  excellent:  { label: "Sangat Baik",  group: "good" },
  good:       { label: "Baik",         group: "good" },
  book:       { label: "Buku",         group: "good" },
  inaccuracy: { label: "Tidak Akurat", group: "bad" },
  mistake:    { label: "Kesalahan",    group: "bad" },
  miss:       { label: "Terlewat",     group: "bad" },
  blunder:    { label: "Blunder",      group: "bad" },
  forced:     { label: "Terpaksa",     group: "good" }
};
const GOOD_ORDER = ["brilliant", "great", "best", "excellent", "good", "book"];
const BAD_ORDER = ["inaccuracy", "mistake", "miss", "blunder"];
const ALL_ORDER = GOOD_ORDER.concat(BAD_ORDER);
const PHASE_ORDER = ["opening", "middlegame", "endgame"];

function moveAccFromWin(wb: number, wa: number) {
  const a = 103.1668 * Math.exp(-0.04354 * Math.max(0, wb - wa)) - 3.1669;
  return Math.max(0, Math.min(100, a));
}

function gameAcc(list: any) {
  const l = list.filter((v: any) => v != null);
  if (!l.length) return null;
  const m = l.reduce((a: any, b: any) => a + b, 0) / l.length;
  const h = l.length / l.reduce((a: any, b: any) => a + 1 / Math.max(b, 5), 0);
  return (m + h) / 2;
}

function estEloOf(v: any) {
  if (v == null || isNaN(v)) return null;
  return Math.max(100, Math.min(3000, Math.round(500 + Math.pow(Math.max(0, v - 50), 1.5) * 6)));
}

function phaseGradeCat(acc: any) {
  if (acc == null) return null;
  if (acc >= 97) return "best";
  if (acc >= 90) return "excellent";
  if (acc >= 80) return "great";
  if (acc >= 65) return "good";
  if (acc >= 50) return "inaccuracy";
  if (acc >= 30) return "mistake";
  return "blunder";
}

function acplFor(centipawnLosses: any) {
  if (!centipawnLosses.length) return null;
  const sum = centipawnLosses.reduce((a: any, b: any) => a + Math.max(0, b), 0);
  return Math.round((sum / centipawnLosses.length) * 10) / 10;
}

const FILES_ALG = ["a", "b", "c", "d", "e", "f", "g", "h"];
function rankPieces(g: any, rank: number) {
  return FILES_ALG.map(f => g.pieceAt(fromAlgebraic(f + rank)));
}
function isEndOpening(g: any) {
  let nonDevBlack = 0, nonDevWhite = 0;
  for (const p of rankPieces(g, 8)) { if (!p || p.color === "w") continue; if (p.type === "n" || p.type === "b" || p.type === "q") nonDevBlack++; }
  for (const p of rankPieces(g, 1)) { if (!p || p.color === "b") continue; if (p.type === "n" || p.type === "b" || p.type === "q") nonDevWhite++; }
  const devBlack = 5 - nonDevBlack, devWhite = 5 - nonDevWhite;
  if (devBlack >= 3 && devWhite >= 2) return true;
  if (devWhite >= 3 && devBlack >= 2) return true;
  if (devBlack >= 4) return true;
  if (devWhite >= 4) return true;
  return false;
}
function isEndMiddlegame(g: any) {
  let w = 0, b = 0;
  for (let i = 0; i < 64; i++) {
    const p = g.pieceAt(i);
    if (p && (p.type === "r" || p.type === "n" || p.type === "b" || p.type === "q")) { if (p.color === "w") w++; else b++; }
  }
  return (w <= 2 && b <= 2) || w <= 1 || b <= 1;
}
function computePhases(fens: any, cats: any) {
  const n = fens.length - 1;
  const phases = new Array(n);
  let phase = "opening";
  for (let i = 0; i < n; i++) {
    phases[i] = phase;
    if (cats[i] === "forced") continue;
    let g: any = null;
    try { g = ChessGame.fromFEN(fens[i + 1]); } catch (e: any) { continue; }
    if (phase === "opening") { if (isEndOpening(g)) phase = "middlegame"; }
    else if (phase === "middlegame") { if (isEndMiddlegame(g)) phase = "endgame"; }
  }
  return phases;
}

const winPct = brilliant.winPct;

function catCounts(reviewData: any) {
  const counts: Record<string, any> = { w: {}, b: {} };
  ALL_ORDER.concat(["forced"]).forEach(ct => { counts.w[ct] = 0; counts.b[ct] = 0; });
  for (const d of reviewData) {
    if (d) counts[d.moverWhite ? "w" : "b"][d.cat]++;
  }
  return counts;
}

function normalizeScores(input: any, fens: any, evals: any) {
  const n1 = fens.length;
  const sc = input.scores;
  const valid = Array.isArray(sc) && sc.length === n1 && sc.every((e: any) =>
    Array.isArray(e) && (e[0] === "cp" || e[0] === "mate") && (e.length === 1 ? e[0] === "mate" : (e.length === 2 && Number.isFinite(Number(e[1])))));
  if (valid) return sc.map((e: any) => e.length === 1 ? ["mate"] : [e[0], String(Math.round(Number(e[1])))]);
  return fens.map((fen: any, i: number) => {
    const sign = fen.split(" ")[1] === "w" ? 1 : -1;
    const v = sign * evals[i];
    if (Math.abs(evals[i]) >= 90000) return ["mate", String(v > 0 ? 1 : -1)];
    return ["cp", String(Math.round(v))];
  });
}

function analyzeGame(input: any) {
  const { fens, moves, evals, bestUci, secondEvals, bookHits, bookPlies, isCustomStart } = input;
  const n = moves.length;

  if (!Array.isArray(fens) || fens.length !== n + 1) throw new Error("fens harus berjumlah moves.length + 1");
  if (!Array.isArray(evals) || evals.length !== n + 1) throw new Error("evals harus berjumlah moves.length + 1");

  const scores = normalizeScores(input, fens, evals);
  const reviewData = new Array(n);
  const reviewMoveAcc = new Array(n);
  const centipawnLossW = [], centipawnLossB = [];
  const accsW = [], accsB = [];

  for (let i = 0; i < n; i++) {
    const moverWhite = fens[i].split(" ")[1] === "w";
    const sign = moverWhite ? 1 : -1;
    const before = evals[i], after = evals[i + 1];
    const cl = sign * (before - after);

    const mv = moves[i];
    const moverColor = moverWhite ? "w" : "b";
    const playedUci = (mv.from + mv.to + (mv.promotion || "")).toLowerCase();
    const best = bestUci[i] ? String(bestUci[i]).toLowerCase() : "";
    const isBest = !!best && playedUci.slice(0, 4) === best.slice(0, 4) && (best.length < 5 || playedUci.slice(4, 5) === best.slice(4, 5));

    const isBook = (i < (bookPlies || 0)) || (!isCustomStart && i < 20 && !!(bookHits && bookHits[i + 1]));

    const sec = Array.isArray(secondEvals) ? secondEvals[i] : null;
    const secondScore = (sec === null || sec === undefined) ? null : ["cp", String(Math.round(sign * sec))];

    let isMate = false;
    try { isMate = ChessGame.fromFEN(fens[i + 1]).isCheckmate(); } catch (e: any) { }
    const staticEval = isMate ? ["mate"] : scores[i + 1];
    const previousStaticEvals: any[] = [];
    for (let j = 0; j < 4 && i - j >= 0; j++) previousStaticEvals.push(scores[i - j]);
    const sacrifice = isMate ? false : brilliant.isSacrifice(fens[i], fens[i + 1], mv, moverColor);
    const forced = isMate ? false : brilliant.isForced(fens[i]);
    const prevMv = i > 0 ? moves[i - 1] : null;
    const trivialRecap = !!(mv.captured && prevMv && prevMv.captured && prevMv.to === mv.to);
    let endgame = false;
    try { endgame = isEndMiddlegame(ChessGame.fromFEN(fens[i])); } catch (e: any) { }
    const cat = forced ? "forced" : brilliant.rateMove({ staticEval, previousStaticEvals, secondScore, isBest, sacrifice, isBook: !!isBook, trivialRecap, endgame });
    reviewData[i] = { cat, cl: Math.round(cl), moverWhite, to: mv.to, sacrifice };

    const cpB = brilliant.scoreCp(scores[i]), cpA = brilliant.scoreCp(staticEval);
    reviewMoveAcc[i] = (forced || cpB === null || cpA === null) ? null : moveAccFromWin(winPct(cpB), winPct(-cpA));

    if (moverWhite) { if (reviewMoveAcc[i] != null) accsW.push(reviewMoveAcc[i]); centipawnLossW.push(cl); }
    else { if (reviewMoveAcc[i] != null) accsB.push(reviewMoveAcc[i]); centipawnLossB.push(cl); }
  }
  const phases = computePhases(fens, reviewData.map((d: any) => d.cat));

  const accuracy = { w: gameAcc(accsW), b: gameAcc(accsB) };
  const acpl = { w: acplFor(centipawnLossW), b: acplFor(centipawnLossB) };
  const estimatedRating = { w: estEloOf(accuracy.w), b: estEloOf(accuracy.b) };
  const counts = catCounts(reviewData);

  const phaseAccuracy: Record<string, any> = { w: {}, b: {} };
  for (const phase of PHASE_ORDER) {
    const listW: number[] = [], listB: number[] = [];
    for (let i = 0; i < n; i++) {
      if (phases[i] !== phase || reviewMoveAcc[i] == null) continue;
      (reviewData[i].moverWhite ? listW : listB).push(reviewMoveAcc[i]);
    }
    const phaseAcc = (l: number[]) => (l.length >= 3 ? gameAcc(l) : null);
    const aw = phaseAcc(listW), ab = phaseAcc(listB);
    phaseAccuracy.w[phase] = { accuracy: aw === null ? null : Math.round(aw * 10) / 10, grade: phaseGradeCat(aw) };
    phaseAccuracy.b[phase] = { accuracy: ab === null ? null : Math.round(ab * 10) / 10, grade: phaseGradeCat(ab) };
  }

  return {
    reviewData,
    moveAccuracy: reviewMoveAcc,
    phases,
    accuracy,
    acpl,
    estimatedRating,
    categoryCounts: counts,
    phaseAccuracy
  };
}

function classifySingleMove(d: any) {
  let isMate = false;
  try { isMate = ChessGame.fromFEN(d.fenAfter).isCheckmate(); } catch (e: any) { }
  const staticEval = isMate ? ["mate"] : d.staticEval;
  const sacrifice = isMate ? false : brilliant.isSacrifice(d.fenBefore, d.fenAfter, d.move, d.moverColor);
  const forced = isMate ? false : brilliant.isForced(d.fenBefore);
  let endgame = false;
  try { endgame = isEndMiddlegame(ChessGame.fromFEN(d.fenBefore)); } catch (e: any) { }
  const trivialRecap = !!(d.move.capturedType && d.previousCaptureSquare && d.previousCaptureSquare === d.move.to);
  const cat = forced ? "forced" : brilliant.rateMove({
    staticEval, previousStaticEvals: d.previousStaticEvals, secondScore: d.secondScore || null,
    isBest: !!d.isBest, sacrifice, isBook: !!d.isBook, trivialRecap, endgame
  });
  return { cat, sacrifice: !!sacrifice };
}

module.exports = {
  analyzeGame,
  classifySingleMove,
  CATS,
  GOOD_ORDER,
  BAD_ORDER,
  ALL_ORDER,
  PHASE_ORDER,
  winPct,
  estEloOf,
  gameAcc,
  acplFor,
  computePhases
};
