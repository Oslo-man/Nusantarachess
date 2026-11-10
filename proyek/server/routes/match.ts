"use strict";
const express = require("express");
const router = express.Router();

const { ChessGame, fromAlgebraic } = require("../lib/chess-rules");
const requireAuth = require("../lib/require-auth");
const security = require("../lib/security");
const matchesRepo = require("../lib/matches-repo");
const usersRepo = require("../lib/users-repo");
const ratingHistoryRepo = require("../lib/rating-history-repo");
const savedGamesRepo = require("../lib/saved-games-repo");
const { generateBotProfile, maybeGetSpecialCharacter, calculateEloChange, randInt } = require("../lib/matchmaking");
const { flagEmojiForCountry, DEFAULT_COUNTRY_CODE } = require("../lib/countries");
const { PLAYER_ELO_MIN, PLAYER_ELO_MAX, UCI_ELO_MIN, UCI_ELO_MAX, GUEST_BOT_ELO_MIN, GUEST_BOT_ELO_MAX } = require("../lib/elo-ranges");

const TIME_CONTROLS: Record<string, any> = {
  bullet: { time: 60, inc: 0 },
  blitz: { time: 180, inc: 2 },
  rapid: { time: 600, inc: 5 }
};

const CUSTOM_TIME_MIN = 15, CUSTOM_TIME_MAX = 120 * 60, CUSTOM_INC_MAX = 60;

function parseCustomTime(time: any, inc: any) {
  if (time === undefined && inc === undefined) return null;
  if (!Number.isInteger(time) || !Number.isInteger(inc) ||
      time < CUSTOM_TIME_MIN || time > CUSTOM_TIME_MAX || inc < 0 || inc > CUSTOM_INC_MAX) {
    return false;
  }
  return { time, inc };
}

function categoryForCustomTime(time: number, inc: number) {
  const est = time + 40 * inc;
  if (est < 180) return "bullet";
  if (est < 480) return "blitz";
  return "rapid";
}

function timeControlOfMatch(m: any) {
  if (m.time_base !== null && m.time_base !== undefined) {
    return { category: m.category, time: m.time_base, inc: m.time_inc || 0, custom: true };
  }
  const tc = TIME_CONTROLS[m.category];
  return tc ? Object.assign({ category: m.category }, tc) : null;
}

function eloFieldFor(category: any) {
  if (category === "bullet") return "eloBullet";
  if (category === "blitz") return "eloBlitz";
  return "eloRapid";
}
function gameCountFieldFor(category: any) {
  if (category === "bullet") return "gameCountBullet";
  if (category === "blitz") return "gameCountBlitz";
  return "gameCountRapid";
}

function publicMatch(m: any) {
  return {
    id: m.id,
    category: m.category,
    playerColor: m.player_color,
    bot: {
      name: m.bot_name, elo: m.bot_elo, flag: m.bot_flag,
      title: m.bot_title || '', avatar: m.bot_avatar || '🤖',
      avatarImage: m.bot_avatar_image || ''
    },
    fen: m.fen,
    status: m.status,
    result: m.result,
    resultReason: m.result_reason,
    playerMs: m.player_ms,
    botMs: m.bot_ms,
    sanHistory: JSON.parse(m.san_history || "[]"),
    plySnapshots: JSON.parse(m.ply_snapshots || "[]"),
    lastMoveSquaresPerPly: JSON.parse(m.last_move_squares_per_ply || "[]"),
    createdAt: m.created_at
  };
}

function publicMatchWithLiveClock(m: any) {
  const base = publicMatch(m);
  if (m.status !== "active") return base;
  const game = ChessGame.fromFEN(m.fen);
  const expectedMover = (game.turn === m.player_color) ? "player" : "bot";
  const elapsedMs = Math.max(0, Date.now() - m.last_move_at);
  if (expectedMover === "player") {
    base.playerMs = Math.max(0, m.player_ms - elapsedMs);
  } else {
    base.botMs = Math.max(0, m.bot_ms - elapsedMs);
  }
  return base;
}

