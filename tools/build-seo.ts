#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CHECK_ONLY = process.argv.includes("--check");

const read = (p: any) => fs.readFileSync(path.join(ROOT, p), "utf8");
const cfg = JSON.parse(read("site.config.json"));

function fail(msg: any) {
  console.error("\u2718 " + msg);
  process.exit(1);
}

let origin: any;
try {
  const u = new URL(cfg.siteUrl);
  if (u.protocol !== "https:") fail("siteUrl harus https: " + cfg.siteUrl);
  if (u.pathname !== "/" || u.search || u.hash) fail("siteUrl harus origin saja tanpa path/query/hash: " + cfg.siteUrl);
  origin = u.origin;
} catch (e: any) {
  fail("siteUrl bukan URL valid: " + cfg.siteUrl);
}
if (!/^[A-Za-z0-9]+$/.test(cfg.siteName)) fail("siteName sebaiknya satu kata tanpa spasi (\"NusantaraChess\"): " + cfg.siteName);

function parseRouterRoutes() {
  const src = read("src/app/routes.ts");
  const start = src.indexOf("const ROUTES: Record<string, RouteConfig> = {");
  const end = src.indexOf("const LESSON_DETAIL_ROUTE");
  if (start < 0 || end < 0) fail("Tidak bisa mengurai ROUTES dari src/app/routes.ts");
  const block = src.slice(start, end).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const routes: Record<string, any> = {};
  const re = /^\s{2}"(\/[^"]*)":\s*\{([\s\S]*?)^\s{2}\}/gm;
  let m;
  while ((m = re.exec(block))) routes[m[1]] = { protected: /shared\/auth-gate\.js/.test(m[2]) };
  return routes;
}
const routes = parseRouterRoutes();

for (const r of cfg.publicRoutes) {
  if (!Object.prototype.hasOwnProperty.call(routes, r)) fail("publicRoutes memuat rute yang TIDAK ada di src/app/routes.ts: " + r);
  if (routes[r].protected) fail("publicRoutes memuat rute yang wajib login (memuat auth-gate.js): " + r);
}
if (new Set(cfg.publicRoutes).size !== cfg.publicRoutes.length) fail("publicRoutes berisi duplikat");

const routerSrc = read("src/app/routes.ts");
const homeBlock = routerSrc.slice(routerSrc.indexOf('"/": {'), routerSrc.indexOf('"/play": {'));
const homeTitle = (homeBlock.match(/title:\s*"([^"]+)"/) || [])[1];
const homeDesc = (homeBlock.match(/description:\s*"([^"]+)"/) || [])[1];
if (!homeTitle || !homeDesc) fail("Tidak menemukan title/description rute \"/\" di src/app/routes.ts");

const esc = (s: any) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escXml = (s: any) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const robots = [
  "# robots.txt - NusantaraChess",
  "# Dihasilkan oleh tools/build-seo.js dari site.config.json - jangan edit manual.",
  "#",
  "User-agent: *",
  "Allow: /",
  "",
  "User-agent: Googlebot",
  "Allow: /",
  "",
  "Sitemap: " + origin + "/sitemap.xml",
  "Sitemap: " + origin + "/sitemap-profiles.xml",
  ""
].join("\n");

const LESSONS_SEED = "server/data-seed/lessons.json";
function lessonIds(): string[] {
  let data: any;
  try { data = JSON.parse(read(LESSONS_SEED)); } catch (e: any) { fail("Tidak bisa membaca " + LESSONS_SEED + " untuk sitemap lesson: " + e.message); }
  const ids = (data && Array.isArray(data.lessons) ? data.lessons : []).map((l: any) => l && l.id);
  if (ids.length === 0 || ids.some((id: any) => typeof id !== "string" || !/^[A-Za-z0-9_-]+$/.test(id))) fail("id lesson di " + LESSONS_SEED + " kosong/tidak valid");
  if (new Set(ids).size !== ids.length) fail("id lesson duplikat di " + LESSONS_SEED);
  return ids;
}
const sitemapPaths: Array<[string, string]> = cfg.publicRoutes.map((r: any) => [r, r === "/" ? "1.0" : "0.8"]);
if (cfg.publicRoutes.includes("/lessons")) for (const id of lessonIds()) sitemapPaths.push(["/lessons/" + encodeURIComponent(id), "0.6"]);

