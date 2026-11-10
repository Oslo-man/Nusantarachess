import type { RouteConfig } from "../routes";

function setMeta(attr: "name" | "property", key: string, content: string | undefined | null): void {
  let el = document.querySelector('meta[' + attr + '="' + key + '"]');
  if (content === undefined || content === null) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function applyRouteMeta(route: RouteConfig): void {
  setMeta("name", "description", route.description);
  setMeta("property", "og:title", route.ogTitle || route.title);
  setMeta("property", "og:description", route.ogDescription || route.description);
  setMeta("name", "twitter:title", route.ogTitle || route.title);
  setMeta("name", "twitter:description", route.ogDescription || route.description);
  setMeta("name", "theme-color", route.themeColor);
}
