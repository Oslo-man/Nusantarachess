export type PageId =
  | "home" | "play" | "bot" | "puzzles" | "gamereview" | "lessons"
  | "lesson-detail" | "library" | "leaderboard" | "profile" | "public-profile";

export type ScriptStep =
  | string
  | { inlineInit: "bot" | "puzzles" }
  | { concatScript: string[] }
  | { isolate: string | string[] };

export interface RouteConfig {
  page: PageId;
  css: string[];
  scripts: ScriptStep[];
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  themeColor?: string;
}

export const ROUTES: Record<string, RouteConfig> = {
  "/": {
    page: "home",
    css: ["styles/tokens.css", "styles/site-nav/01-topbar.css", "styles/site-nav/02-sidebar.css", "styles/site-nav/03-bottombar-drawer.css", "styles/features/home/01-landing-header.css", "styles/features/home/02-landing-hero-footer.css", "styles/features/home/03-home-dashboard.css", "styles/components/game-history.css", "styles/features/home/index-auth.css", "styles/premium.css", "styles/neu-buttons.css"],
    scripts: ["shared/api-client.js", "shared/site-nav.js", "shared/game-history.js", "shared/image-resize.js", "shared/countries.js", "shared/piece-set.js", "features/play/piece-svg-and-sound.js?v=stage-c-2", { concatScript: [
      "features/home/00-shell-header.js",
      "features/home/01-level-select.js",
      "features/home/02-landing-home-summary.js",
      "features/home/03-auth-modal-session.js",
      "features/home/04-register-guest-login.js",
      "features/home/05-hero-avatar-footer.js"
    ] }],
    title: "NusantaraChess — Bermain, berlatih, dan belajar catur",
    description: "NusantaraChess: bermain online dengan rating Elo, berlatih melawan karakter bot, kerjakan puzzle personal, dan bedah partaimu dengan Game Review bertenaga Stockfish."
  },
  "/play": {
    page: "play",
    css: [
      "styles/tokens.css", "styles/site-nav/01-topbar.css", "styles/site-nav/02-sidebar.css", "styles/site-nav/03-bottombar-drawer.css",
      "styles/features/play/01-reset-base.css", "styles/features/play/02-page-switching.css", "styles/features/play/03-buttons.css",
      "styles/features/play/04-auth-page.css", "styles/features/play/05-dashboard-page.css", "styles/features/play/06-matchmaking-page.css",
      "styles/features/play/07-game-page.css", "styles/features/play/08-move-nav.css", "styles/features/play/09-options-menu.css",
      "styles/features/play/10-saved-games.css", "styles/features/play/11-elo-indicator.css", "styles/features/play/12-responsive.css",
      "styles/features/play/13-desktop-game-layout.css", "styles/features/play/14-game-redesign.css", "styles/auth-gate-overlay.css", "styles/premium.css", "styles/neu-buttons.css"
    ],
    scripts: ["shared/api-client.js", "shared/auth-gate.js", "shared/site-nav.js", "shared/chess-rules.js", "shared/countries.js", "shared/image-resize.js", "shared/piece-set.js", "features/play/piece-svg-and-sound.js", "vendor/chess-engines/stockfish-wrapper.js", { isolate: [
      "features/play/00-shell-header.js",
      "features/play/01-init-header.js",
      "features/play/02-dashboard-admin.js",
      "features/play/03-enter-dashboard-resume.js",
      "features/play/04-matchmaking-setup.js",
      "features/play/05-board-render-nav.js",
      "features/play/06-move-execution-premove.js",
      "features/play/07-clock-history-options.js",
      "features/play/08-endgame-saved-replay.js"
    ] }],
    title: "Chess Online - vs Bot"
  },
  "/bot": {
    page: "bot",
    css: ["styles/tokens.css", "styles/site-nav/01-topbar.css", "styles/site-nav/02-sidebar.css", "styles/site-nav/03-bottombar-drawer.css", "styles/features/bot/01-base-header.css", "styles/features/bot/02-board-controls.css", "styles/features/bot/03-opponent-select-modal.css", "styles/features/bot/04-gameover-utility.css", "styles/features/bot/bot-desktop-layout.css", "styles/auth-gate-overlay.css", "styles/premium.css", "styles/neu-buttons.css"],
    scripts: [
      "shared/api-client.js", "shared/auth-gate.js", "shared/site-nav.js",
      "shared/piece-set.js", "vendor/jquery/jquery.min.js", "vendor/jquery/jquery-ui-custom.min.js", "vendor/chess-engines/fahriengine.js", { isolate: [
        "features/bot/01-state-config.js",
        "features/bot/02-character-settings-ui.js",
        "features/bot/03-game-lifecycle-ui.js",
        "features/bot/04-eval-engine.js",
        "features/bot/05-assets-sound.js",
        "features/bot/06-move-rules.js",
        "features/bot/07-premove.js",
        "features/bot/08-board-interaction-render.js"
      ] },
      { inlineInit: "bot" }
    ],
    title: "Nusantara Chess | Bermain dan belajar catur"
  },
  "/puzzles": {
    page: "puzzles",
    css: ["styles/tokens.css", "styles/site-nav/01-topbar.css", "styles/site-nav/02-sidebar.css", "styles/site-nav/03-bottombar-drawer.css", "styles/features/puzzles/01-base-board-controls.css", "styles/features/puzzles/02-settings-panel.css", "styles/features/puzzles/03-theme-move-gameover.css", "styles/features/puzzles/04-responsive.css", "styles/features/puzzles/05-touch-animation-overlays.css", "styles/features/puzzles/06-review.css", "styles/features/puzzles/07-analysis-misc.css", "styles/features/puzzles/08-settings-colors.css", "styles/auth-gate-overlay.css", "styles/premium.css", "styles/neu-buttons.css"],
    scripts: [
      "shared/api-client.js", "shared/auth-gate.js", "shared/site-nav.js",
      "vendor/chess-engines/chess.min.js", "shared/piece-set.js",
      { inlineInit: "puzzles" },
      { isolate: [
        "features/puzzles/01-assets-i18n.js",
        "features/puzzles/01b-i18n-extra.js",
        "features/puzzles/02-theme-mapping.js",
        "features/puzzles/03-state-sound-setup.js",
        "features/puzzles/04-sound-playback.js",
        "features/puzzles/05-animation-drag.js",
        "features/puzzles/06-board-input.js",
        "features/puzzles/07-move-input-server.js",
        "features/puzzles/08-puzzle-flow.js",
        "features/puzzles/09-daily-puzzle.js",
        "features/puzzles/10-review-list-detail.js",
        "features/puzzles/11-review-board-nav.js",
        "features/puzzles/12-highscore-hints.js",
        "features/puzzles/13-settings-scoring.js",
        "features/puzzles/14-analysis-stockfish.js"
      ] }
    ],
    title: "Puzzle | Chess Training",
    themeColor: "#1a1a1a"
  },
  "/gamereview": {
    page: "gamereview",
    css: [
      "styles/tokens.css", "styles/site-nav/01-topbar.css", "styles/site-nav/02-sidebar.css", "styles/site-nav/03-bottombar-drawer.css",
      "styles/features/gamereview/brilliant-review.css", "styles/auth-gate-overlay.css", "styles/premium.css", "styles/neu-buttons.css"
    ],
    scripts: ["shared/api-client.js", "shared/auth-gate.js", "shared/site-nav.js", "vendor/chess-engines/chess.min.js", "shared/piece-set.js", "features/gamereview/piece-svg.js", "features/gamereview/sound.js", "features/gamereview/engine-wrapper.js", { concatScript: [
      "features/gamereview/00-shell-header.js",
      "features/gamereview/01-state-render.js",
      "features/gamereview/02-animation-interaction.js",
      "features/gamereview/03-analysis-eval-arrows.js",
      "features/gamereview/04-movelist-tabs.js",
      "features/gamereview/05-pgn-import.js",
      "features/gamereview/06-fen-opening-detect.js",
      "features/gamereview/07-review-report-boot.js"
    ] }],
    title: "Nusantara Chess | Game review gratis secara tak terbatas",
    description: "Ulasan permainan catur gratis — akurasi, blunder, grafik evaluasi, dan laporan permainan. Impor dari Chess.com atau tempel PGN apa saja.",
    ogTitle: "Nusantara Chess game review",
    ogDescription: "Berapa banyak blunder yang kamu mainkan? Analisis permainan catur apa pun secara gratis — akurasi, perkiraan Elo, momen kunci.",
    themeColor: "#262626"
  },
  "/lessons": {
    page: "lessons",
    css: ["styles/tokens.css", "styles/site-nav/01-topbar.css", "styles/site-nav/02-sidebar.css", "styles/site-nav/03-bottombar-drawer.css", "styles/auth-gate-overlay.css", "styles/features/lessons/01-lessons-list.css", "styles/premium.css", "styles/neu-buttons.css"],
    scripts: ["shared/api-client.js", "shared/site-nav.js", "features/lessons/lessons-list.js"],
    title: "Lesson — NusantaraChess",
    description: "Lesson NusantaraChess: Opening Trainer, Middlegame Plan Trainer, dan Endgame Trainer — belajar lewat posisi nyata, format Learn → Position → Choose Move → Explanation."
  },
  "/library": {
    page: "library",
    css: ["styles/tokens.css", "styles/site-nav/01-topbar.css", "styles/site-nav/02-sidebar.css", "styles/site-nav/03-bottombar-drawer.css", "styles/auth-gate-overlay.css", "styles/features/library/01-base-controls-list.css", "styles/features/library/02-status-pagination.css", "styles/components/game-history.css", "styles/premium.css", "styles/neu-buttons.css"],
    scripts: ["shared/api-client.js", "shared/auth-gate.js", "shared/site-nav.js", "shared/game-history.js", "features/library/library.js"],
    title: "Game Library — NusantaraChess",
    description: "Semua partai online NusantaraChess-mu di satu tempat: filter berdasar kategori dan hasil, cari lawan, buka Game Review, atau unduh PGN."
  },
  "/leaderboard": {
    page: "leaderboard",
    css: ["styles/tokens.css", "styles/site-nav/01-topbar.css", "styles/site-nav/02-sidebar.css", "styles/site-nav/03-bottombar-drawer.css", "styles/auth-gate-overlay.css", "styles/features/leaderboard/01-base-list.css", "styles/features/leaderboard/02-search-ssr.css", "styles/premium.css", "styles/neu-buttons.css"],
    scripts: ["shared/api-client.js", "shared/site-nav.js", "features/leaderboard/leaderboard.js"],
    title: "Leaderboard — NusantaraChess",
    description: "Papan peringkat NusantaraChess: ranking rating Bullet, Blitz, Rapid, dan Puzzle. Cari dan lihat profil pemain lain."
  },
  "/profile": {
    page: "profile",
    css: ["styles/tokens.css", "styles/site-nav/01-topbar.css", "styles/site-nav/02-sidebar.css", "styles/site-nav/03-bottombar-drawer.css", "styles/auth-gate-overlay.css", "styles/features/profile/01-base-hero-rating.css", "styles/features/profile/02-stats-recent-games.css", "styles/components/game-history.css", "styles/premium.css", "styles/neu-buttons.css"],
    scripts: ["shared/api-client.js", "shared/auth-gate.js", "shared/site-nav.js", "shared/game-history.js", "shared/countries.js", "features/profile/profile.js"],
    title: "Profil — NusantaraChess",
    description: "Profil NusantaraChess: rating Bullet/Blitz/Rapid/Puzzle, rekor menang-kalah-remi, dan grafik perkembangan rating."
  }
};

