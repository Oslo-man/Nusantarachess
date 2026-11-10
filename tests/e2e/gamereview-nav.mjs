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
async function open(path = "/gamereview", ready = "#board .sq") {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  await installMockApi(ctx, { root: PROJECT_ROOT, loggedIn: true, calls: [] });
  await ctx.route(/unpkg\.com|cdnjs|googleapis|gstatic|jsdelivr|lichess\.org/, (r) => r.abort());
  await ctx.route(/\/vendor\/stockfish\/stockfish-18-lite-single\.js$/, (r) => r.fulfill({ status: 200, contentType: "text/javascript", body: FAKE_SF }));
  await ctx.addInitScript(() => { try { localStorage.setItem("nusantara_session_token", "tok"); } catch (e) {} });
  const page = await ctx.newPage();
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  await page.goto(BASE + path);
  await page.waitForSelector(ready, { state: "attached", timeout: 15000 });
  return { ctx, page, pageErrors };
}
const fen = (p) => p.$eval("#fenOut", (e) => e.textContent.split(" ").slice(0, 2).join(" "));
const chips = (p) => p.$$eval("#moveList .bc-san", (c) => c.map((x) => x.textContent));
const cur = (p) => p.$eval("#moveList .bc-san.cur", (c) => c.textContent).catch(() => null);
async function mv(p, a, b) { await p.click(`[data-sq="${a}"]`); await p.click(`[data-sq="${b}"]`); }

async function pick(page, key) {
  if (await page.isHidden("#fmtOptions")) await page.click("#fmtToggle");
  await page.click(`[data-import="${key}"]`);
}

await test("tombol navigasi: 5 tombol berurutan, hanya ikon SVG, autoplay di tengah tanpa teks", async () => {
  const t = await open();
  const r = await t.page.$$eval(".nav > button", (b) => b.map((x) => ({ id: x.id, svg: !!x.querySelector("svg"), text: x.textContent.trim() })));
  assert(r.map((x) => x.id).join() === "navStart,navPrev,autoPlayBtn,navNext,navEnd", "urutan: " + r.map((x) => x.id));
  assert(r.every((x) => x.svg && x.text === ""), "ada tombol tanpa SVG / berisi teks: " + JSON.stringify(r));
  const box = await t.page.$$eval(".nav > button", (b) => b.map((x) => { const q = x.getBoundingClientRect(); return [q.left, q.top, q.width]; }));
  assert(box.every((q) => Math.abs(q[1] - box[0][1]) < 1), "tidak satu baris");
  const navBox = await t.page.$eval(".nav", (n) => { const q = n.getBoundingClientRect(); return q.left + q.width / 2; });
  assert(Math.abs(box[2][0] + box[2][2] / 2 - navBox) < 2, "autoplay tidak di tengah");
  assert(box[1][2] >= 36, "tombol terlalu sempit: " + box[1][2]);
  await t.ctx.close();
});

await test("panel Analisis: tab Analisis Game/Ringkasan; pemilih format memuat 4 sumber", async () => {
  const t = await open();
  assert((await t.page.$$eval(".bc-tabs button", (b) => b.map((x) => x.textContent.trim())).then((a) => a.join())) === "Analisis Game,Ringkasan", "tab salah");
  assert(await t.page.isVisible("#fmtToggle") && await t.page.isHidden("#fmtOptions"), "pemilih format harus tertutup di awal");
  await t.page.click("#fmtToggle");
  const labels = await t.page.$$eval("#importChoices .import-choice", (b) => b.map((x) => x.textContent.trim()));
  assert(labels.join("|") === "Chess.com|Lichess.org|PGN|FEN", labels.join("|"));
  await t.ctx.close();
});

