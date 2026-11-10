"use strict";
const express = require("express");
const router = express.Router();

const { ChessGame, fromAlgebraic } = require("../lib/chess-rules");
const requireAuth = require("../lib/require-auth");
const puzzlesRepo = require("../lib/puzzles-repo");
const sessionRepo = require("../lib/puzzle-session-repo");
const usersRepo = require("../lib/users-repo");
const ratingHistoryRepo = require("../lib/rating-history-repo");
const { calculatePuzzleRatingChange } = require("../lib/matchmaking");

function applyUci(game: any, uci: any) {
  const from = uci.slice(0, 2), to = uci.slice(2, 4);
  const promotion = uci.length > 4 ? uci.slice(4, 5) : null;
  const fromIdx = fromAlgebraic(from);
  const toIdx = fromAlgebraic(to);
  const legal = game.legalMovesFor(fromIdx);
  const move = legal.find((m: any) => m.to === toIdx && (!m.promotion || m.promotion === (promotion || "q")))
            || legal.find((m: any) => m.to === toIdx);
  if (!move) return null;
  game.applyMove(move);
  return move;
}

function replayToMoveIndex(puzzleRow: any, moveIndex: any) {
  let game;
  try {
    game = ChessGame.fromFEN(puzzleRow.fen);
  } catch (e: any) {
    return null;
  }
  const moves = puzzleRow.moves.split(" ");
  for (let i = 0; i < moveIndex; i++) {
    if (i >= moves.length) return null;
    const applied = applyUci(game, moves[i]);
    if (!applied) return null;
  }
  return { game, moves };
}

function publicSession(session: any, game: any, extra: any) {
  const base = {
    sessionId: session.id,
    puzzleId: session.puzzle_id,
    isDaily: !!session.is_daily,
    fen: game.toFEN(),
    playerColor: game.turn,
    status: session.status
  };
  return Object.assign(base, extra || {});
}

async function startFromPuzzle(req: SrvReq, res: SrvRes, puzzleRow: any, isDaily: any) {
  if (!puzzleRow || !puzzleRow.fen || !puzzleRow.moves) {
    return res.status(500).json({ error: "Data puzzle tidak valid." });
  }
  const moves = puzzleRow.moves.split(" ");
  if (moves.length < 2) {
    return res.status(500).json({ error: "Data puzzle tidak memiliki cukup langkah." });
  }

  let game;
  try {
    game = ChessGame.fromFEN(puzzleRow.fen);
  } catch (e: any) {
    return res.status(500).json({ error: "FEN puzzle tidak valid." });
  }

  const firstMove = applyUci(game, moves[0]);
  if (!firstMove) {
    return res.status(500).json({ error: "Langkah pembuka puzzle tidak valid." });
  }

  const session = await sessionRepo.createSession({
    userId: req.user.id,
    puzzleId: puzzleRow.id,
    isDaily
  });

  res.status(201).json(publicSession(session, game, {
    rating: puzzleRow.rating,
    themes: puzzleRow.themes,
    totalMoves: moves.length
  }));
}

router.post("/next", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const b = req.body || {};
    const themeFilter = Array.isArray(b.themeFilter)
      ? b.themeFilter.filter((t: any) => typeof t === "string" && t.length <= 40).slice(0, 40)
      : [];
    const themeMatchAll = !!b.themeMatchAll;
    const colorChoice = ["mixed", "white", "black"].includes(b.colorChoice) ? b.colorChoice : "mixed";
    const clampNum = (v: any, lo: any, hi: any, dflt: any) => Number.isFinite(v) ? Math.max(lo, Math.min(hi, v)) : dflt;
    const pieceCountMin = clampNum(b.pieceCountMin, 2, 32, 3);
    const pieceCountMax = clampNum(b.pieceCountMax, 2, 32, 32);
    const currentRating = clampNum(b.currentRating, 0, 4000, req.user.puzzleRating);
    const ratingIncrease = clampNum(b.ratingIncrease, 0, 500, 15);

    const excludeIds = await sessionRepo.getRecentPuzzleIds(req.user.id);

    const result = puzzlesRepo.findCandidate({
      themeFilter, themeMatchAll, colorChoice,
      pieceCountMin, pieceCountMax,
      targetRating: currentRating, ratingIncrease,
      excludeIds
    });

    if (result.error === "no-match-for-filter") {
      return res.status(404).json({ error: "no-match-for-filter" });
    }
    if (result.error === "all-played") {
      return res.status(409).json({ error: "all-played" });
    }

    await startFromPuzzle(req, res, result.puzzle, false);
  } catch (err: any) {
    next(err);
  }
});

router.get("/daily", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const puzzleRow = puzzlesRepo.getDailyPuzzle();
    await startFromPuzzle(req, res, puzzleRow, true);
  } catch (err: any) {
    next(err);
  }
});

