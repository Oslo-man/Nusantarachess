import { renderToString } from "react-dom/server";
import { resolveRoute } from "../routes";
import type { RouteConfig } from "../routes";
import { PAGES } from "../pages";
import INDEX_TEMPLATE from "../../../public/index.html";
import type { SsrLeaderboardCategory, SsrLeaderboardRow, SsrLessonCategory, SsrLessonSummary, SsrPageData, SsrPublicUser, SsrRecentGame, SsrSearchResult } from "./types";

export interface SsrResult {
  status: number;
  html: string;
  cacheControl?: string;
}

const HOME_CACHE_CONTROL = "public, s-maxage=600, stale-while-revalidate=300";

export interface SsrContext {
  home?: { payload?: unknown; failed?: boolean };
  lessons?: unknown;
  leaderboard?: { category: unknown; payload: unknown; searchQuery: string; searchPayload: unknown };
  profile?: { username: string; payload?: unknown; notFound?: boolean };
}

interface HeadOverride {
  title?: string;
  description?: string;
  robots?: string;
  canonicalPath?: string;
  jsonLd?: unknown;
}

export function isAppSsrPath(pathname: string): boolean {
  return pathname === "/" || pathname === "/lessons" || /^\/lessons\/[^/]+$/.test(pathname) || pathname === "/leaderboard" || /^\/profile\/[^/]+$/.test(pathname);
}

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function jsonForScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function isProtectedRoute(route: RouteConfig): boolean {
  return route.scripts.some((step) => typeof step === "string" && /(^|\/)shared\/auth-gate\.js(\?|$)/.test(step));
}

function metaFromTemplate(pattern: RegExp, fallback: string): string {
  const m = INDEX_TEMPLATE.match(pattern);
  return m ? m[1] : fallback;
}

function siteOrigin(): string {
  return metaFromTemplate(/<link rel="canonical" href="([^"]*)"/, "").replace(/\/$/, "");
}

function routeHead(route: RouteConfig, isProtected: boolean, o: HeadOverride): string {
  const siteName = metaFromTemplate(/<meta property="og:site_name" content="([^"]*)"/, "NusantaraChess");
  const locale = metaFromTemplate(/<meta property="og:locale" content="([^"]*)"/, "id_ID");
  const title = o.title || route.title;
  const description = o.description !== undefined ? o.description : route.description || "";
  const ogTitle = o.title || route.ogTitle || title;
  const ogDescription = o.description !== undefined ? o.description : route.ogDescription || description;
  const robots = isProtected ? "noindex, nofollow" : o.robots || "index, follow, max-image-preview:large";
  const indexable = !/^noindex/.test(robots);
  const canonical = !isProtected && o.canonicalPath ? siteOrigin() + o.canonicalPath : "";
  const ogImage = siteOrigin() ? siteOrigin() + "/og-image.png" : "";
  const lines = [
    ...(canonical ? [`<link rel="canonical" href="${escapeHtml(canonical)}">`] : []),
    `<meta name="robots" content="${robots}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${siteName}">`,
    `<meta property="og:locale" content="${locale}">`,
    ...(canonical ? [`<meta property="og:url" content="${escapeHtml(canonical)}">`] : []),
    `<meta property="og:title" content="${escapeHtml(ogTitle)}">`,
    `<meta property="og:description" content="${escapeHtml(ogDescription)}">`,
    ...(ogImage
      ? [
          `<meta property="og:image" content="${escapeHtml(ogImage)}">`,
          `<meta property="og:image:type" content="image/png">`,
          `<meta property="og:image:width" content="1200">`,
          `<meta property="og:image:height" content="630">`
        ]
      : []),
    `<meta name="twitter:card" content="${ogImage ? "summary_large_image" : "summary"}">`,
    `<meta name="twitter:title" content="${escapeHtml(ogTitle)}">`,
    `<meta name="twitter:description" content="${escapeHtml(ogDescription)}">`,
    ...(ogImage ? [`<meta name="twitter:image" content="${escapeHtml(ogImage)}">`] : [])
  ];
  if (route.themeColor) lines.push(`<meta name="theme-color" content="${escapeHtml(route.themeColor)}">`);
  if (indexable && o.jsonLd) lines.push(`<script type="application/ld+json">${jsonForScript(o.jsonLd)}</script>`);
  return lines.join("\n  ");
}

function cssLinks(route: RouteConfig): string {
  return route.css
    .map((href) => `<link rel="stylesheet" href="${escapeHtml(href.startsWith("/") ? href : "/" + href)}" data-route-css="0">`)
    .join("\n  ");
}

