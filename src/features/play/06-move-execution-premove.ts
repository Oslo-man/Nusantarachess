/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
function updateSelectionHighlight() {
    const boardEl = document.getElementById("chessboard");
    if (!boardEl) return;
    const squares = boardEl.querySelectorAll(".square");
    squares.forEach(sq => {
      sq.classList.remove("selected", "legal-move", "legal-capture", "premove-square");
      const idx = parseInt((sq as HTMLElement).dataset.idx, 10);
      if (state.selectedSquare === idx) sq.classList.add("selected");
      const moveHere = state.legalMovesForSelected.find(m => m.to === idx);
      if (moveHere) sq.classList.add(moveHere.capture ? "legal-capture" : "legal-move");

      if (state.premove && (state.premove.from === idx || state.premove.to === idx)) {
        sq.classList.add(state.premove.to === null ? "selected" : "premove-square");
      }
    });
  }

  function selectSquare(idx: any) {
    const piece = state.game.pieceAt(idx);
    if (!piece || piece.color !== state.playerColor) return;
    clearPremove();
    state.selectedSquare = idx;
    const allMoves = state.game.legalMovesFor(idx);
    state.legalMovesForSelected = allMoves.filter((m: any) => !m.promotion || m.promotion === "q");
    updateSelectionHighlight();
  }

  function clearSelection() {
    state.selectedSquare = null;
    state.legalMovesForSelected = [];
    updateSelectionHighlight();
  }

  function selectSquareForPremove(idx: any) {
    const piece = state.game.pieceAt(idx);
    if (!piece || piece.color !== state.playerColor) return;
    state.premove = { from: idx, to: null, piece: piece.type };
    state.premoveTargets = computePremoveTargets(idx);
    updateSelectionHighlight();
  }

  function computePremoveTargets(idx: any) {
    const game = state.game;
    const piece = game.pieceAt(idx);
    const seen = new Set();
    const targets: any[] = [];
    const add = (to: any) => { if (!seen.has(to)) { seen.add(to); targets.push(to); } };
    game.pseudoMovesFor(idx).forEach((m: any) => add(m.to));

    const enemy = piece.color === "w" ? "b" : "w";
    const ghost = game.clone();
    for (let i = 0; i < 64; i++) {
      const p = ghost.board[i];
      if (i !== idx && p && p.color === piece.color) ghost.board[i] = { type: p.type, color: enemy };
    }
    ghost.pseudoMovesFor(idx).forEach((m: any) => {
      const occ = game.pieceAt(m.to);
      if (occ && occ.color === piece.color && occ.type !== "k") add(m.to);
    });
    return targets;
  }

  function clearPremove() {
    state.premove = null;
    state.premoveTargets = [];
  }

  function onSquareClick(idx: any) {
    if (!state.gameActive) return;
    if (state.viewPly !== -1) return;

    if (state.game.turn !== state.playerColor) {
      onSquareClickForPremove(idx);
      return;
    }
    if (state.pendingServerCall) return;

    const piece = state.game.pieceAt(idx);

    const chosenMove = state.legalMovesForSelected.find(m => m.to === idx);
    if (chosenMove) {
      executePlayerMove(chosenMove);
      return;
    }

    if (piece && piece.color === state.playerColor) {
      selectSquare(idx);
    } else {
      clearSelection();
    }
  }

  function onSquareClickForPremove(idx: any) {
    const piece = state.game.pieceAt(idx);
    const isOwn = piece && piece.color === state.playerColor;

    if (state.premove && state.premove.from === idx && state.premove.to === null) {
      clearPremove();
      updateSelectionHighlight();
      return;
    }

    if (state.premove && state.premove.to === null) {
      if (state.premoveTargets.includes(idx)) {
        state.premove = { from: state.premove.from, to: idx, piece: state.premove.piece };
        state.premoveTargets = [];
        updateSelectionHighlight();
        return;
      }
      clearPremove();
      if (isOwn) selectSquareForPremove(idx);
      else updateSelectionHighlight();
      return;
    }

    if (state.premove && state.premove.to !== null) {
      clearPremove();
      if (isOwn) selectSquareForPremove(idx);
      updateSelectionHighlight();
      return;
    }

    if (isOwn) selectSquareForPremove(idx);
  }

  function executePlayerMove(move: any, allowWhilePending?: boolean) {
    if (state.pendingServerCall && !allowWhilePending) return;
    const fromAlg = algebraic(move.from);
    const toAlg = algebraic(move.to);
    const promo = move.promotion || null;

    const wasCapture = !!(state.game.pieceAt(move.to) || move.enPassant);
    const san = state.game.moveToSANFull(move, (() => { const c = state.game.clone(); c.applyMove(move); return c; })());
    state.game.applyMove(move);
    const causesCheck = state.game.inCheck(state.game.turn);
    playSound(pickMoveSound(move, wasCapture, causesCheck));

    state.lastMoveSquares = { from: move.from, to: move.to };
    state.selectedSquare = null;
    state.legalMovesForSelected = [];
    state.moveCount++;
    addMoveToHistory(move, san);
    applyIncrement("player");
    renderBoard();

    if (state.pendingServerCall) {
      state.deferredPlayerSubmit = { fromAlg, toAlg, promo, session: state.gameSession };
      return;
    }
    submitMoveToServer(fromAlg, toAlg, promo, "player");
  }

  async function submitMoveToServer(fromAlg: any, toAlg: any, promo: any, mover: any) {
    state.pendingServerCall = true;
    const session = state.gameSession;
    try {
      const res = await api.submitMove(state.matchId, fromAlg, toAlg, promo);
      if (session !== state.gameSession) return;

      if (res.gameOver) {
        state.deferredPlayerSubmit = null;
        applyServerOutcome(res);
        return;
      }
      state.playerMs = res.match.playerMs;
      state.botMs = res.match.botMs;
      updateClocks();

      if (mover === "player") {
        setTimeout(() => requestBotMove(), 300);
      } else {
        tryFirePremove();
      }
    } catch (err) {
      state.deferredPlayerSubmit = null;
      if (session !== state.gameSession) return;
      if (err.status === 422 && err.payload && err.payload.match) {
        resyncFromServerMatch(err.payload.match);
        alert("Langkah tidak sinkron dengan server, papan disegarkan ke posisi resmi.");
      } else if (err.status === 409 && err.payload && err.payload.match) {
        resyncFromServerMatch(err.payload.match);
      } else {
        alert(err.message || "Gagal mengirim langkah ke server.");
      }
    } finally {
      state.pendingServerCall = false;
      const deferred = state.deferredPlayerSubmit;
      if (deferred) {
        state.deferredPlayerSubmit = null;
        if (state.gameActive && deferred.session === state.gameSession) {
          submitMoveToServer(deferred.fromAlg, deferred.toAlg, deferred.promo, "player");
        }
      }
    }
  }

  function resyncFromServerMatch(match: any) {
    state.game = ChessGame.fromFEN(match.fen);
    state.playerMs = match.playerMs;
    state.botMs = match.botMs;
    state.selectedSquare = null;
    state.legalMovesForSelected = [];
    clearPremove();
    renderBoard();
    updateClocks();
  }

  function applyServerOutcome(res: any) {
    state.game = ChessGame.fromFEN(res.match.fen);
    renderBoard();
    endGame(res.outcome, res.match);
  }

  async function requestBotMove() {
    if (!state.engineReady || !state.gameActive) return;
    const session = state.gameSession;
    const fen = state.game.toFEN();
    const category = state.timeControl.category;

    let thinkTime;
    if (category === "bullet") {
      thinkTime = Math.min(1200, Math.max(300, state.botMs * 0.03));
    } else if (category === "blitz") {
      thinkTime = Math.min(2500, Math.max(500, state.botMs * 0.05));
    } else {
      thinkTime = Math.min(4000, Math.max(800, state.botMs * 0.06));
    }
    const uciMove = await state.engine.getBestMove(fen, thinkTime);
    if (!state.gameActive || session !== state.gameSession) return;

    if (!uciMove || uciMove === "(none)") {
      try {
        const stateRes = await api.getMatchState(state.matchId);
        if (stateRes.match.status !== "active") {
          applyServerOutcome({ match: stateRes.match, outcome: null });
        }
      } catch (e) { }
      return;
    }
    const from = fromAlgebraic(uciMove.slice(0, 2));
    const to = fromAlgebraic(uciMove.slice(2, 4));
    const promo = uciMove.length > 4 ? uciMove[4] : null;

    const legalMoves = state.game.legalMovesFor(from);
    let move = legalMoves.find((m: any) => m.to === to && (!promo || m.promotion === promo));
    if (!move) move = legalMoves.find((m: any) => m.to === to);

    if (!move) {
      console.error("Bot mengirim langkah tidak valid:", uciMove);
      return;
    }

    const wasCapture = !!(state.game.pieceAt(move.to) || move.enPassant);
    const san = state.game.moveToSANFull(move, (() => { const c = state.game.clone(); c.applyMove(move); return c; })());
    state.game.applyMove(move);
    const causesCheck = state.game.inCheck(state.game.turn);
    playSound(pickMoveSound(move, wasCapture, causesCheck));

    state.lastMoveSquares = { from: move.from, to: move.to };
    state.moveCount++;
    addMoveToHistory(move, san);
    applyIncrement("bot");
    renderBoard();

    submitMoveToServer(algebraic(move.from), algebraic(move.to), move.promotion || null, "bot");
    tryFirePremove();
  }

  function tryFirePremove() {
    if (!state.premove || state.premove.to === null) { clearPremove(); return; }
    const { from, to, piece: plannedPiece } = state.premove;
    clearPremove();

    if (state.game.turn !== state.playerColor) return;
    const cur = state.game.pieceAt(from);
    if (!cur || cur.color !== state.playerColor || (plannedPiece && cur.type !== plannedPiece)) { updateSelectionHighlight(); return; }
    const legalMoves = state.game.legalMovesFor(from);
    const move = legalMoves.find((m: any) => m.to === to);
    if (!move) { updateSelectionHighlight(); return; }

    executePlayerMove(move, true);
  }

  