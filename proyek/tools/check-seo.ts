#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const read = (p: any) => fs.readFileSync(path.join(ROOT, p), "utf8");
const exists = (p: any) => fs.existsSync(path.join(ROOT, p));
const existsPublic = (p: any) => exists("public/" + p);

let failures = 0;
let passes = 0;

function ok(cond: any, label: any, detail?: any) {
  if (cond) {
    passes++;
    console.log("  \u2714 " + label);
  } else {
    failures++;
    console.log("  \u2718 " + label + (detail ? "\n      -> " + detail : ""));
  }
}
function section(title: any) { console.log("\n" + title); }


function urlToSource(u: any) {
  if (u.startsWith("styles/")) return "src/" + u;
  if (u.startsWith("features/")) return "src/" + u.replace(/\.js$/, ".ts");
  if (u.startsWith("shared/")) return u.replace(/\.js$/, ".ts");
  if (u.startsWith("vendor/")) return "public/" + u;
  return u;
}

function parseRouterRoutes() {
  const src = read("src/app/routes.ts");
  const start = src.indexOf("const ROUTES: Record<string, RouteConfig> = {");
  const end = src.indexOf("const LESSON_DETAIL_ROUTE");
  const block = src.slice(start, end).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const routes: Record<string, any> = {};
  const re = /^\s{2}"(\/[^"]*)":\s*\{([\s\S]*?)^\s{2}\}/gm;
  let m;
  while ((m = re.exec(block))) {
    const body = m[2];
    routes[m[1]] = {
      protected: /shared\/auth-gate\.js/.test(body),
      page: (body.match(/page:\s*"([^"]+)"/) || [])[1],
      css: [...body.matchAll(/"\/?((?:styles)\/[^"?]+\.css)"/g)].map((x) => x[1]),
      js: [...body.matchAll(/"\/?((?:features|shared|vendor)\/[^"?]+\.js)(?:\?[^"]*)?"/g)].map((x) => x[1])
    };
  }
  return routes;
}

section("index.html");
const html = read("public/index.html");
const head = (html.match(/<head>([\s\S]*?)<\/head>/i) || [])[1] || "";
const headNoComments = head.replace(/<!--[\s\S]*?-->/g, "");

const title = (headNoComments.match(/<title>([^<]*)<\/title>/i) || [])[1];
ok(!!title, "<title> ada");
ok(title && /NusantaraChess/.test(title), "<title> memuat brand \"NusantaraChess\"", title);
ok(title && title.length >= 15 && title.length <= 70, "<title> panjang wajar (15-70 karakter)", title && title.length + " karakter");

const desc = (headNoComments.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [])[1];
ok(!!desc, "meta description ada");
ok(desc && /NusantaraChess/.test(desc), "meta description memuat brand \"NusantaraChess\"");
ok(desc && desc.length >= 70 && desc.length <= 175, "meta description panjang wajar (70-175 karakter)", desc && desc.length + " karakter");

ok(!/noindex/i.test(headNoComments), "tidak ada noindex di <head>");
ok(!/name="robots"[^>]*content="[^"]*none/i.test(headNoComments), "tidak ada robots=none di <head>");

