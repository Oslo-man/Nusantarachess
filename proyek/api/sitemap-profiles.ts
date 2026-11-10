"use strict";

const fs = require("fs");
const path = require("path");

const API_BASE = process.env.NUSANTARA_API_BASE || "https://nusantarachess-api.vercel.app/api";
const CATEGORIES = ["bullet", "blitz", "rapid", "puzzle"];
const USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/;

async function fetchJson(pathAndQuery: string): Promise<any> {
  const res = await fetch(API_BASE + pathAndQuery, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error("Permintaan API gagal (HTTP " + res.status + ")");
  return res.json();
}

function siteOrigin(req: any): string {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "site.config.json"), "utf8"));
    return new URL(cfg.siteUrl).origin;
  } catch (err) {
    const host = String(req.headers["x-forwarded-host"] || req.headers.host || "");
    return "https://" + host;
  }
}

module.exports = async function handler(req: any, res: any) {
  try {
    const payloads = await Promise.all(CATEGORIES.map((c) => fetchJson("/public/leaderboard?category=" + c + "&limit=100")));
    const names = new Set<string>();
    for (const p of payloads) {
      const rows = p && Array.isArray(p.leaderboard) ? p.leaderboard : [];
      for (const row of rows) {
        if (row && typeof row.username === "string" && USERNAME_RE.test(row.username)) names.add(row.username);
      }
    }
    const origin = siteOrigin(req);
    const lastmod = new Date().toISOString().slice(0, 10);
    const entries = [...names].sort().map(
      (n) => "  <url>\n    <loc>" + origin + "/profile/" + encodeURIComponent(n) + "</loc>\n    <lastmod>" + lastmod + "</lastmod>\n  </url>"
    );
    const xml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      entries.join("\n") + (entries.length ? "\n" : "") +
      "</urlset>\n";
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.end(xml);
  } catch (err) {
    console.error("[sitemap-profiles] Gagal membuat sitemap profil:", err);
    res.statusCode = 503;
    res.setHeader("Cache-Control", "no-store");
    res.end("Sitemap profil sementara tidak tersedia.");
  }
};
