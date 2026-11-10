import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".wasm": "application/wasm", ".xml": "application/xml", ".txt": "text/plain", ".map": "application/json" };

export function startStaticServer(root, port = 0) {
  const server = http.createServer((req, res) => {
    const p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const file = path.join(root, p);
    if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
      return fs.createReadStream(file).pipe(res);
    }
    if (/\.[a-z0-9]+$/i.test(p)) { res.writeHead(404); return res.end("not found"); }
    res.writeHead(200, { "Content-Type": TYPES[".html"] });
    fs.createReadStream(path.join(root, "index.html")).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, () => resolve({ server, port: server.address().port })));
}
