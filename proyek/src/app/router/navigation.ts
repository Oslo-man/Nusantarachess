import { normalizeHref, resolveRoute } from "../routes";

export interface NavState {
  id: number;
  path: string;
  search: string;
}

export interface NavigateOptions {
  replace?: boolean;
}

let state: NavState = { id: 0, path: location.pathname === "" ? "/" : location.pathname, search: location.search };
const subscribers = new Set<() => void>();

function setState(path: string, search: string): void {
  state = { id: state.id + 1, path, search };
  subscribers.forEach((fn) => fn());
}

export function subscribe(fn: () => void): () => void {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function getSnapshot(): NavState {
  return state;
}

export function navigate(path: string, options: NavigateOptions = {}): void {
  const url = new URL(path, location.origin);
  const targetFull = url.pathname + url.search;
  if (!resolveRoute(url.pathname)) {
    location.href = path;
    return;
  }
  if (options.replace) history.replaceState({ path: targetFull }, "", targetFull);
  else history.pushState({ path: targetFull }, "", targetFull);
  setState(url.pathname, url.search);
}

let installed = false;

export function installNavigation(): void {
  if (installed) return;
  installed = true;

  window.addEventListener("popstate", () => setState(location.pathname, location.search));

  document.addEventListener("click", (e) => {
    const link = (e.target as Element | null)?.closest?.("a[data-route-link]");
    if (!link) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const href = link.getAttribute("href");
    if (!href || href === "#") return;
    e.preventDefault();
    navigate(normalizeHref(href));
  });

  if (!resolveRoute(state.path)) navigate("/", { replace: true });
}
