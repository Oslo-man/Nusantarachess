/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
function sumCatIcon(cat: any, size: number) {
    const m = CATS[cat];
    return `<img src="${m.img}" width="${size}" height="${size}" alt="${m.label}" title="${m.label}" draggable="false" onerror="iconFallback(this,'${cat}')">`;
}

function sumImportantCat(data: any, i: any, lastBook: any) {
    const d = data[i];
    if (!d) return null;
    if (i === lastBook) return "book";
    if (d.cat === "best" && data[i - 1] && data[i - 1].cat === "inaccuracy") return "best";
    if (d.cat === "blunder" || d.cat === "mistake" || d.cat === "miss" || d.cat === "great" || d.cat === "brilliant") return d.cat;
    return null;
}

let chartHover = NaN;
function chartMoveY(cp: number) {
    if (Math.abs(cp) >= 90000) return cp > 0 ? 1 : 0;
    const raw = ((cp + 400) * (0.925 - 0.075)) / 800 + 0.075;
    return Math.min(Math.max(raw, 0.075), 0.925);
}
function chartIndexAt(box: any, e: any) {
    const n = reviewEvals.length - 1, r = box.getBoundingClientRect();
    return Math.max(0, Math.min(n, Math.round((e.clientX - r.left) / (r.width / n))));
}
function paintCharts() {
    document.querySelectorAll(".bc-chart").forEach((box: any) => {
        const slot = box.closest(".bc-chart-slot");
        if (!reviewReport || !reviewEvals || reviewEvals.length < 2) { box.innerHTML = ""; if (slot) slot.hidden = true; return; }
        if (slot) slot.hidden = false;
        const w = box.clientWidth; if (w < 10) return;
        if (!box.dataset.bound) {
            box.dataset.bound = "1";
            box.addEventListener("pointermove", (e: any) => { if (e.pointerType === "touch") return; chartHover = chartIndexAt(box, e); paintCharts(); });
            box.addEventListener("pointerleave", () => { chartHover = NaN; paintCharts(); });
            box.addEventListener("click", (e: any) => { const i = chartIndexAt(box, e); if (i !== ply || !cur.main) gotoPly(i); });
        }
        const h = 96, n = reviewEvals.length - 1;
        const X = (i: number) => (i / n) * w, Y = (i: number) => h * (1 - chartMoveY(reviewEvals[i]));
        let d = `M 0 ${h * 0.5}`;
        for (let i = 0; i <= n; i++) d += ` L ${X(i).toFixed(2)} ${Y(i).toFixed(2)}`;
        d += ` L ${w} ${h} L 0 ${h}`;
        const data = reviewReport.reviewData || [];
        const onMain = !!cur && cur.main, p = Math.max(0, Math.min(n, ply));
        const rd = onMain && p > 0 ? data[p - 1] : null;
        const curColor = rd && rd.cat !== "forced" ? `var(--h-${rd.cat})` : "var(--h-forced)";
        const lastBook = lastBookIdx();
        let dots = "";
        for (let i = 1; i <= n; i++) {
            const cat = sumImportantCat(data, i - 1, lastBook);
            if (cat) dots += `<circle cx="${X(i).toFixed(2)}" cy="${Y(i).toFixed(2)}" r="5" fill="var(--h-${cat})"/>`;
            else if (onMain && i === p) dots += `<circle cx="${X(i).toFixed(2)}" cy="${Y(i).toFixed(2)}" r="5" fill="${curColor}"/>`;
        }
        const hov = isNaN(chartHover) ? "" : `<line x1="${X(chartHover)}" y1="${h}" x2="${X(chartHover)}" y2="0" stroke="#939291" stroke-opacity=".5" stroke-width="2"/>`;
        const curLine = (onMain && p > 0) ? `<line x1="${X(p)}" y1="${h}" x2="${X(p)}" y2="0" stroke="${curColor}" stroke-width="4"/>` : "";
        box.innerHTML = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Grafik evaluasi permainan"><path fill="#ffffff" d="${d}"/>` +
            `<line x1="0" y1="${h / 2}" x2="${w}" y2="${h / 2}" stroke="#939291" stroke-opacity=".75" stroke-width="2"/>${hov}${curLine}${dots}</svg>`;
    });
}

