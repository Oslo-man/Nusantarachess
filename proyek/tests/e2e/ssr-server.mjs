import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { stripTypeScriptTypes } from "node:module";
import { makeUser } from "./mock-api.mjs";

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".wasm": "application/wasm", ".xml": "application/xml", ".txt": "text/plain", ".map": "application/json" };

function copyTree(src, dst, onFile) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyTree(s, d, onFile);
    else onFile(s, d);
  }
}

export function compileRewrites(vercelJson) {
  return vercelJson.rewrites.map((r) => {
    const src = r.source.replace(/:([A-Za-z_]\w*)\*/g, "(?<$1>.*)").replace(/:([A-Za-z_]\w*)/g, "(?<$1>[^/]+)");
    return { re: new RegExp("^" + src + "$"), destination: r.destination };
  });
}

const TINY_PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
export { TINY_PNG };
function startBackendStub(modes, lessonsData, calls) {
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, "http://x");
    calls.push(u.pathname + u.search);
    const send = (status, body) => { res.writeHead(status, { "Content-Type": "application/json" }); res.end(JSON.stringify(body)); };
    if (u.pathname === "/api/public/leaderboard") {
      if (modes.leaderboard === "error") return send(500, { error: "stub: galat server" });
      if (modes.leaderboard === "hang") return;
      if (modes.leaderboard === "empty") return send(200, { category: u.searchParams.get("category"), leaderboard: [] });
      if (modes.leaderboard === "many") return send(200, { category: u.searchParams.get("category"), leaderboard: Array.from({ length: 8 }, (_, i) => ({ rank: i + 1, username: "Pemain" + (i + 1), rating: 1700 - i * 30, gamesPlayed: 5 + i })) });
      if (modes.leaderboard === "invalid") return send(200, { category: u.searchParams.get("category"), leaderboard: "bukan-array" });
      return send(200, { category: u.searchParams.get("category"), leaderboard: [1, 2, 3].map((i) => ({ rank: i, username: "Pemain" + i, rating: 1600 - i * 40, gamesPlayed: 10 + i })) });
    }
    if (u.pathname === "/api/lessons/definitions") {
      if (modes.lessons === "error") return send(500, { error: "stub: galat server" });
      if (modes.lessons === "invalid") return send(200, { categories: [], lessons: [] });
      return send(200, lessonsData);
    }
    if (u.pathname === "/api/public/search-players") {
      if (modes.search === "error") return send(500, { error: "stub: galat server" });
      if (modes.search === "invalid") return send(200, { results: "x" });
      return send(200, { results: [{ username: "Pemain1", eloBlitz: 1500 }] });
    }
    const m = u.pathname.match(/^\/api\/public\/profile\/(.+)$/);
    if (m) {
      const name = decodeURIComponent(m[1]);
      if (name.startsWith("ghost")) return send(404, { error: "Tidak ditemukan" });
      if (modes.profile === "error") return send(500, { error: "stub: galat server" });
      if (modes.profile === "invalid") return send(200, { user: { username: name } });
      const game = (i, result, change, playedAt) => ({ opponentName: "Lawan" + i, opponentElo: 900 + i, category: "blitz", result, eloChange: change, playedAt });
      return send(200, {
        user: makeUser({ username: name, createdAt: 1759000000000, profilePhoto: name === "Fotoku" ? TINY_PNG : null }),
        recentGames: name === "Kosong" ? [] : [game(1, "win", 8, 1759019400000), game(2, "loss", -6, 1759060800000), game(3, "draw", 0, 1759100000000)]
      });
    }
    send(404, { error: "stub: " + u.pathname });
  });
  return new Promise((resolve) => server.listen(0, () => resolve({ server, port: server.address().port })));
}

export async function startSsrServer({ projectRoot, distRoot, breakRenderer = false, api = {} }) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "nc-ssr-"));
  const staged = path.join(tmp, "dist");
  copyTree(distRoot, staged, (s, d) => fs.copyFileSync(s, d));
  if (fs.existsSync(path.join(staged, "index.html"))) fs.renameSync(path.join(staged, "index.html"), path.join(staged, "spa.html"));

  const fn = path.join(tmp, "fn");
  copyTree(path.join(projectRoot, "api"), path.join(fn, "api"), (s, d) => {
    if (s.endsWith(".ts")) fs.writeFileSync(d.replace(/\.ts$/, ".js"), stripTypeScriptTypes(fs.readFileSync(s, "utf8"), { mode: "strip" }));
    else if (s.endsWith(".cjs")) fs.copyFileSync(s, d);
  });
  fs.copyFileSync(path.join(projectRoot, "site.config.json"), path.join(fn, "site.config.json"));
  if (breakRenderer) {
    const bundle = path.join(fn, "api/ssr/_lib/app-render.cjs");
    fs.writeFileSync(bundle, fs.readFileSync(bundle, "utf8") + "\nconst __real = module.exports; module.exports = { ...__real, renderAppRoute() { throw new Error('render gagal (simulasi)'); } };\n");
  }

  const lessonsData = JSON.parse(fs.readFileSync(path.join(projectRoot, "server/data-seed/lessons.json"), "utf8"));
  const backendCalls = [];
  const backend = await startBackendStub(api, lessonsData, backendCalls);
  process.env.NUSANTARA_API_BASE = "http://127.0.0.1:" + backend.port + "/api";
  const handler = createRequire(import.meta.url)(path.join(fn, "api/ssr/[...path].js"));
  const rewrites = compileRewrites(JSON.parse(fs.readFileSync(path.join(projectRoot, "vercel.json"), "utf8")));

  const serveFile = (res, file) => {
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  };
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://x");
    const p = decodeURIComponent(url.pathname);
    const file = path.join(staged, p);
    if (file.startsWith(staged) && fs.existsSync(file) && fs.statSync(file).isFile()) return serveFile(res, file);
    for (const rw of rewrites) {
      const m = p.match(rw.re);
      if (!m) continue;
      const dest = rw.destination.replace(/:([A-Za-z_]\w*)/g, (_, k) => (m.groups && m.groups[k] != null ? m.groups[k] : ""));
      if (dest.startsWith("/api/ssr/")) {
        const query = Object.fromEntries(url.searchParams);
        query.path = dest.slice("/api/ssr/".length).split("/").map(decodeURIComponent);
        req.query = query;
        return handler(req, res);
      }
      const target = path.join(staged, dest);
      if (fs.existsSync(target)) return serveFile(res, target);
    }
    res.writeHead(404); res.end("not found");
  });
  await new Promise((resolve) => server.listen(0, resolve));
  return {
    port: server.address().port,
    backendCalls,
    close: () => { server.close(); backend.server.closeAllConnections(); backend.server.close(); fs.rmSync(tmp, { recursive: true, force: true }); }
  };
}
