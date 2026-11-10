import "./guard/boot-lock";
import { createRoot, hydrateRoot } from "react-dom/client";
import { Router } from "./Router";
import { getSnapshot, navigate, installNavigation } from "./router/navigation";
import { normalizeHref, resolveRoute } from "./routes";
import type { SsrPageData } from "./ssr/types";

const w = window as unknown as { NusantaraChess?: Record<string, unknown> };
w.NusantaraChess = w.NusantaraChess || {};
w.NusantaraChess.router = Object.assign((w.NusantaraChess.router as object) || {}, {
  navigate,
  normalizeHref,
  resolveRoute
});

let outlet = document.getElementById("route-outlet");
if (!outlet) {
  outlet = document.createElement("div");
  outlet.id = "route-outlet";
  document.body.appendChild(outlet);
}

installNavigation();

function readSsrData(): SsrPageData | undefined {
  try {
    const el = document.getElementById("__SSR_DATA__");
    const data = el && el.textContent ? (JSON.parse(el.textContent) as SsrPageData) : undefined;
    if (data && data.kind === "public-profile" && data.user.photoInDom) {
      const img = document.querySelector("#profileAvatar img");
      data.user.profilePhoto = (img && img.getAttribute("src")) || "";
    }
    return data;
  } catch {
    return undefined;
  }
}

if (outlet.hasAttribute("data-ssr") && outlet.firstChild) {
  hydrateRoot(outlet, <Router ssrBootId={getSnapshot().id} ssrData={readSsrData()} />, {
    onRecoverableError(error: unknown) {
      console.warn("[ssr] hydrate dipulihkan:", error, (error as { cause?: unknown } | null)?.cause);
    }
  });
} else {
  createRoot(outlet).render(<Router />);
}
