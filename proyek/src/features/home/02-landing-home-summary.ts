function showLanding() {
  landingView.classList.remove("hidden");
  authContainer.classList.add("hidden");
  document.body.classList.remove("auth-modal-open");
  menuContainer.classList.add("hidden");
}

function renderHomeAvatar(user: any) {
  const avatarEl = document.getElementById("home-avatar");
  if (!avatarEl) return;
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

function fillHomeSummary(user: any) {
  renderHomeAvatar(user);

  const editNameBtn = document.getElementById("home-edit-name");
  if (editNameBtn) editNameBtn.hidden = !!user.isGuest;

  const bulletEl = document.getElementById("home-elo-bullet");
  const blitzEl = document.getElementById("home-elo-blitz");
  const rapidEl = document.getElementById("home-elo-rapid");
  const noElo = !!user.isGuest;
  if (bulletEl) bulletEl.textContent = noElo ? "—" : (user.eloBullet ?? "—");
  if (blitzEl) blitzEl.textContent = noElo ? "—" : (user.eloBlitz ?? "—");
  if (rapidEl) rapidEl.textContent = noElo ? "—" : (user.eloRapid ?? "—");

  const recordEl = document.getElementById("home-record-line");
  if (recordEl) {
    const wins = user.wins ?? 0;
    const losses = user.losses ?? 0;
    const draws = user.draws ?? 0;
    const total = wins + losses + draws;
    recordEl.textContent = total > 0
      ? total + " partai dimainkan · " + wins + "M / " + losses + "K / " + draws + "R"
      : "Belum ada partai online tercatat — coba mulai satu di bawah.";
  }
}

function fillHomeStats(user: any) {
  const bulletEl = document.getElementById("homeStatsBullet");
  const blitzEl = document.getElementById("homeStatsBlitz");
  const rapidEl = document.getElementById("homeStatsRapid");
  if (bulletEl) bulletEl.textContent = user.gameCountBullet ?? 0;
  if (blitzEl) blitzEl.textContent = user.gameCountBlitz ?? 0;
  if (rapidEl) rapidEl.textContent = user.gameCountRapid ?? 0;
}

function fillHomePuzzleWidget(user: any) {
  const ratingEl = document.getElementById("homePuzzleRating");
  const recordEl = document.getElementById("homePuzzleRecord");
  if (ratingEl) ratingEl.textContent = user.puzzleRating ?? "—";
  if (recordEl) {
    const solved = user.puzzleSolved ?? 0;
    const failed = user.puzzleFailed ?? 0;
    const total = solved + failed;
    recordEl.textContent = total > 0
      ? solved + " terpecahkan dari " + total + " percobaan"
      : "Rating puzzle — belum ada percobaan";
  }
}

function fillHomeRecentGames(games: any) {
  const listEl = document.getElementById("homeRecentGamesList");
  const emptyEl = document.getElementById("homeRecentGamesEmpty");
  if (!listEl || !emptyEl) return;

  if (!games || games.length === 0) {
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;

  listEl.innerHTML = games.map((g: any) => window.NusantaraChess.gameHistoryRowHtml(g)).join("");
}

async function fillHomeLessonsProgress() {
  const countEl = document.getElementById("homeLessonsCount");
  const fillEl = document.getElementById("homeLessonsProgressFill");
  const subEl = document.getElementById("homeLessonsSub");
  if (!countEl) return;

  try {
    const [definitions, completedIds] = await Promise.all([
      api.getLessonDefinitions(),
      api.getLessonProgress()
    ]);
    const allLessons = (definitions && Array.isArray(definitions.lessons)) ? definitions.lessons : [];
    const total = allLessons.length;
    const completedSet = new Set(completedIds);
    const completedCount = allLessons.filter((l: any) => completedSet.has(l.id)).length;

    countEl.textContent = total > 0 ? completedCount + " / " + total : "—";
    if (subEl) subEl.textContent = total > 0 ? "pelajaran selesai" : "Data lesson tidak tersedia";
    if (fillEl) fillEl.style.width = (total > 0 ? Math.round((completedCount / total) * 100) : 0) + "%";
  } catch (e) {
    countEl.textContent = "—";
    if (subEl) subEl.textContent = "Gagal memuat progres lesson";
    if (fillEl) fillEl.style.width = "0%";
  }
}


