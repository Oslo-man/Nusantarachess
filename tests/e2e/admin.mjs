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

const results = [];
async function test(name, fn) {
  try { await fn(); results.push(true); console.log("  PASS " + name); }
  catch (e) { results.push(false); console.log("  FAIL " + name + "  -> " + String((e && e.message) || e).split("\n")[0]); }
}
const assert = (c, m) => { if (!c) throw new Error(m); };

const VALID_CODE = "ADM-TEST-CODE";
const PNG_1PX = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");

async function open({ unlocked = false, viewport = { width: 1280, height: 900 }, failToggle = false, lang = null } = {}) {
  const ctx = await browser.newContext({ viewport, reducedMotion: "reduce" });
  const calls = [];
  const db = { user: makeUser({ isAdminUnlocked: unlocked }), codeUsed: false };
  await installMockApi(ctx, { root: PROJECT_ROOT, loggedIn: true, calls });
  await ctx.route(/unpkg\.com|cdnjs|googleapis|gstatic|jsdelivr/, (r) => r.abort());
  await ctx.route(/^https?:\/\/[^/]+:3000\/api\/(auth\/me|admin\/.*)/, async (route) => {
    const req = route.request();
    const p = new URL(req.url()).pathname.replace(/^\/api/, "");
    const m = req.method();
    const body = (() => { try { return JSON.parse(req.postData() || "{}"); } catch (e) { return {}; } })();
    const json = (b, s = 200) => route.fulfill({ status: s, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify(b) });
    if (m === "OPTIONS") return route.fulfill({ status: 204, headers: { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*" } });
    calls.push(m + " " + p);
    if (p === "/auth/me") return json({ user: db.user });
    if (p === "/admin/verify") {
      if (body.code !== VALID_CODE) return json({ valid: false, error: "Kode akses salah." }, 403);
      if (db.user.isAdminUnlocked) return json({ valid: false, code: "ADMIN_ALREADY_UNLOCKED", error: "Fitur admin sudah aktif di akun ini. Kode tidak dipakai." }, 409);
      db.user.isAdminUnlocked = true;
      return json({ valid: true, user: db.user });
    }
    if (!db.user.isAdminUnlocked) return json({ error: "Fitur admin belum dibuka." }, 403);
    if (p === "/admin/elo" && m === "PATCH") {
      for (const k of ["eloBullet", "eloBlitz", "eloRapid"]) {
        if (k in body) {
          if (typeof body[k] !== "number" || !Number.isFinite(body[k])) return json({ error: k + " harus berupa angka." }, 400);
          db.user[k] = Math.max(1300, Math.min(3200, Math.round(body[k])));
        }
      }
      return json({ user: db.user });
    }
    if (p === "/admin/elo-protection") {
      if (failToggle) return json({ error: "Server error" }, 500);
      db.user.eloProtected = !!body.enabled; return json({ user: db.user });
    }
    if (p === "/admin/custom-opponent" && m === "POST") {
      const name = String(body.name || "").replace(/[<>\u0000-\u001f]/g, "").trim().slice(0, 40);
      if (!name) return json({ error: "Nama lawan custom wajib diisi." }, 400);
      if (typeof body.elo !== "number" || body.elo < 1320 || body.elo > 3190) return json({ error: "Elo lawan custom harus angka antara 1320 dan 3190." }, 400);
      if (body.avatarImage && !/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+\/=]+$/.test(body.avatarImage)) return json({ error: "Format foto lawan custom tidak valid (PNG/JPEG/WebP)." }, 400);
      db.user.customOpponent = JSON.stringify({ name, elo: Math.round(body.elo), title: body.title || "", avatar: "🤖", country: body.country || "ID" });
      if (body.avatarImage) db.user.botAvatarOverrides = JSON.stringify({ [name]: body.avatarImage });
      return json({ user: db.user });
    }
    if (p === "/admin/custom-opponent" && m === "DELETE") { db.user.customOpponent = ""; db.user.botAvatarOverrides = "{}"; return json({ user: db.user }); }
    return json({ error: "nf" }, 404);
  });
  await ctx.addInitScript((lg) => { try { localStorage.setItem("nusantara_session_token", "tok"); if (lg) localStorage.setItem("nusantara_lang", lg); } catch (e) {} }, lang);
  const page = await ctx.newPage();
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  await page.goto(BASE + "/play");
  await page.waitForSelector("#dashboard-settings-btn", { state: "visible", timeout: 10000 });
  await page.waitForFunction(() => document.getElementById("rating-blitz") && document.getElementById("rating-blitz").textContent.trim() !== "", null, { timeout: 10000 });
  return { ctx, page, calls, db, pageErrors };
}
const openModal = async (t) => { await t.page.click("#dashboard-settings-btn"); await t.page.waitForSelector("#dashboard-settings-modal:not(.hidden)", { timeout: 4000 }); };
const txt = (page, sel) => page.$eval(sel, (e) => e.textContent.trim());
const hidden = (page, sel) => page.$eval(sel, (e) => e.classList.contains("hidden"));
const count = (calls, s) => calls.filter((c) => c === s).length;

const { server, port } = await startStaticServer(ROOT);
const BASE = "http://localhost:" + port;
const browser = await chromium.launch();
console.log("Target: " + ROOT + " @ " + BASE);

await test("gerbang kode: kosong & salah menampilkan error, tidak membuka panel", async () => {
  const t = await open(); await openModal(t);
  assert(!(await hidden(t.page, "#admin-unlock-section")) && await hidden(t.page, "#admin-panel-section"), "gerbang harus tampil, panel tersembunyi");
  await t.page.click("#admin-unlock-btn");
  assert((await txt(t.page, "#admin-unlock-error")).length > 0, "kode kosong tidak menampilkan error");
  assert(count(t.calls, "POST /admin/verify") === 0, "kode kosong tidak boleh memanggil server");
  await t.page.fill("#admin-code-input", "salah");
  await t.page.click("#admin-unlock-btn");
  await t.page.waitForFunction(() => /salah/i.test(document.getElementById("admin-unlock-error").textContent));
  assert(await hidden(t.page, "#admin-panel-section"), "panel tidak boleh terbuka dengan kode salah");
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors[0]);
  await t.ctx.close();
});
await test("gerbang kode: tombol Enter di kolom kode mengirim kode", async () => {
  const t = await open(); await openModal(t);
  await t.page.fill("#admin-code-input", VALID_CODE);
  await t.page.press("#admin-code-input", "Enter");
  await t.page.waitForSelector("#admin-panel-section:not(.hidden)", { timeout: 4000 });
  await t.ctx.close();
});
await test("kode benar: panel terbuka, kolom kode dikosongkan, judul modal bukan lagi 'Enter Code'", async () => {
  const t = await open(); await openModal(t);
  await t.page.fill("#admin-code-input", VALID_CODE);
  await t.page.click("#admin-unlock-btn");
  await t.page.waitForSelector("#admin-panel-section:not(.hidden)", { timeout: 4000 });
  assert(await hidden(t.page, "#admin-unlock-section"), "gerbang harus tersembunyi setelah terbuka");
  assert((await t.page.inputValue("#admin-code-input")) === "", "kolom kode harus dikosongkan");
  assert(!/enter code/i.test(await txt(t.page, "#dashboard-settings-modal h3:not(.hidden)")), "judul masih 'Enter Code' padahal panel admin tampil");
  await t.ctx.close();
});
await test("akun sudah terbuka di server tapi state klien usang (409): panel tetap dibuka", async () => {
  const t = await open();
  t.db.user.isAdminUnlocked = true;
  await openModal(t);
  await t.page.fill("#admin-code-input", VALID_CODE);
  await t.page.click("#admin-unlock-btn");
  await t.page.waitForSelector("#admin-panel-section:not(.hidden)", { timeout: 4000 });
  await t.ctx.close();
});

await test("Elo: nilai tidak valid ditolak di klien (kosong, <1300, >3200, desimal, notasi 1e3) tanpa PATCH", async () => {
  const t = await open({ unlocked: true }); await openModal(t);
  await t.page.fill("#admin-elo-blitz", "1600"); await t.page.fill("#admin-elo-rapid", "1700");
  for (const bad of ["", "1299", "3201", "1500.5", "1e3"]) {
    await t.page.fill("#admin-elo-bullet", bad);
    await t.page.click("#admin-elo-save-btn");
    assert((await txt(t.page, "#admin-elo-error")).length > 0, "tidak ada pesan error untuk '" + bad + "'");
  }
  assert(count(t.calls, "PATCH /admin/elo") === 0, "PATCH terkirim padahal input tidak valid");
  await t.ctx.close();
});
await test("Elo: nilai valid tersimpan, dashboard langsung terbarui, bertahan setelah reload", async () => {
  const t = await open({ unlocked: true }); await openModal(t);
  await t.page.fill("#admin-elo-bullet", "1500"); await t.page.fill("#admin-elo-blitz", "2000"); await t.page.fill("#admin-elo-rapid", "3200");
  await t.page.click("#admin-elo-save-btn");
  await t.page.waitForFunction(() => document.getElementById("rating-blitz").textContent.trim() === "2000");
  assert((await txt(t.page, "#rating-bullet")) === "1500" && (await txt(t.page, "#rating-rapid")) === "3200", "rating dashboard tidak sinkron");
  assert((await txt(t.page, "#admin-elo-error")) === "", "error tersisa setelah berhasil");
  await t.page.reload(); await t.page.waitForSelector("#dashboard-settings-btn", { state: "visible" });
  await t.page.waitForFunction(() => document.getElementById("rating-blitz").textContent.trim() !== "");
  await openModal(t);
  assert((await t.page.inputValue("#admin-elo-blitz")) === "2000", "Elo tidak bertahan setelah reload");
  await t.ctx.close();
});
await test("Elo: tombol Simpan dikunci saat request berjalan (tidak bisa dobel kirim)", async () => {
  const t = await open({ unlocked: true }); await openModal(t);
  await t.page.fill("#admin-elo-bullet", "1500"); await t.page.fill("#admin-elo-blitz", "1600"); await t.page.fill("#admin-elo-rapid", "1700");
  await t.page.dblclick("#admin-elo-save-btn");
  await t.page.waitForTimeout(400);
  assert(count(t.calls, "PATCH /admin/elo") === 1, "PATCH terkirim " + count(t.calls, "PATCH /admin/elo") + "x");
  await t.ctx.close();
});

await test("proteksi Elo: toggle tersimpan & bertahan setelah reload", async () => {
  const t = await open({ unlocked: true }); await openModal(t);
  await t.page.check("#admin-elo-protection-toggle");
  await t.page.waitForFunction(() => !document.getElementById("admin-elo-protection-toggle").disabled);
  assert(t.db.user.eloProtected === true, "server tidak menyimpan proteksi");
  await t.page.reload(); await t.page.waitForSelector("#dashboard-settings-btn", { state: "visible" });
  await openModal(t);
  assert(await t.page.isChecked("#admin-elo-protection-toggle"), "toggle tidak tercentang setelah reload");
  await t.ctx.close();
});
await test("proteksi Elo: gagal simpan -> checkbox kembali & ada pesan error terlihat", async () => {
  const t = await open({ unlocked: true, failToggle: true }); await openModal(t);
  await t.page.check("#admin-elo-protection-toggle");
  await t.page.waitForFunction(() => !document.getElementById("admin-elo-protection-toggle").disabled);
  assert(!(await t.page.isChecked("#admin-elo-protection-toggle")), "checkbox tidak dikembalikan");
  assert((await txt(t.page, "#admin-elo-error")).length > 0, "tidak ada pesan error saat gagal simpan");
  await t.ctx.close();
});

await test("lawan custom: validasi nama/Elo (kosong, spasi, desimal, di luar 1320-3190) tanpa POST", async () => {
  const t = await open({ unlocked: true }); await openModal(t);
  const cases = [["", "2000"], ["   ", "2000"], ["Budi", ""], ["Budi", "1319"], ["Budi", "3191"], ["Budi", "2000.5"], ["Budi", "2e3"]];
  for (const [n, e] of cases) {
    await t.page.fill("#admin-custom-name", n); await t.page.fill("#admin-custom-elo", e);
    await t.page.click("#admin-custom-save-btn");
    assert((await txt(t.page, "#admin-custom-error")).length > 0, "tidak ada error untuk nama='" + n + "' elo='" + e + "'");
  }
  assert(count(t.calls, "POST /admin/custom-opponent") === 0, "POST terkirim padahal input tidak valid");
  await t.ctx.close();
});
await test("lawan custom: foto non-gambar ditolak di klien sebelum dikirim", async () => {
  const t = await open({ unlocked: true }); await openModal(t);
  await t.page.fill("#admin-custom-name", "Budi"); await t.page.fill("#admin-custom-elo", "2000");
  await t.page.setInputFiles("#admin-custom-photo", { name: "catatan.txt", mimeType: "text/plain", buffer: Buffer.from("bukan gambar") });
  await t.page.click("#admin-custom-save-btn");
  await t.page.waitForTimeout(500);
  assert((await txt(t.page, "#admin-custom-error")).length > 0, "tidak ada error untuk berkas non-gambar");
  assert(count(t.calls, "POST /admin/custom-opponent") === 0, "berkas non-gambar terkirim ke server");
  await t.ctx.close();
});
await test("lawan custom: simpan (nama+Elo+gelar+negara+foto) -> status aktif, form terisi, reload tetap terisi; Hapus mengosongkan", async () => {
  const t = await open({ unlocked: true }); await openModal(t);
  await t.page.fill("#admin-custom-name", "  Budi Catur  "); await t.page.fill("#admin-custom-elo", "2500");
  await t.page.selectOption("#admin-custom-title", "GM");
  await t.page.setInputFiles("#admin-custom-photo", { name: "f.png", mimeType: "image/png", buffer: PNG_1PX });
  await t.page.click("#admin-custom-save-btn");
  await t.page.waitForFunction(() => !document.getElementById("admin-custom-status").classList.contains("hidden"), null, { timeout: 6000 });
  const st = await txt(t.page, "#admin-custom-status");
  assert(/Budi Catur/.test(st) && /2500/.test(st), "status salah: " + st);
  assert((await t.page.inputValue("#admin-custom-name")) === "Budi Catur", "nama tidak di-trim");
  assert(!(await hidden(t.page, "#admin-custom-photo-preview")), "pratinjau foto tidak tampil");
  await t.page.reload(); await t.page.waitForSelector("#dashboard-settings-btn", { state: "visible" });
  await openModal(t);
  assert((await t.page.inputValue("#admin-custom-elo")) === "2500" && (await t.page.inputValue("#admin-custom-title")) === "GM", "form tidak terisi dari data tersimpan");
  await t.page.click("#admin-custom-clear-btn");
  await t.page.waitForFunction(() => document.getElementById("admin-custom-status").classList.contains("hidden"));
  assert((await t.page.inputValue("#admin-custom-name")) === "" && (await t.page.inputValue("#admin-custom-elo")) === "", "form tidak dikosongkan");
  assert(t.db.user.customOpponent === "", "server tidak menghapus");
  assert(t.pageErrors.length === 0, "pageerror: " + t.pageErrors[0]);
  await t.ctx.close();
});
await test("lawan custom: slider & kolom angka sinkron dua arah", async () => {
  const t = await open({ unlocked: true }); await openModal(t);
  await t.page.fill("#admin-custom-elo", "2222");
  assert((await t.page.inputValue("#admin-custom-elo-range")) === "2222", "slider tidak mengikuti angka");
  await t.page.$eval("#admin-custom-elo-range", (e) => { e.value = "1800"; e.dispatchEvent(new Event("input", { bubbles: true })); });
  assert((await t.page.inputValue("#admin-custom-elo")) === "1800", "angka tidak mengikuti slider");
  await t.ctx.close();
});

await test("modal: Escape menutup; tutup lalu buka ulang membersihkan error & kode yang diketik", async () => {
  const t = await open(); await openModal(t);
  await t.page.fill("#admin-code-input", "rahasia"); await t.page.click("#admin-unlock-btn");
  await t.page.waitForFunction(() => document.getElementById("admin-unlock-error").textContent.trim() !== "");
  await t.page.keyboard.press("Escape");
  await t.page.waitForSelector("#dashboard-settings-modal.hidden", { state: "attached", timeout: 3000 });
  await openModal(t);
  assert((await t.page.inputValue("#admin-code-input")) === "", "kode (password) masih tersisa setelah modal dibuka ulang");
  assert((await txt(t.page, "#admin-unlock-error")) === "", "error lama masih tampil setelah modal dibuka ulang");
  await t.ctx.close();
});
await test("modal: klik latar menutup, klik di dalam kotak tidak menutup; fokus masuk ke modal saat dibuka", async () => {
  const t = await open({ unlocked: true }); await openModal(t);
  await t.page.click(".dashboard-settings-box h3:not(.hidden)");
  assert(!(await hidden(t.page, "#dashboard-settings-modal")), "klik di dalam menutup modal");
  const inside = await t.page.evaluate(() => document.getElementById("dashboard-settings-modal").contains(document.activeElement));
  assert(inside, "fokus keyboard tidak berada di dalam modal");
  await t.page.mouse.click(5, 5);
  assert(await hidden(t.page, "#dashboard-settings-modal"), "klik latar tidak menutup");
  await t.ctx.close();
});
await test("modal: atribut aksesibilitas dialog (role, aria-modal, aria-labelledby)", async () => {
  const t = await open(); await openModal(t);
  const a = await t.page.$eval("#dashboard-settings-modal .dashboard-settings-box", (e) => ({ r: e.getAttribute("role"), m: e.getAttribute("aria-modal"), l: e.getAttribute("aria-labelledby") }));
  assert(a.r === "dialog" && a.m === "true" && a.l, "atribut dialog tidak lengkap: " + JSON.stringify(a));
  await t.ctx.close();
});
await test("mobile 360x640: panel admin muat di layar, bisa digulir sampai tombol terakhir, tanpa scroll horizontal", async () => {
  const t = await open({ unlocked: true, viewport: { width: 360, height: 640 } }); await openModal(t);
  const m = await t.page.$eval(".dashboard-settings-box", (e) => { const r = e.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, sw: e.scrollWidth, cw: e.clientWidth, sh: e.scrollHeight, ch: e.clientHeight, vh: innerHeight }; });
  assert(m.top >= 0 && m.bottom <= m.vh, "kotak modal keluar dari layar: " + JSON.stringify(m));
  assert(m.sw <= m.cw + 1, "ada scroll horizontal di dalam modal: " + JSON.stringify(m));
  await t.page.$eval("#dashboard-settings-close-btn", (e) => e.scrollIntoView());
  const vis = await t.page.$eval("#dashboard-settings-close-btn", (e) => { const r = e.getBoundingClientRect(); return r.bottom <= innerHeight + 1 && r.top >= 0; });
  assert(vis, "tombol Tutup tidak bisa dijangkau");
  await t.ctx.close();
});

await test("English: judul panel admin & pesan error baru diterjemahkan", async () => {
  const t = await open({ unlocked: true, lang: "en" }); await openModal(t);
  assert((await txt(t.page, "#dashboard-settings-modal h3:not(.hidden)")) === "Admin Settings", "judul: " + await txt(t.page, "#dashboard-settings-modal h3:not(.hidden)"));
  await t.page.fill("#admin-elo-bullet", "1500.5"); await t.page.fill("#admin-elo-blitz", "1600"); await t.page.fill("#admin-elo-rapid", "1700");
  await t.page.click("#admin-elo-save-btn");
  await t.page.waitForFunction(() => /whole numbers/i.test(document.getElementById("admin-elo-error").textContent), null, { timeout: 3000 });
  await t.ctx.close();
});

await browser.close(); server.close();
const ok = results.filter(Boolean).length;
console.log("\nHasil: " + ok + "/" + results.length + " lulus" + (ok === results.length ? "" : ", " + (results.length - ok) + " GAGAL"));
process.exit(ok === results.length ? 0 : 1);