const SUM_PHASES_SHORT: Record<string, string> = { opening: "Pembukaan", middlegame: "Permainan Tengah", endgame: "Permainan Akhir" };

function sumPlayersAccuracyHtml(accuracy: any) {
    const wName = (gameMeta && gameMeta.white) || "Putih", bName = (gameMeta && gameMeta.black) || "Hitam";
    const box = (v: any, side: any) => `<div class="bc-ratingbox ${side}">${v == null ? "—" : v.toFixed(1)}</div>`;
    return `<div class="bc-sum-block">
      <div class="bc-sum-names"><div class="bc-sum-name"><span>${esc(wName)}</span></div><div class="bc-sum-name"><span>${esc(bName)}</span></div></div>
      <div class="bc-sum-row"><span class="bc-sum-label">Pemain</span>
        <div class="bc-sum-pair"><div class="bc-sum-avatar white" data-side="w"></div><div class="bc-sum-avatar black" data-side="b"></div></div></div>
      <div class="bc-sum-row"><span class="bc-sum-label">Akurasi</span>
        <div class="bc-sum-pair">${box(accuracy.w, "white")}${box(accuracy.b, "black")}</div></div>
    </div>`;
}
function paintSumAvatars(root: any) {
    root.querySelectorAll(".bc-sum-avatar").forEach((av: any) => {
        const nm = (gameMeta && (av.dataset.side === "w" ? gameMeta.white : gameMeta.black)) || "";
        paintAvatar(av, nm, 60);
    });
}

function sumRatingCountHtml(counts: any) {
    return `<div class="bc-counts">${ALL_ORDER.map((c: any) => `<div class="bc-count-row">
        <span class="bc-sum-label">${CATS[c].label}</span>
        <div class="bc-count-vals" style="--c:var(--h-${c})"><span class="w">${counts.w[c]}</span>${sumCatIcon(c, 30)}<span class="b">${counts.b[c]}</span></div>
      </div>`).join("")}</div>`;
}

function topElo(v: any) { return v == null ? "—" : (v > 3000 ? "3000+" : String(v)); }
function sumGameRatingHtml(estimatedRating: any, phaseAccuracy: any) {
    const wElo = estimatedRating ? estimatedRating.w : null, bElo = estimatedRating ? estimatedRating.b : null;
    const eloBox = (v: any, side: any) => `<div class="bc-ratingbox ${side}">${topElo(v)}</div>`;
    let phaseRows = "";
    if (phaseAccuracy) {
        phaseRows = PHASE_ORDER.map((key: any) => {
            const gradeBtn = (side: any, cat: any) => {
                if (!cat) return `<span class="phase-grade-btn empty" title="Langkah belum cukup untuk menilai fase ini.">-</span>`;
                const m = CATS[cat];
                return `<button type="button" class="phase-grade-btn" data-phase="${key}" data-side="${side}" title="${side === "w" ? "Putih" : "Hitam"} · ${m.label}">${sumCatIcon(cat, 30)}</button>`;
            };
            return `<div class="bc-sum-row"><span class="bc-sum-label">${PHASE_LABEL[key]}</span>
              <div class="bc-sum-pair"><div class="bc-sum-cell">${gradeBtn("w", phaseAccuracy.w[key].grade)}</div><div class="bc-sum-cell">${gradeBtn("b", phaseAccuracy.b[key].grade)}</div></div></div>`;
        }).join("");
    }
    return `<div class="bc-sum-block">
      <div class="bc-sum-row"><span class="bc-sum-label">Rating<span class="bc-only-wide"> Permainan</span></span><div class="bc-sum-pair">${eloBox(wElo, "white")}${eloBox(bElo, "black")}</div></div>
      ${phaseRows}
    </div>`;
}