const lastmod = process.env.SITEMAP_LASTMOD || new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) fail("SITEMAP_LASTMOD harus berformat YYYY-MM-DD: " + lastmod);

const urlEntries = sitemapPaths.map(([r, priority]) => {
  const loc = origin + (r === "/" ? "/" : r);
  return "  <url>\n    <loc>" + escXml(loc) + "</loc>\n    <lastmod>" + lastmod + "</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>" + priority + "</priority>\n  </url>";
});
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urlEntries.join("\n") + "\n" +
  "</urlset>\n";

const canonicalHome = origin + "/";
const ogImage = origin + "/og-image.png";
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": canonicalHome + "#website",
      "url": canonicalHome,
      "name": cfg.siteName,
      "alternateName": cfg.alternateNames,
      "description": homeDesc,
      "inLanguage": cfg.language
    },
    {
      "@type": "WebApplication",
      "@id": canonicalHome + "#app",
      "url": canonicalHome,
      "name": cfg.siteName,
      "alternateName": cfg.alternateNames,
      "description": homeDesc,
      "applicationCategory": "GameApplication",
      "operatingSystem": "Web",
      "inLanguage": cfg.language,
      "isPartOf": { "@id": canonicalHome + "#website" }
    }
  ]
};

const seoBlock = [
  "  <!-- SEO:BEGIN (dihasilkan oleh tools/build-seo.js - lihat README) -->",
  '  <link rel="canonical" href="' + esc(canonicalHome) + '">',
  '  <meta name="robots" content="index, follow, max-image-preview:large">',
  '  <meta name="application-name" content="' + esc(cfg.siteName) + '">',
  '  <meta name="apple-mobile-web-app-title" content="' + esc(cfg.siteName) + '">',
  '  <meta property="og:type" content="website">',
  '  <meta property="og:site_name" content="' + esc(cfg.siteName) + '">',
  '  <meta property="og:locale" content="' + esc(cfg.locale) + '">',
  '  <meta property="og:url" content="' + esc(canonicalHome) + '">',
  '  <meta property="og:title" content="' + esc(homeTitle) + '">',
  '  <meta property="og:description" content="' + esc(homeDesc) + '">',
  '  <meta property="og:image" content="' + esc(ogImage) + '">',
  '  <meta property="og:image:type" content="image/png">',
  '  <meta property="og:image:width" content="1200">',
  '  <meta property="og:image:height" content="630">',
  '  <meta property="og:image:alt" content="Ikon kuda catur ' + esc(cfg.siteName) + '">',
  '  <meta name="twitter:card" content="summary_large_image">',
  '  <meta name="twitter:title" content="' + esc(homeTitle) + '">',
  '  <meta name="twitter:description" content="' + esc(homeDesc) + '">',
  '  <meta name="twitter:image" content="' + esc(ogImage) + '">',
  '  <meta name="twitter:image:alt" content="Ikon kuda catur ' + esc(cfg.siteName) + '">',
  '  <script type="application/ld+json">',
  JSON.stringify(jsonLd, null, 2).split("\n").map((l) => "  " + l).join("\n"),
  "  </script>",
  "  <!-- SEO:END -->"
].join("\n");

const noscriptBlock = [
  "  <!-- NOSCRIPT:BEGIN (dihasilkan oleh tools/build-seo.js - lihat README) -->",
  "  <noscript>",
  "    <main>",
  "      <h1>" + esc(cfg.siteName) + " \u2014 Catur Indonesia, dari latihan sampai rating</h1>",
  "      <p>" + esc(homeDesc) + "</p>",
  "      <ul>",
  "        <li>Bermain online dengan sistem rating Elo (Bullet, Blitz, Rapid) dan validasi langkah di server.</li>",
  "        <li>Latihan melawan karakter bot Fahri, Adit, Dimas, dan Udin.</li>",
  "        <li>Puzzle personal dari basis data posisi Lichess.</li>",
  "        <li>Game Review dengan analisis Stockfish: akurasi, klasifikasi langkah, dan estimasi rating performa.</li>",
  "      </ul>",
  "      <p>" + esc(cfg.siteName) + " membutuhkan JavaScript untuk dimainkan. Aktifkan JavaScript di peramban Anda untuk masuk atau mendaftar.</p>",
  "    </main>",
  "  </noscript>",
  "  <!-- NOSCRIPT:END -->"
].join("\n");

