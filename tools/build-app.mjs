#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build, context } from "esbuild";
import { resolveAntiClone } from "./anti-clone-hosts.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

const antiClone = resolveAntiClone(ROOT);
const lockOn = production && antiClone.enabled;
if (lockOn) console.log("[build-app] domain lock AKTIF untuk host: " + antiClone.hosts.join(", "));

const options = {
  absWorkingDir: ROOT,
  entryPoints: ["src/app/main.tsx"],
  outfile: "dist/app/main.js",
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  jsx: "automatic",
  tsconfig: "tsconfig/app.json",
  minify: production,
  sourcemap: production ? false : "linked",
  legalComments: "none",
  logLevel: "info",
  define: {
    "process.env.NODE_ENV": JSON.stringify(production ? "production" : "development"),
    __ANTI_CLONE__: JSON.stringify(lockOn),
    __ALLOWED_HOSTS__: JSON.stringify(lockOn ? antiClone.hosts : []),
    __OFFICIAL_URL__: JSON.stringify(antiClone.officialUrl)
  }
};

if (watch) {
  const ctx = await context(options);
  await ctx.watch();
  console.log("[build-app] watching src/app ...");
} else {
  const result = await build({ ...options, metafile: true });
  const out = Object.entries(result.metafile.outputs).find(([k]) => k.endsWith("main.js"));
  console.log(`[build-app] dist/app/main.js ${(out[1].bytes / 1024).toFixed(0)} KB (${production ? "production" : "development"})`);
}
