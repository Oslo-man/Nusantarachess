/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
  function fenAnalyze(fen: string) {
    if (!new Chess().load(fen)) { showImportError("FEN tidak valid", "Periksa kembali kode FEN yang ditempel."); return; }
    resetSession(fen);
    switchTab("moves");
  }
  document.getElementById("copyFen").onclick = () => { navigator.clipboard.writeText(game.fen()); setStatus("FEN disalin"); };
  function updateFenOut() { const o = document.getElementById("fenOut"); if (o) o.textContent = game.fen(); }

  const OPENINGS = [
    ["e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7", "Ruy Lopez: Closed"],
    ["e4 e5 Nf3 Nc6 Bb5 a6 Ba4", "Ruy Lopez: Morphy Defense"],
    ["e4 e5 Nf3 Nc6 Bb5 a6 Bxc6", "Ruy Lopez: Exchange Variation"],
    ["e4 e5 Nf3 Nc6 Bb5 Nf6", "Ruy Lopez: Berlin Defense"],
    ["e4 e5 Nf3 Nc6 Bb5", "Ruy Lopez"],
    ["e4 e5 Nf3 Nc6 Bc4 Bc5 b4", "Italian: Evans Gambit"],
    ["e4 e5 Nf3 Nc6 Bc4 Bc5", "Italian: Giuoco Piano"],
    ["e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5", "Italian: Fried Liver Attack"],
    ["e4 e5 Nf3 Nc6 Bc4 Nf6", "Italian: Two Knights Defense"],
    ["e4 e5 Nf3 Nc6 Bc4", "Italian Game"],
    ["e4 e5 Nf3 Nc6 d4 exd4 Nxd4", "Scotch Game"],
    ["e4 e5 Nf3 Nc6 d4", "Scotch Game"],
    ["e4 e5 Nf3 Nc6 Nc3 Nf6", "Four Knights Game"],
    ["e4 e5 Nf3 Nf6", "Petrov Defense"],
    ["e4 e5 Nf3 d6", "Philidor Defense"],
    ["e4 e5 Bc4", "Bishop's Opening"],
    ["e4 e5 Nc3", "Vienna Game"],
    ["e4 e5 f4", "King's Gambit"],
    ["e4 e5 d4 exd4 Qxd4", "Center Game"],
    ["e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6", "Sicilian: Najdorf"],
    ["e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6", "Sicilian: Dragon"],
    ["e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6", "Sicilian: Accelerated Dragon"],
    ["e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5", "Sicilian: Sveshnikov"],
    ["e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6", "Sicilian: Kan"],
    ["e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6", "Sicilian: Taimanov"],
    ["e4 c5 Nf3 d6", "Sicilian Defense"],
    ["e4 c5 Nf3 Nc6", "Sicilian Defense"],
    ["e4 c5 Nf3 e6", "Sicilian Defense"],
    ["e4 c5 c3", "Sicilian: Alapin"],
    ["e4 c5 Nc3", "Sicilian: Closed"],
    ["e4 c5 d4 cxd4 c3", "Sicilian: Smith-Morra Gambit"],
    ["e4 c5", "Sicilian Defense"],
    ["e4 e6 d4 d5 Nc3 Bb4", "French: Winawer"],
    ["e4 e6 d4 d5 Nc3 Nf6", "French: Classical"],
    ["e4 e6 d4 d5 e5", "French: Advance"],
    ["e4 e6 d4 d5 exd5", "French: Exchange"],
    ["e4 e6 d4 d5 Nd2", "French: Tarrasch"],
    ["e4 e6", "French Defense"],
    ["e4 c6 d4 d5 e5", "Caro-Kann: Advance"],
    ["e4 c6 d4 d5 exd5", "Caro-Kann: Exchange"],
    ["e4 c6 d4 d5 Nc3 dxe4 Nxe4", "Caro-Kann: Classical"],
    ["e4 c6", "Caro-Kann Defense"],
    ["e4 d5 exd5 Qxd5", "Scandinavian Defense"],
    ["e4 d5", "Scandinavian Defense"],
    ["e4 Nf6", "Alekhine Defense"],
    ["e4 d6 d4 Nf6", "Pirc Defense"],
    ["e4 d6", "Pirc Defense"],
    ["e4 g6", "Modern Defense"],
    ["d4 d5 c4 e6 Nc3 Nf6", "Queen's Gambit Declined"],
    ["d4 d5 c4 e6", "Queen's Gambit Declined"],
    ["d4 d5 c4 dxc4", "Queen's Gambit Accepted"],
    ["d4 d5 c4 c6", "Slav Defense"],
    ["d4 d5 c4", "Queen's Gambit"],
    ["d4 Nf6 c4 e6 Nc3 Bb4", "Nimzo-Indian Defense"],
    ["d4 Nf6 c4 e6 Nf3 b6", "Queen's Indian Defense"],
    ["d4 Nf6 c4 e6 g3", "Catalan Opening"],
    ["d4 Nf6 c4 g6 Nc3 d5", "Grünfeld Defense"],
    ["d4 Nf6 c4 g6", "King's Indian Defense"],
    ["d4 Nf6 c4 c5 d5 b5", "Benko Gambit"],
    ["d4 Nf6 c4 c5 d5 e6", "Benoni Defense"],
    ["d4 f5", "Dutch Defense"],
    ["d4 Nf6 Bg5", "Trompowsky Attack"],
    ["d4 d5 Bf4", "London System"],
    ["d4 Nf6 Nf3 d5 Bf4", "London System"],
    ["d4 Nf6 Nf3 g6 Bf4", "London System"],
    ["d4 Nf6 Nf3 e6 Bf4", "London System"],
    ["d4 d5 Nf3 Nf6 e3 e6 Bd3", "Colle System"],
    ["d4 d5 e4", "Blackmar-Diemer Gambit"],
    ["d4 d5", "Queen's Pawn Game"],
    ["d4 Nf6", "Indian Game"],
    ["c4 e5", "English: Reversed Sicilian"],
    ["c4 c5", "English: Symmetrical"],
    ["c4", "English Opening"],
    ["Nf3 d5 g3", "King's Indian Attack"],
    ["Nf3 d5 c4", "Réti Opening"],
    ["Nf3", "Réti Opening"],
    ["b3", "Nimzo-Larsen Attack"],
    ["f4", "Bird's Opening"],
    ["g3", "King's Fianchetto Opening"],
    ["b4", "Polish Opening"],
    ["e4", "King's Pawn Opening"],
    ["d4", "Queen's Pawn Opening"]
  ];
  function detectOpening(sans: any) {
    let best = null;
    for (const [line, name] of OPENINGS) {
      const toks = line.split(" ");
      if (toks.length > sans.length) continue;
      if (toks.every((t, i) => t === sans[i])) {
        if (!best || toks.length > best.plies) best = { name, plies: toks.length };
      }
    }
    return best;
  }
  function isBookLine(sans: any) {
    if (!sans || !sans.length || startFen) return false;
    const norm = sans.map((s: any) => String(s || "").replace(/[+#]/g, ""));
    for (const [line] of OPENINGS) {
      const toks = line.split(" ");
      if (toks.length < norm.length) continue;
      let same = true;
      for (let i = 0; i < norm.length; i++) { if (toks[i] !== norm[i]) { same = false; break; } }
      if (same) return true;
    }
    return false;
  }
  function extractGameMeta(header: any, sans: any) {
    const meta: Record<string, any> = {
      opening: null, eco: null, bookPlies: 0,
      white: null, black: null, result: null,
      whiteElo: null, blackElo: null, date: null
    };
    if (header.White && header.White !== "?") meta.white = header.White;
    if (header.Black && header.Black !== "?") meta.black = header.Black;
    if (header.Result && header.Result !== "*") meta.result = header.Result;
    if (header.WhiteElo && header.WhiteElo !== "?") meta.whiteElo = header.WhiteElo;
    if (header.BlackElo && header.BlackElo !== "?") meta.blackElo = header.BlackElo;
    if (header.Date && header.Date !== "????.??.??" && header.Date !== "?") meta.date = header.Date;
    if (header.ECO) meta.eco = header.ECO;
    if (header.Opening && header.Opening !== "?") meta.opening = header.Opening;

    if (!meta.opening && header.ECOUrl) {
      const u = header.ECOUrl.match(/bot\.com\/openings\/([^/?#\s]+)/i);
      if (u) {
        const toks = decodeURIComponent(u[1]).split("-");
        const words = []; for (const t of toks) { if (/^\d/.test(t)) break; words.push(t); }
        if (words.length) meta.opening = words.join(" ");
      }
    }
    const hit = sans && sans.length ? detectOpening(sans) : null;
    if (hit) { meta.bookPlies = hit.plies; if (!meta.opening) meta.opening = hit.name; }
    return meta;
  }

  async function runReview() {
    if (!fullHistory || !fullHistory.length) { alert("Belum ada langkah. Muat permainan lewat panel Analisis Game atau coba langkah langsung di papan."); return; }
    const depth = +(document.getElementById("reviewDepth") as HTMLInputElement).value;
    const wasLocked = treeLocked;
    treeLocked = true;
    const ctl: any = { cancel: null, cancelled: false };
    document.getElementById("scanCancel").onclick = () => { ctl.cancelled = true; if (ctl.abortCloud) ctl.abortCloud(); if (ctl.cancel) ctl.cancel(); };
    const bar = document.getElementById("progressbar");
    const prevTab = curTab === "loading" ? "moves" : curTab;
    const fmtEl = document.getElementById("loadingFmt");
    const srcInfo = IMPORT_INFO[curImport];
    if (fmtEl) fmtEl.textContent = importedGame ? (srcInfo && srcInfo.platform ? "PGN" : (document.getElementById("fmtLabel").textContent || "PGN").toUpperCase()) : "PAPAN";
    bar.style.width = "0";
    switchTab("loading");

    try {
      const base = new Chess(); if (startFen) base.load(startFen);
      const fens = [base.fen()]; const verbose = [];
      for (const san of fullHistory) { const mv = base.move(san); verbose.push(mv); fens.push(base.fen()); }
      const n = verbose.length;
      const isCustomStart = !!startFen;
      gameMeta = gameMeta || (isCustomStart ? { opening: null, eco: null, bookPlies: 0 } : extractGameMeta("", fullHistory));

      bar.style.width = "2%";
      const cloudAbort = new AbortController();
      ctl.abortCloud = () => cloudAbort.abort();
      const cloudP = isCustomStart ? Promise.resolve(new Array(fens.length).fill(false))
        : cloudBook(fens, 12, 4000, cloudAbort.signal).catch(() => new Array(fens.length).fill(false));
      const res = await analyzePool(fens, depth, 2, (done: any, total: any) => { bar.style.width = Math.round(done / total * 100) + "%"; }, null, ctl);
      const bookHits = await cloudP;
      if (ctl.cancelled || !res) { treeLocked = wasLocked; bar.style.width = "0"; switchTab(prevTab); return; }
      const evals = res.map((r: any) => r ? r.ev : 0);
      const bestUci = res.slice(0, n).map((r: any) => r ? r.bm : null);
      const scores = res.map((r: any) => r && r.se ? r.se : ["cp", "0"]);
      const secondEvals = res.slice(0, n).map((r: any) => (r && r.second !== null && r.second !== undefined) ? r.second : null);
      reviewEvals = evals;

      const verboseForServer = verbose.map(mv => ({
        from: mv.from, to: mv.to, promotion: mv.promotion || null,
        captured: !!mv.captured, capturedType: mv.captured || null
      }));

      const report = await api.analyzeGameReview({
        fens, moves: verboseForServer, evals, bestUci, secondEvals, scores,
        bookHits, bookPlies: (gameMeta && gameMeta.bookPlies) || 0,
        isCustomStart
      });
      if (ctl.cancelled) { treeLocked = wasLocked; bar.style.width = "0"; switchTab(prevTab); return; }
      reviewReport = report;
      for (let i = 0; i <= n; i++) {
        const nd = mainNodes[i];
        if (!nd) continue;
        nd.sc = scores[i];
        nd.scDepth = depth;
        nd.sc2 = i < n && res[i] && res[i].se2 ? res[i].se2 : null;
        nd.sc2Depth = depth;
        nd.best = i < n ? (bestUci[i] || null) : null;
        if (i > 0 && report.reviewData && report.reviewData[i - 1]) nd.sac = !!report.reviewData[i - 1].sacrifice;
      }
      rebuildMoveList();

      bar.style.width = "0";
      renderReview();
      if (startReviewAtZero) { startReviewAtZero = false; gotoPly(0); }
      else { render(); highlightReview(); }
      switchTab("review");
    } catch (err) {
      console.error(err);
      treeLocked = wasLocked;
      switchTab(prevTab);
      alert((err && err.message) ? err.message : "Gagal menjalankan ulasan permainan. Pastikan server berjalan.");
    }
  }

  