"use strict";
const fs = require("fs");
const path = require("path");

const MAIN_PATH = path.join(__dirname, "..", "data-seed", "puzzles.json");
const DAILY_PATH = path.join(__dirname, "..", "data-seed", "puzzles-daily.json");

function loadJson(p: any, label: any) {
  try {
    const raw = fs.readFileSync(p, "utf8");
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) throw new Error("bukan array");
    return arr;
  } catch (e: any) {
    console.error("[puzzles-repo] Gagal memuat " + label + " dari " + p + ":", e.message);
    return [];
  }
}

const MAIN_PUZZLES = loadJson(MAIN_PATH, "puzzles.json");
const DAILY_PUZZLES = loadJson(DAILY_PATH, "puzzles-daily.json");

const byId = new Map();
for (const p of MAIN_PUZZLES) byId.set(p.id, p);
for (const p of DAILY_PUZZLES) if (!byId.has(p.id)) byId.set(p.id, p);

console.log("[puzzles-repo] Dimuat " + MAIN_PUZZLES.length + " puzzle utama + " + DAILY_PUZZLES.length + " puzzle harian.");

function getById(id: any) {
  return byId.get(id) || null;
}

function countPieces(fen: any) {
  const board = fen.split(" ")[0];
  return board.replace(/[^a-zA-Z]/g, "").length;
}

const THEME_MAPPINGS: Record<string, any> = {
  rookKnightMate: ["anastasiaMate", "arabianMate", "cornerMate", "hookMate", "vukovicMate"],
  rookBishopMate: ["morphysMate", "operaMate", "pillsburysMate"],
  queenRookMate: ["triangleMate", "killBoxMate"],
  queenBishopMate: ["balestraMate"],
  doubleBishopMate: ["bodenMate", "doubleBishopMate"],
  doubleRookMate: ["blindSwineMate"],
  queenMate: ["dovetailMate"],
  backRankMate: ["backRankMate"],
  smotheredMate: ["smotheredMate"]
};

const STUFEN_THEMES: Record<string, any> = {
  stufe1: ["mateIn1", "hangingPiece", "defensiveMove", "fork"],
  stufe2: ["mateIn2", "pin", "discoveredAttack", "capturingDefender", "intermezzo", "pawnEndgame"],
  stufe3: ["doubleCheck", "discoveredCheck", "advancedPawn", "kingsideAttack", "xRayAttack", "underPromotion"],
  stufe4: ["mateIn3", "interference", "attraction", "clearance", "exposedKing"],
  stufe5: ["mateIn4", "mateIn5", "zugzwang", "trappedPiece", "queensideAttack", "veryLong", "rookEndgame", "pawnEndgame"]
};

const STUFEN_RATINGS: Record<string, any> = {
  stufe1: [400, 900],
  stufe2: [900, 1400],
  stufe3: [1400, 1900],
  stufe4: [1900, 2400],
  stufe5: [2400, 2900]
};

function findCandidate(filters: any) {
  const {
    themeFilter, themeMatchAll, colorChoice,
    pieceCountMin, pieceCountMax,
    targetRating, ratingIncrease,
    excludeIds
  } = filters;

  const excludeSet = new Set(excludeIds || []);
  const selectedThemes = themeFilter || [];

  let available = MAIN_PUZZLES;

  const stufenLevels = selectedThemes.filter((t: any) => t.startsWith("stufe"));
  if (stufenLevels.length > 0) {
    const highestLevel = stufenLevels.slice().sort().pop();
    const newThemes = STUFEN_THEMES[highestLevel] || [];
    const oldThemes = [];
    for (const level of ["stufe1", "stufe2", "stufe3", "stufe4", "stufe5"]) {
      if (level === highestLevel) break;
      oldThemes.push(...(STUFEN_THEMES[level] || []));
    }
    const [minRating, maxRating] = STUFEN_RATINGS[highestLevel] || [0, 4000];
    const useNewThemes = oldThemes.length === 0 || Math.random() < 0.5;
    const themesToUse = useNewThemes ? newThemes : oldThemes;
    const themesToSearch = themesToUse.flatMap((theme: any) => THEME_MAPPINGS[theme] || [theme]);

    available = MAIN_PUZZLES.filter(p => {
      const rating = p.rating;
      const themes = p.themes.toLowerCase();
      if (rating < minRating || rating > maxRating) return false;
      return themesToSearch.some((th: any) => themes.includes(th.toLowerCase()));
    });

    if (available.length === 0) {
      const allStufeThemes = [...newThemes, ...oldThemes];
      const allThemesToSearch = allStufeThemes.flatMap(theme => THEME_MAPPINGS[theme] || [theme]);
      available = MAIN_PUZZLES.filter(p => {
        const rating = p.rating;
        const themes = p.themes.toLowerCase();
        if (rating < minRating || rating > maxRating) return false;
        return allThemesToSearch.some(th => themes.includes(th.toLowerCase()));
      });
    }
  } else if (selectedThemes.length > 0) {
    available = MAIN_PUZZLES.filter(p => {
      const themes = p.themes.toLowerCase();
      if (themeMatchAll) {
        return selectedThemes.every((theme: any) => {
          const expanded = THEME_MAPPINGS[theme] || [theme];
          return expanded.some((th: any) => themes.includes(th.toLowerCase()));
        });
      }
      const allThemesToSearch = selectedThemes.flatMap((theme: any) => THEME_MAPPINGS[theme] || [theme]);
      return allThemesToSearch.some((th: any) => themes.includes(th.toLowerCase()));
    });
  }

  if (colorChoice === "white" || colorChoice === "black") {
    const fenTurn = colorChoice === "white" ? " b " : " w ";
    available = available.filter(p => p.fen.includes(fenTurn));
  }

  if (pieceCountMin > 3 || pieceCountMax < 32) {
    available = available.filter(p => {
      const count = countPieces(p.fen);
      return count >= pieceCountMin && count <= pieceCountMax;
    });
  }

  if (available.length === 0) {
    return { error: "no-match-for-filter" };
  }

  const halfIncrease = Math.max(ratingIncrease / 2, 10);

  let candidates = available.filter(p =>
    p.rating >= targetRating - halfIncrease &&
    p.rating <= targetRating + halfIncrease &&
    !excludeSet.has(p.id)
  );

  if (candidates.length === 0) {
    candidates = available
      .filter(p => p.rating > targetRating + halfIncrease && !excludeSet.has(p.id))
      .sort((a, b) => a.rating - b.rating)
      .slice(0, 20);
  }

  if (candidates.length === 0 && stufenLevels.length > 0) {
    const highestLevel = stufenLevels.slice().sort().pop();
    const [minRating, maxRating] = STUFEN_RATINGS[highestLevel] || [0, 4000];
    const midRating = Math.floor((minRating + maxRating) / 2);
    candidates = available.filter(p => p.rating >= midRating && !excludeSet.has(p.id));
  }

  if (candidates.length === 0) {
    const allUnused = available.filter(p => !excludeSet.has(p.id));
    if (allUnused.length === 0) {
      return { error: "all-played" };
    }
    candidates = allUnused;
  }

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  return { puzzle: chosen };
}

function getDailyPuzzle() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 0));
  const diff = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  const seed = now.getUTCFullYear() * 1000 + dayOfYear;
  return DAILY_PUZZLES[seed % DAILY_PUZZLES.length];
}

module.exports = {
  getById,
  findCandidate,
  getDailyPuzzle,
  countPieces,
  MAIN_PUZZLES_COUNT: MAIN_PUZZLES.length,
  DAILY_PUZZLES_COUNT: DAILY_PUZZLES.length
};
