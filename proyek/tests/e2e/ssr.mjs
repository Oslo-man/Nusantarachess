#!/usr/bin/env node
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { startSsrServer, TINY_PNG } from "./ssr-server.mjs";
import { installMockApi, makeUser } from "./mock-api.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(here, "../..");
const requireFrom = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = requireFrom("playwright")); }
catch (e) {
  if (!process.env.PLAYWRIGHT_NODE_MODULES) { console.error("Paket 'playwright' tidak ditemukan."); process.exit(2); }
  ({ chromium } = createRequire(path.join(path.resolve(process.env.PLAYWRIGHT_NODE_MODULES), "/"))("playwright"));
}
for (const f of ["dist/app/main.js", "api/ssr/_lib/app-render.cjs"]) {
  if (!fs.existsSync(path.join(PROJECT_ROOT, f))) { console.error("Berkas " + f + " belum ada: jalankan `npm run build` dulu."); process.exit(2); }
}

const results = [];
const record = (name, ok, detail = "") => { results.push({ name, ok }); console.log((ok ? "  PASS " : "  FAIL ") + name + (ok ? "" : "  -> " + detail)); };
async function test(name, fn) { try { await fn(); record(name, true); } catch (e) { record(name, false, String((e && e.message) || e).split("\n")[0]); } }
const assert = (c, m) => { if (!c) throw new Error(m); };

const srv = await startSsrServer({ projectRoot: PROJECT_ROOT, distRoot: path.join(PROJECT_ROOT, "dist") });
const BASE = "http://localhost:" + srv.port;
const browser = await chromium.launch();
const lessons = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, "server/data-seed/lessons.json"), "utf8"));
const lessonId = lessons.lessons[1].id;
const get = async (p, base = BASE) => { const r = await fetch(base + p); return { status: r.status, type: r.headers.get("content-type") || "", cc: r.headers.get("cache-control") || "", html: await r.text() }; };
const lessonObj = lessons.lessons[1];
const escHtml = (x) => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const jsonLdBlocks = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
const SITE = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, "site.config.json"), "utf8")).siteUrl.replace(/\/$/, "");

async function open({ loggedIn = true, lang, user, timezoneId } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce", ...(timezoneId ? { timezoneId } : {}) });
  const calls = [];
  await installMockApi(ctx, { root: PROJECT_ROOT, loggedIn, calls, ...(user ? { user } : {}) });
  await ctx.route(/unpkg\.com|cdnjs|googleapis|gstatic/, (r) => r.abort());
  await ctx.addInitScript(([li, lg]) => {
    try { if (li) localStorage.setItem("nusantara_session_token", "tok"); if (lg) localStorage.setItem("nusantara_lang", lg); } catch (e) {}
  }, [loggedIn, lang || null]);
  const page = await ctx.newPage();
  const t = { ctx, page, calls, pageErrors: [], consoleErrors: [], hydrateWarn: [] };
  page.on("pageerror", (e) => t.pageErrors.push(e.message));
  page.on("console", (m) => {
    const txt = m.text();
    if (/\[ssr\] hydrate/.test(txt)) t.hydrateWarn.push(txt);
    else if (m.type() === "error" && !/Failed to load resource/.test(txt)) t.consoleErrors.push(txt);
  });
  return t;
}
const visible = (page, sel) => page.waitForSelector(sel, { state: "visible", timeout: 8000 });

