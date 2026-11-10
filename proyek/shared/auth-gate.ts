(function () {
"use strict";

window.NusantaraChess = window.NusantaraChess || {};

function redirectToLogin(guestBlocked: boolean) {
  if (location.pathname === "/") return;
  const here = location.pathname + location.search;
  let target = "/?next=" + encodeURIComponent(here);
  if (guestBlocked) target += "&guestBlocked=1";
  const router = window.NusantaraChess.router;
  if (router && typeof router.navigate === "function") {
    router.navigate(target, { replace: true });
  } else {
    location.replace(target);
  }
}

function waitForRetry() {
  return new Promise<void>((resolve) => {
    const overlay = document.getElementById("authGateOverlay");
    const textEl: any = overlay && overlay.querySelector(".auth-gate-text");
    const spinner: any = overlay && overlay.querySelector(".auth-gate-spinner");
    let btn: any = null;
    const done = () => {
      window.removeEventListener("online", done);
      if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
      if (spinner) spinner.style.display = "";
      if (textEl) textEl.textContent = "Memeriksa sesi masuk…";
      resolve();
    };
    if (overlay) {
      overlay.style.display = "flex";
      if (spinner) spinner.style.display = "none";
      if (textEl) textEl.textContent = "Tidak bisa menghubungi server. Sesi login Anda tetap tersimpan.";
      btn = document.createElement("button");
      btn.type = "button";
      btn.id = "authGateRetryBtn";
      btn.style.cssText = "padding:10px 22px;border:0;border-radius:8px;background:var(--accent,#6fac46);color:#141413;font:700 0.9375rem var(--font-sans,sans-serif);cursor:pointer;";
      btn.textContent = "Coba lagi";
      btn.addEventListener("click", done);
      overlay.appendChild(btn);
    }
    window.addEventListener("online", done);
    if (!overlay) setTimeout(done, 3000);
  });
}

async function requireAuth(options?: any) {
  const blockGuest = !!(options && options.blockGuest);
  const api = window.NusantaraChess.api;
  if (!api || !api.isLoggedIn()) {
    redirectToLogin(false);
    return new Promise(() => {});
  }
  let user: any;
  for (;;) {
    try {
      user = await api.verifySession();
      break;
    } catch (err) {
      if (err && err.status === 401) {
        api.logout();
        redirectToLogin(false);
        return new Promise(() => {});
      }
      await waitForRetry();
    }
  }
  if (blockGuest && user.isGuest) {
    redirectToLogin(true);
    return new Promise(() => {});
  }
  return user;
}

window.NusantaraChess.requireAuth = requireAuth;

function isPublicPath(path: string) {
  return path === "/" || path === "/leaderboard" || /^\/profile\/[^/]+/.test(path);
}
function onSessionLost() {
  if (!isPublicPath(location.pathname)) redirectToLogin(false);
}
if (!window.NusantaraChess._authSyncInstalled) {
  window.NusantaraChess._authSyncInstalled = true;
  window.addEventListener("nusantara:session-invalid", onSessionLost);
  window.addEventListener("storage", function (e: StorageEvent) {
    const api = window.NusantaraChess.api;
    if (!api || (e.key !== null && e.key !== api.TOKEN_KEY)) return;
    if (api.isLoggedIn()) {
      if (location.pathname === "/") location.reload();
    } else {
      onSessionLost();
    }
  });
}

window.NusantaraChess.REVIEW_HANDOFF_KEY = "nusantarachess.reviewHandoff";
window.NusantaraChess.openGameReview = function (opts?: any) {
  opts = opts || {};
  try {
    sessionStorage.setItem(window.NusantaraChess.REVIEW_HANDOFF_KEY, JSON.stringify({
      pgn: opts.pgn || "",
      savedGameId: opts.savedGameId || null,
      playerColor: opts.playerColor || null,
      source: opts.source || null,
      ts: Date.now()
    }));
  } catch (_) { }
  let target = "/gamereview?handoff=1";
  if (opts.savedGameId) target += "&savedGameId=" + encodeURIComponent(opts.savedGameId);
  const router = window.NusantaraChess.router;
  if (router && typeof router.navigate === "function") router.navigate(target);
  else location.href = target;
};

})();