const canonical = (headNoComments.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i) || [])[1];
ok(!!canonical, "link rel=canonical ada");
ok(canonical && /^https:\/\//.test(canonical), "canonical berupa URL absolut https", canonical);

const ogTags = ["og:title", "og:description", "og:type", "og:url", "og:site_name", "og:locale"];
for (const t of ogTags) {
  ok(new RegExp('property="' + t + '"').test(headNoComments), "meta " + t + " ada");
}
ok(/name="twitter:card"/.test(headNoComments), "meta twitter:card ada");
ok(/name="twitter:title"/.test(headNoComments), "meta twitter:title ada");
ok(/name="twitter:description"/.test(headNoComments), "meta twitter:description ada");

const brandMeta = (headNoComments.match(/property="og:site_name"\s+content="([^"]*)"/i) || [])[1];
ok(brandMeta === "NusantaraChess", "og:site_name persis \"NusantaraChess\" (tanpa spasi)", brandMeta);

const ld = [...headNoComments.matchAll(/<script\s+type="application\/ld\+json"\s*>([\s\S]*?)<\/script>/gi)];
ok(ld.length > 0, "JSON-LD (structured data) ada");
let ldParsed = [];
for (const m of ld) {
  try { ldParsed.push(JSON.parse(m[1])); } catch (e: any) { ok(false, "JSON-LD valid", e.message); }
}
if (ldParsed.length) {
  ok(true, "semua blok JSON-LD adalah JSON valid (" + ldParsed.length + " blok)");
  const flat = ldParsed.flatMap((x) => (Array.isArray(x["@graph"]) ? x["@graph"] : [x]));
  const site = flat.find((x) => x["@type"] === "WebSite");
  ok(!!site, "JSON-LD punya entitas WebSite");
  ok(site && site.name === "NusantaraChess", "WebSite.name = \"NusantaraChess\"", site && site.name);
  ok(site && Array.isArray(site.alternateName) && site.alternateName.includes("Nusantara Chess"),
     "WebSite.alternateName mencakup varian \"Nusantara Chess\"");
  ok(!flat.some((x) => x.potentialAction), "tidak ada SearchAction karangan (situs tidak punya pencarian publik)");
  ok(!flat.some((x) => x["@type"] === "Organization" && x.logo),
     "tidak ada logo Organization karangan (tidak ada file gambar di proyek)");
}

const bodyPart = (html.match(/<body>([\s\S]*?)<\/body>/i) || [])[1] || "";
ok(/<noscript>/i.test(bodyPart), "<noscript> ada (konten untuk crawler/browser tanpa JS)");
ok(/<noscript>[\s\S]*<h1>[\s\S]*NusantaraChess[\s\S]*<\/h1>[\s\S]*<\/noscript>/i.test(bodyPart),
   "<noscript> memuat <h1> dengan brand \"NusantaraChess\"");
const bodyOutsideNoscript = bodyPart.replace(/<noscript>[\s\S]*?<\/noscript>/gi, "");
ok((bodyOutsideNoscript.match(/<h1/gi) || []).length === 0,
   "index.html statis tidak punya <h1> di luar <noscript> (konten asli dirender komponen React rute saat runtime)",
   (bodyOutsideNoscript.match(/<h1/gi) || []).length + " ditemukan");

const hrefs = [...headNoComments.matchAll(/(?:href|content)="([^"]+)"/g)].map((m) => m[1]);
const localRefs = hrefs.filter((h) => /\.(png|jpe?g|svg|ico|webp|json|xml)(\?|$)/i.test(h) && !/^https?:\/\//i.test(h));
for (const ref of localRefs) {
  const clean = ref.replace(/^\.?\//, "").split("?")[0];
  ok(existsPublic(clean), "file yang dirujuk <head> ada di public/: " + ref);
}
const absImg = hrefs.filter((h) => /^https?:\/\/[^"]+\.(png|jpe?g|webp|svg)(\?|$)/i.test(h));
ok(absImg.length === 0 || absImg.every((h) => {
  try { return existsPublic(new URL(h).pathname.replace(/^\//, "")); } catch (e: any) { return false; }
}), "og:image/twitter:image (jika ada) menunjuk file yang benar-benar ada", absImg.join(", "));

section("robots.txt");
ok(existsPublic("robots.txt"), "public/robots.txt ada");
if (existsPublic("robots.txt")) {
  const robots = read("public/robots.txt");
  const lines = robots.split(/\r?\n/).map((l: any) => l.replace(/#.*$/, "").trim()).filter(Boolean);
  ok(lines.some((l: any) => /^user-agent:\s*\*$/i.test(l)), "ada blok User-agent: *");
  const disallowAll = lines.some((l: any) => /^disallow:\s*\/\s*$/i.test(l));
  ok(!disallowAll, "tidak ada \"Disallow: /\" (situs tidak diblokir total)");
  const blocked = lines.filter((l: any) => /^disallow:/i.test(l)).map((l: any) => l.replace(/^disallow:\s*/i, ""));
  for (const asset of ["/styles/", "/features/", "/shared/", "/app/", "/vendor/"]) {
    ok(!blocked.some((b: any) => b && asset.startsWith(b)), "aset render tidak diblokir: " + asset);
  }
  ok(lines.some((l: any) => /^allow:\s*\/\s*$/i.test(l)), "\"Allow: /\" eksplisit ada");
  const sm = lines.find((l: any) => /^sitemap:/i.test(l));
  ok(!!sm, "direktif Sitemap: ada");
  ok(sm && /^sitemap:\s*https:\/\/[^\s]+\/sitemap\.xml$/i.test(sm), "Sitemap: berupa URL absolut https ke /sitemap.xml", sm);
}

section("sitemap.xml");
ok(exists("public/sitemap.xml"), "public/sitemap.xml ada");
if (exists("public/sitemap.xml")) {
  const xml = read("public/sitemap.xml");
  ok(/^<\?xml version="1\.0" encoding="UTF-8"\?>/.test(xml), "deklarasi XML UTF-8 ada");
  ok(/<urlset[^>]+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/.test(xml), "namespace sitemap 0.9 benar");
  const opens = (xml.match(/<url>/g) || []).length;
  const closes = (xml.match(/<\/url>/g) || []).length;
  ok(opens === closes && opens > 0, "tag <url> seimbang dan tidak kosong (" + opens + " entri)");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  ok(locs.length === opens, "setiap <url> punya tepat satu <loc>");
  ok(locs.every((l) => /^https:\/\/[^/\s]+(\/[^\s?#]*)?$/.test(l)), "semua <loc> berupa URL absolut https tanpa query/fragment", locs.join(", "));
  ok(new Set(locs).size === locs.length, "tidak ada <loc> duplikat");
  const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1].trim());
  ok(lastmods.length === opens && lastmods.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)), "setiap <url> punya <lastmod> berformat YYYY-MM-DD");
  const hosts = new Set(locs.map((l) => new URL(l).host));
  ok(hosts.size === 1, "semua <loc> memakai host yang sama", [...hosts].join(", "));

  const routes = parseRouterRoutes();
  const publicRoutes = Object.keys(routes).filter((r) => !routes[r].protected);
  const privateRoutes = Object.keys(routes).filter((r) => routes[r].protected);
  const locPaths = locs.map((l) => new URL(l).pathname);

  ok(publicRoutes.length > 0, "router.js: terdeteksi rute publik (tanpa auth-gate): " + publicRoutes.join(", "));
  for (const r of publicRoutes) ok(locPaths.includes(r), "rute publik ada di sitemap: " + r);
  for (const r of privateRoutes) ok(!locPaths.includes(r), "rute privat (wajib login) TIDAK di sitemap: " + r);
  let lessonIdsSeed: string[] = [];
  try { lessonIdsSeed = JSON.parse(read("server/data-seed/lessons.json")).lessons.map((l: any) => l.id); } catch (e: any) { ok(false, "server/data-seed/lessons.json terbaca", e.message); }
  const lessonPaths = lessonIdsSeed.map((id) => "/lessons/" + encodeURIComponent(id));
  if (publicRoutes.includes("/lessons")) {
    ok(lessonIdsSeed.length > 0, "data seed lesson punya id (" + lessonIdsSeed.length + ")");
    for (const lp of lessonPaths) ok(locPaths.includes(lp), "detail lesson ada di sitemap: " + lp);
    ok(locPaths.filter((p) => /^\/lessons\/.+/.test(p)).every((p) => lessonPaths.includes(p)), "sitemap hanya memuat /lessons/:id yang ada di data seed");
  } else {
    ok(!locPaths.some((p) => /^\/lessons\/.+/.test(p)), "/lessons bukan rute publik -> /lessons/:id tidak di sitemap");
  }
  ok(!locPaths.some((p) => /admin|login|api|profile/i.test(p)), "tidak ada path admin/login/api/profile di sitemap");
  ok(locPaths.every((p) => p === "/" || Object.prototype.hasOwnProperty.call(routes, p) || lessonPaths.includes(p)),
     "setiap <loc> cocok dengan rute yang didefinisikan di router.js (atau detail lesson dari data seed)");

  if (canonical) ok(new URL(canonical).host === [...hosts][0], "host canonical == host sitemap");
  if (existsPublic("robots.txt")) {
    const smLine = read("public/robots.txt").split(/\r?\n/).find((l: any) => /^sitemap:/i.test(l));
    if (smLine) ok(new URL(smLine.replace(/^sitemap:\s*/i, "").trim()).host === [...hosts][0], "host robots.txt Sitemap == host sitemap");
  }
}

section("Integritas rute (src/app/routes.ts)");
const routes = parseRouterRoutes();
ok(Object.keys(routes).length >= 9, "router.js terurai: " + Object.keys(routes).length + " rute statis");
let missing = [];
const pagesIndex = read("src/app/pages/index.ts");
for (const [r, cfg] of Object.entries(routes)) {
  if (!cfg.page) { missing.push(r + " -> field page tidak ada"); continue; }
  if (!new RegExp('(^|[\\s{,])"?' + cfg.page.replace(/[-]/g, "\\-") + '"?\\s*:').test(pagesIndex)) missing.push(r + " -> page \"" + cfg.page + "\" tidak terdaftar di src/app/pages/index.ts");
  for (const f of [...cfg.css, ...cfg.js]) {
    if (!exists(urlToSource(f))) missing.push(r + " -> " + f + " (sumber: " + urlToSource(f) + ")");
  }
}
for (const [label, page] of [["/lessons/:id", "lesson-detail"], ["/profile/:username", "public-profile"]]) {
  if (!new RegExp('"' + page + '"').test(pagesIndex)) missing.push(label + " -> page \"" + page + "\" tidak terdaftar");
}
ok(missing.length === 0, "semua komponen halaman/CSS/JS rute ada di disk dan terdaftar", missing.join("; "));

section("Lessons publik (SSR berdata)");
{
  const routesSrc = read("src/app/routes.ts");
  const detailBlock = routesSrc.slice(routesSrc.indexOf("export const LESSON_DETAIL_ROUTE"), routesSrc.indexOf("export const PUBLIC_PROFILE_ROUTE"))
    .replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  ok(detailBlock.length > 0 && !/auth-gate\.js/.test(detailBlock), "LESSON_DETAIL_ROUTE tidak memuat auth-gate.js (detail lesson publik)");
  ok(!!routes["/lessons"] && !routes["/lessons"].protected, "rute /lessons tidak memuat auth-gate.js (katalog publik)");
  for (const f of ["src/app/pages/lessons/LessonsPage.tsx", "src/app/pages/lessons/LessonDetailPage.tsx"]) {
    ok(exists(f) && !/<AuthGateOverlay/.test(read(f)), f + " tidak merender AuthGateOverlay");
  }
  const rewrites = (JSON.parse(read("vercel.json")).rewrites || []).map((r: any) => r.source + " -> " + r.destination);
  ok(rewrites.includes("/lessons -> /api/ssr/lessons") && rewrites.includes("/lessons/:id -> /api/ssr/lessons/:id"), "vercel.json: /lessons dan /lessons/:id dirender lewat /api/ssr");
}

section("Arsitektur SSR vs SPA murni (vercel.json, render, berkas lama)");
{
  const rewrites = (JSON.parse(read("vercel.json")).rewrites || []).map((r: any) => r.source + " -> " + r.destination);
  ok(rewrites.includes("/leaderboard -> /api/ssr/leaderboard") && rewrites.includes("/profile/:username -> /api/ssr/profile/:username"), "vercel.json: /leaderboard dan /profile/:username dirender lewat /api/ssr");
  ok(!rewrites.some((r: string) => /^\/(library|profile) -> /.test(r)), "vercel.json: /library dan /profile (akun sendiri) TIDAK di jalur SSR (jatuh ke /spa.html)");
  const renderSrc = read("src/app/ssr/render.tsx");
  const guard = (renderSrc.match(/export function isAppSsrPath[\s\S]*?\n}/) || [""])[0];
  ok(/"\/leaderboard"/.test(guard) && /profile/.test(guard) && !/"\/library"/.test(guard) && !/pathname === "\/profile"/.test(guard), "isAppSsrPath: leaderboard & profil publik ya; /library & /profile tidak");
  for (const f of ["api/ssr/_lib/leaderboard-page.ts", "api/ssr/_lib/profile-page.ts", "api/ssr/_lib/shell.ts", "src/features/leaderboard/leaderboard-ssr-hydrate.ts", "src/features/profile/profile-ssr-hydrate.ts"]) {
    ok(!exists(f), "implementasi render lama sudah dihapus: " + f);
  }
}


section("Sintaks berkas yang disentuh");
try { JSON.parse(read("public/manifest.json")); ok(true, "manifest.json JSON valid"); } catch (e: any) { ok(false, "manifest.json JSON valid", e.message); }
try { JSON.parse(read("vercel.json")); ok(true, "vercel.json JSON valid"); } catch (e: any) { ok(false, "vercel.json JSON valid", e.message); }
ok(exists("dist/app/main.js"), "bundel React dist/app/main.js ada (jalankan npm run build)");
if (exists("dist/app/main.js")) {
  try { new Function(read("dist/app/main.js")); ok(true, "dist/app/main.js sintaks valid"); } catch (e: any) { ok(false, "dist/app/main.js sintaks valid", e.message); }
}
ok(!exists("routes"), "folder routes/ (fragment HTML lama) sudah tidak ada");

console.log("\n" + "=".repeat(60));
console.log(passes + " lulus, " + failures + " gagal");
process.exit(failures ? 1 : 0);
