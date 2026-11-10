#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const origEmit = process.emitWarning;
process.emitWarning = (w, ...a) => {
  const t = typeof a[0] === "string" ? a[0] : a[0] && a[0].type;
  if (t === "ExperimentalWarning") return;
  return origEmit.call(process, w, ...a);
};
const { stripTypeScriptTypes } = await import("node:module");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const withApi = process.argv.includes("--with-api");
const mode = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "all";
if (!["all", "web", "node", "server"].includes(mode)) {
  console.error(`[build-ts] mode tidak dikenal: ${mode} (pilih: all | web | node | server)`);
  process.exit(2);
}

const CONCAT_GROUPS = ["src/features/play", "src/features/gamereview", "src/features/home"];
const SHARED_FOR_SERVER = ["shared/chess-rules.ts", "shared/countries.ts"];

const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");
const strip = (src) => stripTypeScriptTypes(src, { mode: "strip" });

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".git") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name.endsWith(".ts") && !e.name.endsWith(".d.ts")) out.push(full);
  }
  return out;
}

let failed = 0;
function check(js, name) {
  try { new vm.Script(js, { filename: name }); } catch (e) { console.error("SINTAKS ERROR", name, e.message); failed++; }
}
function write(file, js) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, js);
}

function runJob(label, files, outPath, { concat = false } = {}) {
  const groupFiles = new Set();
  const groups = [];
  if (concat) {
    for (const g of CONCAT_GROUPS) {
      const parts = files.filter((f) => rel(f).startsWith(g + "/") && /\/\d\d[^/]*\.ts$/.test(rel(f))).sort();
      if (parts.length) { groups.push(parts); parts.forEach((p) => groupFiles.add(p)); }
    }
  }
  let n = 0;
  for (const f of files) {
    if (groupFiles.has(f)) continue;
    try {
      const js = strip(fs.readFileSync(f, "utf8"));
      check(js, rel(f));
      write(outPath(f), js);
      n++;
    } catch (e) { console.error("GAGAL", rel(f), e.message); failed++; }
  }
  for (const parts of groups) {
    const src = parts.map((p) => fs.readFileSync(p, "utf8"));
    let out;
    try { out = strip(src.join("\n")); } catch (e) { console.error("GAGAL grup", rel(parts[0]), e.message); failed++; continue; }
    check(out, rel(path.dirname(parts[0])) + "/(gabungan)");
    let o = 0;
    parts.forEach((p, i) => {
      write(outPath(p), out.slice(o, o + src[i].length));
      o += src[i].length + 1; n++;
    });
  }
  console.log(`[build-ts] ${label}: ${n} file .js dihasilkan`);
}

if (mode === "all" || mode === "web") {
  const files = [...walk(path.join(ROOT, "shared")), ...walk(path.join(ROOT, "src/features"))];
  const outPath = (f) => {
    const r = rel(f).replace(/\.ts$/, ".js");
    return path.join(DIST, r.startsWith("src/features/") ? r.slice("src/".length) : r);
  };
  runJob("web  -> dist/", files, outPath, { concat: true });
}

if (mode === "all" || mode === "node" || mode === "server") {
  let files = [...walk(path.join(ROOT, "server")), ...SHARED_FOR_SERVER.map((f) => path.join(ROOT, f))];
  if (mode !== "server") files.push(...walk(path.join(ROOT, "tools")));
  if (withApi) files.push(...walk(path.join(ROOT, "api")));
  runJob(mode === "server" ? "server" : "node ", files, (f) => f.replace(/\.ts$/, ".js"));
}

console.log(`[build-ts] ${failed} gagal`);
if (failed) process.exit(1);

if (mode === "all" || mode === "node" || mode === "server") {
  const r = spawnSync(process.execPath, [path.join(ROOT, "server", "scripts", "sync-shared.js")], { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status || 1);
}