function expiredClockResult(m: any): "loss" | "win" | null {
  if (m.status !== "active") return null;
  const game = ChessGame.fromFEN(m.fen);
  const playerToMove = game.turn === m.player_color;
  const elapsedMs = Math.max(0, Date.now() - m.last_move_at);
  const playerMsNow = playerToMove ? m.player_ms - elapsedMs : m.player_ms;
  const botMsNow = playerToMove ? m.bot_ms : m.bot_ms - elapsedMs;
  if (playerMsNow <= 0) return "loss";
  if (botMsNow <= 0) return "win";
  return null;
}

router.post("/find", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const body = req.body || {};
    const custom = parseCustomTime(body.time, body.inc);
    if (custom === false) {
      return res.status(400).json({ error: "Kendali waktu kustom tidak valid." });
    }
    const category = custom ? categoryForCustomTime(custom.time, custom.inc) : body.category;
    if (!TIME_CONTROLS[category]) {
      return res.status(400).json({ error: "Kategori waktu tidak dikenal." });
    }

    const existing = await matchesRepo.findActiveMatchForUser(req.user.id);
    if (existing) {
      return res.status(409).json({ error: "Kamu masih punya pertandingan aktif.", match: publicMatch(existing) });
    }

    const isGuest = !!req.user.isGuest;

    const eloField = eloFieldFor(category);
    const playerElo = isGuest ? null : req.user[eloField];
    const min = isGuest ? GUEST_BOT_ELO_MIN : Math.max(UCI_ELO_MIN, playerElo - 50);
    const max = isGuest ? GUEST_BOT_ELO_MAX : Math.min(UCI_ELO_MAX, playerElo + 50);

    let bot;
    let customOpponent = null;
    if (!isGuest && req.user.customOpponent) {
      try { customOpponent = JSON.parse(req.user.customOpponent); } catch (e: any) { customOpponent = null; }
    }
    if (customOpponent && customOpponent.name) {
      let customPhoto = "";
      if (req.user.botAvatarOverrides) {
        try {
          const overrides = JSON.parse(req.user.botAvatarOverrides);
          if (overrides && typeof overrides === "object" && typeof overrides[customOpponent.name] === "string") {
            customPhoto = overrides[customOpponent.name];
          }
        } catch (e: any) { }
      }
      bot = {
        name: customOpponent.name,
        elo: customOpponent.elo,
        flag: flagEmojiForCountry(customOpponent.country) || flagEmojiForCountry(DEFAULT_COUNTRY_CODE),
        title: customOpponent.title || "",
        avatar: customOpponent.avatar || "🤖",
        avatarImage: customPhoto,
        isSpecial: false
      };
    } else if (isGuest) {
      bot = generateBotProfile(min, max);
    } else {
      bot = maybeGetSpecialCharacter(min, max) || generateBotProfile(min, max);
    }

    const playerColor = (!isGuest && playerElo > bot.elo) ? "b" : "w";

    const tc = custom || TIME_CONTROLS[category];
    const game = new ChessGame();
    let match;
    try {
      match = await matchesRepo.createMatch({
        userId: req.user.id,
        category,
        playerColor,
        bot,
        fen: game.toFEN(),
        playerMs: tc.time * 1000,
        botMs: tc.time * 1000,
        timeBase: custom ? custom.time : null,
        timeInc: custom ? custom.inc : null
      });
    } catch (e: any) {
      if (e && e.code === "23505") {
        const active = await matchesRepo.findActiveMatchForUser(req.user.id);
        return res.status(409).json({ error: "Kamu masih punya pertandingan aktif.", match: active ? publicMatch(active) : undefined });
      }
      throw e;
    }

    res.status(201).json({ match: publicMatch(match), timeControl: Object.assign({ category }, tc, custom ? { custom: true } : {}) });
  } catch (err: any) {
    next(err);
  }
});

