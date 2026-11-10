(function () {
"use strict";

const api = window.NusantaraChess.api;

const landingView = document.getElementById("landing-view");
const authContainer = document.getElementById("auth-container");
const levelSelectView = document.getElementById("level-select-view");
const menuContainer = document.getElementById("menu-container");
const menuUsernameEl = document.getElementById("menu-username");

function getNextParam() {
  const params = new URLSearchParams(location.search);
  const next = params.get("next");
  if (next && /^\/(?!\/)[A-Za-z0-9_\-\/]*(\?.*)?$/.test(next)) return next;
  return null;
}

function getGuestBlockedParam() {
  return new URLSearchParams(location.search).get("guestBlocked") === "1";
}

function showMenu(user: any) {
  if (user.levelChosen === 0 || user.levelChosen === false) {
    showLevelSelect(user);
    return;
  }

  landingView.classList.add("hidden");
  authContainer.classList.add("hidden");
  document.body.classList.remove("auth-modal-open");
  levelSelectView.classList.add("hidden");
  menuContainer.classList.remove("hidden");
  menuUsernameEl.textContent = user.username;
  fillHomeSummary(user);
  fillHomeStats(user);
  fillHomeLessonsProgress();
  if (window.NusantaraChess.initSiteNav) window.NusantaraChess.initSiteNav(user, "/");

  api.getProfileSummary().then((data: any) => {
    fillHomePuzzleWidget(data.user);
    fillHomeRecentGames(data.recentGames);
  }).catch(() => {
    const emptyEl = document.getElementById("homeRecentGamesEmpty");
    if (emptyEl) { emptyEl.hidden = false; emptyEl.textContent = "Gagal memuat data partai terakhir."; }
  });

  const next = getNextParam();
  if (next) {
    const router = window.NusantaraChess.router;
    if (router && typeof router.navigate === "function") router.navigate(next, { replace: true });
    else location.replace(next);
  }
}
