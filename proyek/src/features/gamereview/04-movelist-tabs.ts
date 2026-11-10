/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
const svgArrows = document.getElementById("arrowsvg");
  function sqToXY(sq: any) {
    let f = FILES.indexOf(sq[0]), r = 8 - (+sq[1]);
    if (flipped) { f = 7 - f; r = 7 - r; }
    return { x: f + 0.5, y: r + 0.5 };
  }
  let lastArrows: any = null;
  function arrowPoints(p1: any, p2: any, shaft: number, headLen: number, headHalf: number) {
    const dx = p2.x - p1.x, dy = p2.y - p1.y, len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
    const sx = p1.x + ux * 0.18, sy = p1.y + uy * 0.18;
    const ex = p2.x - ux * 0.1, ey = p2.y - uy * 0.1;
    const bx = ex - ux * headLen, by = ey - uy * headLen;
    const pts = [
      [sx + nx * shaft, sy + ny * shaft], [bx + nx * shaft, by + ny * shaft], [bx + nx * headHalf, by + ny * headHalf],
      [ex, ey], [bx - nx * headHalf, by - ny * headHalf], [bx - nx * shaft, by - ny * shaft], [sx - nx * shaft, sy - ny * shaft]
    ];
    return pts.map(q => q[0].toFixed(3) + "," + q[1].toFixed(3)).join(" ");
  }
  function drawArrows(list: any) {
    const clean = (list || []).filter((a: any) => a && a.uci && a.uci.length >= 4).slice(0, 5);
    if (!clean.length) { clearArrow(); return; }
    lastArrows = clean;
    const polys = clean.map((a: any, k: number) => {
      const p1 = sqToXY(a.uci.slice(0, 2)), p2 = sqToXY(a.uci.slice(2, 4));
      const color = k === 0 ? "var(--arrow-best,#9fcf3f)" : "var(--arrow-normal,#ffaa00)";
      return `<polygon points="${arrowPoints(p1, p2, 0.08, 0.34, 0.2)}" fill="${color}" opacity="0.65"/>`;
    });
    svgArrows.innerHTML = polys.reverse().join("");
  }
  function drawArrow(uci: any) { drawArrows([{ uci, o: 0.85, w: 0.18 }]); }
  function clearArrow() { svgArrows.innerHTML = ""; lastArrows = null; }

  let startFen: any = null;
  let fullHistory: any[] = [];

  function rootFullmove() {
    if (!startFen) return 1;
    const n = parseInt(String(startFen).trim().split(/\s+/)[5], 10);
    return n > 0 ? n : 1;
  }
  function makeNode(parent: any, mv: any, main: boolean) {
    const node: any = {
      id: ++nodeSeq, parent, children: [], pref: null, main,
      ply: parent ? parent.ply + 1 : 0,
      san: mv ? mv.san : null, color: mv ? mv.color : null,
      from: mv ? mv.from : null, to: mv ? mv.to : null, promotion: mv ? (mv.promotion || null) : null,
      num: 0
    };
    if (mv) node.num = (!parent.parent) ? rootFullmove() : (parent.color === "b" ? parent.num + 1 : parent.num);
    nodeById.set(node.id, node);
    return node;
  }
  function refreshMain() {
    const nodes = [root];
    let n = root;
    for (;;) {
      const c = n.children.find((x: any) => x.main);
      if (!c) break;
      nodes.push(c); n = c;
    }
    mainNodes = nodes;
    fullHistory = nodes.slice(1).map((x: any) => x.san);
  }
  function resetTree() {
    nodeSeq = 0; nodeById = new Map();
    root = makeNode(null, null, true);
    cur = root; treeLocked = false; ply = 0;
    refreshMain();
  }
  function buildTreeFromSans(sans: any[]) {
    resetTree();
    const t = new Chess(); if (startFen) t.load(startFen);
    let p = root;
    for (const san of sans) {
      const mv = t.move(san);
      if (!mv) break;
      const n = makeNode(p, mv, true);
      p.children.push(n); p.pref = n; p = n;
    }
    treeLocked = true;
    refreshMain();
  }
  function pathTo(n: any) {
    const out: any[] = [];
    for (let x = n; x; x = x.parent) out.push(x);
    return out.reverse();
  }
  const defaultChild = (n: any) => n.children.find((c: any) => c.main) || n.children[0] || null;
  const nextChildOf = (n: any) => (n.pref && n.children.indexOf(n.pref) >= 0) ? n.pref : defaultChild(n);

  function recordUserMove(made: any) {
    let child = cur.children.find((c: any) => c.from === made.from && c.to === made.to && (c.promotion || "") === (made.promotion || ""));
    if (!child) {
      const extendsMain = !treeLocked && cur.main && !cur.children.some((c: any) => c.main);
      child = makeNode(cur, made, extendsMain);
      cur.children.push(child);
      if (extendsMain) refreshMain();
    }
    cur.pref = child; cur = child; ply = cur.ply;
  }
  function syncGameToCur() {
    game.reset(); if (startFen) game.load(startFen);
    for (const n of pathTo(cur)) {
      if (!n.parent) continue;
      const r = game.move({ from: n.from, to: n.to, promotion: n.promotion || undefined });
      if (!r) { console.error("[gamereview] langkah tidak dapat dimainkan ulang:", n.san); break; }
    }
  }
  const lastVerbose = () => game.history({ verbose: true }).slice(-1)[0] || null;

  let autoPlaying = false;
  let autoStepping = false;
  let autoPlayTimer: any = null;

  function goToNode(node: any) {
    if (!node) return;
    if (autoPlaying && !autoStepping) stopAutoPlay();
    const from = cur;
    const fromMv = (from && from.parent) ? lastVerbose() : null;
    const path = pathTo(node);
    for (let i = 0; i < path.length - 1; i++) path[i].pref = path[i + 1];
    cur = node;
    syncGameToCur();
    ply = node.ply; loadedMode = true; selected = null; clearJudge();
    const toMv = node.parent ? lastVerbose() : null;
    if (toMv) sfxFor(toMv);
    render();
    if (from && node.parent === from && toMv) animateMoveObj(toMv, false);
    else if (from && from.parent === node && fromMv) animateMoveObj(fromMv, true);
    rebuildMoveList();
    highlightReview();
    triggerAnalysis();
    if (reviewReport && curTab === "review") switchTab("moves");
  }
  function gotoPly(n: any) {
    goToNode(mainNodes[Math.max(0, Math.min(mainNodes.length - 1, n | 0))]);
  }
  function goPrev() {
    if (!cur.parent) return;
    const P = cur.parent, d = defaultChild(P);
    P.pref = (cur === d) ? cur : d;
    goToNode(P);
  }
  function goNext() { const c = nextChildOf(cur); if (c) goToNode(c); }
  function goStart() { goToNode(root); }
  function goEnd() {
    let n = cur;
    for (;;) { const c = nextChildOf(n); if (!c) break; n = c; }
    goToNode(n);
  }

  function lineNodes() {
    const nodes = pathTo(cur).slice(1);
    for (let n = cur; ;) { const c = nextChildOf(n); if (!c) break; nodes.push(c); n = c; }
    return nodes;
  }
  const moveNo = (n: any) => n.num + (n.color === "w" ? "." : "...");
  function setNavDisabled(key: string, dis: boolean) {
    document.querySelectorAll('[data-nav="' + key + '"]').forEach(b => { (b as HTMLButtonElement).disabled = dis; });
  }
  function updateNavState() {
    const atStart = !cur.parent, atEnd = !nextChildOf(cur);
    setNavDisabled("first", atStart); setNavDisabled("prev", atStart);
    setNavDisabled("next", atEnd); setNavDisabled("last", atEnd);
    setNavDisabled("play", !root.children.length);
    const cp = document.getElementById("copyPgnBtn") as HTMLButtonElement | null;
    if (cp) cp.disabled = !root.children.length;
    const sh = document.getElementById("navShare") as HTMLButtonElement | null;
    if (sh) sh.setAttribute("aria-disabled", root.children.length ? "false" : "true");
  }
  function lastBookIdx() {
    const rd = reviewReport && reviewReport.reviewData;
    if (!rd) return -1;
    for (let i = rd.length - 1; i >= 0; i--) if (rd[i] && rd[i].cat === "book") return i;
    return -1;
  }
  function rebuildMoveList() {
    if (!cur) return;
    history = pathTo(cur).slice(1).map((n: any) => n.san);
    ply = cur.ply;
    const el = document.getElementById("moveList");
    const keepTop = el.scrollTop;
    const lb = lastBookIdx();
    const cell = (n: any) => {
      if (!n) return '<div class="bc-cell"></div>';
      const rd = n.main && reviewReport && reviewReport.reviewData ? reviewReport.reviewData : null;
      const rcat = rd ? (sumImportantCat(rd, n.ply - 1, lb) || "") : "";
      const meta = rcat && CATS[rcat] ? CATS[rcat] : null;
      const icon = meta ? `<img src="${meta.img}" alt="${meta.label}" title="${meta.label}" draggable="false">` : "";
      const hasAlt = n.parent && n.parent.children.length > 1;
      return `<div class="bc-cell"><button type="button" class="bc-ricon" tabindex="-1" aria-hidden="true" data-node="${n.id}">${icon}</button>` +
        `<button type="button" class="bc-san${n === cur ? " cur" : ""}${n.main ? "" : " var"}${hasAlt ? " has-alt" : ""}${meta ? " r-" + rcat : ""}" data-node="${n.id}"${n === cur ? ' aria-current="true"' : ""}>${esc(n.san)}</button></div>`;
    };
    const nodes = lineNodes();
    const rows: any[] = [];
    let i = 0;
    if (nodes.length && nodes[0].color === "b") { rows.push([nodes[0].num, null, nodes[0]]); i = 1; }
    for (; i < nodes.length; i += 2) rows.push([nodes[i].num, nodes[i], nodes[i + 1] || null]);
    let html = "";
    rows.forEach(r => { html += `<li class="bc-turn"><span class="bc-num">${r[0]}.</span><div class="bc-pair">${cell(r[1])}${cell(r[2])}</div></li>`; });
    el.innerHTML = html || '<li class="ms-empty">Belum ada langkah.</li>';
    el.scrollTop = keepTop;
    const c = el.querySelector(".bc-san.cur") as HTMLElement | null;
    if (c) {
      const li = c.closest("li") as HTMLElement;
      const top = Math.max(0, li.offsetTop - (el.clientHeight - li.offsetHeight) / 2);
      const calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ top, behavior: calm ? "auto" : "smooth" });
    } else if (!cur.parent) el.scrollTop = 0;
    renderVariationBar();
    updateNavState();
  }
  function renderVariationBar() {
    const bar = document.getElementById("variationBar");
    if (!bar) return;
    let html = "";
    if (!cur.main) html += '<span class="vb-flag">Variasi</span>';
    if (cur.children.length > 1) {
      const follow = nextChildOf(cur);
      html += '<span class="vb-label">Langkah berikutnya:</span>';
      for (const c of cur.children) {
        html += `<button type="button" class="ms-chip alt${c === follow ? " sel" : ""}${c.main ? "" : " var"}" data-node="${c.id}">${moveNo(c)}${esc(c.san)}${c.main ? "<small>utama</small>" : ""}</button>`;
      }
    }
    bar.innerHTML = html;
    bar.hidden = !html;
  }
  const onNodeClick = (e: any) => {
    const b = e.target && e.target.closest ? e.target.closest("[data-node]") : null;
    if (b && b.dataset.node) goToNode(nodeById.get(+b.dataset.node));
  };
  document.getElementById("moveList").addEventListener("click", onNodeClick);
  document.getElementById("variationBar").addEventListener("click", onNodeClick);
  resetTree();

  const navFns: Record<string, () => void> = { first: () => goStart(), prev: () => goPrev(), next: () => goNext(), last: () => goEnd() };
  document.querySelectorAll("[data-nav]").forEach(b => {
    const fn = navFns[(b as HTMLElement).dataset.nav];
    if (fn) (b as HTMLElement).onclick = fn;
  });
  document.getElementById("navFlip").onclick = () => {
    flipped = !flipped; render(); paintEvalBar();
    if (lastArrows && (document.getElementById("showArrow") as HTMLInputElement).checked) drawArrows(lastArrows);
  };

  const PGN_ROSTER = ["Event", "Site", "Date", "Round", "White", "Black", "Result"];
  const PGN_DEFAULTS: Record<string, string> = { Event: "?", Site: "?", Date: "????.??.??", Round: "?", White: "?", Black: "?", Result: "*" };
  const pgnTag = (v: any) => String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/[\r\n]+/g, " ");
  function pgnResult(): string {
    const h = pgnHeader && pgnHeader.Result;
    if (h && /^(1-0|0-1|1\/2-1\/2|\*)$/.test(h)) return h;
    const g = new Chess(); if (startFen) g.load(startFen);
    for (const n of mainNodes.slice(1)) g.move({ from: n.from, to: n.to, promotion: n.promotion || undefined });
    if (g.in_checkmate()) return g.turn() === "w" ? "0-1" : "1-0";
    if (g.in_stalemate() || g.insufficient_material()) return "1/2-1/2";
    return "*";
  }
  function pgnMoveAtoms(): string[] {
    const tok = (n: any, force: boolean) => (n.color === "w" ? n.num + ". " : (force ? n.num + "... " : "")) + n.san;
    const walk = (parent: any, force: boolean): string[] => {
      const out: string[] = [];
      let node = parent;
      while (node.children.length) {
        const main = node.children.find((c: any) => c.main) || node.children[0];
        out.push(tok(main, force));
        const alts = node.children.filter((c: any) => c !== main);
        for (const alt of alts) {
          const v = [tok(alt, true), ...walk(alt, false)];
          v[0] = "(" + v[0]; v[v.length - 1] += ")";
          out.push(...v);
        }
        force = alts.length > 0;
        node = main;
      }
      return out;
    };
    return walk(root, true);
  }
  function buildPgn(): string {
    const hdr: Record<string, string> = {};
    for (const k of PGN_ROSTER) {
      const v = pgnHeader && pgnHeader[k] != null ? String(pgnHeader[k]) : "";
      hdr[k] = v !== "" ? v : PGN_DEFAULTS[k];
    }
    hdr.Result = pgnResult();
    if (startFen) { hdr.SetUp = "1"; hdr.FEN = startFen; }
    if (pgnHeader) for (const k of Object.keys(pgnHeader)) {
      if (PGN_ROSTER.indexOf(k) >= 0 || k === "SetUp" || k === "FEN") continue;
      if (pgnHeader[k] != null && String(pgnHeader[k]) !== "") hdr[k] = String(pgnHeader[k]);
    }
    const head = Object.keys(hdr).map(k => `[${k} "${pgnTag(hdr[k])}"]`).join("\n");
    const atoms = pgnMoveAtoms(); atoms.push(hdr.Result);
    const lines: string[] = []; let line = "";
    for (const a of atoms) {
      if (line && line.length + 1 + a.length > 80) { lines.push(line); line = a; }
      else line = line ? line + " " + a : a;
    }
    if (line) lines.push(line);
    return head + "\n\n" + lines.join("\n") + "\n";
  }
  function showCopyToast(msg: string, isError?: boolean) {
    let t = document.getElementById("bcToast");
    if (!t) { t = document.createElement("div"); t.id = "bcToast"; t.setAttribute("role", "status"); t.setAttribute("aria-live", "polite"); document.body.appendChild(t); }
    t.className = "bc-toast" + (isError ? " err" : "");
    t.textContent = msg;
    const tt: any = t;
    clearTimeout(tt._timer);
    tt._timer = setTimeout(() => { if (t && t.parentNode) t.parentNode.removeChild(t); }, isError ? 3500 : 2200);
  }
  async function copyPgn() {
    if (!root.children.length) { showCopyToast("Belum ada langkah untuk disalin", true); return; }
    const pgn = buildPgn();
    try {
      await navigator.clipboard.writeText(pgn);
      showCopyToast("PGN disalin ke clipboard");
      return;
    } catch (e) { }
    const ta = document.createElement("textarea");
    ta.value = pgn; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    if (ok) showCopyToast("PGN disalin ke clipboard");
    else { showCopyToast("Gagal menyalin PGN", true); window.prompt("Gagal menyalin otomatis. Salin PGN manual dari sini:", pgn); }
  }
  document.getElementById("copyPgnBtn").addEventListener("click", copyPgn);

  async function sharePgn() {
    if (!root.children.length) { showCopyToast("Belum ada langkah untuk dibagikan", true); return; }
    const pgn = buildPgn();
    const nav: any = navigator;
    if (typeof nav.share === "function") {
      try {
        const file = typeof File === "function" ? new File([pgn], "nusantarachess.pgn", { type: "application/x-chess-pgn" }) : null;
        const data = file && typeof nav.canShare === "function" && nav.canShare({ files: [file] })
          ? { files: [file], title: "PGN NusantaraChess" }
          : { title: "PGN NusantaraChess", text: pgn };
        await nav.share(data);
        return;
      } catch (e: any) {
        if (e && e.name === "AbortError") return;
      }
    }
    try {
      const url = URL.createObjectURL(new Blob([pgn], { type: "application/x-chess-pgn" }));
      const a = document.createElement("a");
      a.href = url; a.download = "nusantarachess.pgn";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showCopyToast("PGN diekspor");
    } catch (e) {
      await copyPgn();
    }
  }
  const navShareBtn = document.getElementById("navShare") as HTMLButtonElement | null;
  if (navShareBtn) {
    navShareBtn.setAttribute("aria-disabled", root.children.length ? "false" : "true");
    navShareBtn.addEventListener("click", sharePgn);
  }
  (window as any).__grBuildPgn = buildPgn;

  const onReviewKey = (e: KeyboardEvent) => {
    if (!boardEl.isConnected) { document.removeEventListener("keydown", onReviewKey); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target as HTMLElement | null, tag = t && t.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (t && t.isContentEditable)) return;
    if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); goStart(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); goEnd(); }
    else if (e.key === " " && tag !== "BUTTON") {
      e.preventDefault();
      if (autoPlaying) stopAutoPlay(); else startAutoPlay();
    }
  };
  document.addEventListener("keydown", onReviewKey);

  document.getElementById("showArrow").addEventListener("change", (e) => {
    if (!(e.target as HTMLInputElement).checked) { arrowMuteNode = cur; clearArrow(); }
    else { arrowMuteNode = null; if (lastArrows) drawArrows(lastArrows); }
  });
  { const sel = document.getElementById("arrowCount") as HTMLSelectElement;
    const saved = (() => { try { return localStorage.getItem("gr_arrow_count"); } catch (e) { return null; } })();
    if (saved && /^[1-5]$/.test(saved)) sel.value = saved;
    sel.addEventListener("change", () => {
      try { localStorage.setItem("gr_arrow_count", sel.value); } catch (e) { }
      lastArrows = null; svgArrows.innerHTML = "";
      triggerAnalysis();
    }); }

  document.getElementById("autoAnalyze").addEventListener("change", () => { triggerAnalysis(); });
  document.getElementById("showArrow").addEventListener("change", (e) => {
    if ((e.target as HTMLInputElement).checked && (document.getElementById("autoAnalyze") as HTMLInputElement).checked) {
      clearArrow(); triggerAnalysis();
    }
  });

  const settingsBtn = document.getElementById("settingsBtn");
  const settingsMenu = document.getElementById("reviewSettingsMenu");
  const isSettingsOpen = () => !!settingsMenu && !settingsMenu.hidden;
  function setSettingsOpen(open: boolean, restoreFocus?: boolean) {
    if (!settingsBtn || !settingsMenu) return;
    settingsMenu.hidden = !open;
    settingsBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { const first = settingsMenu.querySelector("input,button") as HTMLElement | null; if (first) first.focus(); }
    else if (restoreFocus) settingsBtn.focus();
  }
  if (settingsBtn && settingsMenu) {
    settingsBtn.addEventListener("click", () => setSettingsOpen(!isSettingsOpen()));
    const closeBtn = document.getElementById("settingsClose");
    if (closeBtn) closeBtn.addEventListener("click", () => setSettingsOpen(false, true));
    const onSettingsKey = (e: KeyboardEvent) => { if (e.key === "Escape" && isSettingsOpen()) { e.stopPropagation(); setSettingsOpen(false, true); } };
    settingsMenu.addEventListener("keydown", onSettingsKey);
    settingsBtn.addEventListener("keydown", onSettingsKey);
    document.getElementById("navFlip").addEventListener("click", () => setSettingsOpen(false));
    const onOutsidePointer = (e: any) => {
      if (!settingsMenu.isConnected) { window.removeEventListener("pointerdown", onOutsidePointer, true); return; }
      if (!isSettingsOpen()) return;
      const t = e.target as Node;
      if (settingsMenu.contains(t) || settingsBtn.contains(t)) return;
      setSettingsOpen(false);
    };
    window.addEventListener("pointerdown", onOutsidePointer, true);
  }

  const apBtns = Array.from(document.querySelectorAll('[data-nav="play"]')) as HTMLElement[];
  const apSpeed = document.getElementById("autoPlaySpeed") as HTMLSelectElement;
  const autoPlayCanStep = () => !!cur && !!nextChildOf(cur);
  function setAutoPlayUi(on: boolean) {
    const text0 = on ? "Jeda" : "Putar otomatis";
    apBtns.forEach(apBtn => {
      apBtn.classList.toggle("is-playing", on);
      apBtn.setAttribute("aria-pressed", on ? "true" : "false");
      apBtn.title = text0;
      apBtn.setAttribute("aria-label", text0);
    });
  }
  function stopAutoPlay() {
    if (autoPlayTimer !== null) { clearTimeout(autoPlayTimer); autoPlayTimer = null; }
    autoPlaying = false;
    setAutoPlayUi(false);
  }
  function autoPlayTick() {
    autoPlayTimer = null;
    if (!autoPlaying) return;
    if (!boardEl.isConnected) { autoPlaying = false; return; }
    if (!autoPlayCanStep()) { stopAutoPlay(); return; }
    autoStepping = true;
    try { goNext(); }
    catch (err) { console.error(err); stopAutoPlay(); return; }
    finally { autoStepping = false; }
    if (!autoPlayCanStep()) { stopAutoPlay(); return; }
    autoPlayTimer = setTimeout(autoPlayTick, +apSpeed.value);
  }
  function startAutoPlay() {
    if (!root.children.length) return;
    autoPlaying = true;
    setAutoPlayUi(true);
    autoStepping = true;
    try {
      if (!autoPlayCanStep()) goToNode(root);
    } catch (err) { console.error(err); stopAutoPlay(); return; }
    finally { autoStepping = false; }
    autoPlayTimer = setTimeout(autoPlayTick, Math.min(+apSpeed.value, 400));
  }
  if (apBtns.length && apSpeed) {
    apBtns.forEach(b => b.addEventListener("click", () => { if (autoPlaying) stopAutoPlay(); else startAutoPlay(); }));
    apSpeed.addEventListener("change", () => {
      if (!autoPlaying) return;
      if (autoPlayTimer !== null) clearTimeout(autoPlayTimer);
      autoPlayTimer = setTimeout(autoPlayTick, +apSpeed.value);
    });
  }

  let curTab = "import";
  let selectListed = false;
  function updateTabs() {
    const set = (name: string, show: boolean) => { const b = document.querySelector('.bc-tabs button[data-tab="' + name + '"]') as HTMLElement | null; if (b) b.hidden = !show; };
    set("select", selectListed);
    set("review", !!reviewReport);
    const lbl = document.querySelector('[data-tab-label="import"]');
    if (lbl) lbl.textContent = (reviewReport || importedGame) ? "Analisis Game Baru" : "Analisis Game";
  }
  function switchTab(name: any) {
    curTab = name;
    const btnName = name === "loading" ? "import" : name;
    updateTabs();
    document.querySelectorAll(".bc-tabs button").forEach(x => x.classList.toggle("active", (x as HTMLElement).dataset.tab === btnName));
    document.querySelectorAll(".tabpane").forEach(x => x.classList.toggle("active", x.id === "tab-" + name));
    paintCharts();
  }
  document.querySelectorAll(".bc-tabs button").forEach(b => (b as HTMLElement).onclick = () => {
    const name = (b as HTMLElement).dataset.tab;
    if (name === "import") {
      if (reviewReport || importedGame) resetSession();
      if (selectListed) stopSelecting();
    }
    switchTab(name);
  });

  const IMPORTS = ["chesscom", "lichess", "pgn", "fen"];
  const IMPORT_INFO: Record<string, any> = {
    chesscom: { label: "Chess.com", icon: "/images/bc-chesscom.svg", platform: true },
    lichess: { label: "Lichess.org", icon: "/images/bc-lichess.svg", platform: true },
    pgn: { label: "PGN", icon: "/images/bc-pgn.svg", platform: false },
    fen: { label: "FEN", icon: "/images/bc-json.svg", platform: false }
  };
  const lsGet = (k: string) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const lsSet = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch (e) { } };
  let curImport = "chesscom";
  const importForm = document.getElementById("importForm") as HTMLFormElement;
  const importInput = document.getElementById("importInput") as HTMLTextAreaElement;
  const importSubmit = document.getElementById("importSubmit") as HTMLButtonElement;
  function setFmtOptions(open: boolean) {
    const box = document.getElementById("fmtOptions") as HTMLElement, tg = document.getElementById("fmtToggle") as HTMLElement;
    box.hidden = !open;
    tg.setAttribute("aria-expanded", open ? "true" : "false");
    tg.classList.toggle("open", open);
  }
  function showImport(name: any, userPick?: boolean) {
    if (!IMPORT_INFO[name]) name = "chesscom";
    curImport = name;
    const info = IMPORT_INFO[name];
    document.getElementById("fmtLabel").textContent = info.label;
    (document.getElementById("fmtIcon") as HTMLImageElement).src = info.icon;
    importInput.placeholder = info.platform ? "Masukkan pengguna " + info.label + " di sini" : "Tempel kode " + info.label + " di sini";
    importSubmit.textContent = info.platform ? "Daftar permainan" : "Analisis";
    importInput.value = name === "chesscom" ? (lsGet("chesscom") || "") : name === "lichess" ? (lsGet("lichessorg") || "") : "";
    (document.getElementById("fenExtra") as HTMLElement).hidden = name !== "fen";
    if (name === "fen") updateFenOut();
    lsSet("format", String(IMPORTS.indexOf(name)));
    if (userPick) { setFmtOptions(false); importInput.focus(); }
  }
  document.querySelectorAll("#importChoices .import-choice").forEach(b => (b as HTMLElement).onclick = () => showImport((b as HTMLElement).dataset.import, true));
  document.getElementById("fmtToggle").onclick = () => setFmtOptions(!!(document.getElementById("fmtOptions") as HTMLElement).hidden);

  let importErrTimer: any = 0;
  function hideImportError() { const el = document.getElementById("importError"); if (el) el.hidden = true; clearTimeout(importErrTimer); }
  function showImportError(title: string, msg: string) {
    const el = document.getElementById("importError"); if (!el) return;
    el.innerHTML = "<b>" + title + "</b><span>" + msg + "</span>";
    el.hidden = false;
    clearTimeout(importErrTimer);
    importErrTimer = setTimeout(() => { el.hidden = true; }, 8000);
  }

  importForm.addEventListener("submit", (e) => {
    e.preventDefault();
    hideImportError();
    const v = importInput.value.trim();
    if (curImport === "chesscom") { lsSet("chesscom", v); startSelect("chesscom", v); }
    else if (curImport === "lichess") { lsSet("lichessorg", v); startSelect("lichess", v); }
    else if (curImport === "pgn") analyzePgnText(v);
    else fenAnalyze(v);
  });
  importInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (importForm.requestSubmit) importForm.requestSubmit(); else importSubmit.click(); }
  });

  const reviewDepthSel = document.getElementById("reviewDepth") as HTMLSelectElement;
  const customBox = document.getElementById("customDepthBox") as HTMLElement;
  let depthMode = "16", customDepth = 18;
  function applyDepthMode() {
    reviewDepthSel.value = depthMode === "custom" ? String(customDepth) : depthMode;
    customBox.hidden = depthMode !== "custom";
    document.querySelectorAll("#depthOptions .depth-opt").forEach(b => {
      const on = (b as HTMLElement).dataset.depth === depthMode;
      b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    document.querySelectorAll("#customDepthOptions .depth-opt").forEach(b => {
      const on = Number((b as HTMLElement).dataset.cdepth) === customDepth;
      b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  document.querySelectorAll("#depthOptions .depth-opt").forEach(b => (b as HTMLElement).onclick = () => {
    depthMode = (b as HTMLElement).dataset.depth; lsSet("depthMode", depthMode); applyDepthMode();
  });
  document.querySelectorAll("#customDepthOptions .depth-opt").forEach(b => (b as HTMLElement).onclick = () => {
    customDepth = Number((b as HTMLElement).dataset.cdepth); lsSet("customDepth", String(customDepth)); applyDepthMode();
  });
  { const sm = lsGet("depthMode"), sc = Number(lsGet("customDepth"));
    if (sm === "14" || sm === "16" || sm === "custom") depthMode = sm;
    if (sc >= 12 && sc <= 22) customDepth = sc; }
  applyDepthMode();
  { const sf = Number(lsGet("format")); showImport(IMPORTS[Number.isInteger(sf) ? sf : 0] || "chesscom"); }

  function resetSession(fen?: any) {
    if (autoPlaying) stopAutoPlay();
    startFen = fen || null;
    resetTree();
    reviewReport = null; reviewEvals = null; gameMeta = null; pgnHeader = null;
    importedGame = false; startReviewAtZero = false;
    renderGameInfoPanel(null);
    document.getElementById("reviewList").innerHTML = "";
    syncReviewHint();
    game.reset(); if (startFen) game.load(startFen);
    loadedMode = false; selected = null; clearJudge(); clearArrow();
    render(); rebuildMoveList(); highlightReview(); triggerAnalysis();
    renderReview(); selectListed = false; switchTab("import");
  }


  