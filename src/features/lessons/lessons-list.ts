(function () {
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const api = window.NusantaraChess.api;
  const initNav = (user: any) => {
    const overlay = document.getElementById("authGateOverlay");
    if (overlay) overlay.style.display = "none";
    if (window.NusantaraChess.initSiteNav) window.NusantaraChess.initSiteNav(user, "/lessons");
    loadAndRender(!!user);
  };
  if (api && api.isLoggedIn()) {
    api.me().then(initNav).catch(() => initNav(null));
  } else {
    initNav(null);
  }
});

const CHECK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const CHEVRON_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';

async function loadAndRender(loggedIn: boolean) {
  const container = document.getElementById("lessonCategories");

  if (container.querySelector(".lesson-category-block")) {
    if (loggedIn) {
      try {
        applyProgress(new Set(await window.NusantaraChess.api.getLessonProgress()));
      } catch (err) {
      }
    }
    return;
  }

  container.innerHTML = '<p class="lessons-status-text">Memuat lesson…</p>';

  let definitions;
  try {
    definitions = await window.NusantaraChess.api.getLessonDefinitions();
  } catch (err) {
    container.innerHTML =
      '<p class="lessons-status-text lessons-status-error">Gagal memuat daftar lesson dari server. ' +
      'Periksa koneksi Anda lalu muat ulang halaman ini.</p>';
    return;
  }

  if (!definitions || !Array.isArray(definitions.categories) || !Array.isArray(definitions.lessons) || definitions.lessons.length === 0) {
    container.innerHTML = '<p class="lessons-status-text lessons-status-error">Data lesson kosong/tidak valid dari server.</p>';
    return;
  }

  let completedIds = [];
  if (loggedIn) {
    try {
      completedIds = await window.NusantaraChess.api.getLessonProgress();
    } catch (err) {
    }
  }

  renderCategories(definitions, new Set(completedIds));
}

function applyProgress(completedSet: Set<string>) {
  document.querySelectorAll("a.lesson-card").forEach((card) => {
    let id = (card.getAttribute("href") || "").split("/").pop() || "";
    try { id = decodeURIComponent(id); } catch (e) { }
    if (!completedSet.has(id)) return;
    const status = card.querySelector(".lesson-card-status");
    if (!status) return;
    status.classList.add("completed");
    status.innerHTML = CHECK_ICON;
  });
}

function renderCategories(definitions: any, completedSet: any) {
  const container = document.getElementById("lessonCategories");

  container.innerHTML = definitions.categories.map((cat: any) => {
    const lessonsInCat = definitions.lessons.filter((l: any) => l.category === cat.id);
    const cardsHtml = lessonsInCat.map((lesson: any) => {
      const isDone = completedSet.has(lesson.id);
      return (
        '<a class="lesson-card" href="/lessons/' + encodeURIComponent(lesson.id) + '" data-route-link>' +
          '<span class="lesson-card-status' + (isDone ? " completed" : "") + '" aria-hidden="true">' + (isDone ? CHECK_ICON : "") + '</span>' +
          '<span class="lesson-card-body">' +
            '<span class="lesson-card-title">' + escapeHtml(lesson.title) + '</span>' +
          '</span>' +
          '<span class="lesson-card-chevron">' + CHEVRON_ICON + '</span>' +
        '</a>'
      );
    }).join("");

    return (
      '<section class="lesson-category-block" aria-labelledby="cat-' + cat.id + '">' +
        '<div class="lesson-category-header">' +
          '<span class="lesson-category-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + cat.icon + '</svg></span>' +
          '<div>' +
            '<h2 id="cat-' + cat.id + '">' + escapeHtml(cat.title) + '</h2>' +
          '</div>' +
        '</div>' +
        '<div class="lesson-card-grid">' + cardsHtml + '</div>' +
      '</section>'
    );
  }).join("");
}

function escapeHtml(str: any) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

})();
