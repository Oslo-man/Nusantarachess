#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const { Chess } = require("../../public/vendor/chess-engines/chess.min.js");

const LESSONS_PATH = path.join(__dirname, "..", "data-seed", "lessons.json");

function fail(lessonId: any, message: any) {
  errors.push("[" + lessonId + "] " + message);
}

const errors: any[] = [];
const warnings: any[] = [];

let data;
try {
  data = JSON.parse(fs.readFileSync(LESSONS_PATH, "utf8"));
} catch (e: any) {
  console.error("GAGAL membaca/mem-parse " + LESSONS_PATH + ":", e.message);
  process.exit(1);
}

const REQUIRED_LESSON_FIELDS = ["id", "category", "title", "summary", "learn", "fen", "fenCaption", "choices", "correctSan", "explanation"];
const VALID_CATEGORY_IDS = new Set((data.categories || []).map((c: any) => c.id));
const seenIds = new Set();

if (!Array.isArray(data.lessons) || data.lessons.length === 0) {
  console.error("data.lessons kosong atau bukan array — tidak ada yang bisa divalidasi.");
  process.exit(1);
}

data.lessons.forEach((lesson: any, idx: any) => {
  const label = lesson && lesson.id ? lesson.id : "lesson#" + idx + " (id hilang)";

  for (const field of REQUIRED_LESSON_FIELDS) {
    if (lesson[field] === undefined || lesson[field] === null || lesson[field] === "") {
      fail(label, "field wajib \"" + field + "\" hilang/kosong.");
    }
  }
  if (errors.some((e) => e.startsWith("[" + label + "]"))) return;

  if (seenIds.has(lesson.id)) {
    fail(label, "id duplikat — sudah dipakai lesson lain sebelumnya.");
  }
  seenIds.add(lesson.id);

  if (!VALID_CATEGORY_IDS.has(lesson.category)) {
    fail(label, "category \"" + lesson.category + "\" tidak terdaftar di data.categories.");
  }

  let game;
  try {
    game = new Chess();
    const loaded = game.load(lesson.fen, { skipValidation: false });
    if (loaded === false) {
      fail(label, "FEN tidak valid/ilegal: \"" + lesson.fen + "\"");
      return;
    }
  } catch (e: any) {
    fail(label, "FEN gagal dimuat (" + e.message + "): \"" + lesson.fen + "\"");
    return;
  }

  if (!Array.isArray(lesson.choices) || lesson.choices.length < 2) {
    fail(label, "choices harus array berisi minimal 2 opsi SAN.");
  } else if (new Set(lesson.choices).size !== lesson.choices.length) {
    fail(label, "choices mengandung duplikat: " + JSON.stringify(lesson.choices));
  }

  if (Array.isArray(lesson.choices) && !lesson.choices.includes(lesson.correctSan)) {
    fail(label, "correctSan \"" + lesson.correctSan + "\" tidak ada di dalam choices " + JSON.stringify(lesson.choices) + ".");
  }

  if (Array.isArray(lesson.choices)) {
    const legalSans = new Set(game.moves());
    for (const san of lesson.choices) {
      if (!legalSans.has(san)) {
        fail(label, "choice \"" + san + "\" TIDAK LEGAL di posisi FEN lesson ini. Langkah legal yang tersedia: " + [...legalSans].join(", "));
      }
    }
  }

  if (lesson.wrongFeedback && typeof lesson.wrongFeedback === "object") {
    for (const key of Object.keys(lesson.wrongFeedback)) {
      if (!lesson.choices.includes(key)) {
        warnings.push("[" + label + "] wrongFeedback punya key \"" + key + "\" yang tidak ada di choices — feedback ini tidak akan pernah tampil (kemungkinan typo).");
      }
    }
  }
});

if (warnings.length) {
  console.warn("=== PERINGATAN (tidak menggagalkan validasi, tapi layak dicek) ===");
  warnings.forEach((w) => console.warn("  " + w));
}

if (errors.length) {
  console.error("=== VALIDASI GAGAL (" + errors.length + " masalah) ===");
  errors.forEach((e) => console.error("  " + e));
  process.exit(1);
}

console.log("Semua " + data.lessons.length + " lesson valid (FEN legal, correctSan & choices dapat dimainkan, tidak ada id duplikat).");
process.exit(0);
