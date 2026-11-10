/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
const timeDropdown = document.getElementById("time-dropdown");
  const timeDropdownTrigger = document.getElementById("time-dropdown-trigger");
  const timeDropdownPanel = document.getElementById("time-dropdown-panel");
  const timeDropdownLabel = document.getElementById("time-dropdown-trigger-label");
  const timeDropdownIcon = document.getElementById("time-dropdown-trigger-icon");

  function openTimeDropdown() {
    timeDropdown.classList.add("open");
    timeDropdownTrigger.setAttribute("aria-expanded", "true");
  }
  function closeTimeDropdown() {
    timeDropdown.classList.remove("open");
    timeDropdownTrigger.setAttribute("aria-expanded", "false");
  }
  timeDropdownTrigger.addEventListener("click", () => {
    if (timeDropdown.classList.contains("open")) {
      closeTimeDropdown();
    } else {
      openTimeDropdown();
    }
  });
  const onDocClickCloseTimeDropdown = (ev: any) => {
    if (!timeDropdown.isConnected) {
      document.removeEventListener("click", onDocClickCloseTimeDropdown);
      return;
    }
    if (!timeDropdown.contains(ev.target)) closeTimeDropdown();
  };
  document.addEventListener("click", onDocClickCloseTimeDropdown);

  document.querySelectorAll(".time-option").forEach(option => {
    option.addEventListener("click", () => {
      document.querySelectorAll(".time-option").forEach(o => o.classList.remove("selected"));
      document.getElementById("time-custom-toggle")?.classList.remove("selected");
      option.classList.add("selected");
      state.timeControl = {
        time: parseInt((option as HTMLElement).dataset.time, 10),
        inc: parseInt((option as HTMLElement).dataset.inc, 10),
        category: (option as HTMLElement).dataset.category
      };
      setTimeTriggerIcon((option as HTMLElement).dataset.category);
      timeDropdownLabel.textContent = option.textContent.trim();
      closeTimeDropdown();
      updateFindMatchButton();
    });
  });

  const timeCustom = document.getElementById("time-custom");
  const timeCustomToggle = document.getElementById("time-custom-toggle");
  const timeCustomMinutes = document.getElementById("time-custom-minutes") as HTMLInputElement;
  const timeCustomBonus = document.getElementById("time-custom-bonus") as HTMLInputElement;
  const timeCustomMinutesOut = document.getElementById("time-custom-minutes-out");
  const timeCustomBonusOut = document.getElementById("time-custom-bonus-out");
  const CUSTOM_ZERO_MINUTE_SECONDS = 15;

  function customTimeSeconds() {
    const m = parseInt(timeCustomMinutes.value, 10) || 0;
    return m > 0 ? m * 60 : CUSTOM_ZERO_MINUTE_SECONDS;
  }
  function customCategory(time: number, inc: number) {
    const est = time + 40 * inc;
    return est < 180 ? "bullet" : est < 480 ? "blitz" : "rapid";
  }
  function refreshCustomOutputs() {
    const m = parseInt(timeCustomMinutes.value, 10) || 0;
    const b = parseInt(timeCustomBonus.value, 10) || 0;
    timeCustomMinutesOut.textContent = m > 0 ? m + " menit" : "0 menit (" + CUSTOM_ZERO_MINUTE_SECONDS + " dtk)";
    timeCustomBonusOut.textContent = b + " detik";
  }
  timeCustomMinutes.addEventListener("input", refreshCustomOutputs);
  timeCustomBonus.addEventListener("input", refreshCustomOutputs);
  refreshCustomOutputs();

  timeCustomToggle.addEventListener("click", () => {
    const open = !timeCustom.classList.contains("open");
    timeCustom.classList.toggle("open", open);
    timeCustomToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.getElementById("time-custom-apply").addEventListener("click", () => {
    const time = customTimeSeconds();
    const inc = parseInt(timeCustomBonus.value, 10) || 0;
    const category = customCategory(time, inc);
    document.querySelectorAll(".time-option").forEach(o => o.classList.remove("selected"));
    timeCustomToggle.classList.add("selected");
    state.timeControl = { time, inc, category, custom: true };
    setTimeTriggerIcon(category);
    const mins = Math.floor(time / 60);
    timeDropdownLabel.textContent = (mins > 0 ? String(mins) : "0:" + String(time).padStart(2, "0")) + "+" + inc;
    closeTimeDropdown();
    updateFindMatchButton();
  });

  function updateFindMatchButton() {
    const btn = document.getElementById("find-match-btn");
    if (state.timeControl) {
      (btn as HTMLInputElement).disabled = false;
      btn.textContent = "Cari Lawan";
    } else {
      (btn as HTMLInputElement).disabled = true;
      btn.textContent = "Pilih kontrol waktu dulu";
    }
  }

  document.getElementById("find-match-btn").addEventListener("click", () => {
    startMatchmaking();
  });

  function startMatchmaking() {
    showPage("matchmaking-page");
    state.matchmakingCancelled = false;

    const searchDurationMs = 1200 + Math.floor(Math.random() * 1600);
    setTimeout(async () => {
      if (state.matchmakingCancelled) return;
      try {
        const { match, timeControl } = await api.findMatch(
          state.timeControl.category,
          state.timeControl.custom ? { time: state.timeControl.time, inc: state.timeControl.inc } : null
        );
        if (state.matchmakingCancelled) {
          api.abortMatch(match.id).catch(() => {});
          return;
        }
        await startGame(match, timeControl);
      } catch (err) {
        alert(err.message || "Gagal mencari lawan. Coba lagi.");
        enterDashboard();
      }
    }, searchDurationMs);
  }

  document.getElementById("cancel-matchmaking-btn").addEventListener("click", () => {
    state.matchmakingCancelled = true;
    enterDashboard();
  });

  async function startGame(match: any, timeControl: any, resumeData?: any) {
    state.matchId = match.id;
    state.timeControl = timeControl;
    state.bot = match.bot;
    state.playerColor = match.playerColor;
    state.game = ChessGame.fromFEN(match.fen);

    state.selectedSquare = null;
    state.legalMovesForSelected = [];
    state.premove = null;
    state.premoveTargets = [];
    state.drawOffersUsed = 0;
    state.moveSnapshots = [];
    const resumeHasSyncedHistory = resumeData
      && resumeData.plySnapshots && resumeData.plySnapshots.length
      && resumeData.sanHistory
      && resumeData.plySnapshots.length === resumeData.sanHistory.length + 1;
    state.plySnapshots = resumeHasSyncedHistory
      ? resumeData.plySnapshots.slice()
      : [state.game.toFEN()];
    state.sanHistory = resumeHasSyncedHistory ? resumeData.sanHistory.slice() : [];
    state.lastMoveSquaresPerPly = (resumeHasSyncedHistory && resumeData.lastMoveSquaresPerPly
      && resumeData.lastMoveSquaresPerPly.length === resumeData.sanHistory.length)
      ? resumeData.lastMoveSquaresPerPly.map((sq: any) => ({ from: fromAlgebraic(sq.from), to: fromAlgebraic(sq.to) }))
      : [];
    state.moveCount = state.sanHistory.length;
    state.lastMoveSquares = state.lastMoveSquaresPerPly.length
      ? state.lastMoveSquaresPerPly[state.lastMoveSquaresPerPly.length - 1]
      : null;
    state.viewPly = -1;
    state.gameStartTime = match.createdAt || Date.now();
    state.gameSaved = false;
    state.pendingServerCall = false;
    state.deferredPlayerSubmit = null;
    closeOptionsMenu();
    closeGameOverPopup();
    updateMoveNavButtons();

    const playerChangeEl0 = document.getElementById("game-player-elo-change");
    const opponentChangeEl0 = document.getElementById("game-opponent-elo-change");
    playerChangeEl0.textContent = "";
    playerChangeEl0.classList.add("hidden");
    opponentChangeEl0.textContent = "";
    opponentChangeEl0.classList.add("hidden");

    const user = state.currentUser;
    if (!user) {
      const router = window.NusantaraChess.router;
      if (router && typeof router.navigate === "function") router.navigate("/");
      else location.href = "/";
      return;
    }
    const eloField = eloFieldFor(state.timeControl.category);
    const playerElo = user[eloField];

    state.playerMs = match.playerMs;
    state.botMs = match.botMs;
    state.gameSession++;
    state.gameActive = true;

    document.getElementById("game-player-name").textContent = user.username;
    const playerFlagEl = document.getElementById("game-player-flag");
    if (playerFlagEl) {
      const NCf = window.NusantaraChess || {};
      const f = NCf.flagEmojiForCountry ? NCf.flagEmojiForCountry(user.country) : "";
      playerFlagEl.textContent = f ? f + " " : "";
    }
    const playerEloEl = document.getElementById("game-player-elo");
    const isGuestPlayer = !!user.isGuest;
    playerEloEl.textContent = isGuestPlayer ? "" : playerElo;
    if (playerEloEl.parentElement) playerEloEl.parentElement.classList.toggle("hidden", isGuestPlayer);
    document.getElementById("game-opponent-name").textContent = state.bot.name;
    document.getElementById("game-opponent-elo").textContent = state.bot.elo;
    applyProfilePhotoToUI(user.profilePhoto);
    document.getElementById("game-opponent-flag").textContent = state.bot.flag;
    const opponentAvatarImg = document.getElementById("game-opponent-avatar-img");
    const opponentAvatarDefault = document.getElementById("game-opponent-avatar-default");
    opponentAvatarDefault.innerHTML = NC.DEFAULT_AVATAR_SVG || "";
    if (state.bot.avatarImage) {
      (opponentAvatarImg as HTMLImageElement).src = state.bot.avatarImage;
      opponentAvatarImg.classList.remove("hidden");
      opponentAvatarDefault.classList.add("hidden");
    } else {
      opponentAvatarImg.removeAttribute("src");
      opponentAvatarImg.classList.add("hidden");
      opponentAvatarDefault.classList.remove("hidden");
    }
    const opponentTitleEl = document.getElementById("game-opponent-title");
    if (state.bot.title) {
      opponentTitleEl.textContent = state.bot.title;
      opponentTitleEl.dataset.title = String(state.bot.title).toUpperCase();
      opponentTitleEl.classList.remove("hidden");
    } else {
      opponentTitleEl.textContent = "";
      delete opponentTitleEl.dataset.title;
      opponentTitleEl.classList.add("hidden");
    }
    document.getElementById("move-history").innerHTML = "";
    renderMoveHistoryFromSanList(state.sanHistory);

    showPage("game-page");
    renderBoard();
    updateClocks();
    const sessionAtStart = state.gameSession;
    startClock();

    if (!state.engine) {
      state.engine = new StockfishEngine();
      try {
        await state.engine.init();
      } catch (e2) {
        alert("Gagal memuat Stockfish lokal (sudah dicoba Stockfish 18, lalu versi yang lebih lama). Pastikan minimal satu berkas mesin (mis. stockfish-18-lite-single.js dan .wasm pasangannya) ada di folder public/vendor/stockfish/ (lalu jalankan build ulang).\n\nDetail: " + (e2 && (e2 as any).message ? (e2 as any).message : String(e2)));
        state.engine = null;
        state.engineReady = false;
        stopClock();
        return;
      }
      state.engineReady = true;
    }
    state.engine.newGame();
    state.engine.setElo(state.bot.elo);
    if (!state.gameActive || sessionAtStart !== state.gameSession) return;

    if (state.game.turn !== state.playerColor) {
      setTimeout(() => requestBotMove(), 300);
    }
  }

  function eloFieldFor(category: any) {
    if (category === "bullet") return "eloBullet";
    if (category === "blitz") return "eloBlitz";
    return "eloRapid";
  }
  function gameCountFieldFor(category: any) {
    if (category === "bullet") return "gameCountBullet";
    if (category === "blitz") return "gameCountBlitz";
    return "gameCountRapid";
  }

  