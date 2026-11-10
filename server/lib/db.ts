"use strict";
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "[db] Variabel lingkungan DATABASE_URL belum diisi. " +
    "Salin server/.env.example ke server/.env dan isi dengan connection " +
    "string PostgreSQL (mis. dari Neon: https://neon.tech), lalu pastikan " +
    "dotenv sudah dimuat (lihat server/index.js) sebelum server dijalankan."
  );
}

const isProduction = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
const verifyTls = process.env.DB_SSL_INSECURE === "1"
  ? false
  : (isProduction || process.env.DB_SSL_STRICT === "1");
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: verifyTls }
});

pool.on("error", (err: any) => {
  console.error("[db] Kesalahan tak terduga pada koneksi idle di pool:", err.message);
});

async function query(text: any, params: any) {
  return pool.query(text, params);
}

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id                SERIAL PRIMARY KEY,
  username          TEXT UNIQUE NOT NULL,
  pass_hash         TEXT NOT NULL,
  level_chosen      INTEGER NOT NULL DEFAULT 0,
  profile_photo     TEXT NOT NULL DEFAULT '',
  elo_bullet        INTEGER NOT NULL DEFAULT 1320,
  elo_blitz         INTEGER NOT NULL DEFAULT 1320,
  elo_rapid         INTEGER NOT NULL DEFAULT 1320,
  game_count_bullet INTEGER NOT NULL DEFAULT 0,
  game_count_blitz  INTEGER NOT NULL DEFAULT 0,
  game_count_rapid  INTEGER NOT NULL DEFAULT 0,
  wins              INTEGER NOT NULL DEFAULT 0,
  losses            INTEGER NOT NULL DEFAULT 0,
  draws             INTEGER NOT NULL DEFAULT 0,
  puzzle_rating     INTEGER NOT NULL DEFAULT 1400,
  puzzle_solved     INTEGER NOT NULL DEFAULT 0,
  puzzle_failed     INTEGER NOT NULL DEFAULT 0,
  is_admin_unlocked INTEGER NOT NULL DEFAULT 0, -- 0/1: pernah verifikasi kode "akuadmin" (revisi #6)
  elo_protected     INTEGER NOT NULL DEFAULT 0, -- 0/1: Elo tidak turun saat kalah, fitur admin (revisi #6)
  custom_opponent   TEXT NOT NULL DEFAULT '', -- JSON {name,elo,title,avatar} atau '' (fitur admin, revisi #6)
  bot_avatar_overrides TEXT NOT NULL DEFAULT '{}', -- JSON {namaBot: dataUriFoto} - foto profil kustom per-bot/lawan (fitur admin)
  country           TEXT NOT NULL DEFAULT '', -- kode negara ISO 3166-1 alpha-2 (mis. 'ID') yang dipilih saat daftar - lihat shared/countries.js; '' = belum dipilih (akun lama/tamu)
  is_guest          INTEGER NOT NULL DEFAULT 0, -- 0/1: akun tamu sementara dibuat otomatis lewat POST /api/auth/guest (fitur Guest Mode) - tidak punya password yang diketahui pengguna, TIDAK ditampilkan di leaderboard/tidak boleh akses /profile, /library, /leaderboard (lihat requireAuth di shared/auth-gate.js)
  created_at        BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS matches (
  id              TEXT PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id),
  category        TEXT NOT NULL,          -- bullet | blitz | rapid
  player_color    TEXT NOT NULL,          -- 'w' | 'b'
  bot_name        TEXT NOT NULL,
  bot_elo         INTEGER NOT NULL,
  bot_flag        TEXT NOT NULL,
  bot_title       TEXT NOT NULL DEFAULT '', -- '' | CM | NM | FM | IM | GM (revisi #3)
  bot_avatar      TEXT NOT NULL DEFAULT '🤖', -- emoji profil lawan (revisi #3)
  bot_avatar_image TEXT NOT NULL DEFAULT '', -- path images/xxx.png untuk karakter spesial (revisi #5, kosong = pakai bot_avatar emoji)
  fen             TEXT NOT NULL,          -- state resmi SAAT INI (otoritas)
  status          TEXT NOT NULL DEFAULT 'active', -- active | finished | aborted
  result          TEXT,                   -- win | loss | draw (null selagi active)
  result_reason   TEXT,                   -- checkmate | stalemate | resign | timeout | draw-agreement | ...
  player_ms       BIGINT NOT NULL,
  bot_ms          BIGINT NOT NULL,
  last_move_at    BIGINT NOT NULL,
  san_history     TEXT NOT NULL DEFAULT '[]', -- JSON array of SAN strings
  ply_snapshots   TEXT NOT NULL DEFAULT '[]', -- JSON array of FEN strings, satu per posisi (indeks 0 = posisi awal SEBELUM langkah pertama) - dibutuhkan untuk navigasi maju/mundur client & untuk memulihkan tampilan papan penuh saat "Lanjutkan Permainan" (revisi #Play-Audit item #2)
  last_move_squares_per_ply TEXT NOT NULL DEFAULT '[]', -- JSON array of {from,to} per langkah, untuk highlight kotak terakhir saat papan dipulihkan (revisi #Play-Audit item #2)
  created_at      BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS practice_matches (
  id              TEXT PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id),
  character       TEXT NOT NULL,          -- fahri | udin | adit | dimas | agus | ilham | josep | asep
  player_color    TEXT NOT NULL,          -- 'w' | 'b'
  fen             TEXT NOT NULL,          -- state resmi SAAT INI (otoritas) - bot.html (vs bot latihan)
  status          TEXT NOT NULL DEFAULT 'active', -- active | finished
  result          TEXT,                   -- win | loss | draw (null selagi active)
  result_reason   TEXT,                   -- checkmate | stalemate | fifty-move | dead-position | resign
  san_history     TEXT NOT NULL DEFAULT '[]', -- JSON array of SAN strings
  created_at      BIGINT NOT NULL,
  updated_at      BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS saved_games (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id),
  match_id        TEXT NOT NULL,
  opponent_name   TEXT NOT NULL,
  opponent_elo    INTEGER NOT NULL,
  category        TEXT NOT NULL,
  result          TEXT NOT NULL,
  elo_change      INTEGER NOT NULL,
  elo_before      INTEGER NOT NULL,
  elo_after       INTEGER NOT NULL,
  pgn             TEXT NOT NULL,
  played_at       BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS rating_history (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id),
  category        TEXT NOT NULL,          -- bullet | blitz | rapid | puzzle
  rating          INTEGER NOT NULL,       -- rating SETELAH perubahan ini (snapshot, bukan delta)
  recorded_at     BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rating_history_user_cat ON rating_history(user_id, category, recorded_at);

CREATE TABLE IF NOT EXISTS puzzle_sessions (
  id                TEXT PRIMARY KEY,
  user_id           INTEGER NOT NULL REFERENCES users(id),
  puzzle_id         TEXT NOT NULL,          -- id Lichess puzzle yang sedang dikerjakan (lihat server/lib/puzzles-repo.js)
  is_daily          INTEGER NOT NULL DEFAULT 0,
  move_index        INTEGER NOT NULL,       -- indeks langkah BERIKUTNYA yang harus dicocokkan (lihat puzzleMoves[moveIndex] di client lama)
  status            TEXT NOT NULL DEFAULT 'active', -- active | solved | failed
  had_wrong_attempt INTEGER NOT NULL DEFAULT 0, -- 1 jika PERNAH submit langkah salah di sesi ini (dipakai menentukan naik/turunnya puzzle_rating - lihat server/routes/puzzle.js)
  created_at        BIGINT NOT NULL,
  updated_at        BIGINT NOT NULL
);

/* REFACTOR SISTEM LESSON (menggantikan localStorage per-browser):
   sebelumnya status "lesson selesai" disimpan lewat
   localStorage.setItem di lesson-detail.js - murni per BROWSER, bukan
   per AKUN sungguhan. Konsekuensinya: tidak sinkron lintas perangkat,
   dan HILANG TOTAL kalau cache/data situs pengguna dibersihkan -
   persis kelas masalah yang sama dengan bug cache yang pernah dialami
   (data yang seharusnya permanen ternyata bergantung pada isi cache
   browser). Dipindah ke tabel sungguhan di server, pola akses SAMA
   PERSIS dengan tabel lain di atas (per user_id, lewat requireAuth). */
CREATE TABLE IF NOT EXISTS lesson_progress (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id),
  lesson_id       TEXT NOT NULL,
  completed_at    BIGINT NOT NULL,
  UNIQUE (user_id, lesson_id)
);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);

/* SISTEM KUNCI SEKALI PAKAI (lihat server/lib/one-time-keys.js): daftar
   kunci yang SUDAH DIPAKAI. Hanya hash SHA-256 kunci yang disimpan;
   PRIMARY KEY pada key_hash menjamin satu kunci hanya bisa tercatat
   sekali (penandaan terpakai bersifat atomik). */
CREATE TABLE IF NOT EXISTS one_time_keys (
  key_hash  TEXT PRIMARY KEY,
  key_type  TEXT NOT NULL,                              -- master | grandmaster | supergm | admin
  used_by   INTEGER NOT NULL REFERENCES users(id),
  used_at   BIGINT NOT NULL
);

/* KEAMANAN - penghitung rate limit bersama (lihat server/lib/security.js
   consume()). Satu baris per (bucket, jendela waktu); bucket = hash
   SHA-256 dari kunci (IP/username/dst), BUKAN nilai mentahnya. Baris
   lama dibersihkan otomatis oleh security.js. */
CREATE TABLE IF NOT EXISTS rate_limits (
  bucket       TEXT NOT NULL,
  window_start BIGINT NOT NULL,
  hits         INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (bucket, window_start)
);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);

/* KEAMANAN - daftar token sesi yang dicabut lewat POST /api/auth/logout
   (hanya hash SHA-256 token yang disimpan). requireAuth menolak token yang
   ada di sini; baris kedaluwarsa dibersihkan saat logout berikutnya. */
CREATE TABLE IF NOT EXISTS revoked_tokens (
  token_hash TEXT PRIMARY KEY,
  expires_at BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_revoked_tokens_exp ON revoked_tokens(expires_at);
`;

const COLUMN_MIGRATIONS_SQL = `
ALTER TABLE users ADD COLUMN IF NOT EXISTS puzzle_rating INTEGER NOT NULL DEFAULT 1400;
ALTER TABLE users ADD COLUMN IF NOT EXISTS puzzle_solved INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS puzzle_failed INTEGER NOT NULL DEFAULT 0;
ALTER TABLE puzzle_sessions ADD COLUMN IF NOT EXISTS had_wrong_attempt INTEGER NOT NULL DEFAULT 0;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS bot_title TEXT NOT NULL DEFAULT '';
ALTER TABLE matches ADD COLUMN IF NOT EXISTS bot_avatar TEXT NOT NULL DEFAULT '🤖';
ALTER TABLE matches ADD COLUMN IF NOT EXISTS bot_avatar_image TEXT NOT NULL DEFAULT '';
ALTER TABLE matches ADD COLUMN IF NOT EXISTS time_base INTEGER; -- detik; NULL = preset kategori (TIME_CONTROLS), terisi = Kendali Waktu Kustom
ALTER TABLE matches ADD COLUMN IF NOT EXISTS time_inc INTEGER;  -- bonus per langkah (detik); NULL = preset kategori
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin_unlocked INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS elo_protected INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS custom_opponent TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS bot_avatar_overrides TEXT NOT NULL DEFAULT '{}';
ALTER TABLE matches ADD COLUMN IF NOT EXISTS ply_snapshots TEXT NOT NULL DEFAULT '[]';
ALTER TABLE matches ADD COLUMN IF NOT EXISTS last_move_squares_per_ply TEXT NOT NULL DEFAULT '[]';
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_guest INTEGER NOT NULL DEFAULT 0; -- fitur Guest Mode
ALTER TABLE users ADD COLUMN IF NOT EXISTS country TEXT NOT NULL DEFAULT ''; -- negara pemain (pilihan saat daftar)
ALTER TABLE practice_matches ADD COLUMN IF NOT EXISTS mode TEXT NOT NULL DEFAULT 'friendly'; -- friendly = "Dengan alat" | challenge = "Tanpa alat" (hanya challenge yang diarsipkan ke saved_games)
ALTER TABLE practice_matches ADD COLUMN IF NOT EXISTS engine_level INTEGER NOT NULL DEFAULT 3; -- tingkat Fahri: kini selalu 3 (level tunggal); nilai 1/2 hanya sisa data lama
ALTER TABLE practice_matches ADD COLUMN IF NOT EXISTS start_fen TEXT NOT NULL DEFAULT ''; -- '' = posisi awal standar; terisi = sesi dimulai dari FEN kustom
ALTER TABLE practice_matches ADD COLUMN IF NOT EXISTS uci_history TEXT NOT NULL DEFAULT '[]'; -- JSON array langkah ("e2e4", "e7e8q") sejajar dengan san_history - dipakai client memulihkan papan+riwayat langkah
`;

const ONE_ACTIVE_MATCH_INDEX_SQL = `
CREATE UNIQUE INDEX IF NOT EXISTS idx_matches_one_active_per_user
  ON matches(user_id) WHERE status = 'active';
CREATE UNIQUE INDEX IF NOT EXISTS idx_practice_one_active_per_user
  ON practice_matches(user_id) WHERE status = 'active';
`;

let schemaReadyPromise: any = null;

function ensureSchema() {
  if (!schemaReadyPromise) {
    schemaReadyPromise = pool
      .query(SCHEMA_SQL)
      .then(() => pool.query(COLUMN_MIGRATIONS_SQL))
      .then(() => pool.query(ONE_ACTIVE_MATCH_INDEX_SQL).catch((e: any) => {
        console.warn("[db] Indeks 'satu match aktif per akun' tidak dibuat (kemungkinan ada data ganda lama):", e.code || "error");
      }))
      .catch((err: any) => {
        schemaReadyPromise = null;
        throw err;
      });
  }
  return schemaReadyPromise;
}

module.exports = { query, pool, ensureSchema };
