/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
function animatePiece(fromSq: any, toSq: any) {
    const toCell = boardEl.querySelector(`[data-sq="${toSq}"]`);
    const fromCell = boardEl.querySelector(`[data-sq="${fromSq}"]`);
    const pieceEl = toCell && toCell.querySelector(".piece");
    if (!pieceEl || !fromCell) return;
    const a = fromCell.getBoundingClientRect(), b = toCell.getBoundingClientRect();
    const c = pieceEl.cloneNode(true);
    (c as HTMLElement).className = pieceEl.className + " anim-piece";
    (c as HTMLElement).style.left = a.left + "px"; (c as HTMLElement).style.top = a.top + "px";
    (c as HTMLElement).style.width = a.width + "px"; (c as HTMLElement).style.height = a.height + "px";
    (c as HTMLElement).style.fontSize = (a.width * 0.82) + "px";
    document.body.appendChild(c);
    (pieceEl as HTMLElement).style.visibility = "hidden";
    requestAnimationFrame(() => { (c as HTMLElement).style.transform = `translate(${b.left - a.left}px,${b.top - a.top}px)`; });
    setTimeout(() => { (c as HTMLElement).remove(); (pieceEl as HTMLElement).style.visibility = ""; }, 200);
  }
  function animateMoveObj(mv: any, reverse: any) {
    if (!mv) return;
    animatePiece(reverse ? mv.to : mv.from, reverse ? mv.from : mv.to);
    if (mv.flags && (mv.flags.includes("k") || mv.flags.includes("q"))) {
      const rank = mv.color === "w" ? "1" : "8";
      const rf = (mv.flags.includes("k") ? "h" : "a") + rank;
      const rt = (mv.flags.includes("k") ? "f" : "d") + rank;
      animatePiece(reverse ? rt : rf, reverse ? rf : rt);
    }
  }
  let drag: any = null;
  function tryMove(from: any, to: any, noAnim?: any) {
    const mv = game.moves({ square: from, verbose: true }).find((m: any) => m.to === to);
    if (!mv) return false;
    if (mv.flags.includes("p")) { showPromotion(from, to, !!noAnim); return true; }
    return performMove(from, to, undefined, noAnim);
  }
  function hidePromotion() {
    const el = document.getElementById("promoPicker");
    if (el) { el.hidden = true; el.innerHTML = ""; el.onclick = null; }
  }
  function showPromotion(from: any, to: any, noAnim: boolean) {
    const el = document.getElementById("promoPicker");
    if (!el) { performMove(from, to, "q", noAnim); return; }
    const color = game.turn();
    let col = FILES.indexOf(to[0]); if (flipped) col = 7 - col;
    let row = 8 - (+to[1]); if (flipped) row = 7 - row;
    const top = row === 0;
    el.style.left = (col * 12.5) + "%";
    el.style.top = top ? "0" : "auto"; el.style.bottom = top ? "auto" : "0";
    el.style.flexDirection = top ? "column" : "column-reverse";
    const names: Record<string, string> = { q: "Menteri", r: "Benteng", b: "Gajah", n: "Kuda" };
    el.innerHTML = ["q", "r", "b", "n"].map(t =>
      `<button type="button" data-p="${t}" aria-label="Promosi ke ${names[t]}" title="${names[t]}">${PIECE_SVG[color + t.toUpperCase()]}</button>`
    ).join("") + `<button type="button" class="bc-promo-x" data-p="" aria-label="Batal"><span class="ui-ico ui-ico-close" aria-hidden="true"></span></button>`;
    el.hidden = false;
    el.onclick = (e: any) => {
      const b = e.target && e.target.closest ? e.target.closest("button") : null;
      if (!b) return;
      const piece = b.dataset.p;
      hidePromotion();
      if (piece) performMove(from, to, piece, noAnim); else { selected = null; render(); }
    };
  }
  function performMove(from: any, to: any, promo: any, noAnim?: any) {
    const mv = game.moves({ square: from, verbose: true }).find((m: any) => m.to === to);
    if (!mv) return false;
    const fenBefore = game.fen();
    const beforeNode = cur;
    const made = game.move({ from, to, promotion: promo || "q" });
    sfxFor(made);
    selected = null;
    clearJudge();
    if (autoPlaying) stopAutoPlay();
    recordUserMove(made);
    const moveNode = cur;
    loadedMode = false;

    const moverColor = made.color;
    const moveInfo = { from: made.from, to: made.to, promotion: made.promotion || null, capturedType: made.captured || null };
    const pathSans = pathTo(moveNode).slice(1).map((n: any) => n.san);
    const isBook = isBookLine(pathSans);
    const prevScores = buildPrevScores(beforeNode);
    const jseq = judgeSeq;
    if (made.san.includes("#")) {
      moveNode.sc = ["mate"]; moveNode.scDepth = 999; moveNode.best = null;
      classifyMoveViaServer({
        fenBefore, fenAfter: game.fen(), move: moveInfo, moverColor, isBest: true, isBook: false,
        staticEval: ["mate"], previousStaticEvals: prevScores || [["cp", "0"]],
        previousSacrifice: !!beforeNode.sac
      }, moveNode).then((cat: any) => { if (jseq === judgeSeq) showJudge(made.san, made.to, cat); }).catch(() => { if (jseq === judgeSeq) showJudge(made.san, made.to, "best"); });
    } else if (isBook) {
      classifyMoveViaServer({
        fenBefore, fenAfter: game.fen(), move: moveInfo, moverColor, isBest: false, isBook: true,
        staticEval: ["cp", "0"], previousStaticEvals: prevScores || [["cp", "0"]],
        previousSacrifice: !!beforeNode.sac
      }, moveNode).then((cat: any) => { if (jseq === judgeSeq) showJudge(made.san, made.to, cat); }).catch(() => { if (jseq === judgeSeq) showJudge(made.san, made.to, "book"); });
    } else if (prevScores && beforeNode.best && (beforeNode.scDepth || 0) >= JUDGE_MIN_DEPTH && !game.game_over()) {
      pendingJudge = {
        fenBefore, fenAfter: game.fen(), moverColor, move: moveInfo, san: made.san, to: made.to,
        node: moveNode, previousSacrifice: !!beforeNode.sac,
        previousStaticEvals: prevScores,
        beforeSecond: beforeNode.sc2 || null,
        previousCaptureSquare: (beforeNode.san && beforeNode.san.indexOf("x") >= 0) ? beforeNode.to : null,
        playedUci: (made.from + made.to + (made.promotion || "")).toLowerCase(), best: beforeNode.best
      };
    }
    afterMove();
    if (!noAnim) animateMoveObj(made, false);
    return true;
  }

  function buildPrevScores(beforeNode: any) {
    const path = pathTo(beforeNode);
    const out: any[] = [];
    for (let k = 0; k < 4; k++) {
      const nd = path[path.length - 1 - k];
      if (!nd) break;
      const s = nd.sc;
      if (!s) break;
      out.push(s);
    }
    return out.length ? out : null;
  }
  function classifyMoveViaServer(payload: any, node?: any) {
    return api.classifyMoveDetail(payload).then((r: any) => {
      if (node) node.sac = !!r.sacrifice;
      return r.cat;
    });
  }

  function squareFromPoint(x: any, y: any) {
    const r = boardEl.getBoundingClientRect();
    let f = Math.floor((x - r.left) / r.width * 8), rk = Math.floor((y - r.top) / r.height * 8);
    if (f < 0 || f > 7 || rk < 0 || rk > 7) return null;
    if (flipped) { f = 7 - f; rk = 7 - rk; }
    return FILES[f] + (8 - rk);
  }
  function onSquarePointerDown(e: any, sq: any) {
    if (e.button !== undefined && e.button !== 0) return;
    hidePromotion();
    if (loadedMode) loadedMode = false;
    if (selected && selected !== sq && tryMove(selected, sq)) return;
    const piece = game.get(sq);
    if (piece && piece.color === game.turn()) {
      selected = sq; render();
      drag = { from: sq, startX: e.clientX, startY: e.clientY, clone: null, srcPiece: null, cell: 0, moved: false };
      document.addEventListener("pointermove", onDragMove);
      document.addEventListener("pointerup", onDragUp);
      e.preventDefault();
    } else if (selected) { selected = null; render(); }
  }
  function onDragMove(e: any) {
    if (!drag) return;
    if (!drag.moved) {
      if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) < 5) return;
      drag.moved = true;
      const srcSq = boardEl.querySelector(`[data-sq="${drag.from}"]`);
      const pieceEl = srcSq && srcSq.querySelector(".piece");
      if (pieceEl) {
        const cell = boardEl.getBoundingClientRect().width / 8;
        const c = pieceEl.cloneNode(true);
        (c as HTMLElement).classList.add("drag-clone");
        (c as HTMLElement).style.fontSize = (cell * 0.82) + "px";
        (c as HTMLElement).style.width = (c as HTMLElement).style.height = cell + "px";
        document.body.appendChild(c);
        drag.clone = c; drag.cell = cell;
        drag.srcPiece = pieceEl; (pieceEl as HTMLElement).style.opacity = "0.25";
      }
    }
    if (drag.clone) {
      drag.clone.style.left = (e.clientX - drag.cell / 2) + "px";
      drag.clone.style.top = (e.clientY - drag.cell / 2) + "px";
    }
  }
  function onDragUp(e: any) {
    document.removeEventListener("pointermove", onDragMove);
    document.removeEventListener("pointerup", onDragUp);
    const d = drag; drag = null;
    if (!d) return;
    if (d.clone) d.clone.remove();
    if (d.srcPiece) d.srcPiece.style.opacity = "";
    if (!d.moved) return;
    const target = squareFromPoint(e.clientX, e.clientY);
    if (!(target && target !== d.from && tryMove(d.from, target, true))) render();
  }

  function afterMove() {
    render();
    rebuildMoveList();
    highlightReview();
    triggerAnalysis();
  }

  