let html = read("public/index.html");

function findOutsideComments(src: any, re: any) {
  const masked = src.replace(/<!--[\s\S]*?-->/g, (c: any) => " ".repeat(c.length));
  const m = masked.match(re);
  return m ? { index: m.index, length: m[0].length } : null;
}

function replaceOutsideComments(src: any, re: any, replacement: any) {
  const hit = findOutsideComments(src, re);
  if (!hit) return src;
  return src.slice(0, hit.index) + replacement + src.slice(hit.index + hit.length);
}

function replaceBlock(src: any, begin: any, end: any, block: any, anchorRe: any, position: any) {
  const b = src.indexOf(begin);
  const e = src.indexOf(end);
  if (b >= 0 && e > b) {
    const lineStart = src.lastIndexOf("\n", b) + 1;
    return src.slice(0, lineStart) + block + src.slice(e + end.length);
  }
  const hit = findOutsideComments(src, anchorRe);
  if (!hit) fail("Titik sisip (di luar komentar) tidak ditemukan untuk " + begin);
  if (position === "after") {
    const at = hit!.index + hit!.length;
    return src.slice(0, at) + "\n\n" + block + src.slice(at);
  }
  const lineStart = src.lastIndexOf("\n", hit!.index) + 1;
  return src.slice(0, lineStart) + block + "\n" + src.slice(lineStart);
}

html = replaceBlock(html, "<!-- SEO:BEGIN", "<!-- SEO:END -->", seoBlock, /<meta name="description"[^>]*>/, "after");
html = replaceBlock(html, "<!-- NOSCRIPT:BEGIN", "<!-- NOSCRIPT:END -->", noscriptBlock, /<div id="route-outlet">/, "before");

html = replaceOutsideComments(html, /<title>[^<]*<\/title>/, "<title>" + esc(homeTitle).replace(/&quot;/g, '"') + "</title>");
html = replaceOutsideComments(html, /<meta name="description" content="[^"]*">/, '<meta name="description" content="' + esc(homeDesc) + '">');

if (!fs.existsSync(path.join(ROOT, "public/favicon.svg"))) fail("public/favicon.svg tidak ada");
for (const f of ["public/og-image.png", "public/apple-touch-icon.png", "public/icon-192.png", "public/icon-512.png"]) {
  if (!fs.existsSync(path.join(ROOT, f))) fail(f + " tidak ada");
}
html = replaceOutsideComments(html, /[ \t]*<link rel="apple-touch-icon"[^>]*>\n?/, "");
html = replaceOutsideComments(html, /<link rel="icon"[^>]*>/, '<link rel="icon" type="image/svg+xml" href="/favicon.svg">\n  <link rel="apple-touch-icon" href="/apple-touch-icon.png">');

const outputs = { "public/robots.txt": robots, "public/sitemap.xml": sitemap, "public/index.html": html };
let drift = false;
for (const [file, content] of Object.entries(outputs)) {
  const target = path.join(ROOT, file);
  const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : null;
  const sameIgnoringLastmod = (a: any, b: any) => a !== null && a.replace(/<lastmod>[^<]*<\/lastmod>/g, "") === b.replace(/<lastmod>[^<]*<\/lastmod>/g, "");
  if (CHECK_ONLY) {
    if (!(file === "public/sitemap.xml" ? sameIgnoringLastmod(current, content) : current === content)) { drift = true; console.error("\u2718 tidak sinkron dengan site.config.json: " + file); }
    else console.log("\u2714 sinkron: " + file);
  } else {
    if (current !== content) { fs.writeFileSync(target, content); console.log("\u270E ditulis: " + file); }
    else console.log("= tidak berubah: " + file);
  }
}
if (CHECK_ONLY && drift) process.exit(1);
console.log("\nOrigin: " + origin + " | Rute di sitemap: " + sitemapPaths.map((x) => x[0]).join(", "));
