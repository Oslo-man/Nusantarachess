import fs from "node:fs";
import path from "node:path";

function normalizeHost(raw) {
  let h = String(raw || "").trim().toLowerCase();
  if (!h) return "";
  h = h.replace(/^[a-z][a-z0-9+.-]*:\/\//, "");
  h = h.split(/[/?#]/)[0];
  h = h.replace(/:\d+$/, "");
  return /^(\*\.)?[a-z0-9.-]+$/.test(h) ? h : "";
}

export function resolveAntiClone(root) {
  const enabled = process.env.ANTI_CLONE !== "0";
  const site = JSON.parse(fs.readFileSync(path.join(root, "site.config.json"), "utf8"));
  const officialUrl = String(site.siteUrl || "").replace(/\/+$/, "");
  const hosts = new Set();
  const add = (v) => { const h = normalizeHost(v); if (h) hosts.add(h); };

  add(officialUrl);
  String(process.env.ANTI_CLONE_HOSTS || "").split(",").forEach(add);
  add(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  add(process.env.VERCEL_URL);
  add(process.env.VERCEL_BRANCH_URL);

  return { enabled, officialUrl, hosts: [...hosts].sort() };
}

export function checkHost(allowed) {
  var h = String(location.hostname || "").toLowerCase();
  var local = h === "localhost" || h === "::1" || h === "[::1]" ||
    /^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(h) || /\.local$/.test(h);
  var ok = local;
  for (var i = 0; i < allowed.length && !ok; i++) {
    var p = allowed[i];
    ok = p.charAt(0) === "*" ? h.slice(-(p.length - 1)) === p.slice(1) : h === p;
  }
  if (!ok) throw new Error("host tidak diizinkan");
}
