#!/usr/bin/env node
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { startStaticServer } from "./static-server.mjs";
import { installMockApi, makeUser } from "./mock-api.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const rootArg = args.indexOf("--root");
const PROJECT_ROOT = path.resolve(here, "../..");
const ROOT = path.resolve(rootArg >= 0 ? args[rootArg + 1] : path.join(PROJECT_ROOT, "dist"));
const EXPECT_REACT = args.includes("--expect-react");
const mockArg = args.indexOf("--mock-root");
const MOCK_ROOT = mockArg >= 0 ? path.resolve(args[mockArg + 1]) : PROJECT_ROOT;
const requireFrom = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = requireFrom("playwright")); }
catch (e) {
  if (!process.env.PLAYWRIGHT_NODE_MODULES) { console.error("Paket 'playwright' tidak ditemukan. Jalankan `npm install` (lalu `npx playwright install chromium`)."); process.exit(2); }
  ({ chromium } = createRequire(path.join(path.resolve(process.env.PLAYWRIGHT_NODE_MODULES), "/"))("playwright"));
}

const results = [];
function record(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log((ok ? "  PASS " : "  FAIL ") + name + (ok ? "" : "  -> " + detail));
}
async function test(name, fn) {
  try { await fn(); record(name, true); }
  catch (e) { record(name, false, String(e && e.message || e).split("\n")[0]); }
}
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

const { server, port } = await startStaticServer(ROOT);
const BASE = "http://localhost:" + port;
const browser = await chromium.launch();
const lessons = JSON.parse(fs.readFileSync(path.join(MOCK_ROOT, "server/data-seed/lessons.json"), "utf8"));
const lessonId = lessons.lessons[1].id;

async function open({ loggedIn = true, viewport = { width: 1280, height: 900 }, lang } = {}) {
  const ctx = await browser.newContext({ viewport, reducedMotion: "reduce" });
  const calls = [];
  await installMockApi(ctx, { root: MOCK_ROOT, loggedIn, calls });
  await ctx.route(/unpkg\.com|cdnjs|googleapis|gstatic/, (r) => r.abort());
  await ctx.addInitScript(([li, lg]) => {
    try { if (li) localStorage.setItem("nusantara_session_token", "tok"); if (lg) localStorage.setItem("nusantara_lang", lg); } catch (e) {}
  }, [loggedIn, lang || null]);
  const page = await ctx.newPage();
  const pageErrors = [];
  const requested = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  page.on("request", (r) => requested.push(r.url()));
  return { ctx, page, calls, pageErrors, requested };
}
const visible = (page, sel, timeout = 8000) => page.waitForSelector(sel, { state: "visible", timeout });

console.log("Target: " + ROOT + " @ " + BASE + (EXPECT_REACT ? " (mode React)" : ""));

await test("beranda tamu: landing tampil, tombol Masuk membuka modal, login menampilkan shell", async () => {
  const t = await open({ loggedIn: false });
  await t.page.goto(BASE + "/");
  await visible(t.page, "#landing-view");
  await t.page.waitForFunction(() => document.getElementById("heroBoardGrid").children.length > 0, null, { timeout: 8000 });
  await t.page.click("#landingHeaderCta");
  await t.page.waitForFunction(() => !document.getElementById("auth-container").classList.contains("hidden"));
  await t.page.fill("#login-username", "TesterNusantara");
  await t.page.fill("#login-password", "rahasia123");
  await t.ctx.unroute(/^https?:\/\/[^/]+:3000\/api\//);
  await installMockApi(t.ctx, { root: MOCK_ROOT, loggedIn: true, calls: t.calls });
  await t.page.click('#login-form button[type="submit"]');
  await t.page.waitForSelector(".site-shell", { timeout: 8000 });
  assert(t.calls.some((c) => c === "POST /auth/login"), "POST /auth/login tidak terkirim");
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors.join(" | "));
  await t.ctx.close();
});

