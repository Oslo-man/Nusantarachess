"use strict";
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const requireAuth = require("../lib/require-auth");
const lessonProgressRepo = require("../lib/lesson-progress-repo");

const LESSONS_PATH = path.join(__dirname, "..", "data-seed", "lessons.json");

let LESSON_DATA: { categories: any[]; lessons: any[] } = { categories: [], lessons: [] };
try {
  const raw = fs.readFileSync(LESSONS_PATH, "utf8");
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed.categories) && Array.isArray(parsed.lessons)) {
    LESSON_DATA = parsed;
  } else {
    console.error("[lessons route] " + LESSONS_PATH + " ada tapi strukturnya tidak sesuai (categories/lessons harus array).");
  }
} catch (e: any) {
  console.error("[lessons route] Gagal memuat " + LESSONS_PATH + ":", e.message);
}

const VALID_LESSON_IDS = new Set(LESSON_DATA.lessons.map((l) => l.id));

router.get("/definitions", (req: SrvReq, res: SrvRes) => {
  res.json(LESSON_DATA);
});

router.get("/progress", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const completedIds = await lessonProgressRepo.getCompletedIds(req.user.id);
    res.json({ completedIds });
  } catch (err: any) {
    next(err);
  }
});

router.post("/:id/complete", requireAuth, async (req: SrvReq, res: SrvRes, next: SrvNext) => {
  try {
    const lessonId = req.params.id;
    if (!VALID_LESSON_IDS.has(lessonId)) {
      return res.status(400).json({ error: "Lesson id tidak dikenal." });
    }
    await lessonProgressRepo.markCompleted(req.user.id, lessonId);
    res.json({ ok: true, lessonId });
  } catch (err: any) {
    next(err);
  }
});

module.exports = router;
