"use strict";
const db = require("./db");

const PUBLIC_FIELDS = `
  id, username, level_chosen AS "levelChosen", profile_photo AS "profilePhoto",
  elo_bullet AS "eloBullet", elo_blitz AS "eloBlitz", elo_rapid AS "eloRapid",
  game_count_bullet AS "gameCountBullet", game_count_blitz AS "gameCountBlitz",
  game_count_rapid AS "gameCountRapid",
  wins, losses, draws,
  puzzle_rating AS "puzzleRating", puzzle_solved AS "puzzleSolved", puzzle_failed AS "puzzleFailed",
  is_admin_unlocked AS "isAdminUnlocked", elo_protected AS "eloProtected",
  custom_opponent AS "customOpponent",
  bot_avatar_overrides AS "botAvatarOverrides",
  is_guest AS "isGuest",
  country,
  created_at AS "createdAt"
`;

async function findByUsername(username: any) {
  const { rows } = await db.query(
    `SELECT ${PUBLIC_FIELDS}, pass_hash AS "passHash" FROM users WHERE username = $1`,
    [username]
  );
  return rows[0] || null;
}

async function findById(id: any) {
  const { rows } = await db.query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = $1`, [id]);
  return rows[0] || null;
}

let warnedMissingRevokedTable = false;
async function findAuthById(id: any, tokenHash: any) {
  try {
    await db.ensureSchema();
    const { rows } = await db.query(
      `SELECT ${PUBLIC_FIELDS},
              EXISTS (SELECT 1 FROM revoked_tokens WHERE token_hash = $2) AS "revoked"
       FROM users WHERE id = $1`,
      [id, tokenHash]
    );
    return rows[0] || null;
  } catch (err: any) {
    if (err && err.code === "42P01") {
      if (!warnedMissingRevokedTable) {
        warnedMissingRevokedTable = true;
        console.error("[auth] Tabel revoked_tokens belum ada - pencabutan token belum aktif sampai skema dibuat.");
      }
      const user = await findById(id);
      return user ? Object.assign(user, { revoked: false }) : null;
    }
    throw err;
  }
}

async function revokeToken(tokenHash: any, expiresAtMs: any) {
  await db.ensureSchema();
  await db.query(
    `INSERT INTO revoked_tokens (token_hash, expires_at) VALUES ($1, $2)
     ON CONFLICT (token_hash) DO NOTHING`,
    [tokenHash, expiresAtMs]
  );
  if (Math.random() < 0.1) {
    db.query("DELETE FROM revoked_tokens WHERE expires_at < $1", [Date.now()]).catch(() => {});
  }
}

async function usernameTaken(username: any) {
  const { rows } = await db.query(`SELECT 1 FROM users WHERE username = $1`, [username]);
  return rows.length > 0;
}

async function createUser(username: any, passHash: any, country: any) {
  const { rows } = await db.query(
    `INSERT INTO users (username, pass_hash, country, created_at)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [username, passHash, country || "", Date.now()]
  );
  return findById(rows[0].id);
}

async function createGuestUser(username: any, passHash: any) {
  const { rows } = await db.query(
    `INSERT INTO users (username, pass_hash, is_guest, level_chosen, created_at)
     VALUES ($1, $2, 1, 1, $3)
     RETURNING id`,
    [username, passHash, Date.now()]
  );
  return findById(rows[0].id);
}

const PATCHABLE_COLUMNS: Record<string, any> = {
  levelChosen: "level_chosen",
  profilePhoto: "profile_photo",
  eloBullet: "elo_bullet",
  eloBlitz: "elo_blitz",
  eloRapid: "elo_rapid",
  gameCountBullet: "game_count_bullet",
  gameCountBlitz: "game_count_blitz",
  gameCountRapid: "game_count_rapid",
  wins: "wins",
  losses: "losses",
  draws: "draws",
  puzzleRating: "puzzle_rating",
  puzzleSolved: "puzzle_solved",
  puzzleFailed: "puzzle_failed"
};

async function updateUser(id: any, patch: any) {
  const sets = [];
  const values = [];
  let i = 1;
  for (const key of Object.keys(patch)) {
    const col = PATCHABLE_COLUMNS[key];
    if (!col) continue;
    let v = patch[key];
    if (typeof v === "boolean") v = v ? 1 : 0;
    sets.push(`${col} = $${i++}`);
    values.push(v);
  }
  if (sets.length === 0) return findById(id);
  values.push(id);
  await db.query(`UPDATE users SET ${sets.join(", ")} WHERE id = $${i}`, values);
  return findById(id);
}

async function updateUsername(id: any, username: any) {
  await db.query(`UPDATE users SET username = $1 WHERE id = $2`, [username, id]);
  return findById(id);
}

const ADMIN_PATCHABLE_COLUMNS: Record<string, any> = {
  isAdminUnlocked: "is_admin_unlocked",
  eloProtected: "elo_protected",
  eloBullet: "elo_bullet",
  eloBlitz: "elo_blitz",
  eloRapid: "elo_rapid",
  customOpponent: "custom_opponent",
  botAvatarOverrides: "bot_avatar_overrides"
};

async function adminUpdateUser(id: any, patch: any) {
  const sets = [];
  const values = [];
  let i = 1;
  for (const key of Object.keys(patch)) {
    const col = ADMIN_PATCHABLE_COLUMNS[key];
    if (!col) continue;
    let v = patch[key];
    if (typeof v === "boolean") v = v ? 1 : 0;
    sets.push(`${col} = $${i++}`);
    values.push(v);
  }
  if (sets.length === 0) return findById(id);
  values.push(id);
  await db.query(`UPDATE users SET ${sets.join(", ")} WHERE id = $${i}`, values);
  return findById(id);
}

module.exports = {
  findByUsername,
  findById,
  findAuthById,
  revokeToken,
  usernameTaken,
  createUser,
  createGuestUser,
  updateUser,
  updateUsername,
  adminUpdateUser
};
