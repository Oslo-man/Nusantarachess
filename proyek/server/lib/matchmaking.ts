"use strict";

const BOT_FIRST_NAMES = [
  "Budi", "Andi", "Rizky", "Fajar", "Agus", "Dedi", "Hendra", "Bayu",
  "Reza", "Fadli", "Irfan", "Yoga", "Doni", "Arif", "Wahyu", "Taufik",
  "Rian", "Eko", "Joko", "Adi", "Fauzan", "Rendra", "Gilang", "Aji",
  "Panji", "Surya", "Dimas", "Fajri", "Yusuf", "Ridho"
];
const BOT_LAST_NAMES = [
  "Saputra", "Wijaya", "Kurniawan", "Pratama", "Setiawan", "Nugraha",
  "Hidayat", "Firmansyah", "Gunawan", "Susanto", "Permana", "Ramadhan",
  "Santoso", "Wibowo", "Purnomo", "Halim", "Kusuma", "Yulianto",
  "Hakim", "Maulana", "Iskandar", "Prasetyo", "Anggara", "Utomo",
  "Siregar", "Nasution"
];
const BOT_FEMALE_FIRST_NAMES = [
  "Siti", "Dewi", "Putri", "Ayu", "Rina", "Sari", "Wulan", "Indah",
  "Fitri", "Maya", "Citra", "Ratna", "Anisa", "Dian", "Rahma", "Salsa",
  "Nadia", "Kartika", "Lestari", "Mega"
];
const BOT_FEMALE_LAST_NAMES = [
  "Saputri", "Wijayanti", "Lestari", "Hidayati", "Kusuma", "Maharani",
  "Permata", "Rahayu", "Utami", "Wulandari", "Anggraini", "Puspita",
  "Safitri", "Handayani", "Ramadhani", "Fitriani"
];
const BOT_FLAGS = ["🇮🇩"];

// Elo 2501-2799: NM dibuat 2x lebih jarang dari CM (peluang NM = setengah peluang CM).
// Elo 2800-2899: NM 4% dan CM 2%. Elo 2900 ke atas: tidak ada NM/CM (tabel GM/IM kembali seperti semula).
const TITLE_TABLE = [
  { minElo: 3100, chances: [["GM", 0.80], ["IM", 0.19]] },
  { minElo: 3000, chances: [["GM", 0.70], ["IM", 0.27]] },
  { minElo: 2900, chances: [["IM", 0.40], ["GM", 0.50]] },
  { minElo: 2800, chances: [["FM", 0.35], ["IM", 0.25], ["WGM", 0.03], ["NM", 0.04], ["CM", 0.02]] },
  { minElo: 2700, chances: [["CM", 0.25], ["NM", 0.125], ["FM", 0.25], ["WGM", 0.05], ["WIM", 0.07]] },
  { minElo: 2501, chances: [["CM", 0.10], ["NM", 0.05], ["FM", 0.05], ["WCM", 0.10], ["WFM", 0.07], ["WIM", 0.04]] }
];

function pickTitleForElo(elo: any) {
  const row = TITLE_TABLE.find((r) => elo >= r.minElo);
  if (!row) return "";
  const roll = Math.random();
  let cumulative = 0;
  for (let i = 0; i < row.chances.length; i++) {
    cumulative += row.chances[i][1] as number;
    if (roll < cumulative) return row.chances[i][0];
  }
  return "";
}

function isWomenTitle(title: any) {
  return typeof title === "string" && title.charAt(0) === "W";
}

const BOT_AVATARS = ["🤖", "🎮", "♟️"];

function pickBotAvatar() {
  return BOT_AVATARS[randInt(0, BOT_AVATARS.length - 1)];
}

function randInt(min: any, max: any) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBotProfile(minElo: any, maxElo: any) {
  const elo = randInt(minElo, maxElo);
  const title = pickTitleForElo(elo);
  const women = isWomenTitle(title);
  const firsts = women ? BOT_FEMALE_FIRST_NAMES : BOT_FIRST_NAMES;
  const lasts = women ? BOT_FEMALE_LAST_NAMES : BOT_LAST_NAMES;
  const name = firsts[randInt(0, firsts.length - 1)] + " " + lasts[randInt(0, lasts.length - 1)];
  const flag = BOT_FLAGS[randInt(0, BOT_FLAGS.length - 1)];
  const avatar = pickBotAvatar();
  return { name, elo, flag, title, avatar, isSpecial: false };
}

const SPECIAL_CHARACTERS = [
  { name: "Magnus", country: "NO", elo: 3150, uciElo: 3150, title: "GM", avatarImage: "images/magnus.png", avatar: "🧑", isSpecial: true },
  { name: "Hikaru", country: "US", elo: 3100, uciElo: 3100, title: "GM", avatarImage: "images/hikaru.png", avatar: "🧑", isSpecial: true },
  { name: "RL_chess", country: "ID", elo: 2950, uciElo: 2950, title: "IM", avatarImage: "images/rl.png", avatar: "🤖", isSpecial: true },
  { name: "Witty_Alien", country: "BG", elo: 2750, uciElo: 2750, title: "CM", avatarImage: "images/witty.png", avatar: "🤖", isSpecial: true }
];

function flagFromCountryCode(code: any) {
  if (typeof code !== "string" || !/^[A-Z]{2}$/.test(code)) return "";
  const A = 0x1F1E6;
  return String.fromCodePoint(A + code.charCodeAt(0) - 65, A + code.charCodeAt(1) - 65);
}

const SPECIAL_CHARACTER_CHANCE_EACH = 0.075;

function maybeGetSpecialCharacter(minElo: any, maxElo: any) {
  const eligible = SPECIAL_CHARACTERS.filter((c) => c.elo >= minElo && c.elo <= maxElo);
  if (eligible.length === 0) return null;
  const slice = Math.floor(Math.random() / SPECIAL_CHARACTER_CHANCE_EACH);
  if (slice >= eligible.length) return null;
  const chosen = eligible[slice];
  return {
    name: chosen.name,
    elo: chosen.elo,
    uciElo: chosen.uciElo,
    country: chosen.country,
    flag: flagFromCountryCode(chosen.country),
    title: chosen.title,
    avatarImage: chosen.avatarImage,
    avatar: chosen.avatar,
    isSpecial: true
  };
}

const ELO_STEPS = [128, 64, 32, 16];

function getEloChangeAmount(gameCountBeforeThisGame: any) {
  const idx = Math.min(gameCountBeforeThisGame, ELO_STEPS.length - 1);
  return ELO_STEPS[idx];
}

function calculateEloChange(gameCountBeforeThisGame: any, result: any) {
  if (result === "draw") return 0;
  const amount = getEloChangeAmount(gameCountBeforeThisGame);
  return result === "win" ? amount : -amount;
}

const PUZZLE_K_FACTOR = 20;

function calculatePuzzleRatingChange(playerRating: any, puzzleRating: any, solvedFirstTry: any) {
  const expectedScore = 1 / (1 + Math.pow(10, (puzzleRating - playerRating) / 400));
  const actualScore = solvedFirstTry ? 1 : 0;
  const change = Math.round(PUZZLE_K_FACTOR * (actualScore - expectedScore));
  return change;
}

module.exports = {
  randInt,
  generateBotProfile,
  pickTitleForElo,
  maybeGetSpecialCharacter,
  SPECIAL_CHARACTERS,
  SPECIAL_CHARACTER_CHANCE_EACH,
  TITLE_TABLE,
  getEloChangeAmount,
  calculateEloChange,
  calculatePuzzleRatingChange,
  ELO_STEPS
};
