# NusantaraChess — server

Backend Node.js + Express: autentikasi, validasi langkah & hasil
pertandingan, Elo, dan klasifikasi/akurasi/ACPL/rating untuk fitur Game
Review.

**Stockfish TIDAK berjalan di sini.** Mesin analisis 100% berjalan di
browser pemain (Web Worker WASM) — server ini murni memvalidasi/menghitung
dari data yang sudah dihasilkan client, tidak pernah menjalankan mesin
catur sendiri.

## Menjalankan

```bash
npm install
cp .env.example .env   # lalu isi DATABASE_URL (Neon) dan JWT_SECRET
npm start        # produksi
npm run dev       # dengan auto-restart saat berkas berubah (node --watch)
```

Port default `3000`, bisa diubah lewat variabel lingkungan `PORT`.

**Database:** PostgreSQL (rekomendasi: [Neon](https://neon.tech), tier
gratisnya cukup untuk skala portofolio). Isi `DATABASE_URL` di `.env`
dengan connection string dari Neon — lihat `.env.example` untuk format
dan contoh. Skema tabel dibuat otomatis (`CREATE TABLE IF NOT EXISTS`)
saat server pertama kali start, tidak perlu migrasi manual.

**Termux/Android:** alur kerja sama seperti sebelumnya (`npm install`,
akses lewat LAN IP dari Chrome) — driver database (`pg`) adalah paket
JavaScript murni, tidak butuh toolchain native seperti versi
better-sqlite3/libSQL sebelumnya, jadi tidak ada langkah build tambahan
di Termux.

## Struktur

```
index.js              Entry point Express (dev lokal + Vercel)
api/index.js           Entry point Vercel Serverless Function (re-export index.js)
vercel.json             Konfigurasi build & routing Vercel
routes/
  auth.js              Register, login, profil (/api/auth/*)
  match.js             Matchmaking, langkah, hasil, Elo (/api/match/*)
  practice.js          Langkah & hasil bot.html, TANPA Elo (/api/practice/*)
  puzzle.js            Pemilihan & validasi solusi puzzle (/api/puzzle/*)
  review.js            Klasifikasi langkah & analisis game review (/api/review/*)
  profile.js            Ringkasan profil, riwayat rating, Game Library (/api/profile/*)
  leaderboard.js         Papan peringkat per kategori (/api/leaderboard)
lib/
  auth.js              Hashing password (bcrypt) + token sesi (JWT; JWT_SECRET dari env, fallback file lokal untuk dev)
  require-auth.js       Middleware pemeriksa token (async)
  db.js                 Koneksi PostgreSQL (pool `pg`) + skema tabel + ensureSchema()
  users-repo.js          Akses data user (whitelist kolom yang boleh diubah)
  matches-repo.js         Akses data pertandingan aktif (play.html)
  practice-repo.js        Akses data sesi latihan aktif (bot.html, TANPA Elo)
  saved-games-repo.js     Arsip PGN + ringkasan hasil per game selesai (Game Library)
  rating-history-repo.js  Snapshot rating tiap kali berubah (grafik profil)
  puzzles-repo.js         Database puzzle di memori + logika filter/pilih (puzzles.html)
  puzzle-session-repo.js  Akses progres sesi puzzle aktif (puzzles.html)
  matchmaking.js          Generator profil bot + kalkulasi Elo
  review-scoring.js       Klasifikasi langkah/Akurasi/ACPL/Rating/statistik
  chess-rules.js          Disalin otomatis dari ../shared/chess-rules.js (lihat scripts/sync-shared.js)
data-seed/
  puzzles.json            49.796 puzzle utama (Lichess) - HANYA dibaca server, jangan dikirim ke client
  puzzles-daily.json       366 puzzle harian (Lichess)
scripts/
  sync-shared.js          Menyalin ulang shared/chess-rules.js -> lib/chess-rules.js
data/                    HANYA berisi kunci sesi JWT fallback untuk dev lokal (dibuat otomatis, jangan di-commit) - TIDAK ADA lagi file database di sini, data tersimpan di PostgreSQL (Neon)
.env.example             Contoh variabel lingkungan (salin ke .env untuk dev lokal)
```

## Endpoint

Semua endpoint (kecuali `/api/health`, `/api/auth/register`, `/api/auth/login`)
membutuhkan header `Authorization: Bearer <token>`.

### Auth
| Method | Path | Fungsi |
|---|---|---|
| POST | `/api/auth/register` | Daftar akun baru |
| POST | `/api/auth/login` | Masuk, dapat token |
| GET | `/api/auth/me` | Data akun saat ini |
| POST | `/api/auth/logout` | Mencabut token sesi yang dipakai request ini (hash-nya masuk tabel `revoked_tokens`); token lain milik akun yang sama tidak terpengaruh |
| PATCH | `/api/auth/me` | Ubah foto profil / level awal (Elo awal HANYA bisa diset sekali; level Master/Grandmaster/Super Grandmaster butuh `levelPassword` berisi kunci sekali pakai jenis yang sesuai dan belum pernah dipakai, lihat `lib/one-time-keys.js`) |
| POST | `/api/auth/verify-level-password` | Cek password level Master/Grandmaster/Super Grandmaster, hanya kembalikan `{ valid }` - bukan otorisasi, PATCH `/me` tetap validasi ulang |

### Match (play.html)
| Method | Path | Fungsi |
|---|---|---|
| POST | `/api/match/find` | Matchmaking — server pilih profil bot |
| GET | `/api/match/:id/state` | Sinkronisasi state resmi |
| POST | `/api/match/:id/move` | Kirim satu langkah (divalidasi ulang di server) |
| POST | `/api/match/:id/resign` | Menyerah |
| POST | `/api/match/:id/timeout` | Klaim waktu habis (diverifikasi ulang server) |
| POST | `/api/match/:id/draw-offer` | Tawarkan remis |
| POST | `/api/match/:id/abort` | Batalkan sebelum langkah pertama |

### Practice (bot.html — lawan Fahri/Udin/Adit/Dimas, TANPA Elo/skor)
| Method | Path | Fungsi |
|---|---|---|
| POST | `/api/practice/start` | Mulai sesi baru (opsional `startFen` untuk kotak Posisi Papan, `mode` `friendly`/`challenge`, `level` Fahri 1-3) |
| GET | `/api/practice/active` | Sesi bot yang masih berjalan milik user (`{ match: null }` bila tidak ada) - dipakai memulihkan permainan saat halaman Bot dibuka lagi |
| GET | `/api/practice/:id/state` | Sinkronisasi state resmi |
| POST | `/api/practice/:id/move` | Kirim satu langkah, pemain ATAU bot (divalidasi ulang di server) |
| POST | `/api/practice/:id/resign` | Menyerah / akhiri sesi. Permainan mode `challenge` (Tanpa alat) yang selesai (skakmat/remis/menyerah, minimal 1 langkah, bukan Guest) diarsipkan sekali ke `saved_games` (category `bot`) - muncul di Game Library/Profil/Game Review |

### Puzzle (puzzles.html)
| Method | Path | Fungsi |
|---|---|---|
| POST | `/api/puzzle/next` | Pilih & mulai puzzle baru sesuai filter (server yang memilih) |
| GET | `/api/puzzle/daily` | Pilih & mulai puzzle harian hari ini |
| POST | `/api/puzzle/:id/move` | Kirim satu langkah untuk dicocokkan ke solusi tersimpan |
| POST | `/api/puzzle/:id/hint` | Minta petunjuk (HANYA petak asal, bukan langkah utuh) |

### Review (gamereview.html)
| Method | Path | Fungsi |
|---|---|---|
| POST | `/api/review/analyze-game` | Kirim evaluasi mentah 1 partai penuh → terima laporan lengkap |
| POST | `/api/review/classify-move` | Klasifikasi 1 langkah (untuk live-judge) |

### Profile
| Method | Path | Fungsi |
|---|---|---|
| GET | `/api/profile/summary` | Ringkasan statistik + 5 game terakhir |
| GET | `/api/profile/rating-history` | Riwayat rating (`?category=bullet\|blitz\|rapid\|puzzle\|all`) |
| GET | `/api/profile/games` | Game Library dengan filter/pencarian/paginasi |
| GET | `/api/profile/games/:id` | Detail satu game (termasuk PGN) |

### Leaderboard
| Method | Path | Fungsi |
|---|---|---|
| GET | `/api/leaderboard` | Papan peringkat (`?category=bullet\|blitz\|rapid\|puzzle&limit=50`) |

## Keamanan

Semua penegakan ada di backend (frontend hanya lapisan tambahan). Kode utamanya
di `lib/security.js` (tanpa dependency npm baru) dan dipasang di `index.js`.

| Area | Penerapan |
|---|---|
| Sesi/token | JWT HS256 dikunci di sign & verify, masa berlaku 14 hari (`JWT_TTL`), `jti` + `iss`; token baru diterbitkan server di tiap login/register/guest (tidak ada id sesi dari client → tidak ada session fixation); logout mencabut token (`revoked_tokens`); token lama tanpa `jti` tetap diterima sampai kedaluwarsa. Token dikirim lewat header `Authorization` (bukan cookie). |
| IDOR | Kepemilikan match, sesi latihan, dan sesi puzzle diverifikasi di server lewat `getOwned*(id, req.user.id)` sebelum tiap baca/ubah (id dari client tidak pernah dipercaya); game tersimpan, progres, dan riwayat difilter `user_id` langsung di SQL; update kritis (langkah, akhir game, batal) juga menyertakan `user_id` di klausa WHERE. Id sesi harus UUID; id numerik divalidasi ketat. |
| Validasi API | Hasil permainan, Elo, rating, dan progres dihitung server; client hanya mengirim langkah. Langkah/akhir game memakai compare-and-set atomik (anti balapan: Elo/rating tidak bisa dihitung ganda); satu match/sesi latihan aktif per akun dijaga indeks unik. |
| Rate limiting | Penghitung bersama di tabel `rate_limits` (tahan serverless; cadangan memori bila DB gagal): login 20/IP + 10/akun per 15 menit, register 10/IP/jam, guest 30/IP/jam, tebak kunci level/admin 10/akun + 30/IP per 15 menit (satu ember untuk 3 endpoint), analisis review, tawaran remis, endpoint publik, dan batas umum 600 req/menit/IP. Respons 429 membawa `Retry-After`. |
| CSRF | Auth memakai header Bearer (browser tidak mengirimnya otomatis), jadi CSRF klasik tidak berlaku. Pertahanan berlapis: CORS terbatas (`CORS_ORIGINS`), penolakan `Origin` asing pada request pengubah-state, dan body hanya `application/json`. Bila kelak memakai cookie sesi, tambahkan token CSRF + `SameSite`/`HttpOnly`/`Secure`. |
| XSS & injeksi | Query selalu berparameter; wildcard LIKE di-escape; foto profil hanya data URL png/jpeg/webp (divalidasi saat simpan DAN saat keluar); nama lawan custom dibersihkan; tag PGN di-escape; SSR meng-escape HTML & JSON di `<script>`. |
| Header | API: nosniff, frame DENY, CSP `default-src 'none'`, no-store, HSTS (produksi). Frontend: CSP, HSTS, nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy di `vercel.json` di root proyek. |
| Error & log | Client hanya menerima pesan generik; stack/SQL/path/kredensial hanya di log server dan disamarkan; kejadian keamanan (login gagal, rate limit, Origin diblokir) dicatat sebagai JSON satu baris tanpa password/token. |

Variabel lingkungan keamanan ada di `.env.example` (`CORS_ORIGINS`, `JWT_TTL`,
`TRUST_PROXY`, `DB_SSL_STRICT`, `DB_SSL_INSECURE`). Server mencetak
`[SECURITY WARNING]` saat start bila `ONE_TIME_KEY_SECRET` kosong/default atau
`CORS_ORIGINS` kosong di produksi.

**Risiko sisa yang perlu diketahui:** (1) CSP frontend memakai `'unsafe-inline'`
dan `'unsafe-eval'` karena ±80 atribut `onclick`/`onerror` inline dan pemuat
skrip terisolasi di `src/core/router.js` memakai `(0, eval)`; CSP tetap membatasi
sumber skrip/koneksi/gambar/frame ke domain yang diizinkan, tetapi belum bisa
menjadi pertahanan utama XSS sebelum handler inline dipindah ke
`addEventListener`. (2) Bila `ONE_TIME_KEY_SECRET` kosong atau kurang dari 16 karakter, server menolak
semua kunci level tinggi/Admin - isi nilai acak di server DAN di generator kunci.

## Key Generator (kunci sekali pakai)

`keygeneratora1b2/index.html` adalah satu berkas HTML mandiri
(CSS dan JS di dalamnya) untuk membuat kunci 4 jenis akses: Master (2700),
Grandmaster (3000), Super Grandmaster (3100), dan Admin Settings. Bisa dibuka
langsung di browser dari komputer sendiri, atau di-deploy sebagai project Vercel
terpisah (Root Directory = `keygeneratora1b2`, mis. `https://keygeneratora1b2.vercel.app`).
Halaman ini tidak memuat rahasia: rahasia penandatangan diketik di browser,
tidak disimpan dan tidak dikirim ke mana pun (CSP di `keygeneratora1b2/vercel.json`
memblokir semua permintaan jaringan). Berkasnya dibuat oleh
`npm run build:key-generator` (di root) - commit hasilnya sebelum deploy.
`.vercelignore` di root mengecualikannya dari deploy situs utama.

Alur: generator membuat kunci -> pengguna memasukkannya (verifikasi level awal
atau kolom Masukkan Kode di Play) -> server memeriksa tanda tangan HMAC-nya ->
saat benar-benar dipakai server menyimpannya di tabel `one_time_keys` -> kunci
yang sama ditolak sesudahnya. Status "terpakai" hanya ada di server.

Format dan rumus kode cek ada di `server/lib/one-time-keys.js`; generator
adalah salinan spesifikasinya. Setelah mengubah salah satunya, jalankan:

    npm run check-key-generator

Skrip itu memuat generator dan memvalidasi ribuan kunci dengan `parseKey`
server (rahasia kustom) dan memastikan server menolak semua kunci bila env
kosong, terlalu pendek, atau berbeda; gagal bila ada yang menyimpang. Rahasia diisi di kolom "Rahasia penandatangan" generator dan
harus sama persis dengan `ONE_TIME_KEY_SECRET` di server.

## Deploy ke Vercel

1. Buat database di [Neon](https://neon.tech), salin connection string-nya.
2. Di dashboard project Vercel, isi environment variable:
   - `DATABASE_URL` — connection string dari Neon
   - `JWT_SECRET` — string acak panjang (WAJIB diisi, filesystem Vercel
     tidak persisten sehingga fallback file lokal tidak berlaku di sini)
   - `ONE_TIME_KEY_SECRET` — rahasia acak (isi sama persis di kolom "Rahasia penandatangan" key-generator)
   - `CORS_ORIGINS` — domain frontend, mis. `https://nusantara-chess.vercel.app`
3. Deploy folder `server/` sebagai root project (berisi `vercel.json` +
   `api/index.js`). Vercel otomatis mendeteksi `api/index.js` sebagai
   serverless function; semua request `/api/*` diarahkan ke situ (lihat
   `vercel.json`).

## Mengedit aturan catur

`shared/chess-rules.js` (di root proyek, BUKAN di `server/lib/`) adalah
sumber aslinya. Setelah mengeditnya, jalankan:

```bash
npm run sync-shared
```

untuk menyalin ulang perubahan ke `server/lib/chess-rules.js`. Ini juga
berjalan otomatis setiap `npm install` (lihat `"postinstall"` di
`package.json`).
