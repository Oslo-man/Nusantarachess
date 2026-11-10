(function () {
"use strict";

let currentUsername: any = null;

document.addEventListener("DOMContentLoaded", () => {
  const api = window.NusantaraChess.api;
  const overlay = document.getElementById("authGateOverlay");
  if (overlay) overlay.style.display = "none";

  const initNav = (user: any) => {
    currentUsername = user && user.username ? user.username : null;
    if (window.NusantaraChess.initSiteNav) window.NusantaraChess.initSiteNav(user, "/leaderboard");
    initApp();
  };
  if (api && api.isLoggedIn()) {
    api.me().then(initNav).catch(() => initNav(null));
  } else {
    initNav(null);
  }
});

function initApp() {
  const api = window.NusantaraChess.api;
  const CATEGORIES = ["bullet", "blitz", "rapid", "puzzle"];

  const loadingMsg = document.getElementById("leaderboardLoadingMsg");
  let ssrRendered = !!(loadingMsg && loadingMsg.hidden);

  const activeTab = document.querySelector(".leaderboard-tab.is-active") as HTMLElement | null;
  let activeCategory = (activeTab && activeTab.dataset.cat) || "bullet";

  function setActiveTab(category: any) {
    document.querySelectorAll(".leaderboard-tab").forEach((t) => {
      const on = (t as HTMLElement).dataset.cat === category;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    const catInput = document.querySelector('#leaderboardSearchForm input[name="category"]') as HTMLInputElement | null;
    if (catInput) catInput.value = category;
    activeCategory = category;
  }

  function showMyRank(myRank: any) {
    const myRankEl = document.getElementById("leaderboardMyRank");
    if (myRank && myRank.outsideTop) {
      myRankEl.hidden = false;
      myRankEl.innerHTML =
        '<span class="leaderboard-rank">#' + myRank.rank + '</span>' +
        '<span class="leaderboard-username">' + escapeHtml(myRank.username) + '</span>' +
        '<span class="leaderboard-rating">' + myRank.rating + '</span>';
    }
  }

  function markMe() {
    if (!currentUsername) return;
    const href = "/profile/" + encodeURIComponent(currentUsername);
    document.querySelectorAll("#leaderboardList a.leaderboard-row").forEach((row) => {
      if (row.getAttribute("href") !== href || row.classList.contains("is-me")) return;
      row.classList.add("is-me");
      const name = row.querySelector(".leaderboard-username");
      if (name) name.textContent = name.textContent + " (kamu)";
    });
  }

  async function load(category: any) {
    const listEl = document.getElementById("leaderboardList");
    const loadingEl = document.getElementById("leaderboardLoadingMsg");
    const emptyEl = document.getElementById("leaderboardEmptyMsg");
    const myRankEl = document.getElementById("leaderboardMyRank");

    if (ssrRendered && category === activeCategory) {
      ssrRendered = false;
      if (currentUsername) {
        markMe();
        try { showMyRank((await api.getLeaderboard(category, 50)).myRank); } catch (err) { }
      }
      return;
    }

    loadingEl.hidden = false;
    emptyEl.hidden = true;
    myRankEl.hidden = true;
    listEl.innerHTML = "";
    try {
      const data = (api.isLoggedIn())
        ? await api.getLeaderboard(category, 50)
        : await api.getPublicLeaderboard(category, 50);
      const leaderboard = data.leaderboard;
      loadingEl.hidden = true;
      if (leaderboard.length === 0) {
        emptyEl.hidden = false;
        return;
      }
      listEl.innerHTML = leaderboard.map((row: any) => renderRow(row)).join("");
      showMyRank(data.myRank);
    } catch (err) {
      loadingEl.hidden = true;
      emptyEl.hidden = false;
      emptyEl.textContent = err.message || "Gagal memuat leaderboard.";
    }
  }

  function renderRow(row: any) {
    const isMe = row.username === currentUsername;
    const rankClass = row.rank <= 3 ? "top3" : "";
    const gamesText = row.gamesPlayed != null ? row.gamesPlayed + " partai" : "";
    const href = "/profile/" + encodeURIComponent(row.username);
    return (
      '<a class="leaderboard-row' + (isMe ? " is-me" : "") + '" href="' + escapeHtml(href) + '" data-route-link>' +
        '<span class="leaderboard-rank ' + rankClass + '">#' + row.rank + '</span>' +
        '<span class="leaderboard-username">' + escapeHtml(row.username) + (isMe ? " (kamu)" : "") + '</span>' +
        '<span class="leaderboard-games-played">' + gamesText + '</span>' +
        '<span class="leaderboard-rating">' + row.rating + '</span>' +
      '</a>'
    );
  }

  document.querySelectorAll(".leaderboard-tab").forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = (tab as HTMLElement).dataset.cat;
      if (cat === activeCategory) return;
      setActiveTab(cat);
      history.replaceState(null, "", "/leaderboard" + (cat === "bullet" ? "" : "?category=" + cat));
      load(cat);
    });
  });

  if (!ssrRendered) {
    const urlCat = new URLSearchParams(location.search).get("category");
    if (urlCat && CATEGORIES.includes(urlCat) && urlCat !== activeCategory) setActiveTab(urlCat);
  }

  const searchForm = document.getElementById("leaderboardSearchForm");
  const searchInput = document.getElementById("leaderboardSearchInput");
  const searchResultsEl = document.getElementById("leaderboardSearchResults");
  let searchDebounceTimer: any = null;

  function renderSearchResult(row: any) {
    const href = "/profile/" + encodeURIComponent(row.username);
    return (
      '<a class="leaderboard-row" href="' + escapeHtml(href) + '" data-route-link>' +
        '<span class="leaderboard-username">' + escapeHtml(row.username) + '</span>' +
        '<span class="leaderboard-rating">' + row.eloBlitz + '</span>' +
      '</a>'
    );
  }

  async function runSearch(query: any) {
    if (!query || query.trim().length < 2) {
      searchResultsEl.hidden = true;
      searchResultsEl.innerHTML = "";
      return;
    }
    try {
      const results = await api.searchPlayers(query.trim(), 8);
      searchResultsEl.hidden = false;
      searchResultsEl.innerHTML = results.length > 0
        ? results.map(renderSearchResult).join("")
        : '<p class="leaderboard-empty-msg">Tidak ada pemain dengan nama itu.</p>';
    } catch (err) {
      searchResultsEl.hidden = false;
      searchResultsEl.innerHTML = '<p class="leaderboard-empty-msg">Gagal mencari pemain.</p>';
    }
  }

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      runSearch((searchInput as HTMLInputElement).value);
    });
  }
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => runSearch((searchInput as HTMLInputElement).value), 300);
    });
  }

  const initialQuery = new URLSearchParams(location.search).get("search");
  if (initialQuery && searchInput && !(searchInput as HTMLInputElement).value && searchResultsEl.hidden) {
    (searchInput as HTMLInputElement).value = initialQuery;
    runSearch(initialQuery);
  }
  load(activeCategory);
}

function escapeHtml(str: any) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

})();
