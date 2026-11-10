# NusantaraChess

Situs catur: main online dengan rating Elo, lawan karakter bot, puzzle, Game Review (Stockfish), lessons, library, leaderboard, dan profil.
Frontend React/TSX + skrip fitur (dibangun ke `dist/`), halaman SSR Vercel (`api/ssr`), dan backend Express + PostgreSQL (`server/`).

## Struktur proyek

```
.
├── public/                  # aset statis, disalin apa adanya ke dist/ (URL = isi folder ini)
│   ├── index.html  favicon.svg  manifest.json  robots.txt  sitemap.xml
│   ├── og-image.png  icon-192.png  icon-512.png  apple-touch-icon.png
│   ├── images/              # taruh folder image/ lama di sini  (URL /images/...)
│   ├── sounds/              # taruh folder sound/ lama di sini  (URL /sounds/...)
│   └── vendor/
│       ├── chess-engines/   # adit, dimas, udin, agus (+agus-uci), ilham (+ilham-uci, ilham-engine), josep (+josep-uci), asep (+asep-uci), fahriengine, chess.min.js, stockfish-wrapper.js
│       ├── stockfish/       # Stockfish 18 (file ditambahkan sendiri, lihat bawah)
│       └── jquery/
├── src/
│   ├── app/                 # aplikasi React: Router, routes.ts, pages/**, components/**
│   ├── features/            # logika per fitur (bot, play, puzzles, gamereview, home, ...)
│   ├── styles/              # semua CSS (tokens, site-nav, features/**)
│   ├── types/               # *.d.ts
│   └── key-generator/       # sumber React/TSX alat key-generator
├── server/                  # backend Express (project Vercel terpisah, Root Directory = server)
├── api/                     # fungsi SSR Vercel (/, /library, /lessons*, /profile, /leaderboard, /profile/:username) - docs/SSR.md
├── shared/                  # kode bersama browser + server (chess-rules, countries, i18n, api-client, ...)
├── tools/                   # skrip build, SEO, typecheck
├── keygeneratora1b2/        # halaman key-generator (template + hasil build); project Vercel terpisah, Root Directory = keygeneratora1b2
├── tests/                   # key-generator + e2e (Playwright)
├── tsconfig/                # beberapa tsconfig terpisah per bagian (jangan digabung)
├── docs/                    # PANDUAN, STRUKTUR, MIGRASI_REACT, laporan migrasi
├── package.json  tsconfig.json  vercel.json  site.config.json
└── .gitignore  .vercelignore  README.md
```

`dist/` (hasil build, di-gitignore) adalah satu-satunya folder yang disajikan/di-deploy sebagai frontend.
Penjelasan lengkap (alur build, peta URL, peta path lama → baru): [`docs/STRUKTUR.md`](docs/STRUKTUR.md).

## Mulai cepat

Butuh Node.js >= 22.13.

```bash
npm install
npm run build        # dist/ (frontend) + .js untuk Node + keygeneratora1b2/index.html
npm run serve        # http://localhost:8080  (menyajikan dist/ dengan fallback SPA)
```

Backend: `cd server && npm install && cp .env.example .env && npm start` (lihat `docs/PANDUAN.md`).

Aset yang tidak ada di repo (salin sendiri): `public/images/`, `public/sounds/`, `public/icon-3646.png`,
dan berkas Stockfish ke `public/vendor/stockfish/`: `stockfish.js`, `stockfish.wasm`, `stockfish.wasm.js`,
`stockfish-18-lite-single.js`, `stockfish-18-lite-single.wasm`.

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run build` | `build:web` + `build:node` + `build:key-generator` |
| `npm run build:web` | siapkan `dist/` (public + styles), strip tipe skrip fitur, bundel React |
| `npm run build:vercel` | seperti `build:web`, tetapi bundel produksi (minify, tanpa sourcemap) + bundel SSR + `dist/index.html` -> `dist/spa.html` |
| `npm run build:ssr` | bundel render server (`src/app/ssr/render.tsx` -> `api/ssr/_lib/app-render.cjs`); lihat [`docs/SSR.md`](docs/SSR.md) |
| `npm run build:node` | `.js` untuk `server/`, `tools/*.ts`, dan `shared/` inti (di samping `.ts`) |
| `npm run dev` | `build:web` lalu esbuild watch untuk `src/app` |
| `npm run typecheck` | type-check semua project (4 mode) |
| `npm run seo` / `check:seo` | tulis ulang / periksa `public/index.html`, `sitemap.xml`, `robots.txt` |
| `npm run test:keygen` / `test:e2e` / `test:ssr` | uji key-generator / uji browser SPA / uji SSR (browser butuh `npx playwright install chromium`) |
