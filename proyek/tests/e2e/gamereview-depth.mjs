#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { startStaticServer } from "./static-server.mjs";
import { installMockApi } from "./mock-api.mjs";

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

const FAKE_SF = `
let timer = null;
function emit(depth) {
  const pvs = [["e2e4", 30], ["d2d4", 20], ["g1f3", 10]];
  pvs.forEach((p, i) => postMessage("info depth " + depth + " seldepth " + depth + " multipv " + (i + 1) + " score cp " + p[1] + " nodes 1000 pv " + p[0]));
}
self.onmessage = (e) => {
  const c = String(e.data);
  if (c === "uci") postMessage("uciok");
  else if (c === "isready") postMessage("readyok");
  else if (c === "stop") { if (timer) { clearInterval(timer); timer = null; postMessage("bestmove e2e4"); } }
  else if (c === "go infinite") { let d = 0; if (timer) clearInterval(timer); timer = setInterval(() => { d++; emit(d); }, 15); }   // analisis real-time: depth naik terus sampai "stop"
  else if (c.startsWith("go depth")) { emit(parseInt(c.split(" ")[2], 10)); postMessage("bestmove e2e4"); }   // pemindaian (analyzePool)
};`;

const results = [];
async function test(name, fn) {
  try { await fn(); results.push(true); console.log("  PASS " + name); }
  catch (e) { results.push(false); console.log("  FAIL " + name + "  -> " + String((e && e.message) || e).split("\n")[0]); }
}
const assert = (c, m) => { if (!c) throw new Error(m); };

const { server, port } = await startStaticServer(ROOT);
const BASE = "http://localhost:" + port;
const browser = await chromium.launch();

async function open() {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  await installMockApi(ctx, { root: PROJECT_ROOT, loggedIn: true, calls: [] });
  await ctx.route(/unpkg\.com|cdnjs|googleapis|gstatic|jsdelivr|lichess\.org/, (r) => r.abort());
  await ctx.route(/\/vendor\/stockfish\/stockfish-18-lite-single\.js$/, (r) => r.fulfill({ status: 200, contentType: "text/javascript", body: FAKE_SF }));
  await ctx.addInitScript(() => {
    try { localStorage.setItem("nusantara_session_token", "tok"); } catch (e) {}
    window.__sfCmds = [];
    const RealWorker = window.Worker;
    window.Worker = function (...a) {
      const w = new RealWorker(...a);
      const post = w.postMessage.bind(w);
      w.postMessage = (m, ...r) => { if (typeof m === "string") window.__sfCmds.push(m); return post(m, ...r); };
      return w;
    };
  });
  const page = await ctx.newPage();
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  return { ctx, page, pageErrors };
}
const openSettings = async (page) => { await page.click("#settingsBtn"); await page.waitForSelector("#reviewSettingsMenu", { state: "visible" }); };
const goDepths = (page) => page.evaluate(() => window.__sfCmds.filter((c) => c.startsWith("go depth")).map((c) => +c.split(" ")[2]));

console.log("Target: " + ROOT + " @ " + BASE);

await test("pembukaan pertama: tidak ada #depthSel (analisis real-time), #reviewDepth = 16 (tipe Dasar)", async () => {
  const t = await open();
  await t.page.goto(BASE + "/gamereview");
  await t.page.waitForSelector("#reviewDepth", { state: "attached", timeout: 10000 });
  assert((await t.page.$("#depthSel")) === null, "#depthSel masih ada di DOM");
  assert((await t.page.$eval("#reviewDepth", (s) => s.value)) === "16", "#reviewDepth berubah");
  await t.ctx.close();
});

await test("analisis langsung real-time: 'go infinite' dikirim, depth terus naik melewati 15, tanpa pageerror", async () => {
  const t = await open();
  await t.page.goto(BASE + "/gamereview?savedGameId=g1");
  await t.page.waitForFunction(() => window.__sfCmds.includes("go infinite"), null, { timeout: 15000 });
  await t.page.waitForFunction(() => { const m = /\(d(\d+)\)/.exec(document.getElementById("depthText").textContent); return !!m && +m[1] >= 20; }, null, { timeout: 10000 });
  assert(!/final/.test(await t.page.$eval("#depthText", (e) => e.textContent)), "teks depth masih memakai 'final'");
  assert((await t.page.$eval("#bestText", (e) => e.textContent.trim())).length > 0 || (await t.page.$eval("#pvText", (e) => e.textContent.trim())).length > 0, "hasil analisis (best/pv) kosong");
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors[0]);
  await t.ctx.close();
});

await test("mematikan Analisis otomatis menghentikan analisis tanpa batas ('stop' dikirim)", async () => {
  const t = await open();
  await t.page.goto(BASE + "/gamereview?savedGameId=g1");
  await t.page.waitForFunction(() => window.__sfCmds.includes("go infinite"), null, { timeout: 15000 });
  const before = await t.page.evaluate(() => window.__sfCmds.filter((c) => c === "stop").length);
  await t.page.evaluate(() => document.getElementById("autoAnalyze").click());
  await t.page.waitForFunction((n) => window.__sfCmds.filter((c) => c === "stop").length > n, before, { timeout: 5000 });
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors[0]);
  await t.ctx.close();
});

await test("buka ulang halaman: #reviewDepth tetap default 16 (tidak ada lagi opsi depth langsung yang tersimpan)", async () => {
  const t = await open();
  await t.page.goto(BASE + "/gamereview");
  await t.page.waitForSelector("#reviewDepth", { state: "attached" });
  await t.page.reload();
  await t.page.waitForSelector("#reviewDepth", { state: "attached" });
  assert((await t.page.$eval("#reviewDepth", (s) => s.value)) === "16", "default setelah reload bukan 16");
  assert((await t.page.evaluate(() => { try { return localStorage.getItem("gr_live_depth"); } catch (e) { return null; } })) === null, "sisa gr_live_depth");
  await t.ctx.close();
});

await browser.close(); server.close();
const ok = results.filter(Boolean).length;
console.log("\nHasil: " + ok + "/" + results.length + " lulus" + (ok === results.length ? "" : ", " + (results.length - ok) + " GAGAL"));
process.exit(ok === results.length ? 0 : 1);
