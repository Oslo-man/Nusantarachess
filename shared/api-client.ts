(function () {
"use strict";

const API_BASE = window.NUSANTARA_API_BASE || ("http://" + location.hostname + ":3000/api");

const TOKEN_KEY = "nusantara_session_token";

let memoryToken: string | null = null;
function getToken() {
  try { return localStorage.getItem(TOKEN_KEY) || memoryToken; }
  catch (e) { return memoryToken; }
}
function setToken(token: any) {
  memoryToken = token || null;
  if (!token && window.NusantaraChess) window.NusantaraChess.currentUser = null;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch (e) { }
  if (token) {
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
  }
}

const PROFILE_REV_KEY = "nusantara_profile_rev";
function publishUser(user: any) {
  if (!user) return user;
  window.NusantaraChess = window.NusantaraChess || {};
  window.NusantaraChess.currentUser = user;
  try { window.dispatchEvent(new CustomEvent("nusantara:user-updated", { detail: { user: user } })); } catch (e) {}
  return user;
}

async function request(method: string, path: string, body?: any): Promise<any> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = "Bearer " + token;

  let res: Response;
  try {
    res = await fetch(API_BASE + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch (networkErr) {
    const err: any = new Error("Tidak bisa menghubungi server. Pastikan server NusantaraChess berjalan (lihat server/README.md).");
    err.status = 0;
    err.networkError = true;
    throw err;
  }

  let payload: any = null;
  try { payload = await res.json(); } catch (e) { }

  if (!res.ok) {
    const err: any = new Error((payload && payload.error) || ("Permintaan gagal (HTTP " + res.status + ")"));
    err.status = res.status;
    err.payload = payload;
    if (res.status === 401 && payload && payload.code === "SESSION_INVALID") {
      err.sessionInvalid = true;
      if (token) {
        setToken(null);
        try { window.dispatchEvent(new CustomEvent("nusantara:session-invalid")); } catch (e) {}
      }
    }
    throw err;
  }
  return payload;
}

const api = {
  async register(username: any, password: any, country?: any) {
    const data = await request("POST", "/auth/register", { username, password, country });
    setToken(data.token);
    return publishUser(data.user);
  },
  async login(username: any, password: any) {
    const data = await request("POST", "/auth/login", { username, password });
    setToken(data.token);
    return publishUser(data.user);
  },
  async guestLogin() {
    const data = await request("POST", "/auth/guest");
    setToken(data.token);
    return publishUser(data.user);
  },
  logout() {
    const oldToken = getToken();
    setToken(null);
    if (oldToken) {
      try {
        fetch(API_BASE + "/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + oldToken },
          keepalive: true
        }).catch(function () {});
      } catch (e) { }
    }
  },
  TOKEN_KEY: TOKEN_KEY,
  async verifySession(): Promise<any> {
    const waits = [0, 700, 1800];
    let lastErr: any = null;
    for (let i = 0; i < waits.length; i++) {
      if (waits[i]) await new Promise(r => setTimeout(r, waits[i]));
      try { return await api.me(); }
      catch (err) {
        if (err && err.status === 401) throw err;
        lastErr = err;
      }
    }
    throw lastErr;
  },
  isLoggedIn() {
    return !!getToken();
  },
  async me() {
    const data = await request("GET", "/auth/me");
    return publishUser(data.user);
  },
  async updateProfile(patch: any) {
    const data = await request("PATCH", "/auth/me", patch);
    try { localStorage.setItem(PROFILE_REV_KEY, String(Date.now())); } catch (e) {}
    return publishUser(data.user);
  },
  async verifyLevelPassword(base: any, password: any) {
    const data = await request("POST", "/auth/verify-level-password", { base, password });
    return { valid: !!(data && data.valid), reason: (data && data.reason) || "invalid" };
  },

  async findMatch(category: any, custom?: { time: number; inc: number } | null) {
    const body = custom ? { category, time: custom.time, inc: custom.inc } : { category };
    return request("POST", "/match/find", body);
  },
  async getActiveMatch() {
    return request("GET", "/match/active");
  },
  async getMatchState(matchId: any) {
    return request("GET", "/match/" + encodeURIComponent(matchId) + "/state");
  },
  async submitMove(matchId: any, from: any, to: any, promotion?: any) {
    return request("POST", "/match/" + encodeURIComponent(matchId) + "/move", { from, to, promotion });
  },
  async resign(matchId: any) {
    return request("POST", "/match/" + encodeURIComponent(matchId) + "/resign");
  },
  async claimTimeout(matchId: any) {
    return request("POST", "/match/" + encodeURIComponent(matchId) + "/timeout");
  },
  async offerDraw(matchId: any) {
    return request("POST", "/match/" + encodeURIComponent(matchId) + "/draw-offer");
  },
  async abortMatch(matchId: any) {
    return request("POST", "/match/" + encodeURIComponent(matchId) + "/abort");
  },

  async startPractice(character: any, playerColor: any, startFen?: any, options?: any) {
    return request("POST", "/practice/start", {
      character, playerColor, startFen: startFen || undefined,
      mode: options && options.mode, level: options && options.level
    });
  },
  async getActivePractice() {
    return request("GET", "/practice/active");
  },
  async getPracticeState(practiceId: any) {
    return request("GET", "/practice/" + encodeURIComponent(practiceId) + "/state");
  },
  async submitPracticeMove(practiceId: any, from: any, to: any, promotion?: any, mover?: any) {
    return request("POST", "/practice/" + encodeURIComponent(practiceId) + "/move", { from, to, promotion, mover });
  },
  async resignPractice(practiceId: any) {
    return request("POST", "/practice/" + encodeURIComponent(practiceId) + "/resign");
  },

  async analyzeGameReview(payload: any) {
    const data = await request("POST", "/review/analyze-game", payload);
    return data.report;
  },
  async classifyMove(payload: any) {
    const data = await request("POST", "/review/classify-move", payload);
    return data.cat;
  },
  async classifyMoveDetail(payload: any) {
    const data = await request("POST", "/review/classify-move", payload);
    return { cat: data.cat, sacrifice: !!data.sacrifice };
  },

  async nextPuzzle(filters?: any) {
    return request("POST", "/puzzle/next", filters || {});
  },
  async dailyPuzzle() {
    return request("GET", "/puzzle/daily");
  },
  async submitPuzzleMove(sessionId: any, from: any, to: any, promotion?: any) {
    return request("POST", "/puzzle/" + encodeURIComponent(sessionId) + "/move", { from, to, promotion: promotion || null });
  },
  async puzzleHint(sessionId: any) {
    return request("POST", "/puzzle/" + encodeURIComponent(sessionId) + "/hint");
  },

  async getProfileSummary() {
    return request("GET", "/profile/summary");
  },
  async getRatingHistory(category?: any, limit?: any) {
    const q = "?category=" + encodeURIComponent(category || "all") + (limit ? "&limit=" + limit : "");
    const data = await request("GET", "/profile/rating-history" + q);
    return data.history;
  },

  async getGameLibrary({ category, result, search, page, pageSize }: any = {}) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (result) params.set("result", result);
    if (search) params.set("search", search);
    if (page) params.set("page", page);
    if (pageSize) params.set("pageSize", pageSize);
    const qs = params.toString();
    return request("GET", "/profile/games" + (qs ? "?" + qs : ""));
  },
  async getGameDetail(id: any) {
    const data = await request("GET", "/profile/games/" + encodeURIComponent(id));
    return data.game;
  },

  async getLeaderboard(category?: any, limit?: any) {
    const q = "?category=" + encodeURIComponent(category || "blitz") + (limit ? "&limit=" + limit : "");
    return request("GET", "/leaderboard" + q);
  },

  async getPublicLeaderboard(category?: any, limit?: any) {
    const q = "?category=" + encodeURIComponent(category || "bullet") + (limit ? "&limit=" + limit : "");
    return request("GET", "/public/leaderboard" + q);
  },
  async searchPlayers(query?: any, limit?: any) {
    const q = "?q=" + encodeURIComponent(query || "") + (limit ? "&limit=" + limit : "");
    const data = await request("GET", "/public/search-players" + q);
    return data.results;
  },
  async getPublicProfile(username: any) {
    return request("GET", "/public/profile/" + encodeURIComponent(username));
  },
  async getPublicProfileGames(username: any, page?: any, pageSize?: any) {
    const q = "?page=" + (page || 1) + (pageSize ? "&pageSize=" + pageSize : "");
    return request("GET", "/public/profile/" + encodeURIComponent(username) + "/games" + q);
  },

  async getPublicGameDetail(id: any) {
    const data = await request("GET", "/public/games/" + encodeURIComponent(id));
    return data.game;
  },

  async getLessonDefinitions() {
    return request("GET", "/lessons/definitions");
  },
  async getLessonProgress() {
    const data = await request("GET", "/lessons/progress");
    return data.completedIds;
  },
  async markLessonCompleted(lessonId: any) {
    return request("POST", "/lessons/" + encodeURIComponent(lessonId) + "/complete");
  },

  async verifyAdminCode(code: any) {
    return request("POST", "/admin/verify", { code });
  },
  async setAdminElo(patch: any) {
    const data = await request("PATCH", "/admin/elo", patch);
    return data.user;
  },
  async setAdminEloProtection(enabled: any) {
    const data = await request("PATCH", "/admin/elo-protection", { enabled });
    return data.user;
  },
  async setAdminCustomOpponent(profile: any) {
    const data = await request("POST", "/admin/custom-opponent", profile);
    return data.user;
  },
  async clearAdminCustomOpponent() {
    const data = await request("DELETE", "/admin/custom-opponent");
    return data.user;
  }
};

function toDateSafe(value: any) {
  if (value === null || value === undefined || value === "") return null;
  let ms: number;
  if (value instanceof Date) ms = value.getTime();
  else if (typeof value === "number") ms = value;
  else if (typeof value === "string" && /^\s*\d+(\.\d+)?\s*$/.test(value)) ms = Number(value);
  else ms = Date.parse(String(value));
  if (!Number.isFinite(ms) || ms <= 0) return null;
  if (ms < 1e11) ms *= 1000;
  const d = new Date(ms);
  return isNaN(d.getTime()) ? null : d;
}
function formatDateSafe(value: any, opts?: any) {
  const d = toDateSafe(value);
  if (!d) return "";
  let text = "";
  try { text = opts ? d.toLocaleDateString("id-ID", opts) : d.toLocaleString("id-ID"); } catch (e) { text = ""; }
  return (!text || /invalid/i.test(text)) ? "" : text;
}

window.NusantaraChess = window.NusantaraChess || {};
window.NusantaraChess.api = api;
window.NusantaraChess.toDateSafe = toDateSafe;
window.NusantaraChess.formatDate = formatDateSafe;

window.addEventListener("storage", function (e) {
  if (e.key === PROFILE_REV_KEY && getToken()) api.me().catch(function () {});
});

})();