router.get("/active", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    let match = await matchesRepo.findActiveMatchForUser(req.user.id);
    if (!match) return res.json({ match: null, timeControl: null });
    const expiredResult = expiredClockResult(match);
    if (expiredResult) {
      const finished = await matchesRepo.finishMatch({ id: match.id, userId: req.user.id, result: null, resultReason: "timeout" });
      if (finished) await settleGame(req.user, match, expiredResult, "timeout");
      return res.json({ match: null, timeControl: null });
    }
    res.json({
      match: publicMatchWithLiveClock(match),
      timeControl: timeControlOfMatch(match)
    });
  } catch (err: any) {
    next(err);
  }
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
router.param("id", (req: SrvReq, res: SrvRes, next: SrvNext, id: any) => {
  if (!UUID_RE.test(id)) return res.status(404).json({ error: "Pertandingan tidak ditemukan." });
  next();
});

router.get("/:id/state", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const match = await matchesRepo.getOwnedMatch(req.params.id, req.user.id);
    if (!match) return res.status(404).json({ error: "Pertandingan tidak ditemukan." });
    res.json({ match: publicMatchWithLiveClock(match) });
  } catch (err: any) {
    next(err);
  }
});

router.post("/:id/move", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const match = await matchesRepo.getOwnedMatch(req.params.id, req.user.id);
    if (!match) return res.status(404).json({ error: "Pertandingan tidak ditemukan." });
    if (match.status !== "active") {
      return res.status(409).json({ error: "Pertandingan ini sudah berakhir.", match: publicMatch(match) });
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
        match: publicMatch(match)
      });
    }

    const now = Date.now();
    const elapsedMs = now - match.last_move_at;
    let playerMs = match.player_ms;
    let botMs = match.bot_ms;
    const tc = timeControlOfMatch(match);
    const incMs = (tc.inc || 0) * 1000;

    if (expectedMover === "player") {
      playerMs -= elapsedMs;
      if (playerMs <= 0) {
        const finished = await matchesRepo.finishMatch({ id: match.id, userId: req.user.id, result: null, resultReason: "timeout" });
        if (!finished) return res.status(409).json({ error: "Pertandingan sudah berakhir." });
        const outcome = await settleGame(req.user, match, "loss", "timeout");
        return res.status(200).json({ match: publicMatch(finished), gameOver: true, outcome });
      }
      playerMs += incMs;
    } else {
      botMs -= elapsedMs;
      if (botMs <= 0) {
        const finished = await matchesRepo.finishMatch({ id: match.id, userId: req.user.id, result: null, resultReason: "timeout" });
        if (!finished) return res.status(409).json({ error: "Pertandingan sudah berakhir." });
        const outcome = await settleGame(req.user, match, "win", "timeout");
        return res.status(200).json({ match: publicMatch(finished), gameOver: true, outcome });
      }
      botMs += incMs;
    }

    const boardBefore = game.clone();
    game.applyMove(move);
    const san = boardBefore.moveToSANFull(move, game.clone());

    const sanHistory = JSON.parse(match.san_history || "[]");
    sanHistory.push(san);

    const plySnapshots = JSON.parse(match.ply_snapshots || "[]");
    plySnapshots.push(game.toFEN());
    const lastMoveSquaresPerPly = JSON.parse(match.last_move_squares_per_ply || "[]");
    lastMoveSquaresPerPly.push({ from, to });

    const updated = await matchesRepo.updateAfterMove({
      id: match.id,
      userId: req.user.id,
      expectedLastMoveAt: match.last_move_at,
      expectedFen: match.fen,
      fen: game.toFEN(),
      playerMs,
      botMs,
      sanHistory,
      plySnapshots,
      lastMoveSquaresPerPly
    });
    if (!updated) {
      const fresh = await matchesRepo.getOwnedMatch(req.params.id, req.user.id);
      return res.status(409).json({ error: "Langkah bersamaan terdeteksi. Sinkronkan ulang papan.", match: fresh ? publicMatch(fresh) : undefined });
    }

    const over = game.gameOverReason();
    if (over.over) {
      let result;
      if (over.winner === null) result = "draw";
      else result = over.winner === match.player_color ? "win" : "loss";
      const finished = await matchesRepo.finishMatch({ id: match.id, userId: req.user.id, result, resultReason: over.reason });
      if (!finished) return res.status(409).json({ error: "Pertandingan sudah berakhir." });
      const outcome = await settleGame(req.user, match, result, over.reason);
      return res.json({ match: publicMatch(finished), san, gameOver: true, outcome });
    }

    res.json({ match: publicMatch(updated), san, gameOver: false });
  } catch (err: any) {
    next(err);
  }
});