export const LESSON_DETAIL_ROUTE: RouteConfig = {
  page: "lesson-detail",
  css: ["/styles/tokens.css", "/styles/site-nav/01-topbar.css", "/styles/site-nav/02-sidebar.css", "/styles/site-nav/03-bottombar-drawer.css", "/styles/auth-gate-overlay.css", "/styles/features/lessons/01-lessons-list.css", "/styles/features/lessons/02-lesson-detail.css", "/styles/premium.css", "/styles/neu-buttons.css"],
  scripts: ["/shared/api-client.js", "/shared/site-nav.js", "/shared/chess-rules.js", "/shared/piece-set.js", "/features/play/piece-svg-and-sound.js", "/features/lessons/lesson-detail.js"],
  title: "Lesson — NusantaraChess"
};

export const PUBLIC_PROFILE_ROUTE: RouteConfig = {
  page: "public-profile",
  css: ["/styles/tokens.css", "/styles/site-nav/01-topbar.css", "/styles/site-nav/02-sidebar.css", "/styles/site-nav/03-bottombar-drawer.css", "/styles/features/profile/01-base-hero-rating.css", "/styles/features/profile/02-stats-recent-games.css", "/styles/components/game-history.css", "/styles/premium.css", "/styles/neu-buttons.css"],
  scripts: ["/shared/api-client.js", "/shared/site-nav.js", "/shared/game-history.js", "/features/profile/public-profile.js"],
  title: "Profil — NusantaraChess"
};

