/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
function createMoveCell(cls: string, text: string) {
    const span = document.createElement("span");
    span.className = cls;
    span.textContent = text;
    return span;
  }

  function createMoveRow(moveNumber: any, whiteSan: string) {
    const li = document.createElement("li");
    if (moveNumber != null) li.dataset.moveNumber = moveNumber as any;
    li.appendChild(createMoveCell("mv-num", moveNumber != null ? moveNumber + "." : ""));
    li.appendChild(createMoveCell("mv-w", whiteSan));
    return li;
  }

  function appendBlackMove(list: any, san: string) {
    const lastLi = list.lastElementChild;
    if (lastLi) {
      lastLi.appendChild(createMoveCell("mv-b", san));
    } else {
      const li = createMoveRow(null, "\u2026");
      li.appendChild(createMoveCell("mv-b", san));
      list.appendChild(li);
    }
  }

  function scrollMoveHistoryToEnd(list: any) {
    list.scrollTop = list.scrollHeight;
    list.parentElement.scrollTop = list.parentElement.scrollHeight;
  }

  function renderMoveHistoryFromSanList(sanList: any) {
    const list = document.getElementById("move-history");
    for (let i = 0; i < sanList.length; i++) {
      if (i % 2 === 0) {
        list.appendChild(createMoveRow(Math.floor(i / 2) + 1, sanList[i]));
      } else {
        appendBlackMove(list, sanList[i]);
      }
    }
    scrollMoveHistoryToEnd(list);
  }

  function addMoveToHistory(move: any, san: any) {
    const label = san;

    const list = document.getElementById("move-history");
    const isWhiteMove = state.game.turn === "b";

    if (isWhiteMove) {
      list.appendChild(createMoveRow(state.game.fullmoveNumber, label));
    } else {
      appendBlackMove(list, label);
    }

    scrollMoveHistoryToEnd(list);

    state.plySnapshots.push(state.game.toFEN());
    state.sanHistory = state.sanHistory || [];
    state.sanHistory.push(san);
    state.lastMoveSquaresPerPly = state.lastMoveSquaresPerPly || [];
    state.lastMoveSquaresPerPly.push({ from: move.from, to: move.to });
    updateMoveNavButtons();
  }

  function startClock() {
    stopClock();
    state.lastMoveTime = Date.now();
    const clockAnchor = document.getElementById("player-clock");
    state.clockInterval = setInterval(() => {
      if (clockAnchor && !clockAnchor.isConnected) { stopClock(); return; }
      const now = Date.now();
      const elapsed = now - state.lastMoveTime;
      state.lastMoveTime = now;
      if (!state.gameActive || state.pendingServerCall) return;

      if (state.game.turn === state.playerColor) {
        state.playerMs -= elapsed;
        if (state.playerMs <= 0) {
          state.playerMs = 0;
          updateClocks();
          claimTimeoutFromServer();
          return;
        }
      } else {
        state.botMs -= elapsed;
        if (state.botMs <= 0) {
          state.botMs = 0;
          updateClocks();
          claimTimeoutFromServer();
          return;
        }
      }
      updateClocks();
    }, 250);
  }

  async function claimTimeoutFromServer() {
    if (state.pendingServerCall) return;
    state.pendingServerCall = true;
    stopClock();
    const session = state.gameSession;
    try {
      const res = await api.claimTimeout(state.matchId);
      if (session !== state.gameSession) return;
      if (res.gameOver) {
        applyServerOutcome(res);
      } else {
        resyncFromServerMatch(res.match);
        startClock();
      }
    } catch (err) {
      if (session !== state.gameSession) return;
      console.error("Gagal klaim timeout ke server:", err.message || err);
      if (err.payload && err.payload.match) resyncFromServerMatch(err.payload.match);
      if (state.gameActive) startClock();
    } finally {
      state.pendingServerCall = false;
    }
  }

  function stopClock() {
    if (state.clockInterval) clearInterval(state.clockInterval);
    state.clockInterval = null;
  }

  function applyIncrement(who: any) {
    const incMs = (state.timeControl.inc || 0) * 1000;
    if (incMs === 0) return;
    if (who === "player") state.playerMs += incMs;
    else state.botMs += incMs;
  }

  function formatMs(ms: any) {
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  function updateClocks() {
    const playerClockEl = document.getElementById("player-clock");
    const opponentClockEl = document.getElementById("opponent-clock");
    playerClockEl.textContent = formatMs(state.playerMs);
    opponentClockEl.textContent = formatMs(state.botMs);
    playerClockEl.classList.toggle("low-time", state.playerMs <= 20000);
    opponentClockEl.classList.toggle("low-time", state.botMs <= 20000);
    const running = !!(state.gameActive && state.game);
    const playerTurn = running && state.game.turn === state.playerColor;
    playerClockEl.classList.toggle("is-running", playerTurn);
    opponentClockEl.classList.toggle("is-running", running && !playerTurn);
  }

  function openOptionsMenu() {
    updateOptionsMenuVisibility();
    document.getElementById("options-menu-overlay").classList.remove("hidden");
  }
  function closeOptionsMenu() {
    document.getElementById("options-menu-overlay").classList.add("hidden");
  }
  document.getElementById("options-btn").addEventListener("click", openOptionsMenu);
  document.getElementById("option-close-btn").addEventListener("click", closeOptionsMenu);
  document.getElementById("options-menu-overlay").addEventListener("click", (e) => {
    if ((e.target as HTMLElement).id === "options-menu-overlay") closeOptionsMenu();
  });

  function updateOptionsMenuVisibility() {
    const cancelBtn = document.getElementById("option-cancel-btn");
    const drawBtn = document.getElementById("option-draw-btn");
    const copyPgnBtn = document.getElementById("option-copy-pgn-btn");

    cancelBtn.classList.toggle("hidden", !(state.gameActive && state.moveCount === 0));
    drawBtn.classList.toggle("hidden", !(state.gameActive && state.drawOffersUsed < 1));
    copyPgnBtn.classList.toggle("hidden", state.gameActive);
    document.getElementById("option-share-pgn-btn").classList.toggle("hidden", state.gameActive);
  }

  document.getElementById("nav-back-btn").addEventListener("click", stepBack);
  document.getElementById("nav-forward-btn").addEventListener("click", stepForward);

  document.getElementById("option-copy-pgn-btn").addEventListener("click", async () => {
    if (state.gameActive || !state.game) return;
    const pgn = buildPGN();
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
    closeOptionsMenu();
  });

  document.getElementById("option-share-pgn-btn").addEventListener("click", async () => {
    if (state.gameActive || !state.game) return;
    const pgn = buildPGN();
    closeOptionsMenu();
    if (navigator.share) {
      try {
        await navigator.share({ title: "PGN NusantaraChess", text: pgn });
      } catch (e) {
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(pgn);
      alert("Perangkat ini tidak mendukung fitur bagikan. PGN disalin ke clipboard.");
    } catch (e) {
      alert("Gagal membagikan PGN otomatis. Salin manual dari sini:\n\n" + pgn);
    }
  });

  function buildPGN() {
    const user = state.currentUser;
    const whiteName = state.playerColor === "w" ? (user ? user.username : "Pemain") : state.bot.name;
    const blackName = state.playerColor === "b" ? (user ? user.username : "Pemain") : state.bot.name;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, ".");

    let resultTag = "*";
    if (state.lastGameResult === "win") resultTag = state.playerColor === "w" ? "1-0" : "0-1";
    else if (state.lastGameResult === "loss") resultTag = state.playerColor === "w" ? "0-1" : "1-0";
    else if (state.lastGameResult === "draw") resultTag = "1/2-1/2";

    let pgn = "";
    pgn += '[Event "NusantaraChess"]\n';
    pgn += '[Site "NusantaraChess"]\n';
    pgn += '[Date "' + dateStr + '"]\n';
    pgn += '[White "' + whiteName + '"]\n';
    pgn += '[Black "' + blackName + '"]\n';
    pgn += '[Result "' + resultTag + '"]\n';
    pgn += "\n";

    const sans = state.sanHistory || [];
    let moveText = "";
    for (let i = 0; i < sans.length; i++) {
      if (i % 2 === 0) {
        moveText += (Math.floor(i / 2) + 1) + ". " + sans[i] + " ";
      } else {
        moveText += sans[i] + " ";
      }
    }
    pgn += moveText.trim() + " " + resultTag;
    return pgn;
  }

  