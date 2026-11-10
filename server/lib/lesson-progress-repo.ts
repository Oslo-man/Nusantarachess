"use strict";
const db = require("./db");

async function markCompleted(userId: any, lessonId: any) {
  await db.query(
    `INSERT INTO lesson_progress (user_id, lesson_id, completed_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, lesson_id) DO NOTHING`,
    [userId, lessonId, Date.now()]
  );
}

async function getCompletedIds(userId: any) {
  const { rows } = await db.query(
    `SELECT lesson_id FROM lesson_progress WHERE user_id = $1`,
    [userId]
  );
  return rows.map((r: any) => r.lesson_id);
}

module.exports = { markCompleted, getCompletedIds };
