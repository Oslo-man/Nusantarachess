#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { startStaticServer } from "./static-server.mjs";
import { installMockApi, makeUser } from "./mock-api.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(here, "../..");
const args = process.argv.slice(2);
const rootArg = args.indexOf("--root");
const ROOT = path.resolve(rootArg >= 0 ? args[rootArg + 1] : path.join(PROJECT_ROOT, "dist"));
const requireFrom = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = requireFrom("playwright")); }
catch (e) {
  if (!process.env.PLAYWRIGHT_NODE_MODULES) { console.error("Paket 'playwright' tidak ditemukan."); process.exit(2); }
  ({ chromium } = createRequire(path.join(path.resolve(process.env.PLAYWRIGHT_NODE_MODULES), "/"))("playwright"));
}

const BASE_URL = "https://cdn.jsdelivr.net/gh/lichess-org/lila@master/public/piece/cburnett/";
const EXPECTED = ["wK", "wQ", "wR", "wB", "wN", "wP", "bK", "bQ", "bR", "bB", "bN", "bP"].map((n) => BASE_URL + n + ".svg").sort();
const STUB_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45"><circle cx="22" cy="22" r="18" fill="#888"/></svg>';

const results = [];
async function test(name, fn) {
  try { await fn(); results.push(true); console.log("  PASS " + name); }
  catch (e) { results.push(false); console.log("  FAIL " + name + "  -> " + String((e && e.message) || e).split("\n")[0]); }
}
const assert = (c, m) => { if (!c) throw new Error(m); };

const { server, port } = await startStaticServer(ROOT);
const BASE = "http://localhost:" + port;
const browser = await chromium.launch();

async function open({ loggedIn = true, extra } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const calls = [];
  const pieceReqs = [];
  await installMockApi(ctx, { root: PROJECT_ROOT, loggedIn, calls });
  if (extra) await extra(ctx);
  await ctx.route(/unpkg\.com|cdnjs|googleapis|gstatic/, (r) => r.abort());
  await ctx.route(/cdn\.jsdelivr\.net/, (r) => {
    const u = r.request().url();
    pieceReqs.push(u);
    return r.fulfill({ status: 200, contentType: "image/svg+xml", headers: { "access-control-allow-origin": "*" }, body: STUB_SVG });
  });
  await ctx.addInitScript((li) => { try { if (li) localStorage.setItem("nusantara_session_token", "tok"); } catch (e) {} }, loggedIn);
  const page = await ctx.newPage();
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  return { ctx, page, calls, pieceReqs, pageErrors };
}

async function checkBoard(t, sel, minImgs) {
  await t.page.waitForFunction(([s, n]) => document.querySelectorAll(s + " img").length >= n, [sel, minImgs], { timeout: 10000 });
  await t.page.waitForFunction((s) => [...document.querySelectorAll(s + " img")].every((i) => i.complete && i.naturalWidth > 0), sel, { timeout: 10000 });
  const info = await t.page.evaluate((s) => {
    const imgs = [...document.querySelectorAll(s + " img")];
    return {
      n: imgs.length,
      srcs: [...new Set(imgs.map((i) => i.getAttribute("src")))],
      minW: Math.min(...imgs.map((i) => i.getBoundingClientRect().width)),
      notDraggable: imgs.every((i) => i.getAttribute("draggable") === "false"),
      inlineSvg: document.querySelectorAll(s + " svg").length
    };
  }, sel);
  assert(info.n >= minImgs, "hanya " + info.n + " <img> bidak di " + sel);
  assert(info.srcs.every((s) => EXPECTED.includes(s)), "src di luar set CDN: " + info.srcs.filter((s) => !EXPECTED.includes(s)).join(","));
  assert(info.minW >= 15, "bidak runtuh/terlalu kecil di " + sel + " (lebar min " + info.minW + "px)");
  assert(info.notDraggable, "ada <img> bidak yang bisa di-drag native di " + sel);
  assert(info.inlineSvg === 0, "masih ada " + info.inlineSvg + " <svg> inline di " + sel);
  return info;
}
function assertTwelve(t, label) {
  const got = [...new Set(t.pieceReqs)].sort();
  assert(JSON.stringify(got) === JSON.stringify(EXPECTED), label + ": URL CDN diminta = " + JSON.stringify(got.map((u) => u.slice(BASE_URL.length))) + " (harus tepat 12 berkas)");
  assert(!t.pieceReqs.some((u) => !u.startsWith(BASE_URL)), label + ": ada permintaan jsDelivr di luar folder cburnett");
}

console.log("Target: " + ROOT + " @ " + BASE);

await test("Home: papan hero memuat 32 bidak dari CDN baru, 12 berkas diminta, tanpa pageerror", async () => {
  const t = await open({ loggedIn: false });
  await t.page.goto(BASE + "/");
  const info = await checkBoard(t, "#heroBoardGrid", 32);
  assert(info.n === 32, "jumlah bidak hero " + info.n);
  assertTwelve(t, "Home");
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors[0]);
  await t.ctx.close();
});

