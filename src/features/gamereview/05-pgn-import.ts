/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
function loadGameFromPgn(pgn: any) {
    if (!pgn) return false;
    const g = new Chess();
    if (!g.load_pgn(pgn, { sloppy: true })) { return false; }
    const sans = g.history();

    const header = g.header();
    pgnHeader = {};
    for (const k of Object.keys(header)) pgnHeader[k] = String(header[k]).replace(/\\(["\\])/g, "$1");
    startFen = header.FEN || null;
    gameMeta = extractGameMeta(header, startFen ? [] : sans);
    renderGameInfoPanel(gameMeta);

    if (autoPlaying) stopAutoPlay();
    buildTreeFromSans(sans);
    importedGame = true; startReviewAtZero = true;
    reviewReport = null; reviewEvals = null; selected = null; clearJudge();
    document.getElementById("reviewList").innerHTML = "";
    syncReviewHint();
    gotoPly(sans.length);
    return true;
  }
  function analyzePgnText(pgn: string) {
    if (!loadGameFromPgn(pgn)) showImportError("PGN tidak valid", "PGN tersebut tidak dapat dibaca.");
    else { scrollToBoard(); runReview(); }
  }

  (async function loadFromSavedGameParam() {
    const params = new URLSearchParams(location.search);
    const publicGameId = params.get("publicGameId");
    const savedGameId = params.get("savedGameId") || publicGameId;
    const fromHandoff = params.get("handoff") === "1";
    const autoScan = params.get("scan") === "1";
    if (!savedGameId && !fromHandoff) return;

    await Promise.resolve();

    let handoff = null;
    if (fromHandoff) {
      try {
        const raw = sessionStorage.getItem((window.NusantaraChess && window.NusantaraChess.REVIEW_HANDOFF_KEY) || "nusantarachess.reviewHandoff");
        handoff = raw ? JSON.parse(raw) : null;
        if (handoff && handoff.ts && Date.now() - handoff.ts > 24 * 3600 * 1000) handoff = null;
      } catch (_) { handoff = null; }
    }

    let pgn = null;
    if (savedGameId) {
      try {
        const savedGame = publicGameId ? await api.getPublicGameDetail(publicGameId) : await api.getGameDetail(savedGameId);
        pgn = savedGame && savedGame.pgn;
      } catch (err) {
        if (!(handoff && handoff.pgn)) { alert(err.message || "Gagal memuat game tersimpan."); return; }
      }
    }
    let loaded = pgn ? loadGameFromPgn(pgn) : false;
    if (!loaded && handoff && handoff.pgn) loaded = loadGameFromPgn(handoff.pgn);
    if (!loaded) {
      alert(pgn || (handoff && handoff.pgn) ? "PGN dari game ini tidak dapat dibaca." : "Game tidak ditemukan.");
      return;
    }

    if (handoff) {
      if (handoff.playerColor) {
        const wantFlip = handoff.playerColor === "b";
        if (wantFlip !== flipped) { flipped = wantFlip; render(); paintEvalBar(); }
      }
      if (typeof st !== "undefined" && st) st.textContent = "Dimuat — menganalisis…";
      runReview();
    }
    else if (savedGameId && autoScan) {
      if (typeof st !== "undefined" && st) st.textContent = "Dimuat — menganalisis…";
      try { params.delete("scan"); history.replaceState(history.state, "", location.pathname + (params.toString() ? "?" + params : "") + location.hash); } catch (_) { }
      runReview();
    }
    scrollToBoard();
  })();

  const MONTHS_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const ARROW_SVG = '<svg width="20" height="20" viewBox="0 -4.5 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g stroke="none" fill="none" fill-rule="evenodd"><g transform="translate(-260 -6684)" class="bc-arrow-fill"><g transform="translate(56.000000, 160.000000)"><path d="M223.707692,6534.63378 L223.707692,6534.63378 C224.097436,6534.22888 224.097436,6533.57338 223.707692,6533.16951 L215.444127,6524.60657 C214.66364,6523.79781 213.397472,6523.79781 212.616986,6524.60657 L204.29246,6533.23165 C203.906714,6533.6324 203.901717,6534.27962 204.282467,6534.68555 C204.671211,6535.10081 205.31179,6535.10495 205.70653,6534.69695 L213.323521,6526.80297 C213.714264,6526.39807 214.346848,6526.39807 214.737591,6526.80297 L222.294621,6534.63378 C222.684365,6535.03868 223.317949,6535.03868 223.707692,6534.63378"/></g></g></g></svg>';
  const SEL_ERR = {
    user: ["Pengguna tidak ditemukan", "Periksa ejaan nama atau koneksi internet Anda."],
    games: ["Gagal mengambil permainan", "Periksa koneksi internet Anda atau coba lagi nanti."],
    api: ["Server mungkin memblokir permintaan berlebih", "Kurangi laju permintaan atau tunggu sebelum mencoba lagi."]
  };
  let selToken = 0;
  let selSite = "chesscom", selUser = "";
  let selDates: any[] = [], selGames: Record<number, any[]> = {}, selOpen = NaN;

  function detectSite(v: any) {
    v = (v || "").trim();
    let m = v.match(/lichess\.org\/@\/([^/?#\s]+)/i);
    if (m) return { user: m[1], site: "lichess" };
    m = v.match(/chess\.com\/(?:member|members|user)\/([^/?#\s]+)/i);
    if (m) return { user: m[1], site: "chesscom" };
    return { user: v.replace(/^@/, ""), site: null };
  }
  async function ccApi(url: any, ndjson?: boolean) {
    const r = await fetch(url, { headers: { Accept: ndjson ? "application/x-ndjson" : "application/json" } });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r;
  }
  function selShow(loading: boolean, what?: string) {
    (document.getElementById("selLoading") as HTMLElement).hidden = !loading;
    (document.getElementById("selContent") as HTMLElement).hidden = loading;
    if (what) document.getElementById("selWhat").textContent = what;
  }
  function stopSelecting() {
    selToken++; selectListed = false; selDates = []; selGames = {}; selOpen = NaN;
    document.getElementById("selMonths").innerHTML = "";
    updateTabs();
  }
  document.getElementById("selCancel").onclick = () => { stopSelecting(); switchTab("import"); };
  function failSelecting(err: any[], withApi?: boolean) {
    stopSelecting(); switchTab("import");
    showImportError(err[0], err[1] + (withApi ? " " + SEL_ERR.api[0] + ". " + SEL_ERR.api[1] : ""));
  }

  function startSelect(site: string, raw: string) {
    const d = detectSite(raw);
    if (!d.user) { showImportError(SEL_ERR.user[0], "Masukkan nama pengguna " + (site === "lichess" ? "Lichess" : "Chess.com") + "."); return; }
    selSite = d.site || site; selUser = d.user;
    const token = ++selToken;
    selDates = []; selGames = {}; selOpen = NaN;
    selectListed = true; selShow(true, "Arsip"); switchTab("select");
    loadArchives(token).catch(() => { if (token === selToken) failSelecting(SEL_ERR.user, selSite === "lichess"); });
  }
  async function loadArchives(token: number) {
    let dates: any[] = [];
    if (selSite === "chesscom") {
      const json = await (await ccApi(`https://api.chess.com/pub/player/${encodeURIComponent(selUser)}/games/archives`)).json();
      dates = json.archives.slice().reverse().map((url: string) => {
        const [year, month] = url.split("/").slice(-2);
        return { year: Number(year), month: Number(month), url };
      });
    } else {
      const first = await (await ccApi(`https://lichess.org/api/games/user/${encodeURIComponent(selUser)}?sort=dateAsc&max=1`, true)).json();
      const last = await (await ccApi(`https://lichess.org/api/games/user/${encodeURIComponent(selUser)}?sort=dateDesc&max=1`, true)).json();
      const a = new Date(first.createdAt), b = new Date(last.createdAt);
      let y = a.getFullYear(), m = a.getMonth();
      while (y < b.getFullYear() || (y === b.getFullYear() && m <= b.getMonth())) {
        const since = new Date(y, m, 1).getTime(), until = new Date(y, m + 1, 1).getTime() - 1;
        dates.push({ year: y, month: m + 1, url: `https://lichess.org/api/games/user/${encodeURIComponent(selUser)}?since=${since}&until=${until}&pgnInJson=true` });
        m++; if (m > 11) { m = 0; y++; }
      }
      dates.reverse();
    }
    if (token !== selToken) return;
    selDates = dates;
    renderSelectMonths();
  }
  function renderSelectMonths() {
    const link = document.getElementById("selUser") as HTMLAnchorElement;
    link.textContent = selUser;
    link.href = selSite === "lichess" ? "https://lichess.org/@/" + encodeURIComponent(selUser) : "https://www.chess.com/member/" + encodeURIComponent(selUser);
    document.getElementById("selTitleSuffix").textContent = "— permainan";
    document.getElementById("selMonths").innerHTML = selDates.map((dt, i) =>
      `<div class="bc-month-wrap"><button type="button" class="bc-month" data-i="${i}" aria-expanded="false">
        <span><b>${dt.year}</b> ${MONTHS_ID[dt.month - 1]}</span><span class="bc-month-arrow">${ARROW_SVG}</span></button>
        <div class="bc-month-games" data-i="${i}"></div></div>`).join("");
    document.querySelectorAll("#selMonths .bc-month").forEach((b: any) => b.onclick = () => toggleMonth(+b.dataset.i));
    selShow(false);
  }
  function toggleMonth(i: number) {
    const open = selOpen === i ? NaN : i;
    selOpen = open;
    document.querySelectorAll("#selMonths .bc-month").forEach((b: any) => {
      const on = +b.dataset.i === open;
      b.classList.toggle("open", on); b.setAttribute("aria-expanded", on ? "true" : "false");
    });
    document.querySelectorAll("#selMonths .bc-month-games").forEach((el: any) => { if (+el.dataset.i !== open) el.innerHTML = ""; });
    if (!isNaN(open)) loadMonthGames(open);
  }
  async function loadMonthGames(i: number) {
    const box = document.querySelector('#selMonths .bc-month-games[data-i="' + i + '"]') as HTMLElement;
    const token = selToken;
    if (!selGames[i]) {
      box.innerHTML = '<div class="bc-sel-simple">Memuat permainan<span class="bc-dots-sel"></span></div>';
      try {
        selGames[i] = selSite === "chesscom" ? await fetchChessComMonth(selDates[i].url) : await fetchLichessMonth(selDates[i].url);
      } catch (e) {
        if (token === selToken) { selOpen = NaN; box.innerHTML = ""; failSelecting(SEL_ERR.games, selSite === "lichess"); }
        return;
      }
      if (token !== selToken || selOpen !== i) return;
    }
    renderGamesTable(box, selGames[i]);
  }
  async function fetchChessComMonth(url: string) {
    const json = await (await ccApi(url)).json();
    return (json.games || []).filter((g: any) => g.pgn).reverse().map((g: any) => ({
      pgn: g.pgn, whiteName: g.white.username, blackName: g.black.username, whiteElo: g.white.rating, blackElo: g.black.rating,
      result: g.white.result === "win" ? "white" : g.black.result === "win" ? "black" : "draw",
      timestamp: (g.end_time || 0) * 1000, timeClass: g.time_class || ""
    }));
  }
  async function fetchLichessMonth(url: string) {
    const text = await (await ccApi(url, true)).text();
    return text.split("\n").map(l => { try { return JSON.parse(l); } catch (e) { return null; } }).filter((j: any) => j && j.pgn).map((j: any) => {
      const w = (j.players && j.players.white) || {}, b = (j.players && j.players.black) || {};
      return {
        pgn: j.pgn, whiteName: w.user ? w.user.name : (w.aiLevel ? "Stockfish AI" : "?"), blackName: b.user ? b.user.name : (b.aiLevel ? "Stockfish AI" : "?"),
        whiteElo: w.rating || "?", blackElo: b.rating || "?", result: j.winner || "draw", timestamp: j.createdAt || 0, timeClass: j.speed || ""
      };
    });
  }
  function renderGamesTable(box: HTMLElement, games: any[]) {
    if (!games.length) { box.innerHTML = '<div class="bc-sel-empty">Tidak ada permainan di bulan ini...</div>'; return; }
    const me = selUser.toLowerCase();
    const rows = games.map((g, gi) => {
      const whiteWon = g.result === "white", blackWon = g.result === "black";
      const isWin = (whiteWon && String(g.whiteName).toLowerCase() === me) || (blackWon && String(g.blackName).toLowerCase() === me);
      const isLoss = (whiteWon && String(g.whiteName).toLowerCase() !== me) || (blackWon && String(g.blackName).toLowerCase() !== me);
      const dt = new Date(g.timestamp);
      const sw = whiteWon ? "1" : blackWon ? "0" : "½", sb = blackWon ? "1" : whiteWon ? "0" : "½";
      const badge = isWin ? "win" : isLoss ? "loss" : "draw";
      return `<tr data-g="${gi}" tabindex="0" role="button" title="Kelas waktu: ${esc(g.timeClass)}">
        <td class="bc-gt-players"><div><i class="bc-gt-sq w${whiteWon ? " won" : ""}"></i>${esc(g.whiteName)} (${esc(g.whiteElo)})</div><div><i class="bc-gt-sq b${blackWon ? " won" : ""}"></i>${esc(g.blackName)} (${esc(g.blackElo)})</div></td>
        <td class="bc-gt-result"><div><div class="bc-gt-score"><span>${sw}</span><span>${sb}</span></div><div class="bc-gt-badge ${badge}"><span>${isWin ? "+" : isLoss ? "-" : "="}</span></div></div></td>
        <td class="bc-gt-date"><span class="bc-d-full">${MONTHS_ID[dt.getMonth()].slice(0, 3)} </span><b>${dt.getDate()}</b><span class="bc-d-full">, ${dt.getFullYear()}</span></td></tr>`;
    }).join("");
    box.innerHTML = `<div class="bc-gt-wrap"><table class="bc-gt"><thead><tr><th>Pemain</th><th>Hasil</th><th><span class="bc-d-full">Tanggal</span><span class="bc-d-day">Hari</span></th></tr></thead><tbody>${rows}</tbody></table></div>`;
    const open = (tr: any) => {
      const g = games[+tr.dataset.g];
      if (!g) return;
      if (!loadGameFromPgn(g.pgn)) { showImportError("PGN tidak valid", "Permainan ini tidak dapat dibaca."); return; }
      const blackIsUser = String(g.blackName).toLowerCase() === me && String(g.whiteName).toLowerCase() !== me;
      if (blackIsUser !== flipped) { flipped = blackIsUser; render(); paintEvalBar(); }
      selectListed = false; updateTabs();
      scrollToBoard();
      runReview();
    };
    box.querySelectorAll("tbody tr").forEach((tr: any) => {
      tr.onclick = () => open(tr);
      tr.onkeydown = (e: any) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(tr); } };
    });
  }
  function esc(s: any) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  function scrollToBoard() {
    if (window.matchMedia && window.matchMedia("(max-width:1079px)").matches) {
      try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { window.scrollTo(0, 0); }
    }
  }

  function paintAvatar(av: any, name: any, _size?: number) {
    const cu = NC.currentUser;
    const mine = cu && cu.username ? String(cu.username).toLowerCase() : "";
    NC.renderProfileAvatar(av, (mine && name && String(name).toLowerCase() === mine && cu.profilePhoto) ? cu.profilePhoto : null);
  }
  let playerBarKey = "";
  function fillPlayerBar(el: any, side: string) {
    const name = gameMeta && (side === "w" ? gameMeta.white : gameMeta.black);
    const elo = gameMeta && (side === "w" ? gameMeta.whiteElo : gameMeta.blackElo);
    el.dataset.side = side;
    el.querySelector(".pb-name").textContent = (name || (side === "w" ? "Putih" : "Hitam")) + (elo ? " (" + elo + ")" : "");
    el.querySelector(".pb-meta").textContent = "";
    paintAvatar(el.querySelector(".pb-avatar"), name, 40);
  }
  function renderPlayerBars() {
    const top = document.getElementById("playerTop"), bottom = document.getElementById("playerBottom");
    if (!top || !bottom) return;
    const key = [flipped, gameMeta && gameMeta.white, gameMeta && gameMeta.black, gameMeta && gameMeta.whiteElo, gameMeta && gameMeta.blackElo].join("|");
    if (key === playerBarKey) return;
    playerBarKey = key;
    fillPlayerBar(top, flipped ? "w" : "b");
    fillPlayerBar(bottom, flipped ? "b" : "w");
  }

  function renderGameInfoPanel(meta: any) {
    const panel = document.getElementById("gameInfoPanel");
    if (!meta || (!meta.white && !meta.black && !meta.result && !meta.date)) {
      panel.style.display = "none";
      panel.innerHTML = "";
      return;
    }

    const whiteLabel = meta.white ? esc(meta.white) + (meta.whiteElo ? " (" + esc(meta.whiteElo) + ")" : "") : "Putih";
    const blackLabel = meta.black ? esc(meta.black) + (meta.blackElo ? " (" + esc(meta.blackElo) + ")" : "") : "Hitam";

    let html = '<div class="game-info-players">' +
      '<span class="game-info-white">' + whiteLabel + '</span>' +
      '<span class="game-info-vs">vs</span>' +
      '<span class="game-info-black">' + blackLabel + '</span>' +
      '</div>';

    const metaBits = [];
    if (meta.result) metaBits.push(esc(meta.result));
    if (meta.date) metaBits.push(esc(meta.date));
    if (meta.eco) metaBits.push(esc(meta.eco));
    if (metaBits.length) {
      html += '<div class="game-info-sub">' + metaBits.join(" · ") + '</div>';
    }

    panel.innerHTML = html;
    panel.style.display = "block";
  }

  