function composeDocument(route: RouteConfig, pathname: string, markup: string, head: HeadOverride, ssrData?: SsrPageData): string {
  const isHome = pathname === "/";
  const isProtected = isProtectedRoute(route);
  let html = INDEX_TEMPLATE;

  if (!isHome) {
    const title = head.title || route.title;
    const description = head.description !== undefined ? head.description : route.description;
    html = html.replace(/<title>[^<]*<\/title>/, () => `<title>${escapeHtml(title)}</title>`);
    html = description
      ? html.replace(/<meta name="description" content="[^"]*">/, () => `<meta name="description" content="${escapeHtml(description)}">`)
      : html.replace(/<meta name="description" content="[^"]*">\s*/, "");
    html = html.replace(/<!-- SEO:BEGIN[\s\S]*?<!-- SEO:END -->/, () => routeHead(route, isProtected, head));
    html = html.replace(/<!-- NOSCRIPT:BEGIN[\s\S]*?<!-- NOSCRIPT:END -->\s*/, "");
  }

  html = html.replace('<link rel="manifest" href="manifest.json">', '<link rel="manifest" href="/manifest.json">');
  html = html.replace("</head>", () => `  ${cssLinks(route)}\n</head>`);
  const dataScript = ssrData ? `\n  <script id="__SSR_DATA__" type="application/json">${jsonForScript(ssrData)}</script>` : "";
  html = html.replace('<div id="route-outlet"></div>', () => `<div id="route-outlet" data-ssr="1">${markup}</div>${dataScript}`);
  return html;
}

type Rec = Record<string, unknown>;
const isRec = (v: unknown): v is Rec => typeof v === "object" && v !== null && !Array.isArray(v);
const nonEmpty = (v: unknown): v is string => typeof v === "string" && v.length > 0;

const SAFE_ICON = /^(?:<(?:path|circle|rect|line|polyline|polygon|ellipse)(?:\s+[a-zA-Z-]+="[^"<>]*")*\s*\/>)+$/;

interface RawLesson extends SsrLessonSummary {
  learn: string;
  fen: string;
  fenCaption: string;
  correctSan: string;
  explanation: string;
}

function parseDefinitions(raw: unknown): { categories: SsrLessonCategory[]; lessons: RawLesson[] } | null {
  if (!isRec(raw) || !Array.isArray(raw.categories) || !Array.isArray(raw.lessons)) return null;
  if (raw.categories.length === 0 || raw.lessons.length === 0) return null;
  const categories: SsrLessonCategory[] = [];
  for (const c of raw.categories) {
    if (!isRec(c) || !nonEmpty(c.id) || !nonEmpty(c.title) || typeof c.description !== "string") return null;
    categories.push({ id: c.id, title: c.title, description: c.description, icon: typeof c.icon === "string" && SAFE_ICON.test(c.icon) ? c.icon : "" });
  }
  const lessons: RawLesson[] = [];
  for (const l of raw.lessons) {
    if (!isRec(l) || !nonEmpty(l.id) || !nonEmpty(l.category) || !nonEmpty(l.title) || typeof l.summary !== "string") return null;
    if (!nonEmpty(l.learn) || !nonEmpty(l.fen) || !nonEmpty(l.correctSan) || !nonEmpty(l.explanation)) return null;
    lessons.push({
      id: l.id, category: l.category, title: l.title, summary: l.summary, learn: l.learn, fen: l.fen,
      fenCaption: typeof l.fenCaption === "string" ? l.fenCaption : "", correctSan: l.correctSan, explanation: l.explanation
    });
  }
  return { categories, lessons };
}

interface PageRender {
  status: number;
  ssr: SsrPageData;
  head: HeadOverride;
}

function lessonsRender(pathname: string, rawLessons: unknown): PageRender | null {
  const defs = parseDefinitions(rawLessons);
  if (!defs) return null;
  const origin = siteOrigin();

  if (pathname === "/lessons") {
    return {
      status: 200,
      ssr: { kind: "lessons", categories: defs.categories, lessons: defs.lessons.map(({ id, category, title, summary }) => ({ id, category, title, summary })) },
      head: {
        canonicalPath: "/lessons",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Lesson NusantaraChess",
          numberOfItems: defs.lessons.length,
          itemListElement: defs.lessons.map((l, i) => ({ "@type": "ListItem", position: i + 1, name: l.title, url: origin + "/lessons/" + encodeURIComponent(l.id) }))
        }
      }
    };
  }

  const m = pathname.match(/^\/lessons\/([^/]+)$/);
  if (!m) return null;
  let id = m[1];
  try { id = decodeURIComponent(m[1]).trim(); } catch { }
  const idx = defs.lessons.findIndex((l) => l.id === id);
  if (idx < 0) {
    return {
      status: 404,
      ssr: { kind: "lesson-not-found", id },
      head: { title: "Lesson tidak ditemukan — NusantaraChess", description: "Lesson yang diminta tidak ditemukan di NusantaraChess.", robots: "noindex, nofollow" }
    };
  }
  const lesson = defs.lessons[idx];
  const url = origin + "/lessons/" + encodeURIComponent(lesson.id);
  const category = defs.categories.find((c) => c.id === lesson.category);
  return {
    status: 200,
    ssr: {
      kind: "lesson",
      lesson: { id: lesson.id, title: lesson.title, learn: lesson.learn, fenCaption: lesson.fenCaption, side: lesson.fen.split(" ")[1] === "b" ? "Hitam" : "Putih" },
      prevId: idx > 0 ? defs.lessons[idx - 1].id : null,
      nextId: idx < defs.lessons.length - 1 ? defs.lessons[idx + 1].id : null
    },
    head: {
      title: lesson.title + " — NusantaraChess",
      description: lesson.summary || lesson.learn.slice(0, 160),
      canonicalPath: "/lessons/" + encodeURIComponent(lesson.id),
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "LearningResource",
            "@id": url + "#lesson",
            name: lesson.title,
            description: lesson.summary || lesson.learn.slice(0, 160),
            url,
            inLanguage: "id",
            ...(category ? { isPartOf: { "@type": "CollectionPage", name: category.title, url: origin + "/lessons" } } : {})
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Lesson", item: origin + "/lessons" },
              { "@type": "ListItem", position: 2, name: lesson.title, item: url }
            ]
          }
        ]
      }
    }
  };
}

