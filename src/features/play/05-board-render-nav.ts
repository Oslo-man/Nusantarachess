/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
function renderBoard() {
    const boardEl = document.getElementById("chessboard");
    boardEl.innerHTML = "";
    const flip = state.playerColor === "b";

    for (let displayRow = 0; displayRow < 8; displayRow++) {
      for (let displayCol = 0; displayCol < 8; displayCol++) {
        const rank = flip ? 7 - displayRow : displayRow;
        const file = flip ? 7 - displayCol : displayCol;
        const idx = sqIndex(file, rank);

        const sq = document.createElement("div");
        sq.className = "square " + (((rank + file) % 2 === 0) ? "light" : "dark");
        sq.dataset.idx = idx;

        if (state.lastMoveSquares && (idx === state.lastMoveSquares.from || idx === state.lastMoveSquares.to)) {
          sq.classList.add("last-move");
        }

        const piece = state.game.pieceAt(idx);
        if (piece) {
          const glyph = document.createElement("div");
          glyph.className = "piece";
          glyph.innerHTML = PIECE_SVG[piece.color + piece.type] || "";
          if (piece.type === "k" && state.game.inCheck(piece.color) && state.game.turn === piece.color) {
            sq.classList.add("in-check");
          }
          const isPlayersTurn = state.game.turn === state.playerColor;
          const canDrag = state.gameActive && piece.color === state.playerColor && state.viewPly === -1;
          glyph.draggable = canDrag;
          glyph.addEventListener("dragstart", (e) => {
            if (!canDrag) { e.preventDefault(); return; }
            if (isPlayersTurn) {
              selectSquare(idx);
            } else {
              selectSquareForPremove(idx);
            }
            if (e.dataTransfer) {
              e.dataTransfer.effectAllowed = "move";
              try { e.dataTransfer.setData("text/plain", String(idx)); } catch (err) { }
            }
          });
          glyph.addEventListener("touchstart", (e) => {
            if (!canDrag) return;
            e.preventDefault();
            if (isPlayersTurn) {
              selectSquare(idx);
            } else {
              selectSquareForPremove(idx);
            }
            startTouchDrag(glyph, idx, e.touches[0]);
          }, { passive: false });
          sq.appendChild(glyph);
        }

        sq.addEventListener("click", () => onSquareClick(idx));
        sq.addEventListener("dragover", (e) => {
          e.preventDefault();
          if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
        });
        sq.addEventListener("drop", (e) => {
          e.preventDefault();
          onSquareClick(idx);
        });
        boardEl.appendChild(sq);
      }
    }

    updateSelectionHighlight();
  }

  function boardArrayFromFEN(fen: any) {
    const boardPart = fen.split(" ")[0];
    const rows = boardPart.split("/");
    const board = new Array(64).fill(null);
    for (let r = 0; r < 8; r++) {
      let file = 0;
      for (const ch of rows[r]) {
        if (/[1-8]/.test(ch)) {
          file += parseInt(ch, 10);
        } else {
          const color = ch === ch.toUpperCase() ? "w" : "b";
          const type = ch.toLowerCase();
          board[sqIndex(file, r)] = { type, color };
          file++;
        }
      }
    }
    return board;
  }

  function renderBoardReadOnly(fen: any) {
    const boardEl = document.getElementById("chessboard");
    boardEl.innerHTML = "";
    const flip = state.playerColor === "b";
    const board = boardArrayFromFEN(fen);
    const lastMove = state.viewPly >= 1 ? state.lastMoveSquaresPerPly[state.viewPly - 1] : null;

    for (let displayRow = 0; displayRow < 8; displayRow++) {
      for (let displayCol = 0; displayCol < 8; displayCol++) {
        const rank = flip ? 7 - displayRow : displayRow;
        const file = flip ? 7 - displayCol : displayCol;
        const idx = sqIndex(file, rank);

        const sq = document.createElement("div");
        sq.className = "square " + (((rank + file) % 2 === 0) ? "light" : "dark");
        sq.dataset.idx = idx;

        if (lastMove && (idx === lastMove.from || idx === lastMove.to)) {
          sq.classList.add("last-move");
        }

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
  }

  function goToPly(ply: any) {
    const maxPly = state.plySnapshots.length - 1;
    if (ply < 0) ply = 0;
    state.premove = null;
    state.premoveTargets = [];
    if (ply >= maxPly) {
      state.viewPly = -1;
      renderBoard();
    } else {
      state.viewPly = ply;
      renderBoardReadOnly(state.plySnapshots[ply]);
    }
    updateMoveNavButtons();
    updateMoveHistoryActiveHighlight();
  }

  function stepBack() {
    if (!state.game) return;
    const maxPly = state.plySnapshots.length - 1;
    const current = state.viewPly === -1 ? maxPly : state.viewPly;
    goToPly(current - 1);
  }

  function stepForward() {
    if (!state.game) return;
    const maxPly = state.plySnapshots.length - 1;
    const current = state.viewPly === -1 ? maxPly : state.viewPly;
    goToPly(current + 1);
  }

  function jumpToStart() {
    goToPly(0);
  }

  function jumpToLive() {
    goToPly(state.plySnapshots ? state.plySnapshots.length - 1 : 0);
  }

  function updateMoveNavButtons() {
    const btnBack = document.getElementById("nav-back-btn");
    const btnForward = document.getElementById("nav-forward-btn");
    if (!btnBack || !btnForward) return;

    const maxPly = state.plySnapshots ? state.plySnapshots.length - 1 : 0;
    const current = state.viewPly === -1 ? maxPly : state.viewPly;

    (btnBack as HTMLInputElement).disabled = current <= 0;
    (btnForward as HTMLInputElement).disabled = current >= maxPly;
  }

  function updateMoveHistoryActiveHighlight() {
    const list = document.getElementById("move-history");
    if (!list) return;
    list.querySelectorAll("li").forEach(li => li.classList.remove("history-active"));
    if (state.viewPly < 1 || !state.game) return;
    const moveNumber = Math.ceil(state.viewPly / 2);
    const li = list.querySelector('li[data-move-number="' + moveNumber + '"]');
    if (li) li.classList.add("history-active");
  }

  function startTouchDrag(glyphEl: any, fromIdx: any, initialTouch: any) {
    const boardEl = document.getElementById("chessboard");
    if (!boardEl) return;

    const startRect = glyphEl.getBoundingClientRect();
    const startCenterX = startRect.left + startRect.width / 2;
    const startCenterY = startRect.top + startRect.height / 2;
    const offsetX = initialTouch.clientX - startCenterX;
    const offsetY = initialTouch.clientY - startCenterY;

    glyphEl.classList.add("dragging-touch");
    glyphEl.style.position = "fixed";
    glyphEl.style.zIndex = "1000";
    glyphEl.style.width = startRect.width + "px";
    glyphEl.style.height = startRect.height + "px";
    glyphEl.style.left = startRect.left + "px";
    glyphEl.style.top = startRect.top + "px";
    glyphEl.style.pointerEvents = "none";

    let lastHoverSq: any = null;

    function moveTo(clientX: any, clientY: any) {
      glyphEl.style.left = (clientX - offsetX - startRect.width / 2) + "px";
      glyphEl.style.top = (clientY - offsetY - startRect.height / 2) + "px";

      glyphEl.style.display = "none";
      const under = document.elementFromPoint(clientX, clientY);
      glyphEl.style.display = "";
      const hoverSq = under ? under.closest(".square") : null;

      if (lastHoverSq && lastHoverSq !== hoverSq) {
        lastHoverSq.classList.remove("touch-hover");
      }
      if (hoverSq) {
        hoverSq.classList.add("touch-hover");
      }
      lastHoverSq = hoverSq;
    }

    function onTouchMove(e: any) {
      if (e.touches.length === 0) return;
      e.preventDefault();
      moveTo(e.touches[0].clientX, e.touches[0].clientY);
    }

    function cleanupVisual() {
      if (lastHoverSq) lastHoverSq.classList.remove("touch-hover");
      glyphEl.classList.remove("dragging-touch");
      glyphEl.style.position = "";
      glyphEl.style.zIndex = "";
      glyphEl.style.width = "";
      glyphEl.style.height = "";
      glyphEl.style.left = "";
      glyphEl.style.top = "";
      glyphEl.style.pointerEvents = "";
      glyphEl.style.display = "";
    }

    function onTouchEnd(e: any) {
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchEnd);

      const touch = (e.changedTouches && e.changedTouches[0]) || null;
      cleanupVisual();

      if (!touch) return;
      glyphEl.style.display = "none";
      const under = document.elementFromPoint(touch.clientX, touch.clientY);
      glyphEl.style.display = "";
      const targetSq = under ? under.closest(".square") : null;

      if (targetSq && (targetSq as HTMLElement).dataset.idx !== undefined) {
        const targetIdx = parseInt((targetSq as HTMLElement).dataset.idx, 10);
        onSquareClick(targetIdx);
      }
    }

    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
    document.addEventListener("touchcancel", onTouchEnd);
  }

  