router.param("id", (req: SrvReq, res: SrvRes, next: SrvNext, id: any) => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return res.status(404).json({ error: "Sesi puzzle tidak ditemukan." });
  }
  next();
});

router.post("/:id/move", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const session = await sessionRepo.getOwnedSession(req.params.id, req.user.id);
    if (!session) return res.status(404).json({ error: "Sesi puzzle tidak ditemukan." });
    if (session.status !== "active") {
      return res.status(409).json({ error: "Sesi puzzle ini sudah berakhir." });
    }

    const puzzleRow = puzzlesRepo.getById(session.puzzle_id);
    if (!puzzleRow) return res.status(500).json({ error: "Data puzzle tidak ditemukan lagi di server." });

    const replay = replayToMoveIndex(puzzleRow, session.move_index);
    if (!replay) return res.status(500).json({ error: "Gagal memutar ulang posisi puzzle." });
    const { game, moves } = replay;

    const { from, to, promotion } = req.body || {};
    const SQUARE_RE = /^[a-h][1-8]$/;
    if (typeof from !== "string" || typeof to !== "string" || !SQUARE_RE.test(from) || !SQUARE_RE.test(to)) {
      return res.status(400).json({ error: "Notasi kotak tidak valid." });
    }
    const expectedUci = moves[session.move_index];
    const isLastMove = session.move_index === moves.length - 1;

    const trial = game.clone();
    const appliedMove = applyUci(trial, from + to + (promotion || "q"));
    const playerUci = from + to + (appliedMove && appliedMove.promotion ? appliedMove.promotion : "");

    const isCheckmateAlt = isLastMove && !!appliedMove && trial.isCheckmate();
    const correct = !!appliedMove && ((playerUci === expectedUci) || isCheckmateAlt);

    if (!correct) {
      await sessionRepo.markWrongAttempt(session.id);

      return res.json({
        correct: false,
        fen: game.toFEN(),
        moveIndex: session.move_index
      });
    }

    applyUci(game, playerUci);

    let newMoveIndex = session.move_index + 1;
    const solved = newMoveIndex >= moves.length;

    let ratingResult = null;
    if (solved) {
      const closed = await sessionRepo.finishSession(session.id, "solved");
      if (!closed) return res.status(409).json({ error: "Sesi puzzle ini sudah berakhir." });

      const solvedFirstTry = !session.had_wrong_attempt;
      const playerRating = req.user.puzzleRating;
      const change = calculatePuzzleRatingChange(playerRating, puzzleRow.rating, solvedFirstTry);
      const newRating = Math.max(400, playerRating + change);

      await usersRepo.updateUser(req.user.id, {
        puzzleRating: newRating,
        puzzleSolved: req.user.puzzleSolved + (solvedFirstTry ? 1 : 0),
        puzzleFailed: req.user.puzzleFailed + (solvedFirstTry ? 0 : 1)
      });
      await ratingHistoryRepo.record({ userId: req.user.id, category: "puzzle", rating: newRating });

      ratingResult = {
        solvedFirstTry,
        ratingBefore: playerRating,
        ratingAfter: newRating,
        ratingChange: newRating - playerRating
      };
    } else {
      const opponentUci = moves[newMoveIndex];
      const opponentMove = applyUci(game, opponentUci);
      if (!opponentMove) {
        return res.status(500).json({ error: "Langkah lawan berikutnya pada data puzzle tidak valid." });
      }
      newMoveIndex += 1;
      const advanced = await sessionRepo.advanceMove(session.id, newMoveIndex, session.move_index);
      if (!advanced) return res.status(409).json({ error: "Langkah bersamaan terdeteksi. Muat ulang puzzle." });
    }

    res.json({
      correct: true,
      solved,
      moveIndex: newMoveIndex,
      fen: game.toFEN(),
      playerColor: game.turn,
      rating: ratingResult
    });
  } catch (err: any) {
    next(err);
  }
});

router.post("/:id/hint", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const session = await sessionRepo.getOwnedSession(req.params.id, req.user.id);
    if (!session) return res.status(404).json({ error: "Sesi puzzle tidak ditemukan." });
    if (session.status !== "active") return res.status(409).json({ error: "Sesi puzzle ini sudah berakhir." });

    const puzzleRow = puzzlesRepo.getById(session.puzzle_id);
    if (!puzzleRow) return res.status(500).json({ error: "Data puzzle tidak ditemukan lagi di server." });

    const moves = puzzleRow.moves.split(" ");
    const expectedUci = moves[session.move_index];
    if (!expectedUci) return res.status(500).json({ error: "Tidak ada langkah berikutnya untuk di-hint." });

    res.json({ fromSquare: expectedUci.slice(0, 2) });
  } catch (err: any) {
    next(err);
  }
});

module.exports = router;
