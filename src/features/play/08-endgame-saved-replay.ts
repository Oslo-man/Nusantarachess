/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
const SAVED_GAMES_KEY = "chessbot_saved_games";
  const SAVED_GAMES_MAX = 50;

  function readAllSavedGames() {
    try {
      const raw = localStorage.getItem(SAVED_GAMES_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function entryBelongsToUser(entry: any, user: any) {
    if (!entry || !user) return false;
    if (entry.userId !== undefined && entry.userId !== null) {
      return String(entry.userId) === String(user.id);
    }
    return !!entry.username && entry.username === user.username;
  }

  function loadSavedGames() {
    const user = state.currentUser;
    if (!user) return [];
    return readAllSavedGames().filter((g) => entryBelongsToUser(g, user));
  }

  function saveGameToStorage(result: any, playerEloChange: any, eloBefore: any, eloAfter: any, user: any) {
    if (state.gameSaved) return;
    state.gameSaved = true;

    const owner = user || state.currentUser;
    if (owner && owner.isGuest) return;
    const entry = {
      id: "g" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
      userId: owner ? owner.id : null,
      username: owner ? owner.username : "Pemain",
      playerColor: state.playerColor,
      opponentName: state.bot ? state.bot.name : "Bot",
      opponentElo: state.bot ? state.bot.elo : null,
      eloBefore: eloBefore,
      eloAfter: eloAfter,
      eloChange: playerEloChange,
      timeControlCategory: state.timeControl ? state.timeControl.category : null,
      result: result,
      sanHistory: (state.sanHistory || []).slice(),
      plySnapshots: (state.plySnapshots || []).slice(),
      lastMoveSquaresPerPly: (state.lastMoveSquaresPerPly || []).slice(),
      pgn: buildPGN(),
      startedAt: state.gameStartTime,
      endedAt: Date.now()
    };

    const all = readAllSavedGames();
    all.unshift(entry);
    let mine = 0;
    const trimmed = all.filter((g) => {
      if (!entryBelongsToUser(g, owner)) return true;
      mine++;
      return mine <= SAVED_GAMES_MAX;
    });

    try {
      localStorage.setItem(SAVED_GAMES_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.error("Gagal menyimpan permainan (localStorage penuh atau tidak tersedia):", e);
    }
  }

  document.getElementById("option-cancel-btn").addEventListener("click", async () => {
    if (!state.gameActive || state.moveCount > 0) return;
    if (!confirm("Batalkan pertandingan ini? Tidak ada perubahan rating.")) return;
    try {
      await api.abortMatch(state.matchId);
    } catch (err) {
      alert(err.message || "Gagal membatalkan pertandingan di server.");
      return;
    }
    state.gameActive = false;
    stopClock();
    closeOptionsMenu();
    enterDashboard();
  });

  document.getElementById("resign-btn").addEventListener("click", async () => {
    if (!state.gameActive || state.pendingServerCall) return;
    if (!confirm("Yakin ingin menyerah?")) return;
    state.pendingServerCall = true;
    stopClock();
    try {
      const res = await api.resign(state.matchId);
      applyServerOutcome(res);
    } catch (err) {
      alert(err.message || "Gagal mengirim menyerah ke server.");
      startClock();
    } finally {
      state.pendingServerCall = false;
    }
  });

  function endGame(outcome: any, matchFromServer: any) {
    state.gameActive = false;
    state.selectedSquare = null;
    state.legalMovesForSelected = [];
    state.premove = null;
    state.premoveTargets = [];
    stopClock();
    updateMoveNavButtons();
    pendingResumeMatch = null;
    pendingResumeTimeControl = null;
    const resumeBanner = document.getElementById("resume-banner");
    if (resumeBanner) resumeBanner.classList.add("hidden");

    if (!outcome) {
      return;
    }

    state.lastGameResult = outcome.result;
    state.currentUser = outcome.user;

    if (!(outcome.guest || (outcome.user && outcome.user.isGuest))) {
      showResult(outcome.eloAfter, outcome.eloChange, outcome.opponentEloChange);
      saveGameToStorage(outcome.result, outcome.eloChange, outcome.eloBefore, outcome.eloAfter, outcome.user);
    }
    showGameOverPopup(outcome);
  }

  function showGameOverPopup(outcome: any) {
    const overlay = document.getElementById("game-result-overlay");
    const titleEl = document.getElementById("game-result-title");
    const subtitleEl = document.getElementById("game-result-subtitle");
    const eloEl = document.getElementById("game-result-elo");
    const reviewBtn = document.getElementById("game-result-review-btn");

    titleEl.classList.remove("is-win", "is-loss", "is-draw");
    if (outcome.result === "win") {
      titleEl.textContent = "Menang";
      titleEl.classList.add("is-win");
    } else if (outcome.result === "loss") {
      titleEl.textContent = "Kalah";
      titleEl.classList.add("is-loss");
    } else {
      titleEl.textContent = "Remis";
      titleEl.classList.add("is-draw");
    }

    const reasonLabels: Record<string, any> = {
      checkmate: "Skakmat",
      stalemate: "Skak pat",
      "fifty-move": "Aturan 50 langkah",
      "dead-position": "Material tidak cukup",
      resign: "Menyerah",
      timeout: "Waktu habis",
      "draw-agreement": "Kesepakatan remis"
    };
    subtitleEl.textContent = reasonLabels[outcome.reason] || "";

    const changeStr = outcome.eloChange > 0 ? "+" + outcome.eloChange
      : outcome.eloChange < 0 ? String(outcome.eloChange)
      : "±0";
    eloEl.textContent = (outcome.guest || outcome.eloChange === null || outcome.eloChange === undefined)
      ? ""
      : "Elo " + changeStr + " → " + outcome.eloAfter;

    (reviewBtn as HTMLInputElement).disabled = false;
    reviewBtn.dataset.savedGameId = outcome.savedGameId || "";
    reviewBtn.textContent = "Ulasan Permainan";

    overlay.classList.remove("hidden");
  }

  function closeGameOverPopup() {
    document.getElementById("game-result-overlay").classList.add("hidden");
  }

  document.getElementById("game-result-review-btn").addEventListener("click", () => {
    const id = document.getElementById("game-result-review-btn").dataset.savedGameId || "";
    let pgn = "";
    try { pgn = buildPGN(); } catch (_) {}
    if (!id && !pgn) return;
    window.NusantaraChess.openGameReview({
      pgn: pgn,
      savedGameId: id || null,
      playerColor: state.playerColor,
      source: "play"
    });
  });
  document.getElementById("game-result-again-btn").addEventListener("click", () => {
    closeGameOverPopup();
    if (state.timeControl && state.timeControl.category) startMatchmaking();
    else enterDashboard();
  });
  document.getElementById("game-result-close-btn").addEventListener("click", () => {
    closeGameOverPopup();
  });

  function showResult(newPlayerElo: any, playerChange: any, opponentChange: any) {
    function formatChange(v: any) {
      if (v > 0) return " +" + v;
      if (v < 0) return " " + v;
      return " ±0";
    }
    function classFor(v: any) {
      return v > 0 ? "positive" : v < 0 ? "negative" : "neutral";
    }

    document.getElementById("game-player-elo").textContent = newPlayerElo;
    const playerChangeEl = document.getElementById("game-player-elo-change");
    playerChangeEl.textContent = formatChange(playerChange);
    playerChangeEl.classList.remove("positive", "negative", "neutral", "hidden");
    playerChangeEl.classList.add(classFor(playerChange));

    const opponentChangeEl = document.getElementById("game-opponent-elo-change");
    opponentChangeEl.textContent = formatChange(opponentChange);
    opponentChangeEl.classList.remove("positive", "negative", "neutral", "hidden");
    opponentChangeEl.classList.add(classFor(opponentChange));
  }

  document.getElementById("open-saved-games-btn")?.addEventListener("click", () => {
    renderSavedGamesList();
    showPage("saved-games-page");
  });
  document.getElementById("saved-games-back-btn").addEventListener("click", () => {
    showPage("dashboard-page");
  });

  function renderSavedGamesList() {
    const games = loadSavedGames();
    const list = document.getElementById("saved-games-list");
    const emptyMsg = document.getElementById("saved-games-empty");
    list.innerHTML = "";

    if (games.length === 0) {
      emptyMsg.classList.remove("hidden");
      return;
    }
    emptyMsg.classList.add("hidden");

    games.forEach(g => {
      const li = document.createElement("li");
      li.className = "saved-game-item";

      const complete = isReplayableEntry(g);
      const resultLabel = g.result === "win" ? "Menang" : g.result === "loss" ? "Kalah" : "Remis";
      const resultClass = g.result === "win" ? "positive" : g.result === "loss" ? "negative" : "neutral";
      const dateStr = window.NusantaraChess.formatDate(g.endedAt);
      const eloNum = Number(g.eloChange);
      const changeStr = g.eloChange == null || !isFinite(eloNum) ? "" : (eloNum > 0 ? "+" + eloNum : eloNum < 0 ? String(eloNum) : "±0");
      const oppElo = g.opponentElo == null ? "" : " (" + g.opponentElo + ")";

      li.innerHTML =
        '<div class="saved-game-main">' +
          '<span class="saved-game-result ' + resultClass + '">' + resultLabel + '</span>' +
          '<span class="saved-game-opponent">vs ' + escapeHtml(g.opponentName || "Bot") + escapeHtml(oppElo) + '</span>' +
        '</div>' +
        '<div class="saved-game-meta">' +
          '<span>' + escapeHtml(g.timeControlCategory || "") + '</span>' +
          (changeStr ? '<span>Elo ' + changeStr + '</span>' : '') +
          '<span>' + escapeHtml(dateStr) + '</span>' +
        '</div>';

      if (!complete) li.classList.add("is-incomplete");
      li.tabIndex = 0;
      li.setAttribute("role", "button");
      li.addEventListener("click", () => openReplay(g));
      li.addEventListener("keydown", (ev: any) => {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); openReplay(g); }
      });
      list.appendChild(li);
    });
  }

  function escapeHtml(str: any) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  const replayState: Record<string, any> = { game: null, viewPly: -1 };
  let replayAutoTimer: any = null;

  function isReplayableEntry(g: any) {
    return !!g && Array.isArray(g.plySnapshots) && g.plySnapshots.length > 0
      && g.plySnapshots.every((f: any) => typeof f === "string" && f.indexOf("/") !== -1);
  }

  function openReplay(gameEntry: any) {
    if (!isReplayableEntry(gameEntry)) {
      alert("Data permainan ini tidak lengkap sehingga tidak bisa diputar ulang.");
      return;
    }
    stopReplayAutoplay();
    replayState.game = gameEntry;
    replayState.viewPly = gameEntry.plySnapshots.length - 1;

    document.getElementById("replay-title").textContent =
      "vs " + (gameEntry.opponentName || "Bot") + " (" + (gameEntry.result === "win" ? "Menang" : gameEntry.result === "loss" ? "Kalah" : "Remis") + ")";

    renderReplayMoveHistory(Array.isArray(gameEntry.sanHistory) ? gameEntry.sanHistory : []);
    renderReplayBoard();
    showPage("replay-page");
    const pageEl = document.getElementById("replay-page");
    if (pageEl) pageEl.scrollTop = 0;
    scrollReplayHistoryToActive();
  }

  function scrollReplayHistoryToActive() {
    const list = document.getElementById("replay-move-history");
    if (!list) return;
    const active = list.querySelector("li.history-active") as HTMLElement | null;
    if (!active) { list.scrollTop = 0; return; }
    const top = active.offsetTop - list.offsetTop;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (top + active.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = top + active.offsetHeight - list.clientHeight;
  }

  function renderReplayMoveHistory(sanHistory: any) {
    const list = document.getElementById("replay-move-history");
    list.innerHTML = "";
    for (let i = 0; i < sanHistory.length; i += 2) {
      const moveNumber = i / 2 + 1;
      const li = createMoveRow(moveNumber, sanHistory[i]);
      if (sanHistory[i + 1]) li.appendChild(createMoveCell("mv-b", sanHistory[i + 1]));
      list.appendChild(li);
    }
  }

  function renderReplayBoard() {
    const boardEl = document.getElementById("replay-chessboard");
    boardEl.innerHTML = "";
    const g = replayState.game;
    const flip = g.playerColor === "b";
    replayState.viewPly = Math.max(0, Math.min(replayState.viewPly, g.plySnapshots.length - 1));
    const fen = g.plySnapshots[replayState.viewPly];
    const board = boardArrayFromFEN(fen);

    let highlight = null;
    if (replayState.viewPly >= 1 && g.lastMoveSquaresPerPly && g.lastMoveSquaresPerPly[replayState.viewPly - 1]) {
      highlight = g.lastMoveSquaresPerPly[replayState.viewPly - 1];
    }

    for (let displayRow = 0; displayRow < 8; displayRow++) {
      for (let displayCol = 0; displayCol < 8; displayCol++) {
        const rank = flip ? 7 - displayRow : displayRow;
        const file = flip ? 7 - displayCol : displayCol;
        const idx = sqIndex(file, rank);

        const sq = document.createElement("div");
        sq.className = "square " + (((rank + file) % 2 === 0) ? "light" : "dark");
        if (highlight && (idx === highlight.from || idx === highlight.to)) sq.classList.add("last-move");

        const piece = board[idx];
        if (piece) {
          const glyph = document.createElement("div");
          glyph.className = "piece";
          glyph.innerHTML = PIECE_SVG[piece.color + piece.type] || "";
          sq.appendChild(glyph);
        }
        boardEl.appendChild(sq);
      }
    }

    updateReplayNavButtons();

    document.querySelectorAll("#replay-move-history li").forEach(li => li.classList.remove("history-active"));
    if (replayState.viewPly >= 1) {
      const moveNumber = Math.ceil(replayState.viewPly / 2);
      const li = document.querySelector('#replay-move-history li[data-move-number="' + moveNumber + '"]');
      if (li) li.classList.add("history-active");
    }
    scrollReplayHistoryToActive();
  }

  function updateReplayNavButtons() {
    const maxPly = replayState.game.plySnapshots.length - 1;
    (document.getElementById("replay-nav-first-btn") as HTMLInputElement).disabled = replayState.viewPly <= 0;
    (document.getElementById("replay-nav-back-btn") as HTMLInputElement).disabled = replayState.viewPly <= 0;
    (document.getElementById("replay-nav-forward-btn") as HTMLInputElement).disabled = replayState.viewPly >= maxPly;
    (document.getElementById("replay-nav-last-btn") as HTMLInputElement).disabled = replayState.viewPly >= maxPly;
  }

  document.getElementById("replay-nav-first-btn").addEventListener("click", () => {
    stopReplayAutoplay();
    replayState.viewPly = 0;
    renderReplayBoard();
  });
  document.getElementById("replay-nav-back-btn").addEventListener("click", () => {
    stopReplayAutoplay();
    if (replayState.viewPly > 0) replayState.viewPly--;
    renderReplayBoard();
  });
  document.getElementById("replay-nav-forward-btn").addEventListener("click", () => {
    stopReplayAutoplay();
    const maxPly = replayState.game.plySnapshots.length - 1;
    if (replayState.viewPly < maxPly) replayState.viewPly++;
    renderReplayBoard();
  });
  document.getElementById("replay-nav-last-btn").addEventListener("click", () => {
    stopReplayAutoplay();
    replayState.viewPly = replayState.game.plySnapshots.length - 1;
    renderReplayBoard();
  });
  document.getElementById("replay-back-btn").addEventListener("click", () => {
    stopReplayAutoplay();
    showPage("saved-games-page");
  });
  const replayApBtn = document.getElementById("replay-autoplay-btn");
  const replayApLabel = document.getElementById("replay-autoplay-label");
  const replayApSpeed = document.getElementById("replay-autoplay-speed") as HTMLSelectElement;
  function setReplayAutoplayUi(on: boolean) {
    if (!replayApBtn) return;
    replayApBtn.classList.toggle("is-playing", on);
    replayApBtn.setAttribute("aria-pressed", on ? "true" : "false");
    const text = on ? "Jeda" : "Putar otomatis";
    if (replayApLabel) replayApLabel.textContent = text;
    replayApBtn.title = text;
  }
  function stopReplayAutoplay() {
    if (replayAutoTimer !== null) { clearTimeout(replayAutoTimer); replayAutoTimer = null; }
    setReplayAutoplayUi(false);
  }
  function replayAutoplayTick() {
    replayAutoTimer = null;
    const pageEl = document.getElementById("replay-page");
    if (!replayState.game || !pageEl || !pageEl.classList.contains("active")) { setReplayAutoplayUi(false); return; }
    const maxPly = replayState.game.plySnapshots.length - 1;
    if (replayState.viewPly >= maxPly) { stopReplayAutoplay(); return; }
    replayState.viewPly++;
    renderReplayBoard();
    if (replayState.viewPly >= maxPly) { stopReplayAutoplay(); return; }
    replayAutoTimer = setTimeout(replayAutoplayTick, +replayApSpeed.value);
  }
  if (replayApBtn && replayApSpeed) {
    replayApBtn.addEventListener("click", () => {
      if (replayAutoTimer !== null) { stopReplayAutoplay(); return; }
      if (!replayState.game) return;
      const maxPly = replayState.game.plySnapshots.length - 1;
      if (maxPly < 1) return;
      if (replayState.viewPly >= maxPly) { replayState.viewPly = 0; renderReplayBoard(); }
      setReplayAutoplayUi(true);
      replayAutoTimer = setTimeout(replayAutoplayTick, Math.min(+replayApSpeed.value, 400));
    });
    replayApSpeed.addEventListener("change", () => {
      if (replayAutoTimer === null) return;
      clearTimeout(replayAutoTimer);
      replayAutoTimer = setTimeout(replayAutoplayTick, +replayApSpeed.value);
    });
  }
  document.getElementById("replay-copy-pgn-btn").addEventListener("click", async () => {
    const pgn = replayState.game.pgn || "";
    try {
      await navigator.clipboard.writeText(pgn);
      alert("PGN berhasil disalin ke clipboard.");
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = pgn;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        alert("PGN berhasil disalin ke clipboard.");
      } catch (e2) {
        alert("Gagal menyalin PGN otomatis. Salin manual dari sini:\n\n" + pgn);
      }
      document.body.removeChild(ta);
    }
  });
}








