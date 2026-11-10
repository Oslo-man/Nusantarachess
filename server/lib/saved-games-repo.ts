"use strict";
const db = require("./db");
const { escapeLike, pgnTag } = require("./security");

function buildPgn({ whiteName, blackName, resultTag, sanHistory, whiteElo, blackElo }: any) {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, ".");
  let pgn = "";
  pgn += '[Event "NusantaraChess"]\n';
  pgn += '[Site "NusantaraChess"]\n';
  pgn += '[Date "' + dateStr + '"]\n';
  pgn += '[White "' + pgnTag(whiteName) + '"]\n';
  pgn += '[Black "' + pgnTag(blackName) + '"]\n';
  pgn += '[Result "' + resultTag + '"]\n';
  if (Number.isFinite(whiteElo)) pgn += '[WhiteElo "' + whiteElo + '"]\n';
  if (Number.isFinite(blackElo)) pgn += '[BlackElo "' + blackElo + '"]\n';
  pgn += "\n";

  const sans = sanHistory || [];
  let moveText = "";
  for (let i = 0; i < sans.length; i++) {
    if (i % 2 === 0) {
      moveText += (Math.floor(i / 2) + 1) + ". " + sans[i] + " ";
    } else {
      moveText += sans[i] + " ";
    }
  }
  pgn += moveText.trim() + " " + resultTag;
  return pgn;
}

async function create({ userId, matchId, opponentName, opponentElo, category, result, eloChange, eloBefore, eloAfter, pgn }: any) {
  const { rows } = await db.query(
    `INSERT INTO saved_games (
      user_id, match_id, opponent_name, opponent_elo, category,
      result, elo_change, elo_before, elo_after, pgn, played_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING id`,
    [userId, matchId, opponentName, opponentElo, category, result, eloChange, eloBefore, eloAfter, pgn, Date.now()]
  );
  return rows[0].id;
}

async function listForUser(userId: any, { category, result, search, limit, offset }: any = {}) {
  const clauses = ["user_id = $1"];
  const params = [userId];
  let i = 2;

  if (category && category !== "all") {
    clauses.push(`category = $${i++}`);
    params.push(category);
  }
  if (result && result !== "all") {
    clauses.push(`result = $${i++}`);
    params.push(result);
  }
  if (search) {
    clauses.push(`opponent_name LIKE $${i++}`);
    params.push("%" + escapeLike(search) + "%");
  }

  const where = clauses.join(" AND ");

  const rowsParams = params.slice();
  const limitIdx = i++;
  const offsetIdx = i++;
  rowsParams.push(limit || 20, offset || 0);

  const { rows } = await db.query(
    `SELECT id, match_id AS "matchId", opponent_name AS "opponentName", opponent_elo AS "opponentElo",
            category, result, elo_change AS "eloChange", elo_before AS "eloBefore", elo_after AS "eloAfter",
            played_at AS "playedAt"
     FROM saved_games
     WHERE ${where}
     ORDER BY played_at DESC
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    rowsParams
  );

  const totalResult = await db.query(`SELECT COUNT(*) AS n FROM saved_games WHERE ${where}`, params);
  return { rows, total: parseInt(totalResult.rows[0].n, 10) };
}

async function getOwned(id: any, userId: any) {
  const { rows } = await db.query(
    `SELECT id, match_id AS "matchId", opponent_name AS "opponentName", opponent_elo AS "opponentElo",
            category, result, elo_change AS "eloChange", elo_before AS "eloBefore", elo_after AS "eloAfter",
            pgn, played_at AS "playedAt"
     FROM saved_games WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return rows[0] || null;
}

async function getPublic(id: any) {
  const { rows } = await db.query(
    `SELECT g.id, g.opponent_name AS "opponentName", g.opponent_elo AS "opponentElo",
            g.category, g.result, g.elo_change AS "eloChange", g.pgn, g.played_at AS "playedAt"
     FROM saved_games g JOIN users u ON u.id = g.user_id
     WHERE g.id = $1 AND u.is_guest = 0`,
    [id]
  );
  return rows[0] || null;
}

module.exports = { create, listForUser, getOwned, getPublic, buildPgn };
