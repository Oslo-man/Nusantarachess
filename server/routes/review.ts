"use strict";
const express = require("express");
const router = express.Router();

const requireAuth = require("../lib/require-auth");
const security = require("../lib/security");

const analyzeLimiter = security.limit({
  name: "review-analyze", windowMs: 10 * 60 * 1000, shared: false,
  rulesFor: (req: SrvReq) => [{ key: "user:" + req.user.id, max: 40 }]
});
const classifyLimiter = security.limit({
  name: "review-classify", windowMs: 60 * 1000, shared: false,
  rulesFor: (req: SrvReq) => [{ key: "user:" + req.user.id, max: 600 }]
});
const { analyzeGame, classifySingleMove } = require("../lib/review-scoring");

const MAX_MOVES = 600;

function isFiniteNumber(v: any) {
  return typeof v === "number" && Number.isFinite(v);
}

function validateAnalyzeGameBody(body: any) {
  if (!body || typeof body !== "object") return "Body request tidak valid.";
  const { fens, moves, evals, bestUci, secondEvals, scores, bookHits, bookPlies, isCustomStart } = body;

  if (!Array.isArray(moves) || moves.length === 0) return "moves harus array tidak kosong.";
  if (moves.length > MAX_MOVES) return "Jumlah langkah melebihi batas wajar.";
  const n = moves.length;

  if (!Array.isArray(fens) || fens.length !== n + 1) return "fens harus berjumlah moves.length + 1.";
  if (!fens.every(f => typeof f === "string" && f.length > 0 && f.length < 200)) return "fens berisi entri tidak valid.";

  if (!Array.isArray(evals) || evals.length !== n + 1) return "evals harus berjumlah moves.length + 1.";
  if (!evals.every(isFiniteNumber)) return "evals harus berisi angka.";

  if (!Array.isArray(bestUci) || bestUci.length !== n) return "bestUci harus berjumlah moves.length.";
  if (!bestUci.every(u => u === null || (typeof u === "string" && u.length <= 8))) return "bestUci berisi entri tidak valid.";

  if (secondEvals !== undefined && secondEvals !== null) {
    if (!Array.isArray(secondEvals) || secondEvals.length !== n) return "secondEvals harus berjumlah moves.length jika ada.";
    if (!secondEvals.every(v => v === null || isFiniteNumber(v))) return "secondEvals berisi entri tidak valid.";
  }

  if (scores !== undefined && scores !== null) {
    if (!Array.isArray(scores) || scores.length !== n + 1) return "scores harus berjumlah moves.length + 1 jika ada.";
    const okScore = (e: any) => Array.isArray(e) && (e[0] === "cp" || e[0] === "mate")
      && (e.length === 1 ? e[0] === "mate" : (e.length === 2 && /^-?\d{1,7}$/.test(String(e[1]))));
    if (!scores.every(okScore)) return "scores berisi entri tidak valid.";
  }

  if (bookHits !== undefined && bookHits !== null) {
    if (!Array.isArray(bookHits) || bookHits.length !== n + 1 || !bookHits.every((b: any) => typeof b === "boolean")) return "bookHits harus array boolean sepanjang fens.";
  }
  if (bookPlies !== undefined && bookPlies !== null && !(isFiniteNumber(bookPlies) && bookPlies >= 0 && bookPlies <= MAX_MOVES * 2)) return "bookPlies harus angka wajar.";
  if (isCustomStart !== undefined && isCustomStart !== null && typeof isCustomStart !== "boolean") return "isCustomStart harus boolean.";
  if (!evals.every(v => Math.abs(v) <= 100000)) return "evals di luar rentang wajar.";

  for (const mv of moves) {
    if (!mv || typeof mv !== "object") return "moves berisi entri tidak valid.";
    if (typeof mv.from !== "string" || typeof mv.to !== "string") return "setiap move butuh from/to string.";
    if (!/^[a-h][1-8]$/.test(mv.from) || !/^[a-h][1-8]$/.test(mv.to)) return "notasi kotak pada moves tidak valid.";
    if (mv.promotion !== undefined && mv.promotion !== null && !/^[qrbn]$/i.test(String(mv.promotion))) return "promosi pada moves tidak valid.";
  }

  return null;
}