router.post("/:id/resign", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const match = await matchesRepo.getOwnedMatch(req.params.id, req.user.id);
    if (!match) return res.status(404).json({ error: "Pertandingan tidak ditemukan." });
    if (match.status !== "active") return res.status(409).json({ error: "Pertandingan sudah berakhir." });

    const finished = await matchesRepo.finishMatch({ id: match.id, userId: req.user.id, result: null, resultReason: "resign" });

    if (!finished) return res.status(409).json({ error: "Pertandingan sudah berakhir." });
    const outcome = await settleGame(req.user, match, "loss", "resign");
    res.json({ match: publicMatch(finished), gameOver: true, outcome });
  } catch (err: any) {
    next(err);
  }
});

router.post("/:id/timeout", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const match = await matchesRepo.getOwnedMatch(req.params.id, req.user.id);
    if (!match) return res.status(404).json({ error: "Pertandingan tidak ditemukan." });
    if (match.status !== "active") return res.status(409).json({ error: "Pertandingan sudah berakhir." });

    const game = ChessGame.fromFEN(match.fen);
    const turnColor = game.turn;
    const expectedMover = (turnColor === match.player_color) ? "player" : "bot";
    const now = Date.now();
    const elapsedMs = now - match.last_move_at;

    const playerMsNow = expectedMover === "player" ? match.player_ms - elapsedMs : match.player_ms;
    const botMsNow = expectedMover === "bot" ? match.bot_ms - elapsedMs : match.bot_ms;

    if (playerMsNow > 0 && botMsNow > 0) {
      return res.status(409).json({ error: "Belum ada yang kehabisan waktu.", match: publicMatch(match) });
    }

    const result = playerMsNow <= 0 ? "loss" : "win";
    const finished = await matchesRepo.finishMatch({ id: match.id, userId: req.user.id, result: null, resultReason: "timeout" });
    if (!finished) return res.status(409).json({ error: "Pertandingan sudah berakhir." });
    const outcome = await settleGame(req.user, match, result, "timeout");
    res.json({ match: publicMatch(finished), gameOver: true, outcome });
  } catch (err: any) {
    next(err);
  }
});

router.post("/:id/draw-offer", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const match = await matchesRepo.getOwnedMatch(req.params.id, req.user.id);
    if (!match) return res.status(404).json({ error: "Pertandingan tidak ditemukan." });
    if (match.status !== "active") return res.status(409).json({ error: "Pertandingan sudah berakhir." });

    const allowed = await security.consume(req, res, { name: "drawoffer", windowMs: 3600 * 1000, rules: [{ key: "user:" + req.user.id, max: 30 }] });
    if (!allowed) return;
    const accepted = Math.random() < 0.15;
    if (!accepted) {
      return res.json({ accepted: false, match: publicMatch(match) });
    }
    const finished = await matchesRepo.finishMatch({ id: match.id, userId: req.user.id, result: null, resultReason: "draw-agreement" });
    if (!finished) return res.status(409).json({ error: "Pertandingan sudah berakhir." });
    const outcome = await settleGame(req.user, match, "draw", "draw-agreement");
    res.json({ accepted: true, match: publicMatch(finished), gameOver: true, outcome });
  } catch (err: any) {
    next(err);
  }
});