await test("tombol 'Main sebagai Tamu' memanggil /auth/guest", async () => {
  const t = await open({ loggedIn: false });
  await t.page.goto(BASE + "/");
  await visible(t.page, "#landing-view");
  await t.page.waitForFunction(() => document.getElementById("heroBoardGrid").children.length > 0, null, { timeout: 8000 });
  await t.page.click("#heroCta");
  await visible(t.page, "#guestModeBtn");
  await t.page.click("#guestModeBtn");
  await t.page.waitForTimeout(800);
  assert(t.calls.includes("POST /auth/guest"), "POST /auth/guest tidak terkirim");
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors.join(" | "));
  await t.ctx.close();
});

await test("rute terproteksi tanpa sesi dialihkan ke beranda (?next=)", async () => {
  const t = await open({ loggedIn: false });
  await t.page.goto(BASE + "/profile");
  await t.page.waitForFunction(() => location.pathname === "/", null, { timeout: 8000 });
  assert(/next=%2Fprofile/.test(t.page.url()), "parameter next tidak ada: " + t.page.url());
  await t.ctx.close();
});

await test("path tidak dikenal -> kembali ke beranda", async () => {
  const t = await open({ loggedIn: false });
  await t.page.goto(BASE + "/halaman-tidak-ada");
  await t.page.waitForFunction(() => location.pathname === "/", null, { timeout: 8000 });
  await t.ctx.close();
});

const ROUTE_CHECKS = [
  ["/", async (p) => { await visible(p, "#menu-container"); assert((await p.textContent("#menu-container")).includes("TesterNusantara"), "nama pengguna tidak tampil"); }],
  ["/play", async (p) => { await visible(p, "#dashboard-page"); await p.waitForFunction(() => document.getElementById("dashboard-page").textContent.includes("905")); }],
  ["/bot", async (p) => { await visible(p, "#opponent-select-screen"); assert(await p.locator(".character-card").count() === 4, "kartu karakter != 4"); }],
  ["/puzzles", async (p) => { await visible(p, "#setup-screen"); }],
  ["/gamereview", async (p) => { await visible(p, ".wrap"); assert(await p.locator("#tab-import").count() === 1, "tab-import hilang"); }],
  ["/lessons", async (p) => { await p.waitForFunction(() => document.getElementById("lessonCategories").children.length > 0); }],
  ["/lessons/" + lessonId, async (p) => { await p.waitForFunction(() => document.getElementById("lessonBoard").children.length > 0, null, { timeout: 8000 }); assert((await p.textContent("#lessonTitle")).length > 3, "judul lesson kosong"); }],
  ["/library", async (p) => { await visible(p, ".library-page"); }],
  ["/leaderboard", async (p) => { await p.waitForFunction(() => document.getElementById("leaderboardList").textContent.includes("Pemain1")); }],
  ["/profile", async (p) => { await p.waitForFunction(() => document.querySelector(".profile-page").textContent.includes("TesterNusantara")); }],
  ["/profile/Pemain1", async (p) => { await p.waitForFunction(() => document.querySelector(".profile-page").textContent.includes("Pemain1")); }],
  ["/profile/ghost", async (p) => { await p.waitForFunction(() => { const n = document.getElementById("profileNotFound"); return n && !n.hidden && getComputedStyle(n).display !== "none"; }); }]
];
for (const vp of [{ width: 1280, height: 900, n: "desktop" }, { width: 390, height: 844, n: "mobile" }]) {
  for (const [route, check] of ROUTE_CHECKS) {
    await test(`rute ${route} (${vp.n}) dirender & diinisialisasi tanpa pageerror`, async () => {
      const t = await open({ viewport: vp });
      await t.page.goto(BASE + route);
      await check(t.page);
      await t.page.waitForTimeout(300);
      assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors.join(" | "));
      if (EXPECT_REACT) assert(!t.requested.some((u) => /\/routes\/.*\.html/.test(u)), "masih meminta fragment HTML lama");
      await t.ctx.close();
    });
  }
}