function num(v: unknown): number | null {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
}

const LEADERBOARD_CATEGORIES: SsrLeaderboardCategory[] = ["bullet", "blitz", "rapid", "puzzle"];

function parseLeaderboardRows(payload: unknown): SsrLeaderboardRow[] | null {
  if (!isRec(payload) || !Array.isArray(payload.leaderboard)) return null;
  const rows: SsrLeaderboardRow[] = [];
  for (const r of payload.leaderboard) {
    if (!isRec(r) || !nonEmpty(r.username)) return null;
    const rank = num(r.rank), rating = num(r.rating);
    const games = r.gamesPlayed == null ? null : num(r.gamesPlayed);
    if (rank === null || rating === null || (r.gamesPlayed != null && games === null)) return null;
    rows.push({ rank, username: r.username, rating, gamesPlayed: games });
  }
  return rows;
}

function parseSearchResults(payload: unknown): SsrSearchResult[] | null {
  if (!isRec(payload) || !Array.isArray(payload.results)) return null;
  const out: SsrSearchResult[] = [];
  for (const r of payload.results) {
    if (!isRec(r) || !nonEmpty(r.username)) return null;
    const elo = num(r.eloBlitz);
    if (elo === null) return null;
    out.push({ username: r.username, eloBlitz: elo });
  }
  return out;
}

function leaderboardRender(ctx: SsrContext["leaderboard"]): PageRender | null {
  if (!ctx || !LEADERBOARD_CATEGORIES.includes(ctx.category as SsrLeaderboardCategory)) return null;
  const category = ctx.category as SsrLeaderboardCategory;
  const rows = parseLeaderboardRows(ctx.payload);
  if (!rows) return null;
  const searchQuery = ctx.searchQuery || "";
  let searchResults: SsrSearchResult[] | null = null;
  if (searchQuery) {
    searchResults = parseSearchResults(ctx.searchPayload);
    if (!searchResults) return null;
  }
  const origin = siteOrigin();
  const ssr: SsrPageData = { kind: "leaderboard", category, rows, searchQuery, searchResults };
  if (searchQuery) return { status: 200, ssr, head: { robots: "noindex, follow", canonicalPath: "/leaderboard" } };
  return {
    status: 200,
    ssr,
    head: {
      canonicalPath: category === "bullet" ? "/leaderboard" : "/leaderboard?category=" + category,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Leaderboard NusantaraChess — " + category.charAt(0).toUpperCase() + category.slice(1),
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: rows.length,
        itemListElement: rows.map((r) => ({ "@type": "ListItem", position: r.rank, name: r.username, url: origin + "/profile/" + encodeURIComponent(r.username) }))
      }
    }
  };
}

const SAFE_PHOTO = /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/;

