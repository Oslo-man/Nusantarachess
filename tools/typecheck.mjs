#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TSC = path.join(ROOT, "node_modules", "typescript", "bin", "tsc");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "nc-tsc-"));
const MODES = [["non-strict", []], ["noImplicitAny", ["--noImplicitAny"]], ["strict", ["--strict"]], ["erasable", ["--erasableSyntaxOnly"]]];
const verbose = process.argv.includes("--verbose");

const projects = [
  ["node (api+server+scripts)", "tsconfig.json"],
  ["shared+fitur mandiri", "tsconfig/shared-core.json"],
  ["React app (src/app + key-generator)", "tsconfig/app.json"],
  ["bot", "tsconfig/bot.json"],
  ["puzzles", "tsconfig/puzzles.json"],
];
for (const g of ["play", "gamereview", "home"]) {
  const dir = path.join(ROOT, "src/features", g);
  const parts = fs.readdirSync(dir).filter((f) => /^\d\d.*\.ts$/.test(f)).sort();
  const big = path.join(tmp, g + ".ts");
  fs.writeFileSync(big, parts.map((f) => fs.readFileSync(path.join(dir, f), "utf8")).join("\n"));
  const cfg = path.join(tmp, "tsconfig." + g + ".json");
  const types = ["window.d.ts", "play.d.ts"].map((t) => path.join(ROOT, "src/types", t));
  fs.writeFileSync(cfg, JSON.stringify({ extends: path.join(ROOT, "tsconfig/base.json"), compilerOptions: { moduleDetection: "legacy" }, files: [...types, big] }));
  projects.push([g + " (gabungan potongan)", cfg]);
}
let total = 0;
const rows = [];
let syntax = 0;
for (const [name, cfg] of projects) {
  const counts = [];
  for (const [, flags] of MODES) {
    const r = spawnSync(process.execPath, [TSC, "-p", path.isAbsolute(cfg) ? cfg : path.join(ROOT, cfg), ...flags], { encoding: "utf8", cwd: ROOT });
    const lines = (r.stdout || "").split("\n").filter((l) => /error TS\d+/.test(l));
    counts.push(lines.length);
    syntax += lines.filter((l) => /error TS1\d{3}:/.test(l)).length;
    if (verbose) lines.forEach((l) => console.log("   ", l.replace(tmp, "<gabungan>")));
  }
  rows.push([name, ...counts]);
}
console.log("project".padEnd(34) + MODES.map((m) => m[0].padStart(14)).join(""));
for (const r of rows) console.log(r[0].padEnd(34) + r.slice(1).map((c) => String(c).padStart(14)).join(""));
console.log("total".padEnd(34) + MODES.map((_, i) => String(rows.reduce((a, r) => a + r[i + 1], 0)).padStart(14)).join(""));
console.log("error sintaks (TS1xxx):", syntax);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(syntax ? 1 : 0);