await test("Tidak ada opsi depth analisis langsung di Pengaturan; Kedalaman Pemindai di panel Analisis Game; teks Mesin tersembunyi", async () => {
  const t = await open();
  assert((await t.page.$("#depthSel")) === null, "opsi depth analisis langsung seharusnya sudah dihapus (analisis real-time)");
  await t.page.click("#settingsBtn");
  assert(await t.page.isVisible("#autoAnalyze"), "Analisis otomatis tidak ada di menu");
  assert(await t.page.$eval("#reviewSettingsMenu", (m) => m.contains(document.getElementById("autoAnalyze")) && !m.contains(document.getElementById("reviewDepth"))), "Analisis otomatis harus di menu, Kedalaman Pemindai harus di luar menu");
  await t.page.click("#settingsBtn");
  await t.page.click("#fmtToggle");
  assert(await t.page.isVisible("#depthOptions"), "Kedalaman Pemindai tidak tampil di panel Analisis");
  await t.page.click('#depthOptions [data-depth="18"]');
  assert((await t.page.$eval("#reviewDepth", (s) => s.value)) === "18", "tombol kedalaman tidak mengisi #reviewDepth");
  assert(!(await t.page.isVisible("#bestText")) && !(await t.page.isVisible("#pvText")), "teks Mesin terlihat");
  assert(!/Mesin:|Engine:/.test(await t.page.evaluate(() => document.body.innerText)), "teks Mesin/Engine masih tampil");
  await t.ctx.close();
});

await test("Main: langkah dicoba, mundur tidak menghapus langkah, maju kembali ke langkah yang sama", async () => {
  const t = await open();
  await mv(t.page, "e2", "e4"); await mv(t.page, "e7", "e5"); await mv(t.page, "g1", "f3");
  assert((await chips(t.page)).join() === "e4,e5,Nf3", "chips: " + (await chips(t.page)));
  const f3 = await fen(t.page);
  await t.page.click(".bc-gbtns-below [data-nav=prev]"); await t.page.click(".bc-gbtns-below [data-nav=prev]");
  assert((await chips(t.page)).join() === "e4,e5,Nf3" && (await cur(t.page)) === "e4", "langkah hilang / cur salah setelah mundur");
  assert((await fen(t.page)) !== f3, "papan tidak mundur");
  await t.page.click(".bc-gbtns-below [data-nav=next]"); await t.page.click(".bc-gbtns-below [data-nav=next]");
  assert((await fen(t.page)) === f3 && (await cur(t.page)) === "Nf3", "maju tidak kembali ke posisi semula");
  await t.page.click(".bc-gbtns-below [data-nav=first]");
  assert((await fen(t.page)).startsWith("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"), "navStart salah");
  assert(await t.page.isDisabled(".bc-gbtns-below [data-nav=prev]") && await t.page.isDisabled(".bc-gbtns-below [data-nav=first]"), "tombol awal tidak nonaktif di awal");
  await t.page.click(".bc-gbtns-below [data-nav=last]");
  assert((await fen(t.page)) === f3 && await t.page.isDisabled(".bc-gbtns-below [data-nav=next]"), "navEnd salah");
  await t.ctx.close();
});