function syncReviewHint() { }
  function renderReview() {
    const el = document.getElementById("reviewList");
    const empty = document.getElementById("summaryEmpty");
    syncReviewHint(); updateTabs();
    if (!reviewReport) { el.innerHTML = ""; if (empty) empty.hidden = false; paintCharts(); return; }
    if (empty) empty.hidden = true;
    const { accuracy: reviewAccuracy, estimatedRating, categoryCounts: counts, phaseAccuracy } = reviewReport;
    const openingHtml = (gameMeta && gameMeta.opening) ?
      `<div class="opening-line">${esc(gameMeta.opening)}${gameMeta.eco ? ` <span class="num">(${esc(gameMeta.eco)})</span>` : ""}</div>` : "";
    const parts = [
      reviewAccuracy ? sumPlayersAccuracyHtml(reviewAccuracy) : "",
      counts ? sumRatingCountHtml(counts) : "",
      (reviewAccuracy || phaseAccuracy) ? sumGameRatingHtml(estimatedRating, phaseAccuracy) : ""
    ].filter(Boolean);
    const shareBtn = reviewAccuracy ? `<button type="button" class="bc-secondary bc-share" id="shareBtn">Bagikan kartu laporan</button>` : "";
    el.innerHTML = openingHtml + `<div class="bc-chart"></div>` + parts.join('<hr class="bc-hr">') +
      `<div id="labelDetailBox" class="ld-box"></div>` + shareBtn;
    paintSumAvatars(el);
    const sb = document.getElementById("shareBtn"); if (sb) sb.onclick = shareReport;
    el.querySelectorAll(".phase-grade-btn[data-phase]").forEach(b => b.addEventListener("click", () => showPhaseAccuracy((b as HTMLElement).dataset.phase, (b as HTMLElement).dataset.side)));
    paintCharts();
  }

  function showPhaseAccuracy(phase: any, side: any) {
    const box = document.getElementById("labelDetailBox");
    if (!box || !reviewReport || !reviewReport.phaseAccuracy) return;
    const info = reviewReport.phaseAccuracy[side][phase];
    const acc = info.accuracy, cat = info.grade;
    const m = cat ? CATS[cat] : null;
    let idxCount = 0;
    for (let i = 0; i < fullHistory.length; i++) {
      if (reviewReport.phases[i] === phase && reviewReport.reviewData[i].moverWhite === (side === "w")) idxCount++;
    }
    box.innerHTML = `<div class="ld-head">${m ? `<img src="${m.img}" alt="${m.label}" onerror="iconFallback(this,'${cat}')">` : ""}<b>${PHASE_LABEL[phase]} · ${side === "w" ? "Putih" : "Hitam"}</b>
        <button type="button" class="ld-close" id="ldClose" aria-label="Tutup"><span class="ui-ico ui-ico-close" aria-hidden="true"></span></button></div>
      <div class="ld-stats"><span>Akurasi fase ini: <b>${acc == null ? "—" : acc.toFixed(1) + "%"}</b>${m ? ` · ${m.label}` : ""}</span>
      <span>${idxCount} langkah dihitung pada fase ini</span></div>`;
    box.style.display = "block";
    const closeBtn = document.getElementById("ldClose");
    if (closeBtn) closeBtn.onclick = () => { box.style.display = "none"; };
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function highlightReview() { paintCharts(); }

  const _catImgs: Record<string, HTMLImageElement> = {};
  function catIconImg(cat: string) {
    if (!_catImgs[cat]) { const im = new Image(); im.src = "/" + CATS[cat].img; _catImgs[cat] = im; }
    return _catImgs[cat];
  }
  ALL_ORDER.forEach((k: any) => catIconImg(k));

  function buildReportCard() {
    const { reviewData, accuracy: reviewAccuracy, categoryCounts: counts } = reviewReport;
    const W = 720, H = 920, c = document.createElement("canvas"); c.width = W; c.height = H;
    const x = c.getContext("2d");
    const bg = x.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#2c2825"); bg.addColorStop(1, "#1a1815");
    x.fillStyle = bg; x.fillRect(0, 0, W, H);
    const glow = x.createRadialGradient(W * 0.75, 60, 10, W * 0.75, 60, 420);
    glow.addColorStop(0, "rgba(212,175,55,0.22)"); glow.addColorStop(1, "rgba(212,175,55,0)");
    x.fillStyle = glow; x.fillRect(0, 0, W, H);
    const tg = x.createLinearGradient(W * 0.2, 0, W * 0.8, 0); tg.addColorStop(0, "#d4af37"); tg.addColorStop(1, "#f0d060");
    x.textAlign = "center";
    x.font = "800 38px Georgia,serif"; x.fillStyle = tg;
    x.fillText("Nusantara Chess Game Review", W / 2, 66);
    x.font = "600 14px Georgia,serif"; x.fillStyle = "#b8b2a8";
    x.fillText("LAPORAN PERMAINAN", W / 2, 94);
    const wName = (gameMeta && gameMeta.white) || "Putih", bName = (gameMeta && gameMeta.black) || "Hitam";
    x.font = "700 24px Georgia,serif"; x.fillStyle = "#ffffff";
    x.fillText(`${wName}  vs  ${bName}`, W / 2, 148);
    let y = 176;
    if (gameMeta && gameMeta.result) { x.font = "600 16px Georgia,serif"; x.fillStyle = "#b8b2a8"; x.fillText(gameMeta.result, W / 2, y); y += 28; }
    if (gameMeta && gameMeta.opening) { x.font = "600 15px Georgia,serif"; x.fillStyle = "#d4af37"; x.fillText("‎  " + gameMeta.opening, W / 2, y); }
    const drawAcc = (cx: any, label: any, v: any) => {
      x.font = "600 15px Georgia,serif"; x.fillStyle = "#b8b2a8"; x.fillText(label, cx, 258);
      x.font = "800 44px Georgia,serif"; x.fillStyle = (v == null) ? "#b8b2a8" : accColorOf(v);
      x.fillText(v == null ? "—" : v.toFixed(1) + "%", cx, 306);
      const e = reviewReport.estimatedRating ? (label === "PUTIH" ? reviewReport.estimatedRating.w : reviewReport.estimatedRating.b) : null;
      x.font = "600 14px Georgia,serif"; x.fillStyle = "#b8b2a8";
      x.fillText(e == null ? "" : "≈ " + topElo(e) + " Elo", cx, 330);
    };
    drawAcc(W * 0.3, "PUTIH", reviewAccuracy && reviewAccuracy.w);
    drawAcc(W * 0.7, "HITAM", reviewAccuracy && reviewAccuracy.b);
    const cats = ALL_ORDER;
    let ty = 384;
    x.font = "700 13px Georgia,serif"; x.fillStyle = "#b8b2a8";
    x.textAlign = "right"; x.fillText("P", W - 190, ty); x.fillText("H", W - 120, ty);
    ty += 24;
    for (const ct of cats) {
      const m = CATS[ct];
      const catImg = catIconImg(ct);
      if (catImg && catImg.complete && catImg.naturalWidth) x.drawImage(catImg, 180, ty - 15, 20, 20);
      else { x.beginPath(); x.arc(190, ty - 5, 10, 0, 7); x.fillStyle = m.color; x.fill(); }
      x.font = "600 15px Georgia,serif"; x.fillStyle = "#e8e4dc"; x.textAlign = "left"; x.fillText(m.label, 212, ty);
      x.font = "700 15px Georgia,serif"; x.fillStyle = m.color; x.textAlign = "right";
      x.fillText(String(counts.w[ct]), W - 190, ty); x.fillText(String(counts.b[ct]), W - 120, ty);
      ty += 26;
    }
    const gx = 60, gy = 650, gw = W - 120, gh = 160;
    x.fillStyle = "#100f0e"; x.fillRect(gx, gy, gw, gh);
    if (reviewEvals && reviewEvals.length > 1) {
      const n: any = reviewEvals.length;
      const px = (i: any) => gx + i / (n - 1) * gw, py = (cp: any) => gy + gh - (winPct(cp) / 100) * gh;
      x.beginPath(); x.moveTo(gx, gy + gh);
      for (let i = 0; i < n; i++) x.lineTo(px(i), py(reviewEvals[i]));
      x.lineTo(gx + gw, gy + gh); x.closePath();
      x.fillStyle = "rgba(221,208,178,0.92)"; x.fill();
      x.strokeStyle = "rgba(255,255,255,0.18)"; x.setLineDash([4, 4]);
      x.beginPath(); x.moveTo(gx, gy + gh / 2); x.lineTo(gx + gw, gy + gh / 2); x.stroke(); x.setLineDash([]);
      const DOT: Record<string, any> = { brilliant: 1, great: 1, inaccuracy: 1, mistake: 1, miss: 1, blunder: 1 };
      for (let i = 0; i < reviewData.length; i++) {
        const d = reviewData[i];
        if (d && DOT[d.cat]) {
          x.beginPath(); x.arc(px(i + 1), py(reviewEvals[i + 1]), 4.5, 0, 7);
          x.fillStyle = CATS[d.cat].color; x.fill();
          x.strokeStyle = "#262626"; x.lineWidth = 1.5; x.stroke();
        }
      }
    }
    x.textAlign = "center"; x.font = "600 14px Georgia,serif"; x.fillStyle = "#b8b2a8";
    x.fillText("Ulasan permainan catur gratis — Nusantara Chess Game Review", W / 2, H - 36);
    return c;
  }
  async function shareReport() {
    if (!reviewReport) { alert("Jalankan pemindaian terlebih dahulu."); return; }
    const canvas = buildReportCard();
    canvas.toBlob(async blob => {
      if (!blob) return;
      let copied = false;
      try {
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]); copied = true;
        }
      } catch (e) {}
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "laporan-ulasan-catur.png"; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      setStatus(copied ? "Kartu laporan disalin & diunduh" : "Kartu laporan diunduh");
    }, "image/png");
  }


  function updateBoardSize() {
    const root = document.getElementById("bcRoot"), main = document.getElementById("bcMain");
    if (!root || !main) return;
    const W = root.clientWidth;
    if (!W) return;
    const topOff = root.getBoundingClientRect().top + window.scrollY;
    const bb = document.querySelector(".site-bottombar") as HTMLElement | null;
    const bottomH = bb && getComputedStyle(bb).display !== "none" ? bb.offsetHeight : 0;
    const H = Math.max(300, window.innerHeight - topOff - bottomH);
    const vertical = W < 1100, navTop = W < 516;
    const gap = vertical ? 6 : 10;
    const pt = document.getElementById("playerTop");
    const status = (pt && pt.offsetHeight) || (vertical ? 28 : 44);
    const evalW = 36, menuW = 400, boardMenuW = 17, gapW = 8, pad = 16;
    const round8 = (n: number) => Math.round(n / 8) * 8;
    let size: number;
    if (navTop) {
      const p = 8, buttonsH = 40;
      const byH = H - (p + evalW + gapW + status + gapW + gapW + status + gap + buttonsH + gap + boardMenuW + p);
      size = round8(Math.min(byH, W - 2 * p));
    } else if (vertical) {
      const p = 8, buttonsH = 69;
      const byH = H - (status * 2 + gap * 3 + p * 2 + buttonsH);
      size = round8(Math.min(byH, W - (p + 28 + gap + gapW + boardMenuW + p)));
    } else {
      const buttonsH = 69;
      const byH = (H - 2 * pad) - (status * 2 + gap * 2) - (buttonsH + gap);
      size = round8(Math.min(byH, W - (pad + evalW + gap + gapW + boardMenuW + gapW + menuW + pad)));
    }
    size = Math.max(160, size);
    main.style.setProperty("--bsize", size + "px");
    main.style.setProperty("--gap", gap + "px");
    main.style.setProperty("--bc-h", H + "px");
  }
  ENGINE.onReady = () => { if (boardEl.isConnected) triggerAnalysis(); };
  updateBoardSize();
  requestAnimationFrame(updateBoardSize);
  { const root = document.getElementById("bcRoot");
    const onSize = () => { if (!boardEl.isConnected) { window.removeEventListener("resize", onSize); return; } updateBoardSize(); };
    window.addEventListener("resize", onSize);
    if (root && typeof ResizeObserver !== "undefined") new ResizeObserver(onSize).observe(root); }
  render();
  rebuildMoveList();
  updateTabs();
  { let dots = 0;
    const tick = setInterval(() => {
      if (!boardEl.isConnected) { clearInterval(tick); return; }
      if (curTab !== "loading" && curTab !== "select") return;
      dots = (dots + 1) % 4;
      const t = ".".repeat(dots);
      ["loadingDots", "loadingDots2", "selDots"].forEach(id => { const e = document.getElementById(id); if (e) e.textContent = t; });
    }, 300);
    const onResize = () => { if (!boardEl.isConnected) { window.removeEventListener("resize", onResize); return; } paintCharts(); };
    window.addEventListener("resize", onResize); }
  initSounds();
  initEngine();
  setTimeout(() => { if (ENGINE.isReady()) triggerAnalysis(); else setTimeout(triggerAnalysis, 1500); }, 800);

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    const registerSw = () => navigator.serviceWorker.register("sw.js").catch(() => {});
    if (document.readyState !== "complete") window.addEventListener("load", registerSw, { once: true });
  }
}





