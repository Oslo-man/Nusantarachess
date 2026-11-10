"use strict";
const db = require("./db");
const crypto = require("crypto");

function newMatchId() {
  return crypto.randomUUID();
}

async function createMatch({ userId, category, playerColor, bot, fen, playerMs, botMs, timeBase = null, timeInc = null }: any) {
  const id = newMatchId();
  const now = Date.now();
  const plySnapshots = JSON.stringify([fen]);
  await db.query(
    `INSERT INTO matches (
      id, user_id, category, player_color, bot_name, bot_elo, bot_flag,
      bot_title, bot_avatar, bot_avatar_image, fen, status, player_ms, bot_ms,
      last_move_at, san_history, ply_snapshots, last_move_squares_per_ply, created_at,
      time_base, time_inc
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'active', $12, $13, $14, '[]', $15, '[]', $16, $17, $18)`,
    [id, userId, category, playerColor, bot.name, bot.elo, bot.flag,
     bot.title || '', bot.avatar || '🤖', bot.avatarImage || '', fen, playerMs, botMs, now, plySnapshots, now, timeBase, timeInc]
  );
  return getMatch(id);
}

async function getMatch(id: any) {
  const { rows } = await db.query(`SELECT * FROM matches WHERE id = $1`, [id]);
  return rows[0] || null;
}

async function getOwnedMatch(id: any, userId: any) {
  const m = await getMatch(id);
  if (!m || m.user_id !== userId) return null;
  return m;
}

async function updateAfterMove({ id, userId, fen, playerMs, botMs, sanHistory, plySnapshots, lastMoveSquaresPerPly, expectedLastMoveAt, expectedFen }: any) {
  const { rowCount } = await db.query(
    `UPDATE matches
     SET fen = $1, player_ms = $2, bot_ms = $3, san_history = $4,
         ply_snapshots = $5, last_move_squares_per_ply = $6, last_move_at = $7
     WHERE id = $8 AND user_id = $9 AND status = 'active' AND last_move_at = $10 AND fen = $11`,
    [fen, playerMs, botMs, JSON.stringify(sanHistory),
     JSON.stringify(plySnapshots), JSON.stringify(lastMoveSquaresPerPly), Date.now(), id, userId, expectedLastMoveAt, expectedFen]
  );
  if (rowCount !== 1) return null;
  return getMatch(id);
}

async function finishMatch({ id, userId, result, resultReason }: any) {
  const { rowCount } = await db.query(
    `UPDATE matches SET status = 'finished', result = $1, result_reason = $2
     WHERE id = $3 AND user_id = $4 AND status = 'active'`,
    [result, resultReason, id, userId]
  );
  if (rowCount !== 1) return null;
  return getMatch(id);
}

async function abortMatch(id: any, userId: any) {
  const { rowCount } = await db.query(
    `UPDATE matches SET status = 'aborted' WHERE id = $1 AND user_id = $2 AND status = 'active'`,
    [id, userId]
  );
  return rowCount === 1;
}

async function deleteInactiveMatch(id: any, userId: any) {
  const { rowCount } = await db.query(
    `DELETE FROM matches WHERE id = $1 AND user_id = $2 AND status <> 'active'`,
    [id, userId]
  );
  return rowCount === 1;
}

async function findActiveMatchForUser(userId: any) {
  const { rows } = await db.query(
    `SELECT * FROM matches WHERE user_id = $1 AND status = 'active' LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

module.exports = {
  createMatch,
  getMatch,
  getOwnedMatch,
  updateAfterMove,
  finishMatch,
  abortMatch,
  deleteInactiveMatch,
  findActiveMatchForUser
};
