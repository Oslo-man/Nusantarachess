"use strict";
const db = require("./db");
const crypto = require("crypto");

function newPracticeId() {
  return crypto.randomUUID();
}

async function createPracticeMatch({ userId, character, playerColor, fen, mode = "friendly", engineLevel = 3, startFen = "" }: any) {
  const id = newPracticeId();
  const now = Date.now();
  await db.query(
    `INSERT INTO practice_matches (
      id, user_id, character, player_color, fen, status, san_history, created_at, updated_at,
      mode, engine_level, start_fen, uci_history
    ) VALUES ($1, $2, $3, $4, $5, 'active', '[]', $6, $7, $8, $9, $10, '[]')`,
    [id, userId, character, playerColor, fen, now, now, mode, engineLevel, startFen]
  );
  return getPracticeMatch(id);
}

async function getPracticeMatch(id: any) {
  const { rows } = await db.query(`SELECT * FROM practice_matches WHERE id = $1`, [id]);
  return rows[0] || null;
}

async function getOwnedPracticeMatch(id: any, userId: any) {
  const m = await getPracticeMatch(id);
  if (!m || m.user_id !== userId) return null;
  return m;
}

async function updateAfterMove({ id, userId, fen, sanHistory, uciHistory, expectedFen }: any) {
  const { rowCount } = await db.query(
    `UPDATE practice_matches
     SET fen = $1, san_history = $2, uci_history = $3, updated_at = $4
     WHERE id = $5 AND user_id = $6 AND status = 'active' AND fen = $7`,
    [fen, JSON.stringify(sanHistory), JSON.stringify(uciHistory), Date.now(), id, userId, expectedFen]
  );
  if (rowCount !== 1) return null;
  return getPracticeMatch(id);
}

async function finishPracticeMatch({ id, userId, result, resultReason }: any) {
  const { rowCount } = await db.query(
    `UPDATE practice_matches SET status = 'finished', result = $1, result_reason = $2, updated_at = $3
     WHERE id = $4 AND user_id = $5 AND status = 'active'`,
    [result, resultReason, Date.now(), id, userId]
  );
  if (rowCount !== 1) return null;
  return getPracticeMatch(id);
}

async function findActivePracticeForUser(userId: any) {
  const { rows } = await db.query(
    `SELECT * FROM practice_matches WHERE user_id = $1 AND status = 'active' LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

module.exports = {
  createPracticeMatch,
  getPracticeMatch,
  getOwnedPracticeMatch,
  updateAfterMove,
  finishPracticeMatch,
  findActivePracticeForUser
};
