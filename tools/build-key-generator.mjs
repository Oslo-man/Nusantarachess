#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const common = {
  absWorkingDir: ROOT,
  bundle: true,
  write: false,
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  jsx: "automatic",
  tsconfig: "tsconfig/app.json",
  minify: true,
  legalComments: "none",
  logLevel: "warning",
  define: { "process.env.NODE_ENV": JSON.stringify("production") }
};

async function bundle(entry) {
  const res = await build({ ...common, entryPoints: [entry] });
  return res.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
}

const [core, ui] = await Promise.all([bundle("src/key-generator/core-entry.ts"), bundle("src/key-generator/main.tsx")]);
const OUT_DIR = "keygeneratora1b2";
let html = fs.readFileSync(path.join(ROOT, OUT_DIR, "template.html"), "utf8");
html = html.replace("/*__CORE__*/", () => core.trimEnd()).replace("/*__UI__*/", () => ui.trimEnd());
fs.writeFileSync(path.join(ROOT, OUT_DIR, "index.html"), html);
console.log(`[build-key-generator] ${OUT_DIR}/index.html ${(html.length / 1024).toFixed(0)} KB`);
