"use strict";
const { ChessGame, fromAlgebraic } = require("./chess-rules");

const WHITE = "w";
const BLACK = "b";

function invertColor(c: any) { return c === WHITE ? BLACK : WHITE; }

function attackersOf(g: any, sq: any, color: any) {
  const out: any[] = [];
  const f0 = sq % 8, r0 = Math.floor(sq / 8);
  const clear = (f: any, r: any, df: any, dr: any) => {
    const sf = Math.sign(df), sr = Math.sign(dr);
    let cf = f + sf, cr = r + sr;
    while (cf !== f0 || cr !== r0) {
      if (g.pieceAt(cr * 8 + cf)) return false;
      cf += sf; cr += sr;
    }
    return true;
  };
  for (let i = 0; i < 64; i++) {
    const p = g.pieceAt(i);
    if (!p || p.color !== color) continue;
    const f = i % 8, r = Math.floor(i / 8);
    const df = f0 - f, dr = r0 - r;
    const adf = Math.abs(df), adr = Math.abs(dr);
    let hit = false;
    switch (p.type) {
      case "p": hit = adf === 1 && dr === (color === WHITE ? -1 : 1); break;
      case "n": hit = (adf === 1 && adr === 2) || (adf === 2 && adr === 1); break;
      case "k": hit = Math.max(adf, adr) === 1; break;
      case "b": hit = adf === adr && adf > 0 && clear(f, r, df, dr); break;
      case "r": hit = (adf === 0 || adr === 0) && (adf + adr) > 0 && clear(f, r, df, dr); break;
      case "q": hit = ((adf === adr && adf > 0) || ((adf === 0 || adr === 0) && (adf + adr) > 0)) && clear(f, r, df, dr); break;
    }
    if (hit) out.push(i);
  }
  return out;
}

function legalMoveTo(g: any, from: any, to: any) {
  const list = g.legalMovesFor(from).filter((m: any) => m.to === to);
  if (!list.length) return null;
  return list.find((m: any) => m.promotion === "q") || list[0];
}

function afterCapture(g: any, attacker: any, to: any) {
  const t = g.clone();
  const m = legalMoveTo(g, attacker, to);
  if (m) t.applyMove(m);
  return t;
}

function getAttackersDefenders(chess: any, color: any, to: any) {
  const enemy = invertColor(color);
  const attackers = attackersOf(chess, to, enemy);
  const legalAttackers = attackers.filter((a: any) => !!legalMoveTo(chess, a, to));
  const legalAttackersPieces = legalAttackers.map((a: any) => chess.pieceAt(a));

  let legalDefenders: any[];
  if (attackers.length === 1) {
    const test = afterCapture(chess, attackers[0], to);
    const defenders = attackersOf(test, to, color);
    legalDefenders = defenders.filter((d: any) => !!legalMoveTo(test, d, to));
  } else {
    const defenders = attackersOf(chess, to, color);
    legalDefenders = defenders.filter((d: any) => {
      for (const a of legalAttackers) {
        const test = afterCapture(chess, a, to);
        if (!legalMoveTo(test, d, to)) return false;
      }
      return true;
    });
  }

  return {
    attackers: { squares: legalAttackers, pieces: legalAttackersPieces, length: legalAttackers.length },
    defenders: { squares: legalDefenders, length: legalDefenders.length }
  };
}

function couldBeSaved(chess: any, square: any, color: any) {
  if (!attackersOf(chess, square, color).length) {
    for (const m of chess.allLegalMoves(chess.turn)) {
      if (m.from !== square) return true;
    }
  } else {
    for (const m of chess.legalMovesFor(square)) {
      const t = chess.clone();
      t.applyMove(m);
      if (!attackersOf(t, m.to, color).length) return true;
    }
  }
  return false;
}

