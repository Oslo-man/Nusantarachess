"use strict";

const LEADERBOARD_CATEGORIES = ["bullet", "blitz", "rapid", "puzzle"];

const API_BASE = process.env.NUSANTARA_API_BASE || "https://nusantarachess-api.vercel.app/api";

async function fetchJson(path: any, timeoutMs: number = 8000) {
  const res = await fetch(API_BASE + path, { signal: AbortSignal.timeout(timeoutMs) });
  const payload = await res.json().catch((): any => null);
  if (!res.ok) {
    const err: any = new Error((payload && payload.error) || ("Permintaan API gagal (HTTP " + res.status + ")"));
    err.status = res.status;
    throw err;
  }
  return payload;
}

let appRender: any = null;
function loadAppRender() {
  if (!appRender) appRender = require("./_lib/app-render.cjs");
  return appRender;
}

function appRoutePath(segments: string[]): string | null {
  if (segments.length === 1) {
    if (segments[0] === "home") return "/";
    if (segments[0] === "lessons") return "/lessons";
    if (segments[0] === "leaderboard") return "/leaderboard";
  }
  if (segments.length === 2 && segments[0] === "lessons") return "/lessons/" + segments[1];
  if (segments.length === 2 && segments[0] === "profile") return "/profile/" + encodeURIComponent(segments[1]);
  return null;
}

function sendHtml(res: any, status: any, html: any, cacheControl?: string) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", cacheControl || "public, s-maxage=60, stale-while-revalidate=300");
  res.end(html);
}

function renderErrorPage(message: any) {
  return (
    '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8">' +
    '<title>Gagal memuat halaman — NusantaraChess</title></head><body>' +
    '<main style="padding:40px 20px;text-align:center;font-family:sans-serif;">' +
    '<h1>Gagal memuat halaman</h1><p>' + message + '</p>' +
    '<a href="/">Kembali ke beranda</a></main>' +
    '<script src="/shared/language.js"></script><script src="/shared/i18n-en-exact.js"></script><script src="/shared/i18n-en-patterns.js"></script><script src="/shared/i18n-en.js"></script><script src="/shared/i18n.js"></script>' +
    '</body></html>'
  );
}

module.exports = async function handler(req: any, res: any) {
  try {
    const segments = Array.isArray(req.query.path) ? req.query.path : [req.query.path].filter(Boolean);

    const appPath = appRoutePath(segments);
    if (appPath) {
      try {
        const ctx: { home?: unknown; lessons?: unknown; leaderboard?: unknown; profile?: unknown } = {};
        if (appPath === "/") {
          try {
            ctx.home = { payload: await fetchJson("/public/leaderboard?category=bullet&limit=5", 2500) };
          } catch (err) {
            console.error("[ssr] Top 5 landing gagal diambil, landing tanpa bagian itu:", err);
            ctx.home = { failed: true };
          }
        } else if (appPath === "/lessons" || appPath.startsWith("/lessons/")) {
          ctx.lessons = await fetchJson("/lessons/definitions");
        } else if (appPath === "/leaderboard") {
          const category = LEADERBOARD_CATEGORIES.includes(req.query.category) ? req.query.category : "bullet";
          const searchQuery = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 40) : "";
          const searchNeedsApi = searchQuery.length >= 2 && searchQuery.length <= 20;
          const [payload, searchPayload] = await Promise.all([
            fetchJson("/public/leaderboard?category=" + encodeURIComponent(category) + "&limit=50"),
            searchNeedsApi ? fetchJson("/public/search-players?q=" + encodeURIComponent(searchQuery)) : Promise.resolve(searchQuery ? { results: [] } : null)
          ]);
          ctx.leaderboard = { category, payload, searchQuery, searchPayload };
        } else if (appPath.startsWith("/profile/")) {
          const username = segments[1];
          try {
            ctx.profile = { username, payload: await fetchJson("/public/profile/" + encodeURIComponent(username)) };
          } catch (err) {
            if (err.status !== 404) throw err;
            ctx.profile = { username, notFound: true };
          }
        }
        const rendered = loadAppRender().renderAppRoute(appPath, ctx);
        if (rendered) return sendHtml(res, rendered.status, rendered.html, rendered.cacheControl);
      } catch (err) {
        console.error("[ssr] Gagal merender " + appPath + ", memakai cangkang SPA:", err);
      }
      return sendHtml(res, 200, loadAppRender().spaShell(), "no-store");
    }

    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(renderErrorPage("Halaman tidak ditemukan."));
  } catch (err) {
    console.error("[ssr] Gagal merender halaman:", err);
    res.statusCode = 502;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(renderErrorPage("Tidak bisa memuat data dari server. Coba muat ulang halaman."));
  }
};
