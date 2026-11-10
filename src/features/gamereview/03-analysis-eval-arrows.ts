/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
let lastEval: any = { cp: 0 };
  let analysisTimer: any = null, analysisSeq = 0;
  let arrowMuteNode: any = null;
  function syncMoverArrow() {
    if ((document.getElementById("showArrow") as HTMLInputElement).checked) return;
    const n = cur;
    if (!n || n === arrowMuteNode) return;
    arrowMuteNode = null;
    if (!n.parent) { if (lastArrows) clearArrow(); return; }
    const best = n.parent && n.parent.best;
    const played = n.parent ? ((n.from || "") + (n.to || "") + (n.promotion || "")).toLowerCase() : "";
    const isBest = !!best && best.slice(0, 4) === played.slice(0, 4) && (best.length < 5 || played.slice(4, 5) === best.slice(4, 5));
    if (!best || isBest) { if (lastArrows) clearArrow(); return; }
    if (lastArrows && lastArrows.length === 1 && lastArrows[0].uci === best) return;
    drawArrows([{ uci: best, o: 0.85, w: 0.18 }]);
  }
  function triggerAnalysis() {
    clearTimeout(analysisTimer);
    showCachedEval();
    syncMoverArrow();
    analysisTimer = setTimeout(runAnalysis, 60);
  }
  function showCachedEval() {
    if (!reviewEvals || !cur || !cur.main) return;
    const v = reviewEvals[cur.ply];
    if (v === undefined || v === null) return;
    lastEval = Math.abs(v) >= 90000 ? { mate: v > 0 ? 1 : -1, unknown: true } : { cp: v };
    paintEvalBar();
  }
  const arrowCountNow = () => { const v = +((document.getElementById("arrowCount") as HTMLSelectElement) || { value: "3" }).value; return v >= 1 && v <= 5 ? v : 3; };
  const JUDGE_MIN_DEPTH = 10;
  const JUDGE_MIN_GAP = 800;
  let judgeTimer: any = null, judgeSeq = 0;
  const rawScore = (p: any) => p.mate !== undefined ? ["mate", String(p.mate)] : ["cp", String(Math.round(p.cp || 0))];
  function runAnalysis() {
    if (!boardEl.isConnected) return;
    if (!ENGINE.isReady()) { return; }
    if (!(document.getElementById("autoAnalyze") as HTMLInputElement).checked) { analysisSeq++; ENGINE.stopAnalysis(); clearArrow(); syncMoverArrow(); return; }
    if (game.game_over()) { analysisSeq++; ENGINE.stopAnalysis(); clearArrow(); syncMoverArrow(); setBest("—", ""); return; }
    const fen = game.fen();
    const turn = game.turn();
    const nodeAtStart = cur;
    const wantArrows = (document.getElementById("showArrow") as HTMLInputElement).checked;
    const nArrows = wantArrows ? arrowCountNow() : 1;
    const seq = ++analysisSeq;
    setBest("berpikir…", "");
    const sv = (p: any) => p.mate !== undefined ? (p.mate > 0 ? 100000 : -100000) : (p.cp || 0);
    const toW = (s: any) => turn === "b" ? -s : s;
    analyze(fen, 0 , (m: any, byPv: any, idx: any) => {
      if (seq !== analysisSeq) return;
      if (!boardEl.isConnected) { analysisSeq++; ENGINE.stopAnalysis(); return; }
      if (idx === 2 && !m.bound && nodeAtStart && m.depth && m.depth >= (nodeAtStart.sc2Depth || 0)) {
        nodeAtStart.sc2 = rawScore(m); nodeAtStart.sc2Depth = m.depth;
      }
      if (idx === 1 && !m.bound) {
        showEval(m, turn);
        const dt = document.getElementById("depthText"); if (dt) dt.textContent = "(d" + (m.depth || "") + ")";
        if (m.pv) setBest(prettyPV(fen, m.pv.slice(0, 1))[0] || m.pv[0], prettyPV(fen, m.pv.slice(0, 6)).join(" "));
        if (nodeAtStart && m.depth && m.depth >= (nodeAtStart.scDepth || 0)) {
          nodeAtStart.sc = rawScore(m); nodeAtStart.scDepth = m.depth;
          if (m.pv && m.pv[0]) nodeAtStart.best = m.pv[0];
        }
      }
      if (byPv) {
        liveAnal = {
          fen, evW: byPv[1] ? toW(sv(byPv[1])) : 0,
          raw: byPv[1] ? rawScore(byPv[1]) : null,
          best: (byPv[1] && byPv[1].pv) ? byPv[1].pv[0] : null,
          secondEvW: byPv[2] ? toW(sv(byPv[2])) : null
        };
      }
      if (byPv && wantArrows && (document.getElementById("showArrow") as HTMLInputElement).checked) {
        const arrows = [];
        for (let k = 1; k <= nArrows; k++) {
          const p = byPv[k];
          if (p && p.pv && p.pv[0]) arrows.push({ uci: p.pv[0], o: k === 1 ? 0.85 : 0.5, w: 0.18 });
        }
        if (arrows.length) drawArrows(arrows);
      } else if (idx === 1) syncMoverArrow();
      if (idx === 1) liveJudgeTick(fen, m);
    }, (bm: any, m: any) => {
      if (seq !== analysisSeq) return;
      showEval(m, turn);
    }, Math.max(2, nArrows));
  }

  function liveJudgeTick(fen: any, m: any) {
    const j = pendingJudge;
    if (!j || j.fenAfter !== fen || m.bound || !m.depth || m.depth < JUDGE_MIN_DEPTH) return;
    j.pendingRaw = rawScore(m);
    j.pendingKey = j.pendingRaw.join(":");
    if (j.pendingKey === j.lastKey || judgeTimer) return;
    judgeTimer = setTimeout(() => sendJudge(j), Math.max(0, JUDGE_MIN_GAP - (Date.now() - (j.lastSentAt || 0))));
  }
  function sendJudge(j: any) {
    judgeTimer = null;
    if (pendingJudge !== j || !j.pendingRaw || j.pendingKey === j.lastKey) return;
    const raw = j.pendingRaw;
    j.lastKey = j.pendingKey; j.lastSentAt = Date.now();
    const mySeq = ++judgeSeq;
    classifyMoveViaServer({
      fenBefore: j.fenBefore, fenAfter: j.fenAfter, move: j.move, moverColor: j.moverColor,
      isBest: j.playedUci.slice(0, 4) === (j.best || "").slice(0, 4) && (j.best.length < 5 || j.playedUci.slice(4, 5) === j.best.slice(4, 5)),
      isBook: false,
      staticEval: raw,
      previousStaticEvals: j.previousStaticEvals,
      previousSacrifice: !!j.previousSacrifice,
      secondScore: j.beforeSecond || null,
      previousCaptureSquare: j.previousCaptureSquare || null
    }, j.node).then((cat: any) => {
      if (mySeq !== judgeSeq || pendingJudge !== j) return;
      j.shown = true; showJudge(j.san, j.to, cat);
    }).catch(() => {
      if (pendingJudge === j && !j.shown) { j.shown = true; showJudge(j.san, j.to, "good"); }
    });
  }
  function showJudge(san: any, sq: any, cat: any) {
    if (liveBadge && liveBadge.sq === sq && liveBadge.cat === cat) return;
    liveBadge = { sq, cat };
    render();
    const mcat = CATS[cat];
    const jt = document.getElementById("judgeText");
    const box = document.getElementById("analysisBox"); if (box) box.hidden = false;
    const phrase = (cat === "great" || cat === "book") ? "adalah langkah " + mcat.label : "adalah " + mcat.label;
    if (jt) jt.innerHTML = `<div class="bc-cm-head"><img class="bc-cm-icon" src="${mcat.img}" alt="${mcat.label}" title="${mcat.label}" onerror="iconFallback(this,'${cat}')"><span>${esc(san)} ${phrase}</span></div>`;
  }
  function clearJudge() {
    liveBadge = null; pendingJudge = null;
    clearTimeout(judgeTimer); judgeTimer = null; judgeSeq++;
    const jt = document.getElementById("judgeText"); if (jt) jt.textContent = "";
    const box = document.getElementById("analysisBox"); if (box) box.hidden = true;
  }
  { const onVis = () => {
      if (!boardEl.isConnected) { document.removeEventListener("visibilitychange", onVis); return; }
      if (document.hidden) { analysisSeq++; clearTimeout(analysisTimer); ENGINE.stopAnalysis(); }
      else triggerAnalysis();
    };
    document.addEventListener("visibilitychange", onVis); }

  function showEval(m: any, turn: any) {
    let cp;
    if (m.mate !== undefined) { cp = (m.mate > 0 ? 1 : -1) * 100000; }
    else if (m.cp !== undefined) { cp = m.cp; }
    else return;
    if (turn === "b") cp = -cp;
    lastEval = m.mate !== undefined ? { mate: turn === "b" ? -m.mate : m.mate } : { cp };
    paintEvalBar();
  }
  function paintEvalBar() {
    const bar = document.getElementById("evalbar"), fill = document.getElementById("evalfill");
    const la = document.getElementById("evalLabelA"), lb = document.getElementById("evalLabelB");
    if (!bar || !fill || !la || !lb) return;
    const ev: any = lastEval || { cp: 0 };
    const whiteBottom = !flipped;
    let percent: number, label: string;
    if (ev.mate !== undefined) { percent = ev.mate > 0 ? 100 : 0; label = ev.unknown ? "M" : "M" + Math.abs(ev.mate); }
    else {
      const cp = ev.cp || 0;
      percent = Math.min(Math.max(((cp + 400) * 90) / 800 + 5, 5), 95);
      label = (Math.abs(cp) / 100).toFixed(1);
    }
    const winning = whiteBottom ? percent >= 50 : percent <= 50;
    bar.dataset.bottom = whiteBottom ? "w" : "b";
    fill.style.setProperty("--p", percent + "%");
    la.textContent = lb.textContent = label;
    la.dataset.c = whiteBottom ? "light" : "dark";
    lb.dataset.c = whiteBottom ? "dark" : "light";
    la.style.opacity = winning ? "0" : "1";
    lb.style.opacity = winning ? "1" : "0";
    bar.setAttribute("aria-label", "Evaluasi " + label);
  }
  function setBest(a: any, b: any) { const bt = document.getElementById("bestText"); if (bt) bt.textContent = a; const pv = document.getElementById("pvText"); if (pv) pv.textContent = b; }

  function prettyPV(fen: any, uciList: any) {
    const tmp = new Chess(fen); const out = [];
    for (const u of uciList) {
      const mv = tmp.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u.slice(4, 5) || "q" });
      if (!mv) break; out.push(mv.san);
    }
    return out;
  }

  