const RAW = [
  ["/", 'id="landing-view"', "NusantaraChess — Bermain", false],
  ["/lessons", 'class="lessons-page"', "Lesson", false],
  ["/lessons/" + lessonId, 'id="lessonBoard"', "Lesson", false]
];
for (const [p, marker, titlePart, isProtected] of RAW) {
  await test(`HTML server ${p}: markup halaman, <title>, CSS rute, tanpa data pengguna`, async () => {
    const r = await get(p);
    assert(r.status === 200 && /text\/html/.test(r.type), "status/type: " + r.status + " " + r.type);
    assert(r.html.includes('id="route-outlet" data-ssr="1"'), "outlet SSR tidak ada");
    assert(r.html.includes(marker), "markup halaman tidak ada di HTML server: " + marker);
    assert(new RegExp("<title>[^<]*" + titlePart).test(r.html) || (p === "/lessons/" + lessonId && r.html.includes("<title>" + escHtml(lessons.lessons.find((l) => l.id === lessonId).title) + " — NusantaraChess</title>")), "title salah");
    assert(/<link rel="stylesheet" href="\/styles\/tokens\.css" data-route-css="0">/.test(r.html), "CSS rute tidak ada di <head>");
    assert(!r.html.includes("TesterNusantara"), "data pengguna bocor ke HTML server");
    assert(r.html.includes('src="/app/main.js"'), "bundel klien tidak dimuat");
    if (isProtected) {
      assert(r.html.includes('id="authGateOverlay"'), "overlay gerbang login tidak dirender");
      assert(/<meta name="robots" content="noindex, nofollow">/.test(r.html), "rute wajib login harus noindex");
    } else {
      assert(!/noindex/.test(r.html) && r.html.includes('rel="canonical"'), "beranda harus terindeks + canonical");
      assert(r.html.includes("application/ld+json"), "JSON-LD beranda hilang");
    }
  });
}
await test("HTML server /?next=...&guestBlocked=1 (query dari gerbang login) tetap SSR beranda", async () => {
  const r = await get("/?next=%2Flibrary&guestBlocked=1");
  assert(r.status === 200 && r.html.includes('id="landing-view"') && r.html.includes('data-ssr="1"'), "tidak SSR");
});
const callsSince = (n) => srv.backendCalls.slice(n);
await test("leaderboard SSR: baris dari API, tab <a>, SEO (canonical, ItemList), cache s-maxage=60, tanpa data pengguna", async () => {
  const before = srv.backendCalls.length;
  const r = await get("/leaderboard");
  assert(r.status === 200 && /text\/html/.test(r.type), "status/type: " + r.status);
  assert(r.html.includes('id="route-outlet" data-ssr="1"') && r.html.includes('<script id="__SSR_DATA__" type="application/json">'), "outlet/data hydrate tidak ada");
  for (const i of [1, 2, 3]) assert(r.html.includes('href="/profile/Pemain' + i + '"') && r.html.includes(">Pemain" + i + "<"), "baris Pemain" + i + " tidak ada");
  assert(r.html.includes("#1") && r.html.includes("11 partai") && r.html.includes("top3"), "rank/partai/top3 tidak dirender");
  assert(/leaderboard-tab is-active"[^>]*data-cat="bullet"/.test(r.html) && (r.html.match(/<a class="leaderboard-tab/g) || []).length === 4, "tab kategori salah");
  assert(/id="authGateOverlay"[^>]*hidden=""/.test(r.html), "overlay harus tetap tersembunyi");
  assert(r.html.includes('<link rel="canonical" href="' + SITE + '/leaderboard">') && !/noindex/.test(r.html) && /content="index, follow/.test(r.html), "canonical/robots salah");
  const list = jsonLdBlocks(r.html).find((x) => x["@type"] === "ItemList");
  assert(list && list.numberOfItems === 3 && list.itemListElement[0].url === SITE + "/profile/Pemain1" && list.itemListElement[0].position === 1, "JSON-LD ItemList salah");
  assert(/s-maxage=60/.test(r.cc) && !/no-store/.test(r.cc), "Cache-Control: " + r.cc);
  assert(!r.html.includes("TesterNusantara") && !/my-?rank[^>]*>[^<]*#/i.test(r.html), "data pengguna bocor");
  assert(callsSince(before).filter((c) => c.includes("search-players")).length === 0, "API pencarian dipanggil tanpa ?search=");
});
await test("leaderboard SSR: ?category valid dipakai (canonical sendiri), tak valid -> bullet, parameter tak dikenal diabaikan", async () => {
  let before = srv.backendCalls.length;
  const b = await get("/leaderboard?category=blitz");
  assert(b.html.includes('<link rel="canonical" href="' + SITE + '/leaderboard?category=blitz">'), "canonical blitz salah");
  assert(/leaderboard-tab is-active"[^>]*data-cat="blitz"/.test(b.html) && b.html.includes('name="category" value="blitz"'), "tab/input blitz salah");
  assert(callsSince(before).includes("/api/public/leaderboard?category=blitz&limit=50"), "API tidak dipanggil dengan category=blitz: " + callsSince(before).join(","));
  before = srv.backendCalls.length;
  const x = await get("/leaderboard?category=zzz&utm_source=x&foo=1");
  assert(x.html.includes('<link rel="canonical" href="' + SITE + '/leaderboard">') && /leaderboard-tab is-active"[^>]*data-cat="bullet"/.test(x.html), "kategori tak valid harus bullet");
  assert(!x.html.includes("utm_source") && !x.html.includes("foo=1"), "parameter tak dikenal bocor ke HTML");
  assert(callsSince(before).every((c) => !c.includes("utm_source") && !c.includes("zzz")), "parameter tak dikenal diteruskan ke API");
});
await test("leaderboard SSR ?search=: robots noindex,follow, canonical /leaderboard tanpa query, hasil dari API, tanpa ItemList, nilai di-escape", async () => {
  const s1 = await get("/leaderboard?search=pem");
  assert(/<meta name="robots" content="noindex, follow">/.test(s1.html), "robots harus noindex, follow");
  assert(s1.html.includes('<link rel="canonical" href="' + SITE + '/leaderboard">') && s1.html.includes('property="og:url" content="' + SITE + '/leaderboard"'), "canonical/og:url harus /leaderboard tanpa query");
  assert(!s1.html.includes("application/ld+json"), "halaman hasil pencarian tidak boleh memuat ItemList");
  assert(s1.html.includes('value="pem"') && /id="leaderboardSearchResults" class="leaderboard-list">/.test(s1.html) && s1.html.includes("1500"), "hasil pencarian tidak dirender");
  assert(/s-maxage=60/.test(s1.cc), "Cache-Control: " + s1.cc);
  const s2 = await get("/leaderboard?category=blitz&search=pem");
  assert(s2.html.includes('<link rel="canonical" href="' + SITE + '/leaderboard">') && /leaderboard-tab is-active"[^>]*data-cat="blitz"/.test(s2.html), "category+search: canonical harus tanpa query, tab tetap blitz");
  const before = srv.backendCalls.length;
  const s3 = await get("/leaderboard?search=%3Cscript%3Ealert(1)%3C%2Fscript%3E");
  assert(!s3.html.includes("<script>alert(1)") && s3.html.includes('value="&lt;script&gt;alert(1)&lt;/script&gt;"') && s3.html.includes("\\u003cscript\\u003e"), "nilai search tidak di-escape");
  const s4 = await get("/leaderboard?search=a");
  assert(s4.html.includes("Tidak ada pemain dengan nama itu."), "q pendek harus 'tidak ada pemain'");
  assert(callsSince(before).filter((c) => c.includes("search-players")).length === 0, "API pencarian dipanggil untuk q <2 atau >20 karakter");
});
await test("profil publik SSR: judul, hero, rating, game terbaru, SEO (canonical, ProfilePage), cache s-maxage=60, tanpa data berlebih", async () => {
  const r = await get("/profile/Pemain1");
  assert(r.status === 200, "status " + r.status);
  assert(r.html.includes("<title>Pemain1 — Profil NusantaraChess</title>") && r.html.includes('id="profileNameHeading">Pemain1</h1>'), "title/h1 salah");
  assert(r.html.includes('id="profileJoined">Bergabung ') && r.html.includes('id="ratingBullet">812<') && r.html.includes('id="ratingPuzzle">1180<') && r.html.includes('id="recordWins">14<'), "hero/rating salah");
  assert((r.html.match(/class="gh-row"/g) || []).length === 3 && r.html.includes(">Lawan1</span>") && r.html.includes(">(901)</span>") && r.html.includes("+8") && r.html.includes("-6"), "game terbaru salah");
  assert(r.html.includes('<link rel="canonical" href="' + SITE + '/profile/Pemain1">') && /content="index, follow/.test(r.html), "canonical/robots salah");
  const pp = jsonLdBlocks(r.html).find((x) => x["@type"] === "ProfilePage");
  assert(pp && pp.url === SITE + "/profile/Pemain1" && pp.mainEntity["@type"] === "Person" && pp.mainEntity.name === "Pemain1", "JSON-LD ProfilePage salah");
  assert(pp.dateCreated === new Date(1759000000000).toISOString(), "dateCreated salah: " + pp.dateCreated);
  assert(/s-maxage=60/.test(r.cc) && !/no-store/.test(r.cc), "Cache-Control: " + r.cc);
  assert(!r.html.includes("TesterNusantara") && !r.html.includes("isAdminUnlocked") && !r.html.includes("customOpponent"), "field yang tidak perlu ikut ke HTML/JSON");
  assert(r.html.includes('<script id="__SSR_DATA__" type="application/json">'), "data hydrate tidak ada");
});
await test("profil publik SSR: foto hanya satu kali di HTML (tidak diulang di JSON hydrate); 404 noindex tanpa canonical", async () => {
  const f = await get("/profile/Fotoku");
  assert(f.html.split(TINY_PNG).length - 1 === 1, "foto muncul " + (f.html.split(TINY_PNG).length - 1) + "x (harus 1)");
  assert(f.html.includes('<img src="' + TINY_PNG + '" alt=""') && f.html.includes('"photoInDom":true'), "foto/photoInDom tidak benar");
  const g = await get("/profile/ghost");
  assert(g.status === 404 && g.html.includes("Pemain tidak ditemukan") && g.html.includes('data-ssr="1"'), "404 tidak dirender");
  assert(/<meta name="robots" content="noindex, nofollow">/.test(g.html) && !g.html.includes('rel="canonical"') && !g.html.includes("application/ld+json"), "404 harus noindex tanpa canonical/JSON-LD");
  const x = await get("/profile/ghost%3Cb%3E");
  assert(!x.html.includes("<b>") && x.status === 404, "username 404 tidak di-escape");
});
const SHELL_CHECKS = async (b, paths) => {
  for (const [p, want] of paths) {
    const r = await get(p, "http://localhost:" + b.port);
    assert(r.status === want, p + " status " + r.status + " (harus " + want + ")");
    if (want === 200) {
      assert(!r.html.includes("data-ssr") && r.html.includes('<div id="route-outlet"></div>'), p + " bukan cangkang SPA");
      assert(r.cc === "no-store", p + " harus no-store, dapat: " + r.cc);
    }
  }
};
for (const mode of ["error", "invalid"]) {
  await test(`API leaderboard ${mode} -> cangkang SPA no-store (bukan 502); API pencarian gagal hanya mematikan halaman ?search=`, async () => {
    const b = await startSsrServer({ projectRoot: PROJECT_ROOT, distRoot: path.join(PROJECT_ROOT, "dist"), api: { leaderboard: mode } });
    try { await SHELL_CHECKS(b, [["/leaderboard", 200], ["/leaderboard?category=blitz", 200]]); } finally { b.close(); }
    const c = await startSsrServer({ projectRoot: PROJECT_ROOT, distRoot: path.join(PROJECT_ROOT, "dist"), api: { search: mode } });
    try {
      await SHELL_CHECKS(c, [["/leaderboard?search=pem", 200]]);
      const ok = await get("/leaderboard", "http://localhost:" + c.port);
      assert(ok.status === 200 && ok.html.includes('data-ssr="1"'), "tanpa ?search= leaderboard harus tetap SSR");
    } finally { c.close(); }
  });
  await test(`API profil ${mode} -> cangkang SPA no-store (bukan 502, bukan 404); profil yang memang tidak ada tetap 404`, async () => {
    const b = await startSsrServer({ projectRoot: PROJECT_ROOT, distRoot: path.join(PROJECT_ROOT, "dist"), api: { profile: mode } });
    try { await SHELL_CHECKS(b, [["/profile/Pemain1", 200], ["/profile/ghost", 404]]); } finally { b.close(); }
  });
}
await test("lessons publik /lessons: katalog dari API di HTML server, SEO (canonical, ItemList), cache s-maxage=60, tanpa overlay login/noindex, tanpa jawaban", async () => {
  const r = await get("/lessons");
  assert(r.status === 200, "status " + r.status);
  for (const l of lessons.lessons) {
    assert(r.html.includes(escHtml(l.title)), "judul lesson tidak ada di HTML server: " + l.id);
    assert(r.html.includes('href="/lessons/' + l.id + '"'), "tautan lesson tidak ada: " + l.id);
  }
  for (const c of lessons.categories) assert(r.html.includes('id="cat-' + c.id + '"'), "kategori tidak ada: " + c.id);
  assert(!r.html.includes("authGateOverlay"), "overlay login masih dirender");
  assert(!/noindex/.test(r.html), "katalog lesson tidak boleh noindex");
  assert(r.html.includes('<link rel="canonical" href="' + SITE + '/lessons">'), "canonical /lessons salah");
  assert(r.html.includes('property="og:url" content="' + SITE + '/lessons"') && r.html.includes('name="twitter:title"'), "og/twitter tidak lengkap");
  assert(/<meta name="robots" content="index, follow/.test(r.html), "robots harus index, follow");
  const list = jsonLdBlocks(r.html).find((x) => x["@type"] === "ItemList");
  assert(list && list.numberOfItems === lessons.lessons.length && list.itemListElement.length === lessons.lessons.length, "JSON-LD ItemList salah");
  assert(list.itemListElement[0].url === SITE + "/lessons/" + lessons.lessons[0].id, "url ItemList salah");
  assert(r.html.includes('<script id="__SSR_DATA__" type="application/json">'), "data hydrate tidak disisipkan");
  assert(!r.html.includes(lessons.lessons[0].explanation.slice(0, 40)), "penjelasan/jawaban lesson bocor di HTML katalog");
  assert(/s-maxage=60/.test(r.cc) && !/no-store/.test(r.cc), "Cache-Control salah: " + r.cc);
  assert(!r.html.includes("TesterNusantara"), "data pengguna bocor");
});
await test("lessons publik /lessons/:id: judul, Learn, tombol prev/next, SEO (canonical, LearningResource), cache s-maxage=60, tanpa jawaban", async () => {
  const r = await get("/lessons/" + lessonObj.id);
  assert(r.status === 200, "status " + r.status);
  assert(r.html.includes("<title>" + escHtml(lessonObj.title) + " — NusantaraChess</title>"), "title per-lesson salah");
  assert(r.html.includes('id="lessonTitle">' + escHtml(lessonObj.title) + "</h1>"), "h1 lesson tidak dirender server");
  assert(r.html.includes('id="lessonLearnText">' + escHtml(lessonObj.learn) + "</p>"), "teks Learn tidak dirender server");
  assert(r.html.includes('name="description" content="' + escHtml(lessonObj.summary) + '"'), "meta description bukan ringkasan lesson");
  const prev = r.html.match(/id="lessonPrevBtn" href="([^"]*)"/), next = r.html.match(/id="lessonNextBtn" href="([^"]*)"/);
  assert(prev && prev[1] === "/lessons/" + lessons.lessons[0].id && next && next[1] === "/lessons/" + lessons.lessons[2].id, "tautan prev/next salah");
  assert(!r.html.includes("authGateOverlay") && !/noindex/.test(r.html), "detail lesson harus publik & terindeks");
  assert(r.html.includes('<link rel="canonical" href="' + SITE + "/lessons/" + lessonObj.id + '">'), "canonical detail salah");
  const graph = jsonLdBlocks(r.html).flatMap((x) => x["@graph"] || [x]);
  const res = graph.find((x) => x["@type"] === "LearningResource"), crumbs = graph.find((x) => x["@type"] === "BreadcrumbList");
  assert(res && res.name === lessonObj.title && res.url === SITE + "/lessons/" + lessonObj.id, "JSON-LD LearningResource salah");
  assert(crumbs && crumbs.itemListElement.length === 2, "JSON-LD BreadcrumbList salah");
  assert(!r.html.includes(lessonObj.explanation.slice(0, 40)), "penjelasan/jawaban lesson bocor di HTML detail");
  assert(/s-maxage=60/.test(r.cc) && !/no-store/.test(r.cc), "Cache-Control salah: " + r.cc);
});
await test("lessons: id tidak ada -> 404 (noindex, tanpa canonical), id berbahaya di-escape", async () => {
  const r = await get("/lessons/tidak-ada");
  assert(r.status === 404, "status harus 404, dapat " + r.status);
  assert(/<meta name="robots" content="noindex, nofollow">/.test(r.html) && !r.html.includes('rel="canonical"'), "404 harus noindex tanpa canonical");
  assert(r.html.includes("tidak ditemukan") && r.html.includes('data-ssr="1"'), "halaman 404 lesson tidak dirender");
  const x = await get("/lessons/%3Cb%3Ex");
  assert(x.status === 404 && !x.html.includes("<b>x") && x.html.includes("&lt;b&gt;x"), "id lesson tidak di-escape");
  assert(!/<script id="__SSR_DATA__"[^>]*>[^]*<b>x/.test(x.html), "JSON data memuat < mentah");
});
for (const mode of ["error", "invalid"]) {
  await test(`API lessons ${mode}: /lessons & /lessons/:id -> cangkang SPA no-store (200, tanpa data-ssr), bukan 502/halaman berhasil`, async () => {
    const b = await startSsrServer({ projectRoot: PROJECT_ROOT, distRoot: path.join(PROJECT_ROOT, "dist"), api: { lessons: mode } });
    try {
      for (const p of ["/lessons", "/lessons/" + lessonObj.id, "/lessons/tidak-ada"]) {
        const r = await get(p, "http://localhost:" + b.port);
        assert(r.status === 200, p + " status " + r.status);
        assert(!r.html.includes("data-ssr") && r.html.includes('<div id="route-outlet"></div>'), p + " bukan cangkang SPA");
        assert(r.cc === "no-store", p + " harus no-store, dapat: " + r.cc);
      }
      if (mode === "error") {
        const t = await open({ loggedIn: false });
        await t.page.goto("http://localhost:" + b.port + "/lessons");
        await t.page.waitForFunction(() => document.getElementById("lessonCategories") && document.getElementById("lessonCategories").children.length > 0, null, { timeout: 8000 });
        assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors.join(" | "));
        await t.ctx.close();
      }
    } finally { b.close(); }
  });
}
await test("tamu (belum login): /lessons & /lessons/:id terbuka tanpa dialihkan, tanpa API progres, hydrate bersih", async () => {
  for (const route of ["/lessons", "/lessons/" + lessonObj.id]) {
    const t = await open({ loggedIn: false });
    await t.page.goto(BASE + route);
    if (route === "/lessons") await t.page.waitForFunction(() => document.querySelectorAll(".lesson-card").length >= 12, null, { timeout: 8000 });
    else await t.page.waitForFunction(() => document.getElementById("lessonBoard").children.length > 0, null, { timeout: 8000 });
    await t.page.waitForTimeout(500);
    assert(new URL(t.page.url()).pathname === route, route + " dialihkan ke " + t.page.url());
    assert(await t.page.locator("#authGateOverlay").count() === 0, route + ": overlay login ada");
    assert(!t.calls.some((c) => /\/lessons\/progress|\/complete/.test(c)), route + ": tamu memanggil API progres: " + t.calls.join(","));
    clean(t, route);
    await t.ctx.close();
  }
});
await test("login: progres diterapkan ke daftar hasil SSR tanpa mengganti markup (definisi tidak diambil ulang)", async () => {
  const t = await open();
  await t.page.goto(BASE + "/lessons");
  await t.page.waitForSelector(".lesson-card-status.completed", { timeout: 8000 });
  const done = await t.page.$$eval("a.lesson-card:has(.lesson-card-status.completed)", (els) => els.map((e) => e.getAttribute("href")));
  assert(done.length === 1 && done[0] === "/lessons/" + lessons.lessons[0].id, "badge selesai salah: " + done.join(","));
  assert(t.calls.includes("GET /lessons/progress"), "progres tidak diminta");
  assert(!t.calls.includes("GET /lessons/definitions"), "daftar SSR diambil/dirender ulang oleh klien");
  clean(t, "/lessons");
  await t.ctx.close();
});
{
  const { ChessGame } = requireFrom(path.join(PROJECT_ROOT, "shared/chess-rules.js"));
  const norm = (x) => String(x).replace(/[+#!?]/g, "");
  const game = ChessGame.fromFEN(lessonObj.fen);
  let correct = null;
  for (let i = 0; i < 64 && !correct; i++) for (const m of game.legalMovesFor(i)) { const after = game.clone(); after.applyMove(m); if (norm(game.moveToSANFull(m, after)) === norm(lessonObj.correctSan)) { correct = m; break; } }
  for (const loggedIn of [false, true]) {
    await test(`jawaban benar di detail lesson (${loggedIn ? "login: progres disimpan" : "tamu: ajakan masuk, progres TIDAK disimpan"})`, async () => {
      assert(correct, "langkah benar tidak ditemukan");
      const t = await open({ loggedIn });
      await t.page.goto(BASE + "/lessons/" + lessonObj.id);
      await t.page.waitForFunction(() => document.querySelectorAll('#lessonBoard [data-idx]').length === 64, null, { timeout: 8000 });
      await t.page.locator('#lessonBoard [data-idx="' + correct.from + '"]').click();
      await t.page.locator('#lessonBoard [data-idx="' + correct.to + '"]').click();
      await t.page.waitForFunction(() => /Jawaban benar/.test(document.getElementById("lessonMoveHint").textContent), null, { timeout: 8000 });
      const prompt = await t.page.locator("#lessonMoveHint a.lesson-login-prompt").count();
      const completed = t.calls.filter((c) => /^POST \/lessons\/.+\/complete$/.test(c));
      if (loggedIn) assert(completed.length === 1 && prompt === 0, "login: complete=" + completed.length + " prompt=" + prompt);
      else assert(completed.length === 0 && prompt === 1, "tamu: complete=" + completed.length + " prompt=" + prompt);
      assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors.join(" | "));
      await t.ctx.close();
    });
  }
}
await test("leaderboard (tamu): hydrate bersih, daftar server tidak diambil ulang, tab tanpa reload (URL diperbarui), pencarian instan", async () => {
  const t = await open({ loggedIn: false });
  await t.page.goto(BASE + "/leaderboard");
  await t.page.waitForFunction(() => document.querySelectorAll("#leaderboardList a.leaderboard-row").length === 3);
  await t.page.waitForTimeout(600);
  assert(!t.calls.some((c) => /leaderboard/.test(c)), "klien mengambil ulang daftar yang sudah dirender server: " + t.calls.join(","));
  assert(await t.page.evaluate(() => document.getElementById("leaderboardLoadingMsg").hidden && document.getElementById("leaderboardEmptyMsg").hidden), "pesan memuat/kosong tampil");
  clean(t, "/leaderboard");
  await t.page.evaluate(() => { window.__marker = 42; });
  await t.page.click('.leaderboard-tab[data-cat="blitz"]');
  await t.page.waitForFunction(() => document.querySelectorAll("#leaderboardList a.leaderboard-row").length === 5);
  assert(await t.page.evaluate(() => window.__marker === 42), "tab memicu reload halaman penuh");
  assert(new URL(t.page.url()).search === "?category=blitz", "URL tidak diperbarui: " + t.page.url());
  assert(t.calls.includes("GET /public/leaderboard") && await t.page.locator('.leaderboard-tab.is-active[data-cat="blitz"]').count() === 1, "tab blitz tidak aktif / API publik tidak dipanggil");
  assert(await t.page.locator('#leaderboardSearchForm input[name="category"]').inputValue() === "blitz", "input category form pencarian tidak mengikuti tab");
  await t.page.fill("#leaderboardSearchInput", "pem");
  await t.page.waitForFunction(() => !document.getElementById("leaderboardSearchResults").hidden && document.querySelectorAll("#leaderboardSearchResults a.leaderboard-row").length === 1, null, { timeout: 5000 });
  assert(t.calls.includes("GET /public/search-players"), "pencarian instan tidak memanggil API");
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors.join(" | "));
  await t.ctx.close();
});
await test("leaderboard (login): baris sendiri ditandai '(kamu)' + 'posisimu' pada daftar hasil server, tanpa mengganti daftar", async () => {
  const t = await open({ user: makeUser({ username: "Pemain1" }) });
  await t.page.goto(BASE + "/leaderboard");
  await t.page.waitForSelector("#leaderboardList a.leaderboard-row.is-me", { timeout: 8000 });
  const txt = await t.page.textContent("#leaderboardList a.leaderboard-row.is-me .leaderboard-username");
  assert(txt === "Pemain1 (kamu)", "label (kamu) salah: " + txt);
  assert(await t.page.locator("#leaderboardList a.leaderboard-row.is-me").count() === 1, "harus tepat satu baris is-me");
  await t.page.waitForFunction(() => !document.getElementById("leaderboardMyRank").hidden, null, { timeout: 5000 });
  assert(t.calls.includes("GET /leaderboard") && !t.calls.includes("GET /public/leaderboard"), "login harus memakai endpoint /leaderboard (myRank) saja: " + t.calls.join(","));
  clean(t, "/leaderboard");
  await t.ctx.close();
});
await test("leaderboard -> profil publik lewat navigasi SPA (tanpa reload); profil dimuat klien dari API bila tanpa data server", async () => {
  const t = await open({ loggedIn: false });
  await t.page.goto(BASE + "/leaderboard");
  await t.page.waitForSelector("#leaderboardList a.leaderboard-row");
  await t.page.evaluate(() => { window.__marker = 7; });
  await t.page.click("#leaderboardList a.leaderboard-row >> nth=0");
  await t.page.waitForFunction(() => location.pathname === "/profile/Pemain1" && document.getElementById("profileNameHeading") && document.getElementById("profileNameHeading").textContent === "Pemain1", null, { timeout: 8000 });
  assert(await t.page.evaluate(() => window.__marker === 7), "navigasi ke profil memuat ulang halaman");
  assert(t.calls.includes("GET /public/profile/Pemain1"), "profil tidak diambil dari API pada navigasi SPA");
  assert(await t.page.locator(".gh-row").count() === 1, "game terbaru tidak dirender");
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors.join(" | "));
  await t.ctx.close();
});
await test("profil publik (tamu): hydrate bersih, data server tidak diambil ulang; foto tetap utuh dan tanggal sama di zona waktu lain", async () => {
  const t = await open({ loggedIn: false, timezoneId: "America/Los_Angeles" });
  await t.page.goto(BASE + "/profile/Pemain1");
  await t.page.waitForSelector(".gh-row");
  await t.page.waitForTimeout(600);
  assert(!t.calls.some((c) => /public\/profile/.test(c)), "profil yang sudah dirender server diambil ulang: " + t.calls.join(","));
  clean(t, "/profile/Pemain1");
  await t.ctx.close();
  const f = await open({ loggedIn: false });
  await f.page.goto(BASE + "/profile/Fotoku");
  await f.page.waitForSelector("#profileAvatar img");
  await f.page.waitForTimeout(400);
  assert(await f.page.getAttribute("#profileAvatar img", "src") === TINY_PNG, "foto profil berubah setelah hydrate");
  clean(f, "/profile/Fotoku");
  await f.ctx.close();
  const k = await open({ loggedIn: false });
  await k.page.goto(BASE + "/profile/Kosong");
  await k.page.waitForSelector("#recentGamesEmpty:not([hidden])", { timeout: 8000 });
  clean(k, "/profile/Kosong");
  await k.ctx.close();
});
await test("profil tidak ada (404 dari server): halaman 'Pemain tidak ditemukan' tampil dan tetap utuh setelah hydrate", async () => {
  const t = await open({ loggedIn: false });
  const resp = await t.page.goto(BASE + "/profile/ghost");
  assert(resp.status() === 404, "status " + resp.status());
  await t.page.waitForTimeout(600);
  assert((await t.page.textContent(".profile-page h1")) === "Pemain tidak ditemukan", "judul 404 hilang setelah hydrate");
  clean(t, "/profile/ghost");
  await t.ctx.close();
});
await test("API leaderboard gagal: cangkang SPA tetap memuat kategori & pencarian dari URL (/leaderboard?category=blitz&search=pem)", async () => {
  const b = await startSsrServer({ projectRoot: PROJECT_ROOT, distRoot: path.join(PROJECT_ROOT, "dist"), api: { leaderboard: "error" } });
  try {
    const t = await open({ loggedIn: false });
    await t.page.goto("http://localhost:" + b.port + "/leaderboard?category=blitz&search=pem");
    await t.page.waitForFunction(() => document.querySelectorAll("#leaderboardList a.leaderboard-row").length === 5, null, { timeout: 8000 });
    await t.page.waitForFunction(() => !document.getElementById("leaderboardSearchResults").hidden && document.querySelectorAll("#leaderboardSearchResults a.leaderboard-row").length === 1, null, { timeout: 5000 });
    assert(await t.page.locator('.leaderboard-tab.is-active[data-cat="blitz"]').count() === 1, "tab blitz tidak aktif");
    assert(await t.page.inputValue("#leaderboardSearchInput") === "pem", "input pencarian tidak diisi dari URL");
    assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors.join(" | "));
    await t.ctx.close();
  } finally { b.close(); }
});
const OPT = { projectRoot: PROJECT_ROOT, distRoot: path.join(PROJECT_ROOT, "dist") };
await test("landing SSR: lima pemain teratas dari API leaderboard dengan tautan profil, cache s-maxage=600, tanpa data pengguna", async () => {
  const before = srv.backendCalls.length;
  const r = await get("/");
  assert(r.status === 200 && r.html.includes('id="landing-view"') && r.html.includes('data-ssr="1"'), "landing tidak dirender");
  assert(r.html.includes('id="topPlayersHeading">Pemain Teratas</h2>'), "bagian pemain teratas tidak ada");
  for (const i of [1, 2, 3]) assert(r.html.includes('class="top-player" href="/profile/Pemain' + i + '"') && r.html.includes(">Pemain" + i + "<"), "tautan profil Pemain" + i + " tidak ada");
  assert(r.html.includes('href="/leaderboard" data-route-link=""'), "tautan ke leaderboard lengkap tidak ada");
  assert(callsSince(before).includes("/api/public/leaderboard?category=bullet&limit=5"), "API top 5 tidak dipanggil dengan benar: " + callsSince(before).join(","));
  assert(/<script id="__SSR_DATA__" type="application\/json">\{"kind":"home"/.test(r.html), "data hydrate home tidak ada");
  assert(/s-maxage=600/.test(r.cc) && !/no-store/.test(r.cc), "Cache-Control landing: " + r.cc);
  assert(!r.html.includes("TesterNusantara") && /<title>[^<]*NusantaraChess/.test(r.html) && r.html.includes('rel="canonical"'), "metadata/pengguna");
  const b = await startSsrServer({ ...OPT, api: { leaderboard: "many" } });
  try {
    const m = await get("/", "http://localhost:" + b.port);
    assert((m.html.match(/class="top-player"/g) || []).length === 5 && !m.html.includes(">Pemain6<"), "harus tepat 5 pemain");
  } finally { b.close(); }
});
for (const mode of ["error", "invalid", "empty"]) {
  await test(`landing SSR, API leaderboard ${mode}: landing tetap tampil tanpa bagian pemain teratas (${mode === "empty" ? "daftar kosong sah -> cache 600" : "varian terdegradasi -> no-store"})`, async () => {
    const b = await startSsrServer({ ...OPT, api: { leaderboard: mode } });
    try {
      const r = await get("/", "http://localhost:" + b.port);
      assert(r.status === 200 && r.html.includes('data-ssr="1"') && r.html.includes('id="landing-view"') && r.html.includes('id="heroCta"'), "landing harus tetap dirender server");
      assert(!r.html.includes("top-players") && !r.html.includes("__SSR_DATA__"), "bagian/data pemain teratas tidak boleh ada");
      if (mode === "empty") assert(/s-maxage=600/.test(r.cc), "daftar kosong yang sah tetap di-cache 600: " + r.cc);
      else assert(r.cc === "no-store", "varian terdegradasi harus no-store, dapat: " + r.cc);
      const t = await open({ loggedIn: false });
      await t.page.goto("http://localhost:" + b.port + "/");
      await t.page.waitForSelector("#heroCta", { state: "visible" });
      await t.page.waitForTimeout(500);
      assert(await t.page.locator(".top-players").count() === 0, "bagian muncul di klien padahal server tidak merendernya");
      clean(t, "/");
      await t.ctx.close();
    } finally { b.close(); }
  });
}
await test("landing SSR: API leaderboard tidak menjawab -> landing tetap tampil dalam batas 2,5 dtk (bukan 8 dtk), no-store", async () => {
  const b = await startSsrServer({ ...OPT, api: { leaderboard: "hang" } });
  try {
    const t0 = Date.now();
    const r = await get("/", "http://localhost:" + b.port);
    const ms = Date.now() - t0;
    assert(r.status === 200 && r.html.includes('id="landing-view"') && !r.html.includes("top-players"), "landing/bagian salah");
    assert(r.cc === "no-store", "harus no-store: " + r.cc);
    assert(ms >= 2000 && ms < 6000, "waktu respons " + ms + " ms (harus sekitar 2,5 dtk)");
  } finally { b.close(); }
});
await test("landing (tamu): bagian pemain teratas tampil, hydrate bersih, klik pemain -> profil lewat navigasi SPA tanpa reload", async () => {
  const t = await open({ loggedIn: false });
  await t.page.goto(BASE + "/");
  await t.page.waitForSelector(".top-players .top-player", { state: "visible" });
  await t.page.waitForTimeout(500);
  assert(await t.page.locator(".top-player").count() === 3, "jumlah pemain tidak sama dengan HTML server");
  clean(t, "/");
  await t.page.evaluate(() => { window.__marker = 9; });
  await t.page.click(".top-player >> nth=0");
  await t.page.waitForFunction(() => location.pathname === "/profile/Pemain1" && document.getElementById("profileNameHeading") && document.getElementById("profileNameHeading").textContent === "Pemain1", null, { timeout: 8000 });
  assert(await t.page.evaluate(() => window.__marker === 9), "klik pemain memuat ulang halaman");
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors.join(" | "));
  await t.ctx.close();
});
await test("landing (login): dashboard tampil dan bagian pemain teratas ikut tersembunyi bersama landing", async () => {
  const t = await open();
  await t.page.goto(BASE + "/");
  await t.page.waitForFunction(() => document.getElementById("landing-view").classList.contains("hidden"), null, { timeout: 8000 });
  assert(await t.page.locator(".top-players").isVisible() === false, "bagian pemain teratas terlihat untuk pengguna login");
  clean(t, "/");
  await t.ctx.close();
});
await test("landing dalam bahasa English: bagian pemain teratas diterjemahkan tanpa peringatan hydrate", async () => {
  const t = await open({ loggedIn: false, lang: "en" });
  await t.page.goto(BASE + "/");
  await t.page.waitForSelector(".top-players", { state: "visible" });
  await t.page.waitForTimeout(800);
  const head = await t.page.textContent("#topPlayersHeading");
  assert(head === "Top Players", "judul tidak diterjemahkan: " + head);
  assert(t.hydrateWarn.length === 0, "peringatan hydrate: " + t.hydrateWarn.join(" | "));
  await t.ctx.close();
});
await test("rute SPA murni (/play, /bot, /puzzles, /gamereview, /library, /profile) memakai cangkang SPA tanpa SSR", async () => {
  for (const p of ["/play", "/bot", "/puzzles", "/gamereview", "/library", "/profile"]) {
    const r = await get(p);
    assert(r.status === 200 && !r.html.includes("data-ssr") && r.html.includes('<div id="route-outlet"></div>'), p + " berubah");
  }
});

await test("render server gagal -> cangkang SPA (200, tanpa data-ssr), halaman tetap berfungsi lewat router klien", async () => {
  const broken = await startSsrServer({ projectRoot: PROJECT_ROOT, distRoot: path.join(PROJECT_ROOT, "dist"), breakRenderer: true });
  try {
    const r = await fetch("http://localhost:" + broken.port + "/lessons");
    const html = await r.text();
    assert(r.status === 200 && !html.includes("data-ssr") && html.includes('<div id="route-outlet"></div>'), "tidak jatuh ke cangkang SPA: " + r.status);
    assert((r.headers.get("cache-control") || "") === "no-store", "cangkang cadangan tidak boleh di-cache");
    const t = await open();
    await t.page.goto("http://localhost:" + broken.port + "/lessons");
    await t.page.waitForFunction(() => document.getElementById("lessonCategories") && document.getElementById("lessonCategories").children.length > 0, null, { timeout: 8000 });
    assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors.join(" | "));
    await t.ctx.close();
  } finally { broken.close(); }
});

const CHECKS = {
  "/": async (p) => { await visible(p, "#menu-container"); assert((await p.textContent("#menu-container")).includes("TesterNusantara"), "dashboard Home tidak menampilkan pengguna"); },
  "/library": async (p) => { await visible(p, ".library-page"); await p.waitForFunction(() => document.getElementById("libraryList").children.length > 0, null, { timeout: 8000 }); },
  "/lessons": async (p) => { await p.waitForFunction(() => document.getElementById("lessonCategories").children.length > 0, null, { timeout: 8000 }); },
  ["/lessons/" + lessonId]: async (p) => { await p.waitForFunction(() => document.getElementById("lessonBoard").children.length > 0, null, { timeout: 8000 }); },
  "/profile": async (p) => { await p.waitForFunction(() => document.querySelector(".profile-page").textContent.includes("TesterNusantara"), null, { timeout: 8000 }); }
};
function clean(t, label) {
  assert(t.pageErrors.length === 0, label + " pageerror: " + t.pageErrors.join(" | "));
  assert(t.consoleErrors.length === 0, label + " console.error: " + t.consoleErrors.join(" | "));
  assert(t.hydrateWarn.length === 0, label + " hydrate tidak cocok: " + t.hydrateWarn.join(" | "));
}
const SPA_ONLY = new Set(["/library", "/profile"]);
for (const [route, check] of Object.entries(CHECKS)) {
  await test(`browser ${route}: URL langsung + refresh ${SPA_ONLY.has(route) ? "memakai cangkang SPA (/spa.html), fitur jalan" : "dirender server, di-hydrate, fitur jalan"} (login)`, async () => {
    const t = await open();
    const resp = await t.page.goto(BASE + route);
    const body = await resp.text();
    if (SPA_ONLY.has(route)) assert(!body.includes("data-ssr") && body.includes('<div id="route-outlet"></div>'), "rute SPA murni tidak boleh dirender server");
    else assert(body.includes('data-ssr="1"'), "respons dokumen bukan hasil SSR");
    await check(t.page);
    assert(await t.page.locator("#route-outlet").count() === 1, "outlet tidak benar");
    if (!SPA_ONLY.has(route)) assert(await t.page.locator("link[data-route-css]").count() > 0, "CSS rute dari server tidak ada");
    await t.page.waitForLoadState("networkidle");
    await t.page.reload();
    await check(t.page);
    await t.page.waitForLoadState("networkidle");
    await t.page.waitForTimeout(300);
    clean(t, route);
    assert(await t.page.locator("#authGateOverlay").count() <= 1, "overlay ganda");
    await t.ctx.close();
  });
}
for (const route of ["/library", "/profile"]) {
  await test(`proteksi auth ${route}: tanpa sesi -> HTML SSR hanya kerangka, lalu dialihkan ke /?next=`, async () => {
    const t = await open({ loggedIn: false });
    const resp = await t.page.goto(BASE + route);
    const html = await resp.text();
    assert(!html.includes("TesterNusantara"), "data pengguna bocor ke HTML server");
    if (!SPA_ONLY.has(route)) assert(html.includes("authGateOverlay"), "kerangka SSR tidak benar");
    await t.page.waitForFunction(() => location.pathname === "/", null, { timeout: 8000 });
    assert(t.page.url().includes("next=" + encodeURIComponent(route)), "parameter next salah: " + t.page.url());
    await visible(t.page, "#landing-view");
    assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors.join(" | "));
    await t.ctx.close();
  });
}
await test("beranda SSR untuk tamu: landing tampil, tombol Masuk membuka modal", async () => {
  const t = await open({ loggedIn: false });
  await t.page.goto(BASE + "/");
  await visible(t.page, "#landing-view");
  await t.page.waitForTimeout(500);
  assert(await t.page.locator("#menu-container").isHidden(), "dashboard Home tampil untuk tamu");
  await t.page.locator("#landing-view").getByRole("button", { name: /masuk/i }).first().click();
  await t.page.waitForTimeout(300);
  clean(t, "/");
  await t.ctx.close();
});
await test("navigasi dari halaman SSR tetap SPA (tanpa reload), CSS SSR dilepas, tanpa elemen ganda", async () => {
  const t = await open();
  await t.page.goto(BASE + "/lessons");
  await t.page.waitForFunction(() => document.getElementById("lessonCategories").children.length > 0, null, { timeout: 8000 });
  await t.page.waitForFunction(() => document.querySelector("link[data-route-css]"));
  await t.page.evaluate(() => { window.__spaMarker = 7; });
  for (const href of ["/library", "/leaderboard", "/profile", "/play", "/"]) {
    await t.page.click('.site-sidebar a[href="' + href + '"]');
    await t.page.waitForFunction((h) => location.pathname === h, href);
    await t.page.waitForTimeout(300);
  }
  assert(await t.page.evaluate(() => window.__spaMarker) === 7, "navigasi memicu reload penuh");
  const n = await t.page.evaluate(() => ({ ssrCss: document.querySelectorAll('link[data-route-css="0"]').length, outlets: document.querySelectorAll("#route-outlet").length, gates: document.querySelectorAll("#authGateOverlay").length, shells: document.querySelectorAll(".site-shell").length }));
  assert(n.ssrCss === 0, "CSS dari server tidak dilepas: " + n.ssrCss);
  assert(n.outlets === 1 && n.shells === 1 && n.gates <= 1, "elemen ganda: " + JSON.stringify(n));
  clean(t, "navigasi");
  await t.ctx.close();
});
await test("bahasa English pada halaman SSR: teks diterjemahkan & fitur tetap jalan", async () => {
  const t = await open({ lang: "en" });
  await t.page.goto(BASE + "/lessons");
  await t.page.waitForFunction(() => document.getElementById("lessonCategories").children.length > 0, null, { timeout: 8000 });
  await t.page.waitForTimeout(600);
  const txt = await t.page.textContent(".lessons-page");
  assert(!/Satu teknik, satu posisi utama/.test(txt), "teks Indonesia belum diterjemahkan");
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors.join(" | "));
  console.log("    (info) peringatan hydrate pada English: " + t.hydrateWarn.length);
  await t.ctx.close();
});

await browser.close();
srv.close();
const failed = results.filter((r) => !r.ok);
console.log("\nHasil SSR: " + (results.length - failed.length) + "/" + results.length + " lulus" + (failed.length ? ", " + failed.length + " GAGAL" : ""));
process.exit(failed.length ? 1 : 0);