export const LEGACY_HTML_ALIASES: Record<string, string> = {
  "index.html": "/",
  "play.html": "/play",
  "chess.html": "/bot",
  "bot.html": "/bot",
  "puzzles.html": "/puzzles",
  "gamereview.html": "/gamereview",
  "lessons.html": "/lessons",
  "library.html": "/library",
  "leaderboard.html": "/leaderboard",
  "profile.html": "/profile"
};

function matchDynamicRoute(path: string): RouteConfig | null {
  if (/^\/lessons\/([^/]+)\/?$/.test(path)) return LESSON_DETAIL_ROUTE;
  if (/^\/profile\/([^/]+)\/?$/.test(path)) return PUBLIC_PROFILE_ROUTE;
  return null;
}

export function resolveRoute(path: string): RouteConfig | null {
  if (Object.prototype.hasOwnProperty.call(ROUTES, path)) return ROUTES[path];
  return matchDynamicRoute(path);
}

export function normalizeHref(href: string): string {
  const lessonMatch = href.match(/^lesson-detail\.html\?id=([^&]+)/);
  if (lessonMatch) return "/lessons/" + lessonMatch[1];
  const bare = href.split("?")[0].split("/").pop() as string;
  if (LEGACY_HTML_ALIASES[bare]) {
    const query = href.includes("?") ? href.slice(href.indexOf("?")) : "";
    return LEGACY_HTML_ALIASES[bare] + query;
  }
  return href;
}