await test("variasi: langkah berbeda dari posisi lama membuat variasi; mundur ke percabangan kembali ke jalur utama otomatis", async () => {
  const t = await open();
  await mv(t.page, "e2", "e4"); await mv(t.page, "e7", "e5"); await mv(t.page, "g1", "f3");
  const mainFen = await fen(t.page);
  await t.page.click(".bc-gbtns-below [data-nav=prev]"); await t.page.click(".bc-gbtns-below [data-nav=prev]");
  await mv(t.page, "c7", "c5");
  assert((await chips(t.page)).join() === "e4,c5", "chips variasi: " + (await chips(t.page)));
  assert(await t.page.$eval("#moveList .bc-san.cur", (c) => c.classList.contains("var")), "chip variasi tidak ditandai");
  await mv(t.page, "g1", "f3");
  assert((await chips(t.page)).join() === "e4,c5,Nf3", "chips: " + (await chips(t.page)));
  await t.page.click(".bc-gbtns-below [data-nav=prev]"); await t.page.click(".bc-gbtns-below [data-nav=prev]");
  assert((await cur(t.page)) === "e4", "tidak berhenti di percabangan");
  const alts = await t.page.$$eval("#variationBar .ms-chip", (c) => c.map((x) => x.textContent.replace(/\s+/g, "")));
  assert(alts.length === 2, "pilihan percabangan: " + alts);
  await t.page.click(".bc-gbtns-below [data-nav=next]");
  assert((await cur(t.page)) === "e5" && (await chips(t.page)).join() === "e4,e5,Nf3", "maju tidak kembali ke jalur utama: " + (await chips(t.page)));
  await t.page.click(".bc-gbtns-below [data-nav=last]");
  assert((await fen(t.page)) === mainFen, "ujung jalur utama berubah");
  await t.page.click(".bc-gbtns-below [data-nav=prev]"); await t.page.click(".bc-gbtns-below [data-nav=prev]");
  await t.page.click('#variationBar .ms-chip.var');
  assert((await cur(t.page)) === "c5", "variasi tidak dapat dibuka kembali");
  await t.page.click(".bc-gbtns-below [data-nav=next]");
  assert((await cur(t.page)) === "Nf3" && (await chips(t.page)).join() === "e4,c5,Nf3", "variasi tidak diikuti");
  await t.ctx.close();
});

await test("Main -> Ulasan -> Main mempertahankan papan, riwayat, dan langkah terpilih", async () => {
  const t = await open();
  await mv(t.page, "e2", "e4"); await mv(t.page, "e7", "e5"); await t.page.click(".bc-gbtns-below [data-nav=prev]");
  const before = { f: await fen(t.page), c: await chips(t.page), cur: await cur(t.page) };
  await t.page.click('.bc-tabs button[data-tab="moves"]');
  const mid = { f: await fen(t.page), c: await chips(t.page), cur: await cur(t.page) };
  assert(JSON.stringify(mid) === JSON.stringify(before), "berubah di Ulasan: " + JSON.stringify(mid));
  await t.page.click('.bc-tabs button[data-tab="import"]');
  assert(JSON.stringify({ f: await fen(t.page), c: await chips(t.page), cur: await cur(t.page) }) === JSON.stringify(before), "berubah setelah kembali");
  await t.ctx.close();
});

await test("impor PGN: papan + profil Guest/nama PGN, riwayat chip, ketuk chip, geser horizontal, autoplay", async () => {
  const t = await open();
  await t.page.click('.bc-tabs button[data-tab="import"]');
  await pick(t.page, "pgn");
  await t.page.fill("#pgnInput", '[White "Budi"]\n[Black "Siti"]\n[WhiteElo "1200"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 *');
  await t.page.click("#loadPgn");
  await t.page.waitForSelector("#playerTop:not([hidden])");
  const names = await t.page.$$eval(".player-bar", (b) => b.map((x) => x.querySelector(".pb-name").textContent + "/" + x.dataset.side + "/" + !!x.querySelector("svg, img")));
  assert(names.join() === "Siti/b/true,Budi/w/true", "profil: " + names);
  const top = await t.page.$eval("#playerTop", (e) => e.getBoundingClientRect().bottom), bt = await t.page.$eval("#board", (e) => e.getBoundingClientRect().top);
  assert(top <= bt + 1, "profil atas tidak di atas papan");
  const n = (await chips(t.page)).length; assert(n === 18, "jumlah chip " + n);
  const sc = await t.page.$eval("#moveList", (e) => ({ sw: e.scrollWidth, cw: e.clientWidth, ov: getComputedStyle(e).overflowX }));
  assert(sc.sw > sc.cw && sc.ov === "auto", "riwayat tidak bisa digeser: " + JSON.stringify(sc));
  const docOverflow = await t.page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  assert(!docOverflow, "halaman meluber horizontal di ponsel");
  await t.page.click('#moveList .bc-san:nth-of-type(3)');
  assert((await cur(t.page)) === "Nf3", "ketuk chip: " + (await cur(t.page)));
  assert((await fen(t.page)).includes("RNBQKB1R") || (await fen(t.page)).includes("5N2"), "papan tidak sinkron dengan chip");
  await t.page.click(".bc-gbtns-below [data-nav=first]"); await t.page.click(".bc-gbtns-below [data-nav=play]");
  assert(await t.page.getAttribute(".bc-gbtns-below [data-nav=play]", "aria-pressed") === "true", "autoplay tidak aktif");
  await t.page.waitForFunction(() => document.querySelector("#moveList .bc-san.cur") && document.querySelector("#moveList .bc-san.cur").textContent !== "", null, { timeout: 5000 });
  await t.page.click(".bc-gbtns-below [data-nav=play]");
  assert(await t.page.getAttribute(".bc-gbtns-below [data-nav=play]", "aria-pressed") === "false", "autoplay tidak berhenti");
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors[0]);
  await t.ctx.close();
});