router.post("/:id/abort", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const match = await matchesRepo.getOwnedMatch(req.params.id, req.user.id);
    if (!match) return res.status(404).json({ error: "Pertandingan tidak ditemukan." });
    if (match.status !== "active") return res.status(409).json({ error: "Pertandingan sudah berakhir." });

    const sanHistory = JSON.parse(match.san_history || "[]");
    if (sanHistory.length > 0) {
      return res.status(409).json({ error: "Tidak bisa membatalkan setelah langkah pertama dimainkan." });
    }
    const aborted = await matchesRepo.abortMatch(match.id, req.user.id);
    if (!aborted) return res.status(409).json({ error: "Pertandingan sudah berakhir." });
    if (req.user.isGuest) await matchesRepo.deleteInactiveMatch(match.id, req.user.id).catch(() => {});
    res.json({ ok: true });
  } catch (err: any) {
    next(err);
  }
});

async function settleGame(user: any, match: any, result: any, reason: any) {
  if (user.isGuest) {
    try {
      await matchesRepo.deleteInactiveMatch(match.id, user.id);
    } catch (e: any) {
      console.error("[match] Gagal menghapus match Guest:", e.message);
    }
    return {
      result,
      reason,
      guest: true,
      eloField: null,
      eloBefore: null,
      eloAfter: null,
      eloChange: null,
      opponentEloChange: null,
      user,
      savedGameId: null
    };
  }

  const eloField = eloFieldFor(match.category);
  const gameCountField = gameCountFieldFor(match.category);
  const currentElo = user[eloField];
  const currentGameCount = user[gameCountField];

  let eloChange = calculateEloChange(currentGameCount, result);
  if (user.eloProtected && eloChange < 0) {
    eloChange = 0;
  }
  const newElo = Math.max(PLAYER_ELO_MIN, Math.min(PLAYER_ELO_MAX, currentElo + eloChange));
  const actualChange = newElo - currentElo;

  const patch = {
    [eloField]: newElo,
    [gameCountField]: currentGameCount + 1,
    wins: user.wins + (result === "win" ? 1 : 0),
    losses: user.losses + (result === "loss" ? 1 : 0),
    draws: user.draws + (result === "draw" ? 1 : 0)
  };
  const updatedUser = await usersRepo.updateUser(user.id, patch);

  await ratingHistoryRepo.record({ userId: user.id, category: match.category, rating: newElo });

  let opponentChange;
  if (result === "draw") opponentChange = 0;
  else opponentChange = (result === "win") ? -16 : 16;

  let savedGameId = null;
  try {
    const sanHistory = JSON.parse(match.san_history || "[]");
    const whiteName = match.player_color === "w" ? user.username : match.bot_name;
    const blackName = match.player_color === "b" ? user.username : match.bot_name;
    const whiteElo = match.player_color === "w" ? currentElo : match.bot_elo;
    const blackElo = match.player_color === "b" ? currentElo : match.bot_elo;
    let resultTag = "*";
    if (result === "win") resultTag = match.player_color === "w" ? "1-0" : "0-1";
    else if (result === "loss") resultTag = match.player_color === "w" ? "0-1" : "1-0";
    else if (result === "draw") resultTag = "1/2-1/2";

    savedGameId = await savedGamesRepo.create({
      userId: user.id,
      matchId: match.id,
      opponentName: match.bot_name,
      opponentElo: match.bot_elo,
      category: match.category,
      result,
      eloChange: actualChange,
      eloBefore: currentElo,
      eloAfter: newElo,
      pgn: savedGamesRepo.buildPgn({ whiteName, blackName, resultTag, sanHistory, whiteElo, blackElo })
    });
  } catch (e: any) {
    console.error("[match] Gagal menyimpan saved_games:", e.message);
  }

  return {
    result,
    reason,
    eloField,
    eloBefore: currentElo,
    eloAfter: newElo,
    eloChange: actualChange,
    opponentEloChange: opponentChange,
    user: updatedUser,
    savedGameId
  };
}

module.exports = router;
