(function () {
"use strict";

let sessionUser: any = null;

document.addEventListener("DOMContentLoaded", () => {
  const api = window.NusantaraChess.api;
  const initNav = (user: any) => {
    sessionUser = user || null;
    const overlay = document.getElementById("authGateOverlay");
    if (overlay) overlay.style.display = "none";
    if (window.NusantaraChess.initSiteNav) window.NusantaraChess.initSiteNav(user, location.pathname);
    initApp();
  };
  if (api && api.isLoggedIn()) {
    api.me().then(initNav).catch(() => initNav(null));
  } else {
    initNav(null);
  }
});

async function initApp() {
  const pathMatch = location.pathname.match(/^\/lessons\/([^/]+)\/?$/);
  let lessonId = null;
  if (pathMatch) {
    try { lessonId = decodeURIComponent(pathMatch[1]).trim() || null; }
    catch (e) { lessonId = pathMatch[1].trim() || null; }
  }

  if (!lessonId) {
    showLessonError("Tautan lesson tidak lengkap", "URL ini tidak membawa id lesson yang valid. Kembali ke daftar lesson dan pilih salah satu dari sana.");
    return;
  }

  let definitions;
  try {
    definitions = await window.NusantaraChess.api.getLessonDefinitions();
  } catch (err) {
    showLessonError(
      "Gagal memuat data lesson dari server",
      "Periksa koneksi Anda, lalu muat ulang halaman ini. (" + (err.message || "kesalahan tidak diketahui") + ")"
    );
    return;
  }

  if (!definitions || !Array.isArray(definitions.lessons) || definitions.lessons.length === 0) {
    showLessonError("Data lesson kosong dari server", "Coba muat ulang halaman ini beberapa saat lagi.");
    return;
  }

  const lesson = definitions.lessons.find((l: any) => l.id === lessonId);
  if (!lesson) {
    const availableIds = definitions.lessons.map((l: any) => l.id).join(", ");
    showLessonError(
      "Lesson \"" + escapeHtml(lessonId) + "\" tidak ditemukan",
      "ID lesson yang tersedia: " + escapeHtml(availableIds)
    );
    return;
  }

  const missingFields = ["title", "learn", "fen", "correctSan", "explanation"].filter((f) => !lesson[f]);
  if (missingFields.length > 0) {
    showLessonError(
      "Data lesson \"" + escapeHtml(lesson.id) + "\" tidak lengkap",
      "Field yang hilang: " + missingFields.join(", ") + ". Laporkan ini ke pengembang."
    );
    return;
  }

  renderLesson(lesson);
  setupNav(lesson, definitions.lessons);
}

function showLessonError(heading: any, detail: any) {
  const container = document.querySelector(".lesson-detail-page");
  if (!container) return;
  container.innerHTML =
    '<div style="padding:24px;text-align:center;">' +
      '<p style="color:var(--text-primary);font-weight:700;margin-bottom:8px;">' + heading + '</p>' +
      '<p style="color:var(--text-muted);font-size:0.8125rem;margin-bottom:16px;">' + detail + '</p>' +
      '<a href="/lessons" data-route-link style="color:var(--accent);font-weight:600;text-decoration:none;"><span class="ui-ico ui-ico-arrow-left" aria-hidden="true"></span> Kembali ke Lesson</a>' +
    '</div>';
}

function renderLesson(lesson: any) {
  document.title = lesson.title + " — NusantaraChess";
  document.getElementById("lessonTitle").textContent = lesson.title;
  document.getElementById("lessonLearnText").textContent = lesson.learn;
  document.getElementById("lessonFenCaption").textContent = lesson.fenCaption || "";

  const explainBox = document.getElementById("lessonExplainBox");
  explainBox.classList.remove("is-visible", "correct", "wrong");

  setupInteractiveBoard(lesson);
}

const lessonUi: Record<string, any> = {
  lesson: null,
  game: null,
  selected: null,
  legal: [],
  lastMove: null,
  locked: false,
  solved: false,
  timer: null,
  drag: null,
  viaKeyboard: false
};

function sanOfMove(game: any, move: any) {
  const after = game.clone();
  after.applyMove(move);
  return game.moveToSANFull(move, after);
}

function normSan(san: any) {
  return String(san == null ? "" : san).replace(/[+#!?]/g, "");
}

function setupInteractiveBoard(lesson: any) {
  const NC = window.NusantaraChess;
  if (lessonUi.timer) { clearTimeout(lessonUi.timer); lessonUi.timer = null; }
  cleanupDrag();

  let game;
  try {
    game = NC.ChessGame.fromFEN(lesson.fen);
  } catch (e) {
    showLessonError("Posisi lesson tidak dapat dimuat", "FEN lesson ini tidak valid. Laporkan ke pengembang.");
    return;
  }

  lessonUi.lesson = lesson;
  lessonUi.game = game;
  lessonUi.selected = null;
  lessonUi.legal = [];
  lessonUi.lastMove = null;
  lessonUi.locked = false;
  lessonUi.solved = false;
  lessonUi.viaKeyboard = false;

  const boardEl = document.getElementById("lessonBoard");
  boardEl.classList.remove("is-locked", "is-wrong-flash");
  boardEl.onpointerdown = onBoardPointerDown;
  boardEl.onpointermove = onBoardPointerMove;
  boardEl.onpointerup = onBoardPointerUp;
  boardEl.onpointercancel = onBoardPointerCancel;
  boardEl.onkeydown = onBoardKeyDown;

  updateMoveHint();
  renderInteractiveBoard();
}

function updateMoveHint() {
  const hint = document.getElementById("lessonMoveHint");
  if (!hint || !lessonUi.lesson) return;
  if (lessonUi.solved) {
    hint.textContent = "Jawaban benar — lesson selesai.";
    if (!sessionUser) {
      const login = document.createElement("a");
      login.href = "/?next=" + encodeURIComponent(location.pathname);
      login.setAttribute("data-route-link", "");
      login.className = "lesson-login-prompt";
      login.textContent = "Masuk untuk menyimpan progres.";
      hint.appendChild(document.createTextNode(" "));
      hint.appendChild(login);
    }
    return;
  }
  const side = String(lessonUi.lesson.fen).split(" ")[1] === "b" ? "Hitam" : "Putih";
  hint.textContent = "Giliran " + side + " — gerakkan bidak di papan untuk menjawab.";
}

function renderInteractiveBoard() {
  const boardEl = document.getElementById("lessonBoard");
  if (!boardEl || !lessonUi.game) return;
  const PIECE_SVG = window.NusantaraChess.PIECE_SVG;
  const game = lessonUi.game;
  const interactive = !lessonUi.locked;
  const targets = new Set(lessonUi.legal.map((m: any) => m.to));
  const files = "abcdefgh";

  let html = "";
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const idx = r * 8 + f;
      const piece = game.board[idx];
      const isLight = (f + (8 - r)) % 2 === 0;
      const cls = ["lesson-square", isLight ? "light" : "dark"];
      if (lessonUi.lastMove && (idx === lessonUi.lastMove.from || idx === lessonUi.lastMove.to)) cls.push("is-last-move");
      if (lessonUi.selected === idx) cls.push("is-selected");
      if (interactive && targets.has(idx)) { cls.push("is-target"); if (piece) cls.push("has-piece"); }
      const movable = interactive && piece && piece.color === game.turn;
      if (movable) cls.push("can-move");
      if (lessonUi.drag && lessonUi.drag.active && lessonUi.drag.idx === idx) cls.push("is-dragging");

      const svg = piece && PIECE_SVG ? PIECE_SVG[piece.color + piece.type] || "" : "";
      const focusable = interactive && (movable || targets.has(idx));
      const name = files[f] + (8 - r);
      html += '<div class="' + cls.join(" ") + '" data-idx="' + idx + '"' +
        (focusable ? ' tabindex="0" role="button" aria-label="' + name + (piece ? " " + piece.color + piece.type : "") + '"' : "") +
        '>' + svg + '</div>';
    }
  }
  boardEl.innerHTML = html;
  boardEl.classList.toggle("is-locked", !interactive);

  if (lessonUi.viaKeyboard && lessonUi.selected != null) {
    const el = boardEl.querySelector('[data-idx="' + lessonUi.selected + '"]') as HTMLElement | null;
    if (el) el.focus();
  }
}

function squareIdxFromPoint(x: any, y: any) {
  const el = document.elementFromPoint(x, y) as HTMLElement | null;
  const sq = el && el.closest ? (el.closest(".lesson-square") as HTMLElement | null) : null;
  return sq && sq.dataset.idx != null ? parseInt(sq.dataset.idx, 10) : null;
}

function selectSquare(idx: any) {
  const game = lessonUi.game;
  const piece = game.board[idx];
  if (piece && piece.color === game.turn) {
    lessonUi.selected = idx;
    lessonUi.legal = game.legalMovesFor(idx);
  } else {
    lessonUi.selected = null;
    lessonUi.legal = [];
  }
}

function activateSquare(idx: any) {
  if (lessonUi.locked || !lessonUi.game) return;
  const target = lessonUi.legal.find((m: any) => m.to === idx && (!m.promotion || m.promotion === "q"));
  if (lessonUi.selected != null && target) {
    attemptMove(target);
    return;
  }
  if (lessonUi.selected === idx) {
    lessonUi.selected = null;
    lessonUi.legal = [];
  } else {
    selectSquare(idx);
  }
  renderInteractiveBoard();
}

function onBoardPointerDown(e: any) {
  if (lessonUi.locked || (e.pointerType === "mouse" && e.button !== 0)) return;
  const idx = squareIdxFromPoint(e.clientX, e.clientY);
  if (idx == null) return;
  lessonUi.viaKeyboard = false;

  const target = lessonUi.legal.find((m: any) => m.to === idx && (!m.promotion || m.promotion === "q"));
  if (lessonUi.selected != null && target) {
    attemptMove(target);
    return;
  }
  const piece = lessonUi.game.board[idx];
  if (piece && piece.color === lessonUi.game.turn) {
    selectSquare(idx);
    lessonUi.drag = { idx: idx, startX: e.clientX, startY: e.clientY, active: false, ghost: null, pointerId: e.pointerId };
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch (_) {}
  } else {
    lessonUi.selected = null;
    lessonUi.legal = [];
  }
  renderInteractiveBoard();
}

function onBoardPointerMove(e: any) {
  const d = lessonUi.drag;
  if (!d || e.pointerId !== d.pointerId) return;
  if (!d.active) {
    if (Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 6) return;
    d.active = true;
    const boardEl = document.getElementById("lessonBoard");
    const size = boardEl.getBoundingClientRect().width / 8;
    const src = boardEl.querySelector('[data-idx="' + d.idx + '"] svg, [data-idx="' + d.idx + '"] img') as HTMLElement | null;
    const ghost = document.createElement("div");
    ghost.className = "lesson-drag-ghost";
    ghost.style.width = size * 0.88 + "px";
    ghost.style.height = size * 0.88 + "px";
    ghost.innerHTML = src ? src.outerHTML : "";
    document.body.appendChild(ghost);
    d.ghost = ghost;
    const srcSq = boardEl.querySelector('[data-idx="' + d.idx + '"]');
    if (srcSq) srcSq.classList.add("is-dragging");
  }
  if (d.ghost) {
    d.ghost.style.left = e.clientX + "px";
    d.ghost.style.top = e.clientY + "px";
  }
}

function onBoardPointerUp(e: any) {
  const d = lessonUi.drag;
  if (!d || e.pointerId !== d.pointerId) return;
  const wasActive = d.active;
  cleanupDrag();
  if (!wasActive) return;
  const idx = squareIdxFromPoint(e.clientX, e.clientY);
  const move = idx == null ? null : lessonUi.legal.find((m: any) => m.to === idx && (!m.promotion || m.promotion === "q"));
  if (move) attemptMove(move);
  else renderInteractiveBoard();
}

function onBoardPointerCancel() {
  if (!lessonUi.drag) return;
  cleanupDrag();
  renderInteractiveBoard();
}

function cleanupDrag() {
  const d = lessonUi.drag;
  if (d && d.ghost && d.ghost.parentNode) d.ghost.parentNode.removeChild(d.ghost);
  lessonUi.drag = null;
}

function onBoardKeyDown(e: any) {
  const sq = e.target && e.target.closest ? (e.target.closest(".lesson-square") as HTMLElement | null) : null;
  if (e.key === "Escape" && lessonUi.selected != null) {
    lessonUi.selected = null;
    lessonUi.legal = [];
    renderInteractiveBoard();
    return;
  }
  if (!sq || (e.key !== "Enter" && e.key !== " ")) return;
  e.preventDefault();
  lessonUi.viaKeyboard = true;
  activateSquare(parseInt(sq.dataset.idx, 10));
}

function attemptMove(move: any) {
  const lesson = lessonUi.lesson;
  const before = lessonUi.game;
  const playedSan = sanOfMove(before, move);
  const isCorrect = normSan(playedSan) === normSan(lesson.correctSan);

  const after = before.clone();
  after.applyMove(move);
  lessonUi.game = after;
  lessonUi.selected = null;
  lessonUi.legal = [];
  lessonUi.lastMove = { from: move.from, to: move.to };
  lessonUi.locked = true;
  lessonUi.viaKeyboard = false;
  renderInteractiveBoard();

  const boardEl = document.getElementById("lessonBoard");
  const explainBox = document.getElementById("lessonExplainBox");
  const heading = document.getElementById("lessonExplainHeading");
  const text = document.getElementById("lessonExplainText");

  explainBox.classList.add("is-visible");
  explainBox.classList.toggle("correct", isCorrect);
  explainBox.classList.toggle("wrong", !isCorrect);

  if (isCorrect) {
    lessonUi.solved = true;
    updateMoveHint();
    heading.textContent = "Benar — " + lesson.correctSan;
    text.textContent = lesson.explanation;
    text.hidden = false;
    markCompleted(lesson.id);
  } else {
    heading.textContent = "Langkah yang salah.";
    const fb = lesson.wrongFeedback || {};
    const key = Object.keys(fb).find((k) => normSan(k) === normSan(playedSan));
    text.textContent = key ? fb[key] : "";
    text.hidden = !key;
    boardEl.classList.add("is-wrong-flash");
    lessonUi.timer = setTimeout(() => {
      lessonUi.timer = null;
      if (!document.getElementById("lessonBoard") || lessonUi.solved) return;
      lessonUi.game = window.NusantaraChess.ChessGame.fromFEN(lesson.fen);
      lessonUi.lastMove = null;
      lessonUi.locked = false;
      boardEl.classList.remove("is-wrong-flash");
      updateMoveHint();
      renderInteractiveBoard();
    }, 1100);
  }

  explainBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function markCompleted(lessonId: any) {
  if (!sessionUser) return;
  window.NusantaraChess.api.markLessonCompleted(lessonId).catch(() => {
  });
}

function setupNav(lesson: any, allLessons: any) {
  const idx = allLessons.findIndex((l: any) => l.id === lesson.id);

  const prevBtn = document.getElementById("lessonPrevBtn");
  const nextBtn = document.getElementById("lessonNextBtn");

  if (idx > 0) {
    (prevBtn as HTMLAnchorElement).href = "/lessons/" + encodeURIComponent(allLessons[idx - 1].id);
    prevBtn.innerHTML = '<span class="ui-ico ui-ico-arrow-left" aria-hidden="true"></span> Sebelumnya';
  } else {
    (prevBtn as HTMLAnchorElement).href = "/lessons";
    prevBtn.innerHTML = '<span class="ui-ico ui-ico-arrow-left" aria-hidden="true"></span> Semua Lesson';
  }

  if (idx < allLessons.length - 1) {
    (nextBtn as HTMLAnchorElement).href = "/lessons/" + encodeURIComponent(allLessons[idx + 1].id);
    nextBtn.innerHTML = 'Berikutnya <span class="ui-ico ui-ico-arrow-right" aria-hidden="true"></span>';
  } else {
    (nextBtn as HTMLAnchorElement).href = "/lessons";
    nextBtn.textContent = "Selesai — Semua Lesson";
  }
}

function escapeHtml(str: any) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

})();
