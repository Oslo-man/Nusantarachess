import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import crypto from "node:crypto";

export function makeUser(over = {}) {
  return {
    id: 1, username: "TesterNusantara", levelChosen: "beginner", profilePhoto: null,
    eloBullet: 812, eloBlitz: 905, eloRapid: 1010, gameCountBullet: 4, gameCountBlitz: 9, gameCountRapid: 12,
    wins: 14, losses: 9, draws: 2, puzzleRating: 1180, puzzleSolved: 33, puzzleFailed: 7,
    isAdminUnlocked: false, eloProtected: false, customOpponent: null, botAvatarOverrides: null,
    isGuest: false, country: "ID", createdAt: "2026-01-15T10:00:00.000Z", ...over
  };
}

const GAME = (i, result) => ({
  id: "g" + i, category: ["bullet", "blitz", "rapid"][i % 3], result, opponentName: "Lawan" + i, opponentElo: 900 + i * 10,
  playerColor: i % 2 ? "black" : "white", eloChange: result === "win" ? 8 : -6, endedAt: "2026-02-0" + (1 + (i % 8)) + "T10:00:00.000Z",
  pgn: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7", moves: 10, reason: "checkmate", timeControl: "3+0"
});

export function installMockApi(context, { root, loggedIn = true, user = makeUser(), calls = [] } = {}) {
  const { ChessGame, fromAlgebraic } = createRequire(import.meta.url)(path.join(root, "shared/chess-rules.js"));
  const practice = new Map();
  const pub = (m) => ({ id: m.id, character: m.character, playerColor: m.playerColor, fen: m.fen, status: m.status, result: m.result, resultReason: m.resultReason, sanHistory: m.sanHistory });
  const lessons = JSON.parse(fs.readFileSync(path.join(root, "server/data-seed/lessons.json"), "utf8"));
  return context.route(/^https?:\/\/[^/]+:3000\/api\//, async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const p = url.pathname.replace(/^\/api/, "");
    const method = req.method();
    calls.push(method + " " + p);
    const json = (body, status = 200) => route.fulfill({ status, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify(body) });
    if (method === "OPTIONS") return route.fulfill({ status: 204, headers: { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*" } });
    if (p === "/health") return json({ ok: true });
    if (p === "/auth/me") return loggedIn ? json({ user }) : json({ error: "Tidak login" }, 401);
    if (p === "/auth/login" || p === "/auth/register") return json({ token: "tok", user });
    if (p === "/auth/guest") return json({ token: "tok-guest", user: makeUser({ isGuest: true, username: "Tamu83920481" }) });
    if (p === "/auth/logout") return json({ ok: true });
    if (p === "/profile/summary") return json({ user, recentGames: [GAME(1, "win"), GAME(2, "loss"), GAME(3, "draw")] });
    if (p === "/profile/rating-history") return json({ history: [{ at: "2026-02-01", elo: 800 }, { at: "2026-02-05", elo: 830 }, { at: "2026-02-09", elo: 812 }], category: url.searchParams.get("category") || "blitz" });
    if (p === "/profile/games") return json({ games: [GAME(1, "win"), GAME(2, "loss"), GAME(3, "draw"), GAME(4, "win")], total: 4, page: 1, pageSize: 10, totalPages: 1 });
    if (p.startsWith("/profile/games/")) return json({ game: GAME(1, "win") });
    if (p === "/leaderboard" || p === "/public/leaderboard") {
      const rows = Array.from({ length: 5 }, (_, i) => ({ rank: i + 1, username: "Pemain" + (i + 1), rating: 1500 - i * 40, gamesPlayed: 10 + i }));
      const body = { category: url.searchParams.get("category") || "bullet", leaderboard: rows };
      if (p === "/leaderboard") body.myRank = { rank: 42, username: user.username, rating: 812, outsideTop: true };
      return json(body);
    }
    if (p === "/public/search-players") return json({ results: [{ username: "Pemain1", eloBlitz: 1500 }] });
    if (p.startsWith("/public/profile/")) return decodeURIComponent(p).endsWith("/ghost") ? json({ error: "Tidak ditemukan" }, 404) : json({ user: makeUser({ username: decodeURIComponent(p.split("/").pop()), createdAt: 1759000000000 }), recentGames: [{ opponentName: "Lawan1", opponentElo: 910, category: "blitz", result: "win", eloChange: 8, playedAt: 1759019400000 }] });
    if (p === "/lessons/definitions") return json(lessons);
    if (p === "/lessons/progress") return json({ completedIds: [lessons.lessons[0].id] });
    if (/^\/lessons\/.+\/complete$/.test(p)) return json({ ok: true });
    if (p === "/practice/start" && method === "POST") {
      const b = JSON.parse(req.postData() || "{}");
      const game = b.startFen ? ChessGame.fromFEN(b.startFen) : new ChessGame();
      const m = { id: crypto.randomUUID(), character: b.character, playerColor: b.playerColor, fen: game.toFEN(), status: "active", result: null, resultReason: null, sanHistory: [] };
      practice.set(m.id, m);
      return json({ match: pub(m) }, 201);
    }
    if (p === "/practice/active") return json({ match: null });
    const pm = p.match(/^\/practice\/([^/]+)\/(state|move|resign)$/);
    if (pm) {
      const m = practice.get(pm[1]);
      if (!m) return json({ error: "Sesi latihan tidak ditemukan." }, 404);
      if (pm[2] === "state") return json({ match: pub(m) });
      if (pm[2] === "resign") { m.status = "finished"; m.result = "loss"; m.resultReason = "resign"; return json({ match: pub(m), gameOver: true }); }
      const b = JSON.parse(req.postData() || "{}");
      const game = ChessGame.fromFEN(m.fen);
      const expectedMover = game.turn === m.playerColor ? "player" : "bot";
      const legal = game.legalMovesFor(fromAlgebraic(b.from));
      const mv = legal.find((x) => x.to === fromAlgebraic(b.to) && (!x.promotion || x.promotion === (b.promotion || "q"))) || legal.find((x) => x.to === fromAlgebraic(b.to));
      if (!mv) return json({ error: "Langkah tidak legal pada posisi saat ini.", match: pub(m) }, 422);
      const before = game.clone(); game.applyMove(mv);
      const san = before.moveToSANFull(mv, game.clone());
      m.fen = game.toFEN(); m.sanHistory.push(san);
      const over = game.gameOverReason();
      if (over.over) { m.status = "finished"; m.result = over.winner === null ? "draw" : over.winner === m.playerColor ? "win" : "loss"; m.resultReason = over.reason; }
      return json({ match: pub(m), san, gameOver: !!over.over, expectedMover });
    }
    if (p === "/match/active") return json({ match: null, timeControl: null });
    if (p === "/puzzle/daily") return json({ error: "Tidak tersedia" }, 404);
    if (p === "/puzzle/next") return json({ error: "Tidak tersedia" }, 404);
    return json({ error: "mock: endpoint belum ditiru " + method + " " + p }, 404);
  });
}