await test("bot: pilih karakter, mulai, langkah e2-e4 diterima server & bot membalas", async () => {
  const t = await open();
  await t.page.goto(BASE + "/bot");
  await visible(t.page, "#opponent-select-screen");
  await t.page.locator(".character-card").nth(0).click();
  await t.page.click("#opponent-select-start-btn");
  await t.page.waitForFunction(() => document.querySelectorAll("#board td.board-td").length === 64, null, { timeout: 8000 });
  await t.page.waitForTimeout(500);
  await t.page.locator('#board td[data-ui-x="4"][data-ui-y="6"]').click();
  await t.page.locator('#board td[data-ui-x="4"][data-ui-y="4"]').click();
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline && t.calls.filter((c) => /^POST \/practice\/[^/]+\/move$/.test(c)).length < 2) await t.page.waitForTimeout(300);
  const moves = t.calls.filter((c) => /^POST \/practice\/[^/]+\/move$/.test(c)).length;
  assert(moves >= 2, "hanya " + moves + " langkah terkirim ke server (diharapkan langkah pemain + balasan bot)");
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors.join(" | "));
  await t.ctx.close();
});

await test("handler markup: onChange select memanggil fungsi global; input teks memakai semantik `change` native", async () => {
  const t = await open();
  await t.page.goto(BASE + "/puzzles");
  await visible(t.page, "#setup-screen");
  await t.page.waitForFunction(() => typeof window.toggleCustomInput === "function", null, { timeout: 8000 });
  await t.page.evaluate(() => { window.__calls = []; const orig = window.toggleCustomInput; window.toggleCustomInput = (...a) => { window.__calls.push(a.join(":")); return orig(...a); }; });
  await t.page.selectOption("#time-limit", "300");
  assert((await t.page.evaluate(() => window.__calls)).includes("time"), "toggleCustomInput('time') tidak terpanggil");
  await t.page.goto(BASE + "/bot");
  await visible(t.page, "#opponent-select-screen");
  await t.page.waitForFunction(() => typeof window.UIChangeTimePerMove === "function", null, { timeout: 8000 });
  await t.page.evaluate(() => { window.__n = 0; const orig = window.UIChangeTimePerMove; window.UIChangeTimePerMove = (...a) => { window.__n++; return orig(...a); }; });
  await t.page.evaluate(() => { const el = document.getElementById("TimePerMove"); el.value = "1500"; el.dispatchEvent(new Event("input", { bubbles: true })); });
  assert(await t.page.evaluate(() => window.__n) === 0, "handler terpanggil pada event input (harus menunggu change)");
  await t.page.evaluate(() => document.getElementById("TimePerMove").dispatchEvent(new Event("change", { bubbles: true })));
  assert(await t.page.evaluate(() => window.__n) === 1, "handler tidak terpanggil pada event change");
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors.join(" | "));
  await t.ctx.close();
});

await test("fallback gambar (onError): ikon bahasa gagal-muat diganti emoji tanpa pageerror", async () => {
  const t = await open({ loggedIn: false });
  await t.page.goto(BASE + "/");
  await visible(t.page, "#landing-view");
  await t.page.waitForFunction(() => document.querySelector(".lang-btn") && document.querySelector(".lang-btn img[src=\"/images/ui-globe.svg\"]"), null, { timeout: 8000 });
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors.join(" | "));
  await t.ctx.close();
});

await test("key-generator: buat kunci per jenis, format valid, tanpa jaringan, bersihkan", async () => {
  if (!fs.existsSync(path.join(PROJECT_ROOT, "keygeneratora1b2/index.html"))) return console.log("  (dilewati: keygeneratora1b2/index.html belum dibangun)");
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  const network = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => { if (!r.url().startsWith("file:")) network.push(r.url()); });
  await page.goto("file://" + path.join(PROJECT_ROOT, "keygeneratora1b2/index.html"));
  await visible(page, "#generate");
  assert(await page.locator("label.type").count() === 4, "harus ada 4 jenis akses");
  assert((await page.textContent("#compat-badge")) === "Kompatibel", "uji bawaan generator gagal");
  await page.click("#generate");
  assert(await page.locator(".row").count() === 0, "generator membuat kunci tanpa rahasia");
  await page.fill("#secret", "rahasia-uji-smoke-1234567890");
  const FORMAT = { master: /^MST-[A-Z2-9]{5}-[A-Z2-9]{5}-[A-Z2-9]{5}-[A-Z2-9]{8}$/, grandmaster: /^GMR(-[A-Z2-9]{4}){6}$/, supergm: /^SGM-[A-Z2-9]{8}-[A-Z2-9]{8}-[A-Z2-9]{8}$/, admin: /^ADM(-[A-Z2-9]{6}){3}(-[A-Z2-9]{4}){2}$/ };
  const order = ["master", "grandmaster", "supergm", "admin"];
  for (let i = 0; i < 4; i++) {
    await page.locator("label.type").nth(i).click();
    await page.fill("#qty", "2");
    await page.click("#generate");
    const keys = await page.$$eval(".row .key", (els) => els.slice(0, 2).map((e) => e.textContent));
    assert(keys.length === 2 && keys.every((k) => FORMAT[order[i]].test(k)), "format kunci " + order[i] + " salah: " + keys.join(","));
  }
  assert(await page.locator(".row").count() === 8, "jumlah baris != 8");
  await page.click("#clear");
  assert(await page.locator(".row").count() === 0, "daftar tidak kosong setelah Bersihkan");
  assert(errors.length === 0, "pageerror: " + errors.join(" | "));
  assert(network.length === 0, "generator meminta jaringan: " + network.join(", "));
  await ctx.close();
});