router.post("/analyze-game", requireAuth, analyzeLimiter, (req: SrvReq, res: SrvRes) => {
  const errMsg = validateAnalyzeGameBody(req.body);
  if (errMsg) return res.status(400).json({ error: errMsg });

  try {
    const report = analyzeGame(req.body);
    res.json({ report });
  } catch (err: any) {
    console.error("[review/analyze-game]", err);
    res.status(500).json({ error: "Gagal menganalisis partai." });
  }
});

const okScoreEntry = (e: any) => Array.isArray(e) && (e[0] === "cp" || e[0] === "mate") &&
  (e.length === 1 ? e[0] === "mate" : (e.length === 2 && Number.isFinite(Number(e[1]))));
function validateClassifyMoveBody(body: any) {
  if (!body || typeof body !== "object") return "Body request tidak valid.";
  if (typeof body.isBest !== "boolean") return "Field 'isBest' harus boolean.";
  if (typeof body.isBook !== "boolean") return "Field 'isBook' harus boolean.";
  for (const k of ["fenBefore", "fenAfter"]) {
    if (typeof body[k] !== "string" || body[k].length === 0 || body[k].length > 100) return "Field '" + k + "' harus string FEN yang valid.";
  }
  if (body.moverColor !== "w" && body.moverColor !== "b") return "Field 'moverColor' harus 'w' atau 'b'.";
  const m = body.move;
  if (!m || typeof m !== "object" || !/^[a-h][1-8]$/.test(m.from) || !/^[a-h][1-8]$/.test(m.to)) return "Field 'move' tidak valid.";
  if (m.promotion != null && !/^[qrbn]$/.test(m.promotion)) return "Field 'move.promotion' tidak valid.";
  if (m.capturedType != null && !/^[pnbrq]$/.test(m.capturedType)) return "Field 'move.capturedType' tidak valid.";
  if (!okScoreEntry(body.staticEval)) return "Field 'staticEval' tidak valid.";
  if (!Array.isArray(body.previousStaticEvals) || body.previousStaticEvals.length < 1 || body.previousStaticEvals.length > 4 ||
      !body.previousStaticEvals.every(okScoreEntry)) return "Field 'previousStaticEvals' tidak valid.";
  if (body.previousSacrifice != null && typeof body.previousSacrifice !== "boolean") return "Field 'previousSacrifice' harus boolean.";
  if (body.secondScore != null && !okScoreEntry(body.secondScore)) return "Field 'secondScore' tidak valid.";
  if (body.previousCaptureSquare != null && !(typeof body.previousCaptureSquare === "string" && /^[a-h][1-8]$/.test(body.previousCaptureSquare))) return "Field 'previousCaptureSquare' tidak valid.";
  return null;
}

router.post("/classify-move", requireAuth, classifyLimiter, (req: SrvReq, res: SrvRes) => {
  const errMsg = validateClassifyMoveBody(req.body);
  if (errMsg) return res.status(400).json({ error: errMsg });

  try {
    const { fenBefore, fenAfter, move, moverColor, isBest, isBook, staticEval, previousStaticEvals, previousSacrifice, secondScore, previousCaptureSquare } = req.body;
    const norm = (e: any) => e.length === 1 ? ["mate"] : [e[0], String(Math.round(Number(e[1])))];
    const result = classifySingleMove({
      fenBefore, fenAfter, moverColor, isBest, isBook, previousSacrifice: previousSacrifice === true,
      secondScore: secondScore ? norm(secondScore) : null, previousCaptureSquare: previousCaptureSquare || null,
      move: { from: move.from, to: move.to, promotion: move.promotion || null, capturedType: move.capturedType || null },
      staticEval: norm(staticEval), previousStaticEvals: previousStaticEvals.map(norm)
    });
    res.json(result);
  } catch (err: any) {
    console.error("[review/classify-move]", err);
    res.status(500).json({ error: "Gagal mengklasifikasi langkah." });
  }
});

module.exports = router;
