#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const DENY_NAME = (n) => n.endsWith(".ts") || n.endsWith(".tsx") || n.endsWith(".md") || n === ".DS_Store" || n === ".gitkeep" || n.startsWith(".env");

let count = 0;
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (DENY_NAME(e.name)) continue;
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else { fs.copyFileSync(s, d); count++; }
  }
}

fs.rmSync(DIST, { recursive: true, force: true });
copyDir(path.join(ROOT, "public"), DIST);
copyDir(path.join(ROOT, "src/styles"), path.join(DIST, "styles"));
console.log(`[prepare-dist] ${count} berkas disalin ke dist/ (public/ + src/styles/)`);
