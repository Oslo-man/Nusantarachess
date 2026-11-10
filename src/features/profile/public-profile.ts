(function () {
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const api = window.NusantaraChess.api;

  const username = location.pathname.split("/")[2] || "";
  const initNav = (user: any) => {
    if (window.NusantaraChess.initSiteNav) window.NusantaraChess.initSiteNav(user, "/profile/" + username);
  };
  if (api && api.isLoggedIn()) {
    api.me().then(initNav).catch(() => initNav(null));
  } else {
    initNav(null);
  }

  initApp(username);
});

const PROFILE_TZ = "Asia/Jakarta";

function guardServerAvatar() {
  const avatarEl = document.getElementById("profileAvatar");
  const img = avatarEl && avatarEl.querySelector("img");
  if (!img) return;
  const fallback = () => window.NusantaraChess.renderProfileAvatar(avatarEl, null);
  img.onerror = fallback;
  if (img.complete && img.naturalWidth === 0) fallback();
}

async function initApp(username: any) {
  const api = window.NusantaraChess.api;
  const heading = document.getElementById("profileNameHeading");
  if (!heading) return;
  if (heading.textContent) {
    guardServerAvatar();
    const more = document.getElementById("recentGamesMore");
    if (more) setupViewAll(more.hidden ? 0 : Infinity, 0);
    return;
  }
  if (!username) {
    showNotFound();
    return;
  }
  try {
    const { user, recentGames, totalGames } = await api.getPublicProfile(username);
    renderHero(user);
    renderRecentGames(recentGames, totalGames);
  } catch (err) {
    console.error("[public-profile] Gagal memuat profil:", err);
    showNotFound();
  }
}

function showNotFound() {
  const notFound = document.getElementById("profileNotFound");
  if (notFound) notFound.hidden = false;
  const heading = document.getElementById("profileNameHeading");
  if (heading) heading.textContent = "Pemain tidak ditemukan";
}

function formatJoinedLabel(createdAt: any) {
  let ms = Number(createdAt);
  if (!Number.isFinite(ms) || ms <= 0) return "";
  if (ms < 1e11) ms *= 1000;
  const d = new Date(ms);
  if (isNaN(d.getTime())) return "";
  let text = "";
  try { text = d.toLocaleDateString("id-ID", { year: "numeric", month: "long", timeZone: PROFILE_TZ }); } catch (e) { text = ""; }
  if (!text || /invalid/i.test(text)) return "";
  return "Bergabung " + text;
}

function renderHero(user: any) {
  document.title = user.username + " — Profil NusantaraChess";
  document.getElementById("profileNameHeading").textContent = user.username;
  document.getElementById("profileJoined").textContent = formatJoinedLabel(user.createdAt);

  const avatarEl = document.getElementById("profileAvatar");
  if (user.profilePhoto && /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+\/]+={0,2}$/.test(user.profilePhoto)) {
    avatarEl.textContent = "";
    const photoEl = document.createElement("img");
    photoEl.alt = "";
    photoEl.setAttribute("src", user.profilePhoto);
    photoEl.onerror = function () { window.NusantaraChess.renderProfileAvatar(avatarEl, null); };
    avatarEl.appendChild(photoEl);
  } else {
    window.NusantaraChess.renderProfileAvatar(avatarEl, null);
  }

  document.getElementById("ratingBullet").textContent = user.eloBullet;
  document.getElementById("ratingBlitz").textContent = user.eloBlitz;
  document.getElementById("ratingRapid").textContent = user.eloRapid;
  document.getElementById("ratingPuzzle").textContent = user.puzzleRating;

  document.getElementById("recordWins").textContent = user.wins;
  document.getElementById("recordDraws").textContent = user.draws;
  document.getElementById("recordLosses").textContent = user.losses;
  document.getElementById("recordPuzzleSolved").textContent = user.puzzleSolved;
}

const PUBLIC_ROW_OPTS = { publicReview: true, dateOpts: { day: "numeric", month: "short", timeZone: PROFILE_TZ } };

function renderRecentGames(games: any, totalGames?: any) {
  const list = document.getElementById("recentGamesList");
  const empty = document.getElementById("recentGamesEmpty");
  if (!games || games.length === 0) {
    list.innerHTML = "";
    empty.hidden = false;
    setupViewAll(0, games ? games.length : 0);
    return;
  }
  empty.hidden = true;
  list.innerHTML = games.map((g: any) => window.NusantaraChess.gameHistoryRowHtml(g, PUBLIC_ROW_OPTS)).join("");
  setupViewAll(totalGames == null ? games.length : totalGames, games.length);
}

let viewAllWired = false;
function setupViewAll(total: number, shown: number) {
  const wrap = document.getElementById("recentGamesMore");
  const btn = document.getElementById("recentViewAllBtn") as HTMLButtonElement | null;
  if (!wrap || !btn) return;
  wrap.hidden = !(total > shown);
  if (viewAllWired) return;
  viewAllWired = true;
  let page = 0, loaded = false, busy = false;
  btn.addEventListener("click", async () => {
    if (busy) return;
    busy = true; btn.disabled = true;
    const username = location.pathname.split("/")[2] || "";
    const list = document.getElementById("recentGamesList");
    try {
      const data = await window.NusantaraChess.api.getPublicProfileGames(decodeURIComponent(username), page + 1, 20);
      if (!loaded) { list.innerHTML = ""; loaded = true; }
      page = data.page;
      list.insertAdjacentHTML("beforeend", data.games.map((g: any) => window.NusantaraChess.gameHistoryRowHtml(g, PUBLIC_ROW_OPTS)).join(""));
      btn.textContent = "Muat lebih banyak";
      wrap.hidden = page >= data.totalPages;
    } catch (err) {
      btn.textContent = "Gagal memuat. Coba lagi";
    } finally {
      busy = false; btn.disabled = false;
    }
  });
}

function escapeHtml(str: any) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

})();
