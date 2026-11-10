"use strict";
const express = require("express");
const router = express.Router();

const { ChessGame, fromAlgebraic } = require("../lib/chess-rules");
const requireAuth = require("../lib/require-auth");
const practiceRepo = require("../lib/practice-repo");
const savedGamesRepo = require("../lib/saved-games-repo");

const VALID_CHARACTERS = ["fahri", "udin", "adit", "dimas", "agus", "ilham", "josep", "asep"];
const VALID_MODES = ["friendly", "challenge"];

const PRACTICE_OPPONENTS: any = {
  udin: { name: "Udin", elo: 1250 },
  adit: { name: "Adit", elo: 1000 },
  dimas: { name: "Dimas", elo: 1650 },
  agus: { name: "Agus", elo: 1600 },
  ilham: { name: "Ilham", elo: 2450 },
  josep: { name: "Josep", elo: 2200 },
  asep: { name: "Asep", elo: 1850 },
  fahri: {
    3: { name: "Fahri serius", elo: 2300 }   // level tunggal (level 1/2 dihapus)
  }
};

function opponentOf(m: any) {
  if (m.character === "fahri") return PRACTICE_OPPONENTS.fahri[3];
  return PRACTICE_OPPONENTS[m.character];
}

function publicPractice(m: any) {
  return {
    id: m.id,
    character: m.character,
    playerColor: m.player_color,
    fen: m.fen,
    status: m.status,
    result: m.result,
    resultReason: m.result_reason,
    sanHistory: JSON.parse(m.san_history || "[]"),
    mode: m.mode,
    engineLevel: m.engine_level,
    startFen: m.start_fen || "",
    uciHistory: JSON.parse(m.uci_history || "[]")
  };
}

async function archivePracticeGame(user: any, match: any) {
  if (!user || user.isGuest || !match || match.mode !== "challenge" || !match.result) return null;
  try {
    const sanHistory = JSON.parse(match.san_history || "[]");
    const opponent = opponentOf(match);
    if (sanHistory.length === 0 || !opponent) return null;

    const playerIsWhite = match.player_color === "w";
    let resultTag = "1/2-1/2";
    if (match.result === "win") resultTag = playerIsWhite ? "1-0" : "0-1";
    else if (match.result === "loss") resultTag = playerIsWhite ? "0-1" : "1-0";

    return await savedGamesRepo.create({
      userId: user.id,
      matchId: match.id,
      opponentName: opponent.name,
      opponentElo: opponent.elo,
      category: "bot",
      result: match.result,
      eloChange: 0,
      eloBefore: 0,
      eloAfter: 0,
      pgn: savedGamesRepo.buildPgn({
        whiteName: playerIsWhite ? user.username : opponent.name,
        blackName: playerIsWhite ? opponent.name : user.username,
        resultTag,
        sanHistory,
        whiteElo: playerIsWhite ? undefined : opponent.elo,
        blackElo: playerIsWhite ? opponent.elo : undefined
      })
    });
  } catch (e: any) {
    console.error("[practice] Gagal menyimpan saved_games:", e.message);
    return null;
  }
}

router.post("/start", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const { character, playerColor, startFen } = req.body || {};
    if (VALID_CHARACTERS.indexOf(character) === -1) {
      return res.status(400).json({ error: "Karakter tidak dikenal." });
    }
    if (playerColor !== "w" && playerColor !== "b") {
      return res.status(400).json({ error: "Warna pemain tidak valid." });
    }
    const mode = (req.body && req.body.mode !== undefined) ? req.body.mode : "friendly";
    if (VALID_MODES.indexOf(mode) === -1) {
      return res.status(400).json({ error: "Mode permainan tidak valid." });
    }
    // Level tunggal: parameter `level` dari klien lama diabaikan, selalu level utama (3).
    const engineLevel = 3;
    const hasCustomStart = typeof startFen === "string" && startFen.trim().length > 0;
    if (hasCustomStart && mode === "challenge") {
      return res.status(400).json({ error: "Mode Tanpa alat tidak mendukung posisi awal kustom." });
    }

    let game;
    if (typeof startFen === "string" && startFen.length > 200) {
      return res.status(400).json({ error: "FEN tidak valid." });
    }
    if (typeof startFen === "string" && startFen.trim().length > 0) {
      try {
        game = ChessGame.fromFEN(startFen);
      } catch (e: any) {
        return res.status(400).json({ error: "FEN tidak valid." });
      }
    } else {
      game = new ChessGame();
    }

    const existing = await practiceRepo.findActivePracticeForUser(req.user.id);
    if (existing) {
      await practiceRepo.finishPracticeMatch({ id: existing.id, userId: req.user.id, result: null, resultReason: "superseded" });
    }

    let match;
    try {
      match = await practiceRepo.createPracticeMatch({
        userId: req.user.id,
        character,
        playerColor,
        fen: game.toFEN(),
        mode,
        engineLevel,
        startFen: hasCustomStart ? game.toFEN() : ""
      });
    } catch (e: any) {
      if (e && e.code === "23505") return res.status(409).json({ error: "Sesi latihan sedang dimulai. Coba lagi." });
      throw e;
    }

    res.status(201).json({ match: publicPractice(match) });
  } catch (err: any) {
    next(err);
  }
});