await test("Lessons: papan pelajaran interaktif memakai CDN baru", async () => {
  const t = await open();
  await t.page.goto(BASE + "/lessons/opening-center-control");
  await checkBoard(t, "#lessonBoard", 4);
  assertTwelve(t, "Lessons");
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors[0]);
  await t.ctx.close();
});

await test("Play: Riwayat Permainan -> Replay merender bidak dari CDN baru", async () => {
  const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const AFTER_E4 = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1";
  const t = await open();
  await t.ctx.addInitScript(([a, b]) => {
    try {
      localStorage.setItem("chessbot_saved_games", JSON.stringify([{
        id: "g1", userId: 1, username: "TesterNusantara", playerColor: "white", opponentName: "BotUji", opponentElo: 1500,
        eloBefore: 800, eloAfter: 810, eloChange: 10, timeControlCategory: "blitz", result: "win",
        sanHistory: ["e4"], plySnapshots: [a, b], lastMoveSquaresPerPly: [null, ["e2", "e4"]], pgn: "1. e4 *", startedAt: 1, endedAt: 2
      }]));
    } catch (e) {}
  }, [START, AFTER_E4]);
  await t.page.goto(BASE + "/play");
  await t.page.waitForSelector("#open-saved-games-btn", { state: "visible", timeout: 10000 });
  await t.page.click("#open-saved-games-btn");
  await t.page.waitForSelector(".saved-game-item", { state: "visible", timeout: 5000 });
  await t.page.click(".saved-game-item");
  const info = await checkBoard(t, "#replay-chessboard", 32);
  assert(info.n === 32, "jumlah bidak replay " + info.n);
  await t.page.click("#replay-nav-first-btn");
  await t.page.waitForTimeout(200);
  await checkBoard(t, "#replay-chessboard", 32);
  assertTwelve(t, "Play");
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors[0]);
  await t.ctx.close();
});

await test("Bot: papan memakai CDN baru; langkah e2-e4 tetap diterima & bot membalas", async () => {
  const t = await open();
  await t.page.goto(BASE + "/bot");
  await t.page.waitForSelector("#opponent-select-screen", { state: "visible" });
  await t.page.locator(".character-card").nth(0).click();
  await t.page.click("#opponent-select-start-btn");
  await t.page.waitForFunction(() => document.querySelectorAll("#board td.board-td").length === 64, null, { timeout: 8000 });
  const info = await checkBoard(t, "#board", 32);
  assert(info.n === 32, "jumlah bidak bot " + info.n);
  await t.page.waitForTimeout(500);
  await t.page.locator('#board td[data-ui-x="4"][data-ui-y="6"]').click();
  await t.page.locator('#board td[data-ui-x="4"][data-ui-y="4"]').click();
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline && t.calls.filter((c) => /^POST \/practice\/[^/]+\/move$/.test(c)).length < 2) await t.page.waitForTimeout(300);
  assert(t.calls.filter((c) => /^POST \/practice\/[^/]+\/move$/.test(c)).length >= 2, "langkah/balasan bot tidak terkirim");
  await checkBoard(t, "#board", 32);
  assertTwelve(t, "Bot");
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors[0]);
  await t.ctx.close();
});

await test("Puzzle: papan puzzle memakai CDN baru", async () => {
  const t = await open({
    extra: (ctx) => ctx.route(/\/api\/puzzle\/next$/, (r) => r.fulfill({
      status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify({ sessionId: "s1", puzzleId: "p1", fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", rating: 1200, themes: ["opening"], totalMoves: 2, playerColor: "white" })
    }))
  });
  await t.page.goto(BASE + "/puzzles");
  await t.page.waitForSelector("#setup-screen", { state: "visible" });
  await t.page.waitForFunction(() => typeof window.startGame === "function", null, { timeout: 8000 });
  await t.page.click("#setup-screen .btn-primary");
  const info = await checkBoard(t, "#board", 20);
  assert(info.n === 32 || info.n >= 20, "jumlah bidak puzzle " + info.n);
  assertTwelve(t, "Puzzle");
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors[0]);
  await t.ctx.close();
});

await test("Game Review: papan memuat bidak dari CDN baru (partai dimuat via savedGameId)", async () => {
  const t = await open();
  await t.page.goto(BASE + "/gamereview?savedGameId=g1");
  const info = await checkBoard(t, "#board", 20);
  assertTwelve(t, "Game Review");
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors[0]);
  await t.ctx.close();
});

await browser.close(); server.close();
const ok = results.filter(Boolean).length;
console.log("\nHasil: " + ok + "/" + results.length + " lulus" + (ok === results.length ? "" : ", " + (results.length - ok) + " GAGAL"));
process.exit(ok === results.length ? 0 : 1);
