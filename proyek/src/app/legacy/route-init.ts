type AnyFn = (...args: unknown[]) => unknown;
type NC = {
  requireAuth: () => Promise<unknown>;
  currentUser?: unknown;
  bindProfileAvatar?: (el: HTMLElement | null) => void;
  initSiteNav?: (user: unknown, path: string) => void;
  language?: { get: () => string };
};

const nc = (): NC => (window as unknown as { NusantaraChess: NC }).NusantaraChess;
const g = (name: string): AnyFn | undefined => {
  const v = (window as unknown as Record<string, unknown>)[name];
  return typeof v === "function" ? (v as AnyFn) : undefined;
};
const gv = (name: string): unknown => (window as unknown as Record<string, unknown>)[name];

function initBot(isActive: () => boolean): () => void {
  nc().requireAuth().then((user) => {
    if (!isActive()) return;
    nc().currentUser = user;
    if (nc().bindProfileAvatar) nc().bindProfileAvatar!(document.getElementById("botPlayerAvatar"));
    const overlay = document.getElementById("authGateOverlay");
    if (overlay) overlay.style.display = "none";
    if (nc().initSiteNav) nc().initSiteNav!(user, "/bot");
    (window as unknown as { g_timeout: number }).g_timeout = 2000;
    g("PreloadChessSounds")?.();
    g("ApplyModeUI")?.(gv("g_mode"));
    g("RestoreActivePracticeSession")?.();
  });

  function startSelectedMatch(): void {
    // Tidak ada bot bawaan: jangan mulai sebelum pemain memilih lawan.
    if (!document.querySelector(".character-card.is-selected:not([data-placeholder])")) return;
    document.getElementById("opponent-select-screen")?.classList.add("hidden");
    document.getElementById("mainContent")?.classList.remove("hidden");
    g("UINewGame")?.();
  }
  const startBtn = document.getElementById("opponent-select-start-btn");
  if (startBtn) startBtn.addEventListener("click", startSelectedMatch);

  function syncBoardLayout(): void {
    if (g("RecalcCellSize") && g("RedrawBoard") && gv("g_uiBoard")) g("RedrawBoard")!();
  }
  function onOrientationChange(): void {
    setTimeout(syncBoardLayout, 200);
  }
  window.addEventListener("resize", syncBoardLayout);
  window.addEventListener("orientationchange", onOrientationChange);

  return function cleanup(): void {
    window.removeEventListener("resize", syncBoardLayout);
    window.removeEventListener("orientationchange", onOrientationChange);
    if (startBtn) startBtn.removeEventListener("click", startSelectedMatch);
  };
}

function initPuzzles(isActive: () => boolean): () => void {
  nc().requireAuth().then((user) => {
    if (!isActive()) return;
    const ov = document.getElementById("authGateOverlay");
    if (ov) ov.style.display = "none";
    if (nc().initSiteNav) nc().initSiteNav!(user, "/puzzles");
  });
  return function cleanup(): void {
    const L = nc() && nc().language;
    document.documentElement.lang = L ? L.get() : "id";
  };
}

export function runInlineInit(name: "bot" | "puzzles", isActive: () => boolean): (() => void) | void {
  if (name === "bot") return initBot(isActive);
  if (name === "puzzles") return initPuzzles(isActive);
  console.error("[router] routeInit tidak ditemukan untuk:", name);
}