router.get("/active", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const match = await practiceRepo.findActivePracticeForUser(req.user.id);
    res.json({ match: match ? publicPractice(match) : null });
  } catch (err: any) {
    next(err);
  }
});

router.param("id", (req: SrvReq, res: SrvRes, next: SrvNext, id: any) => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return res.status(404).json({ error: "Sesi latihan tidak ditemukan." });
  }
  next();
});

router.get("/:id/state", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const match = await practiceRepo.getOwnedPracticeMatch(req.params.id, req.user.id);
    if (!match) return res.status(404).json({ error: "Sesi latihan tidak ditemukan." });
    res.json({ match: publicPractice(match) });
  } catch (err: any) {
    next(err);
  }
});

router.post("/:id/move", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const match = await practiceRepo.getOwnedPracticeMatch(req.params.id, req.user.id);
    if (!match) return res.status(404).json({ error: "Sesi latihan tidak ditemukan." });
    if (match.status !== "active") {
      return res.status(409).json({ error: "Sesi latihan ini sudah berakhir.", match: publicPractice(match) });
    }

    const { from, to, promotion } = req.body || {};
    const SQUARE_RE = /^[a-h][1-8]$/;
    if (typeof from !== "string" || typeof to !== "string" || !SQUARE_RE.test(from) || !SQUARE_RE.test(to)) {
      return res.status(400).json({ error: "Notasi kotak tidak valid." });
    }

    const game = ChessGame.fromFEN(match.fen);
    const turnColor = game.turn;
    const expectedMover = (turnColor === match.player_color) ? "player" : "bot";

    const fromIdx = fromAlgebraic(from);
    const toIdx = fromAlgebraic(to);

    const legalMoves = game.legalMovesFor(fromIdx);
    const move = legalMoves.find((m: any) =>
      m.to === toIdx && (!m.promotion || m.promotion === (promotion || "q"))
    ) || legalMoves.find((m: any) => m.to === toIdx);

    if (!move) {
      return res.status(422).json({
        error: "Langkah tidak legal pada posisi saat ini.",
        match: publicPractice(match)
      });
    }

    const boardBefore = game.clone();
    game.applyMove(move);
    const san = boardBefore.moveToSANFull(move, game.clone());

    const sanHistory = JSON.parse(match.san_history || "[]");
    sanHistory.push(san);
    const uciHistory = JSON.parse(match.uci_history || "[]");
    uciHistory.push(from + to + (move.promotion || ""));

    const updated = await practiceRepo.updateAfterMove({
      id: match.id,
      userId: req.user.id,
      expectedFen: match.fen,
      fen: game.toFEN(),
      sanHistory,
      uciHistory
    });
    if (!updated) {
      const fresh = await practiceRepo.getOwnedPracticeMatch(req.params.id, req.user.id);
      return res.status(409).json({ error: "Langkah bersamaan terdeteksi. Sinkronkan ulang papan.", match: fresh ? publicPractice(fresh) : undefined });
    }

    const over = game.gameOverReason();
    if (over.over) {
      let result;
      if (over.winner === null) result = "draw";
      else result = over.winner === match.player_color ? "win" : "loss";
      const finished = await practiceRepo.finishPracticeMatch({ id: match.id, userId: req.user.id, result, resultReason: over.reason });
      if (!finished) return res.status(409).json({ error: "Sesi latihan sudah berakhir." });
      const savedGameId = await archivePracticeGame(req.user, finished);
      return res.json({ match: publicPractice(finished), san, gameOver: true, expectedMover, savedGameId });
    }

    res.json({ match: publicPractice(updated), san, gameOver: false, expectedMover });
  } catch (err: any) {
    next(err);
  }
});

router.post("/:id/resign", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const match = await practiceRepo.getOwnedPracticeMatch(req.params.id, req.user.id);
    if (!match) return res.status(404).json({ error: "Sesi latihan tidak ditemukan." });
    if (match.status !== "active") return res.status(409).json({ error: "Sesi latihan sudah berakhir." });

    const finished = await practiceRepo.finishPracticeMatch({ id: match.id, userId: req.user.id, result: "loss", resultReason: "resign" });

    if (!finished) return res.status(409).json({ error: "Sesi latihan sudah berakhir." });
    const savedGameId = await archivePracticeGame(req.user, finished);
    res.json({ match: publicPractice(finished), gameOver: true, savedGameId });
  } catch (err: any) {
    next(err);
  }
});

module.exports = router;