function parsePublicProfile(payload: unknown): { user: SsrPublicUser; recentGames: SsrRecentGame[]; totalGames: number } | null {
  if (!isRec(payload) || !isRec(payload.user) || !Array.isArray(payload.recentGames)) return null;
  const u = payload.user;
  if (!nonEmpty(u.username)) return null;
  const n = {
    eloBullet: num(u.eloBullet), eloBlitz: num(u.eloBlitz), eloRapid: num(u.eloRapid), puzzleRating: num(u.puzzleRating),
    wins: num(u.wins), draws: num(u.draws), losses: num(u.losses), puzzleSolved: num(u.puzzleSolved)
  };
  if (Object.values(n).some((v) => v === null)) return null;
  const createdAt = u.createdAt == null ? null : typeof u.createdAt === "number" || typeof u.createdAt === "string" ? u.createdAt : null;
  const photo = typeof u.profilePhoto === "string" && u.profilePhoto.length <= 100000 && SAFE_PHOTO.test(u.profilePhoto) ? u.profilePhoto : "";
  const recentGames: SsrRecentGame[] = [];
  for (const g of payload.recentGames) {
    if (!isRec(g) || typeof g.opponentName !== "string" || typeof g.category !== "string" || typeof g.result !== "string") return null;
    const opponentElo = num(g.opponentElo), eloChange = num(g.eloChange), playedAt = num(g.playedAt);
    if (opponentElo === null || eloChange === null || playedAt === null) return null;
    recentGames.push({ ...(num(g.id) !== null ? { id: num(g.id) as number } : {}), opponentName: g.opponentName, opponentElo, category: g.category, result: g.result, eloChange, playedAt });
  }
  return {
    user: { username: u.username, createdAt, profilePhoto: photo, ...(n as { eloBullet: number; eloBlitz: number; eloRapid: number; puzzleRating: number; wins: number; draws: number; losses: number; puzzleSolved: number }) },
    recentGames,
    totalGames: Math.max(num(payload.totalGames) ?? 0, recentGames.length)
  };
}

function profileRender(ctx: SsrContext["profile"]): PageRender | null {
  if (!ctx || !ctx.username) return null;
  if (ctx.notFound) {
    return {
      status: 404,
      ssr: { kind: "profile-not-found", username: ctx.username },
      head: { title: "Pemain tidak ditemukan — NusantaraChess", description: "Pemain dengan username tersebut tidak ditemukan di NusantaraChess.", robots: "noindex, nofollow" }
    };
  }
  const parsed = parsePublicProfile(ctx.payload);
  if (!parsed) return null;
  const { user } = parsed;
  const origin = siteOrigin();
  const path = "/profile/" + encodeURIComponent(user.username);
  const description = "Profil " + user.username + " di NusantaraChess: rating Bullet " + user.eloBullet + ", Blitz " + user.eloBlitz + ", Rapid " + user.eloRapid + ", Puzzle " + user.puzzleRating + ".";
  let created = Number(user.createdAt);
  if (Number.isFinite(created) && created > 0 && created < 1e11) created *= 1000;
  const createdDate = Number.isFinite(created) && created > 0 ? new Date(created) : null;
  return {
    status: 200,
    ssr: { kind: "public-profile", user, recentGames: parsed.recentGames, totalGames: parsed.totalGames },
    head: {
      title: user.username + " — Profil NusantaraChess",
      description,
      canonicalPath: path,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": origin + path,
        url: origin + path,
        inLanguage: "id",
        ...(createdDate && !isNaN(createdDate.getTime()) ? { dateCreated: createdDate.toISOString() } : {}),
        mainEntity: { "@type": "Person", "@id": origin + path + "#person", name: user.username, url: origin + path, description }
      }
    }
  };
}

export function renderAppRoute(pathname: string, ctx: SsrContext = {}): SsrResult | null {
  if (!isAppSsrPath(pathname)) return null;
  const route = resolveRoute(pathname);
  if (!route) return null;
  const Page = PAGES[route.page];
  if (pathname === "/") {
    const rows = ctx.home && !ctx.home.failed ? parseLeaderboardRows(ctx.home.payload) : null;
    const top = rows ? rows.slice(0, 5) : [];
    const ssr: SsrPageData | undefined = top.length > 0 ? { kind: "home", topPlayers: top } : undefined;
    return {
      status: 200,
      cacheControl: rows ? HOME_CACHE_CONTROL : "no-store",
      html: composeDocument(route, pathname, renderToString(<Page ssr={ssr} />), {}, ssr)
    };
  }
  const data = pathname === "/leaderboard" ? leaderboardRender(ctx.leaderboard) : pathname.startsWith("/profile/") ? profileRender(ctx.profile) : lessonsRender(pathname, ctx.lessons);
  if (!data) return null;
  const clientData: SsrPageData = data.ssr.kind === "public-profile" && data.ssr.user.profilePhoto
    ? { ...data.ssr, user: { ...data.ssr.user, profilePhoto: "", photoInDom: true } }
    : data.ssr;
  return { status: data.status, html: composeDocument(route, pathname, renderToString(<Page ssr={data.ssr} />), data.head, clientData) };
}

export function spaShell(): string {
  return INDEX_TEMPLATE;
}
