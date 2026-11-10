#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vercel = process.argv.includes("--vercel");
const OUT = "api/ssr/_lib/app-render.cjs";

const result = await build({
  absWorkingDir: ROOT,
  entryPoints: ["src/app/ssr/render.tsx"],
  outfile: OUT,
  bundle: true,
  format: "cjs",
  platform: "node",
  target: ["node22"],
  jsx: "automatic",
  tsconfig: "tsconfig/app.json",
  loader: { ".html": "text" },
  minify: vercel,
  legalComments: "none",
  logLevel: "warning",
  metafile: true,
  define: { "process.env.NODE_ENV": JSON.stringify("production") }
});
const bytes = Object.values(result.metafile.outputs)[0].bytes;
console.log(`[build-ssr] ${OUT} ${(bytes / 1024).toFixed(0)} KB`);

if (vercel) {
  const idx = path.join(ROOT, "dist", "index.html");
  const spa = path.join(ROOT, "dist", "spa.html");
  if (!fs.existsSync(idx)) { console.error("[build-ssr] dist/index.html tidak ada (jalankan prepare-dist dulu)"); process.exit(1); }
  fs.renameSync(idx, spa);
  console.log("[build-ssr] dist/index.html -> dist/spa.html (fallback SPA; '/' dilayani fungsi SSR)");
}
