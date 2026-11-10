"use strict";
const db = require("./db");

async function record({ userId, category, rating }: any) {
  await db.query(
    `INSERT INTO rating_history (user_id, category, rating, recorded_at)
     VALUES ($1, $2, $3, $4)`,
    [userId, category, rating, Date.now()]
  );
}

async function getHistory(userId: any, category: any, limit: any) {
  const { rows } = await db.query(
    `SELECT rating, recorded_at AS "recordedAt"
     FROM rating_history
     WHERE user_id = $1 AND category = $2
     ORDER BY recorded_at DESC
     LIMIT $3`,
    [userId, category, limit || 200]
  );
  return rows.reverse();
}

async function getAllHistory(userId: any, limit: any) {
  const categories = ["bullet", "blitz", "rapid", "puzzle"];
  const result: Record<string, any> = {};
  for (const cat of categories) {
    result[cat] = await getHistory(userId, cat, limit);
  }
  return result;
}

module.exports = { record, getHistory, getAllHistory };
