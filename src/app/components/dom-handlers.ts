import type { SyntheticEvent } from "react";

type ImgEvent = SyntheticEvent<HTMLImageElement>;

export function callGlobal(name: string, ...args: unknown[]): unknown {
  const fn = (window as unknown as Record<string, unknown>)[name];
  if (typeof fn === "function") return (fn as (...a: unknown[]) => unknown)(...args);
  console.error("[app] fungsi global tidak ditemukan untuk handler markup: " + name + "()");
  return undefined;
}

export function hideImg(e: ImgEvent): void {
  e.currentTarget.style.display = "none";
}

export function hideImgInvisible(e: ImgEvent): void {
  e.currentTarget.style.visibility = "hidden";
}

export function swapImgForNext(display: string) {
  return (e: ImgEvent): void => {
    const img = e.currentTarget;
    img.style.display = "none";
    const next = img.nextElementSibling as HTMLElement | null;
    if (next) next.style.display = display;
  };
}

export function replaceImgWithText(text: string) {
  return (e: ImgEvent): void => {
    const img = e.currentTarget;
    img.style.display = "none";
    if (img.parentNode) img.parentNode.textContent = text;
  };
}

export function swapOpponentAvatar(e: ImgEvent): void {
  e.currentTarget.classList.add("hidden");
  const fallback = document.getElementById("game-opponent-avatar-default");
  if (fallback) fallback.classList.remove("hidden");
}

export function markWordmarkLogo(e: ImgEvent): void {
  const img = e.currentTarget;
  if (img.naturalHeight && img.naturalWidth / img.naturalHeight > 2.2) {
    img.classList.add("brand-logo-wordmark");
    const next = img.nextElementSibling as HTMLElement | null;
    if (next) next.style.display = "none";
  }
}

export function onNativeChange(name: string, ...args: unknown[]) {
  return (el: HTMLElement | null): (() => void) | void => {
    if (!el) return;
    const listener = (): void => {
      callGlobal(name, ...args);
    };
    el.addEventListener("change", listener);
    return () => el.removeEventListener("change", listener);
  };
}