function isSacrifice(fenBefore: any, fenAfter: any, mv: any, moverColor: any) {
  let after: any, before: any;
  try { after = ChessGame.fromFEN(fenAfter); before = ChessGame.fromFEN(fenBefore); } catch (e: any) { return false; }
  if (mv.promotion) return false;

  const captured = mv.capturedType || undefined;
  const sacrifying: any[] = [];

  for (let idx = 0; idx < 64; idx++) {
    const sq = after.pieceAt(idx);
    if (!sq || sq.type === "p") continue;
    if (sq.color !== moverColor) continue;

    const { attackers, defenders } = getAttackersDefenders(after, moverColor, idx);

    if (!defenders.length && attackers.length && (!captured || captured === "p")) {
      sacrifying.push(idx); continue;
    }
    if ((sq.type === "n" || sq.type === "b") && !captured && attackers.pieces.findIndex((p: any) => p && p.type === "p") !== -1) {
      sacrifying.push(idx); continue;
    }
    if (sq.type === "r" && attackers.length && (captured !== "r" && captured !== "q")
        && !(attackers.length === 1 && attackers.pieces[0] && (attackers.pieces[0].type === "q" || attackers.pieces[0].type === "r") && defenders.length)
        && !(defenders.length && (captured === "n" || captured === "b"))) {
      sacrifying.push(idx); continue;
    }
    if (sq.type === "q" && attackers.length && captured !== "q"
        && !(attackers.length === 1 && attackers.pieces[0] && attackers.pieces[0].type === "q" && defenders.length)
        && !(attackers.length === 1 && attackers.pieces[0] && attackers.pieces[0].type === "r" && captured === "r" && defenders.length)) {
      sacrifying.push(idx); continue;
    }
  }

  const fromIdx = fromAlgebraic(mv.from);
  for (const idx of sacrifying) {
    const b = before.pieceAt(idx), a = after.pieceAt(idx);
    const same = (b && a && b.color === a.color && b.type === a.type);
    const beforeSquare = same ? idx : fromIdx;
    if (couldBeSaved(before, beforeSquare, invertColor(moverColor))) return true;
  }
  return false;
}

function isForced(fenBefore: any) {
  try {
    const g = ChessGame.fromFEN(fenBefore);
    return g.allLegalMoves(g.turn).length === 1;
  } catch (e: any) { return false; }
}

const MATE_CP = 100000;
function winPct(cp: any) {
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * Math.max(-10000, Math.min(10000, cp)))) - 1);
}
function scoreCp(s: any) {
  if (!s || !s.length) return null;
  if (s[0] === "mate") { if (s.length === 1) return -MATE_CP; return Number(s[1]) > 0 ? MATE_CP : -MATE_CP; }
  const v = Number(s[1]);
  return Number.isFinite(v) ? v : null;
}

function rateMove(d: any) {
  const { staticEval, secondScore, isBest, sacrifice, isBook, trivialRecap, endgame } = d;
  const prev: any[] = d.previousStaticEvals || [];

  if (isBook) return "book";

  const cpBefore = scoreCp(prev[0]);
  const cpAfterOpp = scoreCp(staticEval);
  if (cpBefore === null || cpAfterOpp === null) return isBest ? "best" : "good";
  const cpAfter = -cpAfterOpp;
  const wb = winPct(cpBefore), wa = winPct(cpAfter);
  const wl = Math.max(0, wb - wa);

  if (!isBest && prev[0][0] === "mate" && prev[0].length > 1 && staticEval[0] === "mate" && staticEval.length > 1) {
    const nB = Number(prev[0][1]), nA = Number(staticEval[1]);
    if (nB > 0 && nA < 0 && Math.abs(nA) + 1 > nB) return "good";
    if (nB < 0 && nA > 0 && nA < -nB) return "good";
  }

  const sacMates = cpAfter >= 90000;
  const sacWins = cpAfter >= 150 && cpBefore <= 300;
  if (sacrifice && (isBest || wl <= 2) && (sacMates || sacWins)) return "brilliant";

  const cpSecond = secondScore ? scoreCp(secondScore) : null;
  const gapWl = cpSecond === null ? 0 : wb - winPct(cpSecond);
  const onlyMove = gapWl >= 14 && cpAfter >= -50;
  const winsMat = gapWl >= 10 && cpAfter >= 200;
  if (isBest && !sacrifice && !trivialRecap && wl <= 1.5 && (onlyMove || winsMat)) return "great";

  if (isBest) return "best";

  if (prev[0][0] === "mate" && staticEval[0] !== "mate" && cpBefore > 0) return "miss";

  const decisive = wb >= 90 || wb <= 10;
  if (wl <= 0.5 && (endgame || decisive)) return "best";

  const wm = (k: number) => { const c = scoreCp(prev[k]); return c === null ? null : winPct((k % 2 === 0 ? 1 : -1) * c); };
  const w0 = wm(0), w1 = wm(1), w2 = wm(2);
  const noMate = staticEval[0] !== "mate" && prev[0][0] !== "mate" && !(prev[1] && prev[1][0] === "mate");
  if (noMate && w0 !== null && w1 !== null) {
    const oppLoss = w0 - w1;
    const myPrevLoss = w2 !== null ? w2 - w1 : 0;
    const oppPrevWasMiss = myPrevLoss > 10 && oppLoss > 5 && oppLoss <= myPrevLoss + 3;
    if (!oppPrevWasMiss && oppLoss > 10 && wl > 5 && wl <= oppLoss + 3) return "miss";
  }

  if (wl <= 2) return "excellent";
  if (wl <= 5) return "good";
  if (wl <= 10) return "inaccuracy";
  if (wl <= 20) return "mistake";
  return "blunder";
}

module.exports = { rateMove, winPct, scoreCp, isSacrifice, isForced };
