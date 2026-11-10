(function () {
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  window.NusantaraChess.requireAuth({ blockGuest: true }).then((user: any) => {
    const overlay = document.getElementById("authGateOverlay");
    if (overlay) overlay.style.display = "none";
    if (window.NusantaraChess.initSiteNav) window.NusantaraChess.initSiteNav(user, "/library");
    initApp();
  });
});

function initApp() {
  const api = window.NusantaraChess.api;
  const listEl = document.getElementById("libraryList");
  const emptyEl = document.getElementById("libraryEmptyMsg");
  const loadingEl = document.getElementById("libraryLoadingMsg");
  const paginationEl = document.getElementById("libraryPagination");
  const pageStatusEl = document.getElementById("libraryPageStatus");
  const prevBtn = document.getElementById("libraryPrevBtn");
  const nextBtn = document.getElementById("libraryNextBtn");
  const searchInput = document.getElementById("librarySearch");
  const categorySelect = document.getElementById("libraryCategoryFilter");
  const resultSelect = document.getElementById("libraryResultFilter");

  let state = { category: "all", result: "all", search: "", page: 1 };
  let searchDebounceTimer: any = null;
  let requestSeq = 0;

  async function load() {
    const mySeq = ++requestSeq;
    loadingEl.hidden = false;
    emptyEl.hidden = true;
    listEl.innerHTML = "";
    paginationEl.hidden = true;

    try {
      const data = await api.getGameLibrary({
        category: state.category,
        result: state.result,
        search: state.search,
        page: state.page,
        pageSize: 15
      });
      if (mySeq !== requestSeq) return;

      loadingEl.hidden = true;
      renderList(data.games);

      if (data.games.length === 0) {
        emptyEl.hidden = false;
      } else if (data.totalPages > 1) {
        paginationEl.hidden = false;
        pageStatusEl.textContent = "Halaman " + data.page + " dari " + data.totalPages;
        (prevBtn as HTMLInputElement).disabled = data.page <= 1;
        (nextBtn as HTMLInputElement).disabled = data.page >= data.totalPages;
      }
    } catch (err) {
      if (mySeq !== requestSeq) return;
      loadingEl.hidden = true;
      emptyEl.hidden = false;
      emptyEl.textContent = err.message || "Gagal memuat Game Library.";
    }
  }

  function renderList(games: any) {
    const rowOpts = { dateOpts: { day: "numeric", month: "short", year: "numeric" } };
    listEl.innerHTML = games.map((g: any) => window.NusantaraChess.gameHistoryRowHtml(g, rowOpts)).join("");
  }

  searchInput.addEventListener("input", () => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      state.search = (searchInput as HTMLInputElement).value.trim();
      state.page = 1;
      load();
    }, 350);
  });

  categorySelect.addEventListener("change", () => {
    state.category = (categorySelect as HTMLInputElement).value;
    state.page = 1;
    load();
  });

  resultSelect.addEventListener("change", () => {
    state.result = (resultSelect as HTMLInputElement).value;
    state.page = 1;
    load();
  });

  prevBtn.addEventListener("click", () => {
    if (state.page > 1) { state.page -= 1; load(); }
  });
  nextBtn.addEventListener("click", () => {
    state.page += 1;
    load();
  });

  load();
}

})();
