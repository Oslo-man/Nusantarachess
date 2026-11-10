(function () {
"use strict";

function formatJoinedLabel(createdAt: any) {
  let ms = Number(createdAt);
  if (!Number.isFinite(ms) || ms <= 0) return "";
  if (ms < 1e11) ms *= 1000;
  const d = new Date(ms);
  if (isNaN(d.getTime())) return "";
  let text = "";
  try { text = d.toLocaleDateString("id-ID", { year: "numeric", month: "long" }); } catch (e) { text = ""; }
  if (!text || /invalid/i.test(text)) return "";
  return "Bergabung " + text;
}


document.addEventListener("DOMContentLoaded", () => {
  window.NusantaraChess.requireAuth({ blockGuest: true }).then((user: any) => {
    const overlay = document.getElementById("authGateOverlay");
    if (overlay) overlay.style.display = "none";
    if (window.NusantaraChess.initSiteNav) window.NusantaraChess.initSiteNav(user, "/profile");
    initApp();
  });
});

const CATEGORY_LABEL: Record<string, any> = { bullet: "Bullet", blitz: "Blitz", rapid: "Rapid", puzzle: "Puzzle", bot: "Bot" };

async function initApp() {
  const api = window.NusantaraChess.api;
  let historyCache: Record<string, any> = {};
  let activeCategory = "bullet";

  try {
    const { user, recentGames } = await api.getProfileSummary();
    renderHero(user);
    renderRecentGames(recentGames);
  } catch (err) {
    console.error("[profile] Gagal memuat ringkasan:", err);
    document.getElementById("recentGamesEmpty").hidden = false;
    document.getElementById("recentGamesEmpty").textContent = "Gagal memuat data. Coba muat ulang halaman.";
  }

  await loadAndRenderChart(activeCategory);

  document.querySelectorAll(".profile-chart-tab").forEach((tab) => {
    tab.addEventListener("click", async () => {
      if ((tab as HTMLElement).dataset.cat === activeCategory) return;
      document.querySelectorAll(".profile-chart-tab").forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      activeCategory = (tab as HTMLElement).dataset.cat;
      await loadAndRenderChart(activeCategory);
    });
  });

  async function loadAndRenderChart(category: any) {
    if (!historyCache[category]) {
      try {
        const history = await api.getRatingHistory(category, 200);
        historyCache[category] = history[category] || [];
      } catch (err) {
        console.error("[profile] Gagal memuat riwayat rating:", err);
        historyCache[category] = [];
      }
    }
    renderChart(historyCache[category], category);
  }
}

function renderHero(user: any) {
  document.getElementById("profileNameHeading").textContent = user.username;
  const countryEl = document.getElementById("profileCountry");
  const NCp = window.NusantaraChess || {};
  if (countryEl && NCp.flagEmojiForCountry && NCp.flagEmojiForCountry(user.country)) {
    const langCode = NCp.language ? NCp.language.get() : "id";
    countryEl.textContent = NCp.flagEmojiForCountry(user.country) + " " + NCp.countryDisplayName(user.country, langCode);
    countryEl.hidden = false;
  } else if (countryEl) {
    countryEl.hidden = true;
  }
  document.getElementById("profileJoined").textContent = formatJoinedLabel(user.createdAt);

  document.getElementById("ratingBullet").textContent = user.eloBullet;
  document.getElementById("ratingBlitz").textContent = user.eloBlitz;
  document.getElementById("ratingRapid").textContent = user.eloRapid;
  document.getElementById("ratingPuzzle").textContent = user.puzzleRating;

  document.getElementById("recordWins").textContent = user.wins;
  document.getElementById("recordDraws").textContent = user.draws;
  document.getElementById("recordLosses").textContent = user.losses;
  document.getElementById("recordPuzzleSolved").textContent = user.puzzleSolved;

  const avatarEl = document.getElementById("profileAvatar");
  if (user.profilePhoto) {
    avatarEl.textContent = "";
    const img = document.createElement("img");
    img.src = user.profilePhoto;
    img.alt = "";
    img.onerror = function () { window.NusantaraChess.renderProfileAvatar(avatarEl, null); };
    avatarEl.appendChild(img);
  } else {
    window.NusantaraChess.renderProfileAvatar(avatarEl, null);
  }
}

function renderRecentGames(games: any) {
  const listEl = document.getElementById("recentGamesList");
  const emptyEl = document.getElementById("recentGamesEmpty");

  if (!games || games.length === 0) {
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;

  listEl.innerHTML = games.map((g: any) => window.NusantaraChess.gameHistoryRowHtml(g)).join("");
}

function renderChart(points: any, category: any) {
  const svg = document.getElementById("ratingChart");
  const emptyMsg = document.getElementById("chartEmptyMsg");

  if (!points || points.length < 2) {
    svg.style.display = "none";
    emptyMsg.hidden = false;
    return;
  }
  svg.style.display = "block";
  emptyMsg.hidden = true;

  const W = 600, H = 220;
  const padLeft = 44, padRight = 12, padTop = 16, padBottom = 28;
  const plotW = W - padLeft - padRight;
  const plotH = H - padTop - padBottom;

  const ratings = points.map((p: any) => p.rating);
  let min = Math.min(...ratings);
  let max = Math.max(...ratings);
  if (min === max) { min -= 10; max += 10; }
  const rangePad = (max - min) * 0.1;
  min -= rangePad;
  max += rangePad;

  const xFor = (i: any) => padLeft + (i / (points.length - 1)) * plotW;
  const yFor = (rating: any) => padTop + plotH - ((rating - min) / (max - min)) * plotH;

  const pathD = points.map((p: any, i: any) => (i === 0 ? "M" : "L") + xFor(i).toFixed(1) + "," + yFor(p.rating).toFixed(1)).join(" ");

  const gridSteps = 4;
  let gridLines = "";
  let yLabels = "";
  for (let i = 0; i <= gridSteps; i++) {
    const val = min + ((max - min) * i) / gridSteps;
    const y = yFor(val);
    gridLines += '<line x1="' + padLeft + '" y1="' + y.toFixed(1) + '" x2="' + (W - padRight) + '" y2="' + y.toFixed(1) + '" class="chart-grid-line" />';
    yLabels += '<text x="' + (padLeft - 8) + '" y="' + (y + 4).toFixed(1) + '" class="chart-axis-label" text-anchor="end">' + Math.round(val) + '</text>';
  }

  const firstDate = points[0].recordedAt;
  const lastDate = points[points.length - 1].recordedAt;
  const fmt = (d: any) => window.NusantaraChess.formatDate(d, { day: "numeric", month: "short" });
  const xLabels =
    '<text x="' + padLeft + '" y="' + (H - 8) + '" class="chart-axis-label" text-anchor="start">' + fmt(firstDate) + '</text>' +
    '<text x="' + (W - padRight) + '" y="' + (H - 8) + '" class="chart-axis-label" text-anchor="end">' + fmt(lastDate) + '</text>';

  const lastX = xFor(points.length - 1);
  const lastY = yFor(points[points.length - 1].rating);
  const lastPoint =
    '<circle cx="' + lastX.toFixed(1) + '" cy="' + lastY.toFixed(1) + '" r="4" class="chart-last-point" />' +
    '<text x="' + Math.min(lastX, W - padRight - 30) + '" y="' + Math.max(lastY - 10, padTop + 10) + '" class="chart-last-label" text-anchor="end">' + points[points.length - 1].rating + '</text>';

  svg.innerHTML =
    '<style>' +
      '.chart-grid-line{stroke:var(--border);stroke-width:1;}' +
      '.chart-axis-label{fill:var(--text-muted);font-size:11px;font-family:var(--font-sans);}' +
      '.chart-line{fill:none;stroke:var(--accent);stroke-width:2.5;stroke-linejoin:round;stroke-linecap:round;}' +
      '.chart-last-point{fill:var(--accent);stroke:var(--bg-surface);stroke-width:2;}' +
      '.chart-last-label{fill:var(--text-primary);font-size:13px;font-weight:700;font-family:var(--font-sans);}' +
    '</style>' +
    gridLines + yLabels + xLabels +
    '<path d="' + pathD + '" class="chart-line" />' +
    lastPoint;

  svg.setAttribute("aria-label",
    (CATEGORY_LABEL[category] || category) + ": rating bergerak dari " + points[0].rating +
    " menjadi " + points[points.length - 1].rating + " dalam " + points.length + " perubahan tercatat.");
}

function escapeHtml(str: any) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

})();
