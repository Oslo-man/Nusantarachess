"use strict";
const express = require("express");
const router = express.Router();

const db = require("../lib/db");
const requireAuth = require("../lib/require-auth");

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
const CATEGORY_USER_FIELD: Record<string, any> = {
  bullet: "eloBullet", blitz: "eloBlitz", rapid: "eloRapid", puzzle: "puzzleRating"
};

router.get("/", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const category = typeof req.query.category === "string" ? req.query.category : "blitz";
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

    let myRank = null;
    const myRow = ranked.find((r: any) => r.username === req.user.username);
    if (myRow) {
      myRank = myRow;
    } else {
      const myRating = req.user[CATEGORY_USER_FIELD[category]];
      const aboveResult = category === "puzzle"
        ? await db.query(
            `SELECT COUNT(*) AS n FROM users WHERE (puzzle_solved + puzzle_failed) > 0 AND puzzle_rating > $1`,
            [myRating]
          )
        : await db.query(
            `SELECT COUNT(*) AS n FROM users WHERE ${GAME_COUNT_COLUMN[category]} > 0 AND ${col} > $1`,
            [myRating]
          );
      const above = parseInt(aboveResult.rows[0].n, 10);
      myRank = { rank: above + 1, username: req.user.username, rating: myRating, gamesPlayed: null, outsideTop: true };
    }

    res.json({ category, leaderboard: ranked, myRank });
  } catch (err: any) {
    next(err);
  }
});

module.exports = router;
