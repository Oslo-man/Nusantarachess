document.addEventListener("DOMContentLoaded", () => {
  window.NusantaraChess.requireAuth().then((user: any) => {
    const overlay = document.getElementById("authGateOverlay");
    if (overlay) overlay.style.display = "none";
    if (window.NusantaraChess.initSiteNav) window.NusantaraChess.initSiteNav(user, "/gamereview");
    initApp();
  });
});

function initApp() {
  