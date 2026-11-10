/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
const NC = window.NusantaraChess;
  const api = NC.api;
  const ENGINE = NC.gameReviewEngine;
  const SOUND = NC.gameReviewSound;
  const PIECE_SVG = NC.gameReviewPieceSvg;

  const { initEngine, analyze, analyzePool, cloudBook, setStatus } = ENGINE;
  const { initSounds, sfx, sfxFor } = SOUND;

  const game = new Chess();
  let history = [];
  let ply = 0;
  let loadedMode = false;
  let flipped = false;
  let selected: any = null;
  let root: any = null;
  let cur: any = null;
  let treeLocked = false;
  let nodeSeq = 0;
  let nodeById: Map<number, any> = new Map();
  let mainNodes: any[] = [];
  let importedGame = false;
  let startReviewAtZero = false;
  let liveAnal: any = null;
  let pendingJudge: any = null;
  let liveBadge: any = null;

  let reviewReport: any = null;
  let reviewEvals: any = null;
  let gameMeta: any = null;
  let pgnHeader: Record<string, string> | null = null;

  const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const PVAL: Record<string, any> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

  const CATS: Record<string, any> = {
    brilliant: { label: "Brilian", icon: "!!", img: "images/brilliant.svg", color: "#148484", group: "good" },
    great: { label: "Bagus", icon: "!", img: "images/great.svg", color: "#327ab6", group: "good" },
    best: { label: "Terbaik", icon: "", ico: "star", img: "images/best.svg", color: "#468446", group: "good" },
    excellent: { label: "Sangat Baik", icon: "", ico: "check", img: "images/excellent.svg", color: "#608033", group: "good" },
    good: { label: "Baik", icon: "", ico: "dot", img: "images/good.svg", color: "#727932", group: "good" },
    book: { label: "Buku", icon: "", ico: "grid", img: "images/book.svg", color: "#9a6b34", group: "good" },
    inaccuracy: { label: "Tidak Akurat", icon: "?!", img: "images/inaccuracy.svg", color: "#86732c", group: "bad" },
    mistake: { label: "Kesalahan", icon: "?", img: "images/mistake.svg", color: "#a5662c", group: "bad" },
    miss: { label: "Terlewat", icon: "", ico: "close", img: "images/miss.svg", color: "#c0563f", group: "bad" },
    blunder: { label: "Blunder", icon: "??", img: "images/blunder.svg", color: "#cd4848", group: "bad" },
    forced: { label: "Terpaksa", icon: "", ico: "arrow-right", img: "images/forced.svg", color: "#7c7a77", group: "good" }
  };
  const HL: Record<string, string> = {
    brilliant: "#26c2a3", great: "#749bbf", best: "#81b64c", excellent: "#81b64c", good: "#95b776", book: "#d5a47d",
    inaccuracy: "#f7c631", mistake: "#ffa459", miss: "#ff7769", blunder: "#fa412d", forced: "#a3a2a0"
  };
  const GOOD_ORDER = ["brilliant", "great", "best", "excellent", "good", "book"];
  const BAD_ORDER = ["inaccuracy", "mistake", "miss", "blunder"];
  const ALL_ORDER = GOOD_ORDER.concat(BAD_ORDER);
  const PHASE_LABEL: Record<string, any> = { opening: "Pembukaan", middlegame: "Permainan Tengah", endgame: "Permainan Akhir" };
  const PHASE_ORDER = ["opening", "middlegame", "endgame"];

  function iconFallback(img: any, metaOrKey: any) {
    const m = (typeof metaOrKey === "string") ? CATS[metaOrKey] : metaOrKey;
    if (!m || !img || !img.parentNode) return;
    const span = document.createElement("span");
    span.className = img.className + " icon-fallback";
    span.style.cssText = img.style.cssText;
    span.style.background = m.color;
    span.title = m.label;
    if (m.ico) { span.innerHTML = '<span class="ui-ico ui-ico-' + m.ico + '" aria-hidden="true"></span>'; span.style.color = "#fff"; }
    else span.textContent = m.icon;
    img.replaceWith(span);
  }
  window.iconFallback = iconFallback;

  const winPct = (cp: any) => 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * Math.max(-10000, Math.min(10000, cp)))) - 1);
  const accColorOf = (v: any) => v >= 90 ? "#5fb35f" : v >= 80 ? "#8ab84a" : v >= 70 ? "#e0c04a" : v >= 55 ? "#e08a3c" : "#d24a4a";

  const boardEl = document.getElementById("board");
  function boardBadge(cell: any, meta: any, cat?: string) {
    const cs = boardEl.getBoundingClientRect().width / 8;
    const bs = Math.max(20, Math.round(cs * 0.4));
    const b = document.createElement("img");
    b.className = "movebadge";
    b.src = meta.img; b.alt = meta.label; b.title = meta.label;
    b.onerror = () => iconFallback(b, meta);
    b.style.width = b.style.height = b.style.minWidth = bs + "px";
    const idx = Array.prototype.indexOf.call(boardEl.children, cell);
    const edgeRight = idx % 8 === 7, edgeTop = idx < 8;
    b.style.top = edgeTop ? "2px" : Math.round(-bs * 0.35) + "px";
    b.style.right = edgeRight ? "2px" : Math.round(-bs * 0.35) + "px";
    cell.appendChild(b);
  }
  function rateHighlight(last: any, cat: string) {
    const color = HL[cat];
    if (!color || !last) return;
    [last.from, last.to].forEach((sq: string) => {
      const el = boardEl.querySelector(`[data-sq="${sq}"]`) as HTMLElement | null;
      if (el) el.style.setProperty("--hl", color);
    });
  }
  function render() {
    boardEl.innerHTML = "";
    const board = game.board();
    const last = game.history({ verbose: true }).slice(-1)[0];
    const order = flipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()];
    const fileOrder = flipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()];
    for (const r of order) {
      for (const f of fileOrder) {
        const sq = document.createElement("div");
        const sqName = FILES[f] + (8 - r);
        const dark = (r + f) % 2 === 1;
        sq.className = "sq " + (dark ? "d" : "l");
        sq.dataset.sq = sqName;
        const cell = board[r][f];
        if (cell) {
          const p = document.createElement("span");
          p.className = "piece " + (cell.color === "w" ? "w" : "b");
          p.innerHTML = PIECE_SVG[cell.color + cell.type.toUpperCase()];
          sq.appendChild(p);
        }
        if (last && (last.from === sqName || last.to === sqName)) sq.classList.add("lastmove");
        if (selected === sqName) sq.classList.add("sel");
        if ((flipped ? r === 0 : r === 7)) { const c = document.createElement("span"); c.className = "coord file"; c.textContent = FILES[f]; sq.appendChild(c); }
        if ((flipped ? f === 7 : f === 0)) { const c = document.createElement("span"); c.className = "coord rank"; c.textContent = 8 - r as any; sq.appendChild(c); }
        sq.addEventListener("pointerdown", (e) => onSquarePointerDown(e, sqName));
        boardEl.appendChild(sq);
      }
    }
    if (selected) {
      const moves = game.moves({ square: selected, verbose: true });
      for (const mv of moves) {
        const target = boardEl.querySelector(`[data-sq="${mv.to}"]`);
        if (target) { const d = document.createElement("span"); d.className = mv.captured ? "ring" : "dot"; target.appendChild(d); }
      }
    }
    if (reviewReport && loadedMode && cur && cur.main && ply > 0 && reviewReport.reviewData[ply - 1] && last) {
      const meta = CATS[reviewReport.reviewData[ply - 1].cat];
      const cell = boardEl.querySelector(`[data-sq="${last.to}"]`);
      if (meta && cell) { rateHighlight(last, reviewReport.reviewData[ply - 1].cat); boardBadge(cell, meta); }
    }
    if (liveBadge && !loadedMode) {
      const meta = CATS[liveBadge.cat];
      const cell = boardEl.querySelector(`[data-sq="${liveBadge.sq}"]`);
      if (meta && cell) { rateHighlight(last, liveBadge.cat); boardBadge(cell, meta); }
    }
    renderPlayerBars();
    updateFenOut();
  }

  