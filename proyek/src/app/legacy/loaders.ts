import type { RouteConfig, ScriptStep } from "../routes";

type DocListenerRecord = [string, EventListenerOrEventListenerObject, boolean | AddEventListenerOptions | undefined];

export function installDomReadyShim(tracked?: DocListenerRecord[]): () => void {
  let done = false;
  const originalAdd = document.addEventListener.bind(document);
  document.addEventListener = function (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    if (type === "DOMContentLoaded") {
      if (document.readyState === "loading") return originalAdd(type, listener, options);
      Promise.resolve().then(() => {
        try {
          (listener as EventListener)(new Event("DOMContentLoaded"));
        } catch (e) {
          console.error("[router] DOMContentLoaded shim listener error:", e);
        }
      });
      return;
    }
    if (tracked) tracked.push([type, listener, options]);
    return originalAdd(type, listener, options);
  } as typeof document.addEventListener;
  return () => {
    if (done) return;
    done = true;
    document.addEventListener = originalAdd as typeof document.addEventListener;
  };
}

export function removeRouteCssExcept(tag: string): void {
  document.querySelectorAll("link[data-route-css]").forEach((el) => {
    if (el.getAttribute("data-route-css") !== tag) el.remove();
  });
}

export function loadRouteCss(cssList: string[], tag: string): Promise<void> {
  return cssList.reduce<Promise<void>>(
    (prev, href) =>
      prev.then(
        () =>
          new Promise<void>((resolve) => {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = href;
            link.setAttribute("data-route-css", tag);
            link.onload = () => resolve();
            link.onerror = () => resolve();
            document.head.appendChild(link);
          })
      ),
    Promise.resolve()
  );
}

export function clearRouteScripts(): void {
  document.querySelectorAll("script[data-route-script]").forEach((el) => el.remove());
}

function fetchAll(paths: string[]): Promise<string[]> {
  return Promise.all(
    paths.map((p) =>
      fetch(p).then((res) => {
        if (!res.ok) throw new Error("Gagal memuat script: " + p + " (HTTP " + res.status + ")");
        return res.text();
      })
    )
  );
}

export async function loadConcatenatedScript(paths: string[], isActive: () => boolean = () => true): Promise<void> {
  const combined = (await fetchAll(paths)).join("\n");
  if (!isActive()) return;
  const script = document.createElement("script");
  script.setAttribute("data-route-script", "1");
  script.textContent = combined + "\n//# sourceURL=" + paths[paths.length - 1];
  document.body.appendChild(script);
}

export async function loadIsolatedScript(src: string | string[], isActive: () => boolean = () => true): Promise<void> {
  const paths = Array.isArray(src) ? src : [src];
  const combined = (await fetchAll(paths)).join("\n");
  if (!isActive()) return;
  (0, eval)(combined + "\n//# sourceURL=" + paths[paths.length - 1]);
}

async function loadLocalScript(src: string, isActive: () => boolean): Promise<void> {
  const [code] = await fetchAll([src]);
  if (!isActive()) return;
  const script = document.createElement("script");
  script.setAttribute("data-route-script", "1");
  script.setAttribute("data-src", src);
  script.textContent = code + "\n//# sourceURL=" + src;
  document.body.appendChild(script);
}

function loadExternalScript(src: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let settled = false;
    const script = document.createElement("script");
    script.src = src;
    script.setAttribute("data-route-script", "1");
    const timeoutId = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error("Waktu tunggu habis memuat script eksternal: " + src));
    }, 10000);
    script.onload = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      resolve();
    };
    script.onerror = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      reject(new Error("Gagal memuat script: " + src));
    };
    document.body.appendChild(script);
  });
}

export interface ScriptRunContext {
  isActive: () => boolean;
  cleanups: Array<() => void>;
  runInlineInit: (name: "bot" | "puzzles", isActive: () => boolean) => (() => void) | void;
}

export async function runRouteScripts(steps: RouteConfig["scripts"], ctx: ScriptRunContext): Promise<void> {
  for (const step of steps as ScriptStep[]) {
    if (!ctx.isActive()) return;
    if (typeof step === "string") {
      if (/^https?:\/\//.test(step)) await loadExternalScript(step);
      else await loadLocalScript(step, ctx.isActive);
    } else if ("inlineInit" in step) {
      const cleanup = ctx.runInlineInit(step.inlineInit, ctx.isActive);
      if (typeof cleanup === "function") ctx.cleanups.push(cleanup);
    } else if ("isolate" in step) {
      await loadIsolatedScript(step.isolate, ctx.isActive);
    } else if ("concatScript" in step) {
      await loadConcatenatedScript(step.concatScript, ctx.isActive);
    }
  }
}
