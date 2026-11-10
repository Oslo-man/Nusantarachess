function isLocalHost(h: string): boolean {
  return (
    h === "localhost" || h === "::1" || h === "[::1]" ||
    /^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(h) || /\.local$/.test(h)
  );
}

function hostAllowed(host: string, allowed: string[]): boolean {
  if (isLocalHost(host)) return true;
  for (let i = 0; i < allowed.length; i++) {
    const p = allowed[i];
    if (p.charAt(0) === "*" ? host.slice(-(p.length - 1)) === p.slice(1) : host === p) return true;
  }
  return false;
}

function showBlockedNotice(officialUrl: string): void {
  const body = document.createElement("body");
  body.setAttribute("style", "margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#1a1a1a;color:#eee;font:16px/1.5 system-ui,sans-serif;text-align:center;padding:24px");
  const box = document.createElement("div");
  const title = document.createElement("h1");
  title.textContent = "Salinan tidak resmi";
  title.setAttribute("style", "font-size:22px;margin:0 0 8px");
  const msg = document.createElement("p");
  msg.textContent = "Halaman ini bukan situs resmi NusantaraChess. Silakan buka situs resminya:";
  msg.setAttribute("style", "margin:0 0 16px;opacity:.85");
  box.appendChild(title);
  box.appendChild(msg);
  if (/^https:\/\//.test(officialUrl)) {
    const a = document.createElement("a");
    a.href = officialUrl;
    a.textContent = officialUrl.replace(/^https:\/\//, "");
    a.setAttribute("style", "color:#7fc3ff;font-weight:600");
    box.appendChild(a);
  }
  body.appendChild(box);
  document.title = "NusantaraChess";
  document.documentElement.replaceChildren(body);
}

if (__ANTI_CLONE__ && !hostAllowed(String(location.hostname || "").toLowerCase(), __ALLOWED_HOSTS__)) {
  showBlockedNotice(__OFFICIAL_URL__);
  throw new Error("NusantaraChess: host tidak diizinkan");
}

export {};
