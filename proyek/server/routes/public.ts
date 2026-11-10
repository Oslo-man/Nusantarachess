"use strict";
const express = require("express");
const router = express.Router();

const db = require("../lib/db");
const savedGamesRepo = require("../lib/saved-games-repo");
const security = require("../lib/security");

const publicLimiter = security.limit({
  name: "public", windowMs: 60 * 1000, shared: false,
  rulesFor: (req: SrvReq) => [{ key: "ip:" + security.clientIp(req), max: 120 }]
});
router.use(publicLimiter);

function safePhoto(v: any) {
  return security.isSafeImageDataUrl(v, 100000) ? v : "";
}

const USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/;

const CATEGORY_COLUMN: Record<string, any> = {
  bullet: "elo_bullet",
  blitz: "elo_blitz",
  rapid: "elo_rapid",
  puzzle: "puzzle_rating"
};
const GAME_COUNT_COLUMN: Record<string, any> = {
  bullet: "game_count_bullet",
  blitz: "game_count_blitz",
  rapid: "game_count_rapid",
  puzzle: null
};

router.get("/leaderboard", async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const category = typeof req.query.category === "string" ? req.query.category : "bullet";
    const col = CATEGORY_COLUMN[category];
    if (!col) return res.status(400).json({ error: "Kategori tidak dikenal." });

    const limit = Math.min(100, Math.max(5, parseInt(req.query.limit, 10) || 50));

    let rows;
    if (category === "puzzle") {
      const result = await db.query(
        `SELECT username, puzzle_rating AS rating, puzzle_solved AS "gamesPlayed"
         FROM users
         WHERE (puzzle_solved + puzzle_failed) > 0
         ORDER BY puzzle_rating DESC
         LIMIT $1`,
        [limit]
      );
      rows = result.rows;
    } else {
      const gcCol = GAME_COUNT_COLUMN[category];
      const result = await db.query(
        `SELECT username, ${col} AS rating, ${gcCol} AS "gamesPlayed"
         FROM users
         WHERE ${gcCol} > 0
         ORDER BY ${col} DESC
         LIMIT $1`,
        [limit]
      );
      rows = result.rows;
    }

    const ranked = rows.map((r: any, i: any) => ({ rank: i + 1, ...r }));
    res.json({ category, leaderboard: ranked });
  } catch (err: any) {
    next(err);
  }
});

router.get("/search-players", async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    if (q.length < 2) return res.json({ results: [] });
    if (q.length > 20) return res.json({ results: [] });

    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 8));

    const { rows } = await db.query(
      `SELECT username, elo_blitz AS "eloBlitz"
       FROM users
       WHERE is_guest = 0 AND username ILIKE $1
       ORDER BY username ASC
       LIMIT $2`,
      [security.escapeLike(q) + "%", limit]
    );
    res.json({ results: rows });
  } catch (err: any) {
    next(err);
  }
});

router.get("/profile/:username", async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const username = req.params.username;
    if (!USERNAME_RE.test(username)) return res.status(404).json({ error: "Pemain tidak ditemukan." });

    const { rows } = await db.query(
      `SELECT id, username, profile_photo AS "profilePhoto", created_at AS "createdAt",
              elo_bullet AS "eloBullet", elo_blitz AS "eloBlitz", elo_rapid AS "eloRapid",
              puzzle_rating AS "puzzleRating", puzzle_solved AS "puzzleSolved", puzzle_failed AS "puzzleFailed",
              wins, losses, draws, is_guest AS "isGuest"
       FROM users
       WHERE username = $1`,
      [username]
    );
    const user = rows[0];
    if (!user || user.isGuest) return res.status(404).json({ error: "Pemain tidak ditemukan." });
    delete user.isGuest;
    user.profilePhoto = safePhoto(user.profilePhoto);

    const { rows: recentGames, total: totalGames } = await savedGamesRepo.listForUser(user.id, { limit: 5, offset: 0 });
    delete user.id;

    res.json({ user, recentGames, totalGames });
  } catch (err: any) {
    next(err);
  }
});

router.get("/profile/:username/games", async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const username = req.params.username;
    if (!USERNAME_RE.test(username)) return res.status(404).json({ error: "Pemain tidak ditemukan." });

    const { rows } = await db.query(`SELECT id, is_guest AS "isGuest" FROM users WHERE username = $1`, [username]);
    const user = rows[0];
    if (!user || user.isGuest) return res.status(404).json({ error: "Pemain tidak ditemukan." });

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const pageSize = Math.min(50, Math.max(5, parseInt(req.query.pageSize, 10) || 20));
    const { rows: games, total } = await savedGamesRepo.listForUser(user.id, { limit: pageSize, offset: (page - 1) * pageSize });
    res.json({
      games: games.map((g: any) => ({ id: g.id, opponentName: g.opponentName, opponentElo: g.opponentElo, category: g.category, result: g.result, eloChange: g.eloChange, playedAt: g.playedAt })),
      total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize))
    });
  } catch (err: any) {
    next(err);
  }
});

router.get("/games/:id", async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    if (!/^\d{1,9}$/.test(req.params.id)) return res.status(400).json({ error: "ID game tidak valid." });
    const game = await savedGamesRepo.getPublic(parseInt(req.params.id, 10));
    if (!game) return res.status(404).json({ error: "Game tidak ditemukan." });
    res.json({ game });
  } catch (err: any) {
    next(err);
  }
});

module.exports = router;
