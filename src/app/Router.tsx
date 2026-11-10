import { Component, useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { resolveRoute } from "./routes";
import type { RouteConfig } from "./routes";
import { PAGES } from "./pages";
import { FatalRouteError } from "./components/FatalRouteError";
import { getSnapshot, subscribe } from "./router/navigation";
import {
  clearRouteScripts,
  installDomReadyShim,
  loadRouteCss,
  removeRouteCssExcept,
  runRouteScripts
} from "./legacy/loaders";
import { applyRouteMeta } from "./legacy/route-meta";
import { runInlineInit } from "./legacy/route-init";
import type { SsrPageData } from "./ssr/types";

type Phase = "css" | "ready" | "error";

interface RouteViewProps {
  id: number;
  route: RouteConfig;
  active: boolean;
  onReady: (id: number, route: RouteConfig) => void;
  ssr?: boolean;
  ssrData?: SsrPageData;
}

function RouteView({ id, route, active, onReady, ssr, ssrData }: RouteViewProps) {
  const [phase, setPhase] = useState<Phase>(ssr ? "ready" : "css");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (ssr && active) onReady(id, route);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hanya sekali, saat mount
  }, []);

  useEffect(() => {
    if (!active || phase !== "css") return;
    let alive = true;
    clearRouteScripts();
    loadRouteCss(route.css || [], String(id)).then(() => {
      if (!alive) return;
      removeRouteCssExcept(String(id));
      document.title = route.title || "NusantaraChess";
      applyRouteMeta(route);
      setPhase("ready");
      onReady(id, route);
    });
    return () => {
      alive = false;
    };
  }, [active, phase, route, id, onReady]);

  useEffect(() => {
    if (!active || phase !== "ready") return;
    let running = true;
    const trackedDocListeners: Array<[string, EventListenerOrEventListenerObject, boolean | AddEventListenerOptions | undefined]> = [];
    const cleanups: Array<() => void> = [
      function releaseDocListeners() {
        trackedDocListeners.forEach(([type, listener, options]) => {
          try {
            document.removeEventListener(type, listener, options);
          } catch {
          }
        });
        trackedDocListeners.length = 0;
      }
    ];
    const uninstallShim = installDomReadyShim(trackedDocListeners);

    runRouteScripts(route.scripts || [], { isActive: () => running, cleanups, runInlineInit })
      .catch((err: unknown) => {
        if (!running) return;
        console.error("[router] mount error:", err);
        setErrorMessage("Terjadi kesalahan memuat skrip halaman ini. Coba muat ulang. (" + ((err as Error)?.message || "") + ")");
        setPhase("error");
      })
      .finally(uninstallShim);

    return () => {
      running = false;
      uninstallShim();
      cleanups.forEach((fn) => {
        try {
          fn();
        } catch (e) {
          console.error("[router] cleanup error:", e);
        }
      });
      clearRouteScripts();
    };
  }, [active, phase, route]);

  if (phase === "css") return null;
  if (phase === "error") return <FatalRouteError message={errorMessage} />;
  const Page = PAGES[route.page];
  return <Page ssr={ssr ? ssrData : undefined} />;
}

interface BoundaryState {
  error: Error | null;
}

class PageErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { error: null };
  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[router] render error:", error, info.componentStack);
  }
  render() {
    if (this.state.error) return <FatalRouteError message={"Terjadi kesalahan menampilkan halaman. (" + this.state.error.message + ")"} />;
    return this.props.children;
  }
}

interface ShownView {
  id: number;
  route: RouteConfig;
}

interface RouterProps {
  ssrBootId?: number | null;
  ssrData?: SsrPageData;
}

export function Router({ ssrBootId = null, ssrData }: RouterProps = {}) {
  const nav = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const [shown, setShown] = useState<ShownView | null>(null);
  const route = resolveRoute(nav.path);
  const handleReady = useCallback((id: number, r: RouteConfig) => setShown({ id, route: r }), []);
  if (!route) return <FatalRouteError message={"Rute tidak ditemukan: " + nav.path} />;
  const stale = shown && shown.id !== nav.id ? shown : null;
  return (
    <>
      {stale && (
        <PageErrorBoundary key={stale.id}>
          <RouteView id={stale.id} route={stale.route} active={false} onReady={handleReady} ssr={ssrBootId === stale.id} ssrData={ssrData} />
        </PageErrorBoundary>
      )}
      <PageErrorBoundary key={nav.id}>
        <RouteView id={nav.id} route={route} active onReady={handleReady} ssr={ssrBootId === nav.id} ssrData={ssrData} />
      </PageErrorBoundary>
    </>
  );
}