await test("impor PGN tanpa nama pemain: profil Guest; FEN & Lichess/Chess.com punya form sendiri", async () => {
  const t = await open();
  await t.page.click('.bc-tabs button[data-tab="import"]');
  await pick(t.page, "pgn");
  await t.page.fill("#pgnInput", "1. d4 d5 2. c4 *"); await t.page.click("#loadPgn");
  await t.page.waitForSelector("#playerTop:not([hidden])");
  assert((await t.page.$$eval(".pb-name", (e) => e.map((x) => x.textContent).join())) === "Guest,Guest", "bukan Guest");
  await t.page.click('.bc-tabs button[data-tab="import"]');
  for (const [k, sel] of [["lichess", "#ccUserLi"], ["chesscom", "#ccUserCc"], ["fen", "#fenInput"]]) {
    await pick(t.page, k);
    assert(await t.page.isVisible(sel), k + ": form tidak tampil");
  }
  await pick(t.page, "fen");
  await t.page.fill("#fenInput", "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"); await t.page.click("#loadFen");
  assert((await fen(t.page)) === "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b", "FEN tidak dimuat");
  assert(await t.page.isHidden("#playerTop"), "profil seharusnya tersembunyi setelah FEN");
  await t.ctx.close();
});

await test("Play & Bot: tidak ada tombol awal/akhir, tombol mundur/maju berikon SVG; Replay tetap 4 tombol + autoplay", async () => {
  const t = await open("/play", "#nav-back-btn");
  assert((await t.page.$("#nav-first-btn")) === null && (await t.page.$("#nav-last-btn")) === null, "Play masih punya awal/akhir");
  assert(await t.page.$eval("#nav-back-btn", (b) => !!b.querySelector("svg") && b.textContent.trim() === ""), "Play mundur bukan SVG");
  assert(await t.page.$eval("#nav-forward-btn", (b) => !!b.querySelector("svg") && b.textContent.trim() === ""), "Play maju bukan SVG");
  const rp = await t.page.$$eval("#replay-page .nav-btn", (b) => b.map((x) => !!x.querySelector("svg") && x.textContent.trim() === ""));
  assert(rp.length === 4 && rp.every(Boolean), "Replay: " + rp);
  assert(await t.page.$("#replay-autoplay-btn svg") !== null, "autoplay Replay tanpa SVG");
  assert(t.pageErrors.length === 0, "pageerror Play: " + t.pageErrors[0]);
  await t.ctx.close();
  const b = await open("/bot", "#navPrev").catch(() => null);
  if (b) {
    assert((await b.page.$("#navFirst")) === null && (await b.page.$("#navLast")) === null, "Bot masih punya awal/akhir");
    assert(await b.page.$eval("#navPrev", (x) => !!x.querySelector("svg")) && await b.page.$eval("#navNext", (x) => !!x.querySelector("svg")), "Bot bukan SVG");
    await b.ctx.close();
  }
});

await browser.close(); server.close();
const ok = results.filter(Boolean).length;
console.log("\nHasil: " + ok + "/" + results.length + " lulus" + (ok === results.length ? "" : ", " + (results.length - ok) + " GAGAL"));
process.exit(ok === results.length ? 0 : 1);