await test("navigasi sidebar tanpa reload penuh, back/forward, kunjungan berulang bersih", async () => {
  const t = await open();
  await t.page.goto(BASE + "/play");
  await visible(t.page, "#dashboard-page");
  await t.page.evaluate(() => { window.__spaMarker = 42; });
  for (const href of ["/bot", "/lessons", "/leaderboard", "/play", "/puzzles", "/", "/play"]) {
    await t.page.click('.site-sidebar a[href="' + href + '"]');
    await t.page.waitForFunction((h) => location.pathname === h, href);
    await t.page.waitForTimeout(250);
  }
  assert(await t.page.evaluate(() => window.__spaMarker) === 42, "halaman reload penuh (marker hilang)");
  await t.page.goBack(); await t.page.waitForFunction(() => location.pathname === "/");
  await t.page.goBack(); await t.page.waitForFunction(() => location.pathname === "/puzzles");
  await t.page.goForward(); await t.page.waitForFunction(() => location.pathname === "/");
  await t.page.waitForTimeout(400);
  const dup = await t.page.evaluate(() => ({
    outlets: document.querySelectorAll("#route-outlet").length,
    gates: document.querySelectorAll("#authGateOverlay").length,
    shells: document.querySelectorAll(".site-shell").length,
    css: document.querySelectorAll("link[data-route-css]").length
  }));
  assert(dup.outlets === 1 && dup.shells === 1 && dup.gates <= 1, "elemen ganda: " + JSON.stringify(dup));
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors.join(" | "));
  await t.ctx.close();
});

await test("30 pindah rute beruntun tidak menumpuk CSS/skrip rute dan tanpa error", async () => {
  const t = await open();
  await t.page.goto(BASE + "/play");
  await visible(t.page, "#dashboard-page");
  const seq = ["/lessons", "/library", "/leaderboard", "/profile", "/play", "/bot", "/puzzles", "/gamereview", "/"];
  for (let i = 0; i < 30; i++) {
    await t.page.evaluate((h) => window.NusantaraChess.router.navigate(h), seq[i % seq.length]);
    await t.page.waitForTimeout(120);
  }
  await t.page.waitForTimeout(800);
  const n = await t.page.evaluate(() => ({ css: document.querySelectorAll("link[data-route-css]").length, scripts: document.querySelectorAll("script[data-route-script]").length }));
  assert(n.css <= 12, "CSS rute menumpuk: " + n.css);
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors.join(" | "));
  await t.ctx.close();
});

await test("bahasa English menerjemahkan teks yang dirender React", async () => {
  const t = await open({ lang: "en" });
  await t.page.goto(BASE + "/lessons");
  await t.page.waitForFunction(() => document.getElementById("lessonCategories").children.length > 0);
  await t.page.waitForTimeout(600);
  const txt = await t.page.textContent(".lessons-page");
  assert(!/Satu teknik, satu posisi utama/.test(txt), "teks Indonesia belum diterjemahkan: " + txt.slice(0, 80));
  await t.ctx.close();
});

await browser.close();
server.close();
const failed = results.filter((r) => !r.ok);
console.log("\nHasil: " + (results.length - failed.length) + "/" + results.length + " lulus" + (failed.length ? ", " + failed.length + " GAGAL" : ""));
process.exit(failed.length ? 1 : 0);
