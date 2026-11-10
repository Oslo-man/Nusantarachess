"use strict";
const express = require("express");
const router = express.Router();

const requireAuth = require("../lib/require-auth");
const ratingHistoryRepo = require("../lib/rating-history-repo");
const savedGamesRepo = require("../lib/saved-games-repo");
const security = require("../lib/security");

router.get("/summary", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const u = req.user;
    const { rows: recentGames } = await savedGamesRepo.listForUser(u.id, { limit: 5, offset: 0 });

    res.json({
      user: {
        username: u.username,
        profilePhoto: security.isSafeImageDataUrl(u.profilePhoto, 100000) ? u.profilePhoto : "",
        country: u.country,
        createdAt: u.createdAt,
        eloBullet: u.eloBullet,
        eloBlitz: u.eloBlitz,
        eloRapid: u.eloRapid,
        puzzleRating: u.puzzleRating,
        puzzleSolved: u.puzzleSolved,
        puzzleFailed: u.puzzleFailed,
        wins: u.wins,
        losses: u.losses,
        draws: u.draws,
        gameCountBullet: u.gameCountBullet,
        gameCountBlitz: u.gameCountBlitz,
        gameCountRapid: u.gameCountRapid
      },
      recentGames
    });
  } catch (err: any) {
    next(err);
  }
});

const RATING_HISTORY_CATEGORIES = ["bullet", "blitz", "rapid", "puzzle"];
router.get("/rating-history", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const category = typeof req.query.category === "string" ? req.query.category : "all";
    const limit = Number.isFinite(Number(req.query.limit)) ? Number(req.query.limit) : 200;
    const cappedLimit = Math.min(Math.max(limit, 1), 1000);

    if (category === "all") {
      return res.json({ history: await ratingHistoryRepo.getAllHistory(req.user.id, cappedLimit) });
    }
    if (!RATING_HISTORY_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: "Kategori tidak dikenal." });
    }
    res.json({ history: { [category]: await ratingHistoryRepo.getHistory(req.user.id, category, cappedLimit) } });
  } catch (err: any) {
    next(err);
  }
});

const GAME_LIBRARY_CATEGORIES = ["all", "bullet", "blitz", "rapid", "bot"];
router.get("/games", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const q = req.query || {};
    const category = typeof q.category === "string" ? q.category : "all";
    const result = typeof q.result === "string" ? q.result : "all";
    const search = typeof q.search === "string" ? q.search.slice(0, 60) : "";
    const page = Math.max(1, parseInt(q.page, 10) || 1);
    const pageSize = Math.min(50, Math.max(5, parseInt(q.pageSize, 10) || 15));

    if (!GAME_LIBRARY_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: "Kategori tidak dikenal." });
    }
    if (!["all", "win", "loss", "draw"].includes(result)) {
      return res.status(400).json({ error: "Filter hasil tidak dikenal." });
    }

    const { rows, total } = await savedGamesRepo.listForUser(req.user.id, {
      category, result, search,
      limit: pageSize,
      offset: (page - 1) * pageSize
    });

    res.json({ games: rows, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) });
  } catch (err: any) {
    next(err);
  }
});

router.get("/games/:id", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    if (!/^\d{1,9}$/.test(req.params.id)) return res.status(400).json({ error: "ID game tidak valid." });
    const id = parseInt(req.params.id, 10);

    const game = await savedGamesRepo.getOwned(id, req.user.id);
    if (!game) return res.status(404).json({ error: "Game tidak ditemukan." });

    res.json({ game });
  } catch (err: any) {
    next(err);
  }
});

module.exports = router;
