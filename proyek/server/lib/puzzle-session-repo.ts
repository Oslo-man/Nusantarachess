"use strict";
const db = require("./db");
const crypto = require("crypto");

function newSessionId() {
  return crypto.randomUUID();
}

async function createSession({ userId, puzzleId, isDaily }: any) {
  const id = newSessionId();
  const now = Date.now();
  await db.query(
    `INSERT INTO puzzle_sessions (id, user_id, puzzle_id, is_daily, move_index, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, 1, 'active', $5, $6)`,
    [id, userId, puzzleId, isDaily ? 1 : 0, now, now]
  );
  return getSession(id);
}

async function getSession(id: any) {
  const { rows } = await db.query(`SELECT * FROM puzzle_sessions WHERE id = $1`, [id]);
  return rows[0] || null;
}

async function getOwnedSession(id: any, userId: any) {
  const s = await getSession(id);
  if (!s || s.user_id !== userId) return null;
  return s;
}

async function advanceMove(id: any, newMoveIndex: any, expectedMoveIndex: any) {
  const { rowCount } = await db.query(
    `UPDATE puzzle_sessions SET move_index = $1, updated_at = $2
     WHERE id = $3 AND status = 'active' AND move_index = $4`,
    [newMoveIndex, Date.now(), id, expectedMoveIndex]
  );
  return rowCount === 1;
}

async function finishSession(id: any, status: any) {
  const { rowCount } = await db.query(
    `UPDATE puzzle_sessions SET status = $1, updated_at = $2 WHERE id = $3 AND status = 'active'`,
    [status, Date.now(), id]
  );
  return rowCount === 1;
}
async function markWrongAttempt(id: any) {
  await db.query(
    `UPDATE puzzle_sessions SET had_wrong_attempt = 1, updated_at = $1 WHERE id = $2`,
    [Date.now(), id]
  );
}

const RECENT_LIMIT = 500;
async function getRecentPuzzleIds(userId: any) {
  const { rows } = await db.query(
    `SELECT puzzle_id FROM puzzle_sessions
     WHERE user_id = $1 AND is_daily = 0
     ORDER BY created_at DESC LIMIT $2`,
    [userId, RECENT_LIMIT]
  );
  return rows.map((r: any) => r.puzzle_id);
}

module.exports = {
  createSession,
  getSession,
  getOwnedSession,
  advanceMove,
  finishSession,
  markWrongAttempt,
  getRecentPuzzleIds
};
