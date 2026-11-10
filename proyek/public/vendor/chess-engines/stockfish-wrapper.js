/* =======================================================================
   PLAY.HTML — js/play/stockfish-wrapper.js

   PENTING (Tahap 2): Stockfish TETAP 100% BERJALAN DI CLIENT (browser/HP
   pemain sendiri) lewat Web Worker WASM — sesuai permintaan eksplisit.
   Server NusantaraChess yang baru (server/) TIDAK menjalankan Stockfish
   sama sekali; yang server lakukan hanyalah memvalidasi langkah (legal
   atau tidak) dan mencatat hasil/Elo, bukan menghitung/menyarankan
   langkah bot.

   StockfishEngine (WASM lokal) adalah satu-satunya engine yang dipakai
   app.js secara default sekarang.

   StockfishServerEngine di bawah ini TETAP disertakan (tidak dihapus)
   sebagai OPSI untuk pengembangan lanjutan di masa depan, seandainya
   suatu saat memang ingin dipakai (mis. HP yang terlalu lemah untuk
   menjalankan WASM) — TAPI TIDAK DIAKTIFKAN oleh app.js secara default,
   dan endpoint yang dipanggilnya (/health, /bestmove) TIDAK ADA di
   server/ yang baru (server/ hanya urusan logika permainan, bukan mesin
   analisis). Mengaktifkannya kembali membutuhkan server Stockfish
   terpisah, sama seperti stockfish-server.js versi lama.
   ======================================================================= */
(function () {
"use strict";

/* =======================================================================
   STOCKFISH UCI WRAPPER (WASM lokal, client-side)
   Melemahkan Stockfish via UCI_LimitStrength + UCI_Elo (bukan depth/time).
   Mencoba Stockfish 18 -> 17 -> ... -> 10 (versi yang tidak tersedia/gagal dijalankan dilewati), lalu stockfish.js generik.
   Berkas engine ada di public/vendor/stockfish/ (URL /vendor/stockfish/).
   ======================================================================= */
// Versi Stockfish yang dicoba, dari yang terbaru ke yang lebih lama.
const STOCKFISH_VERSIONS = [18, 17, 16, 15, 14, 13, 12, 11, 10];

class StockfishEngine {
  constructor() {
    this.loadedFile = null;
    this.loadedLabel = null;
    this.worker = null;
    this.ready = false;
    this.pendingResolvers = [];
  }

  async init() {
    const base = "/vendor/stockfish/"; // public/vendor/stockfish/
    // Urutan coba: Stockfish 18 lebih dulu, lalu turun ke versi yang lebih lama (17 ... 10), terakhir
    // berkas generik. Berkas yang tidak ada di server dilewati otomatis oleh _preflight (HTTP 404 / dijawab HTML),
    // dan berkas yang ada tetapi gagal dijalankan (WASM rusak, timeout, galat worker) juga berlanjut ke kandidat
    // berikutnya, jadi cukup meletakkan versi yang tersedia di public/vendor/stockfish/.
    // Build "lite-single"/"single" selalu berpasangan dengan .wasm bernama sama (wajib dicek). Berkas generik
    // (stockfish.js / stockfish-<v>.js) bisa saja build asm.js tanpa .wasm, jadi pasangan WASM-nya tidak dijadikan syarat.
    const candidates = [];
    for (const v of STOCKFISH_VERSIONS) {
      candidates.push({ file: base + "stockfish-" + v + "-lite-single.js", requireWasm: true, label: "Stockfish " + v });
      candidates.push({ file: base + "stockfish-" + v + "-single.js", requireWasm: true, label: "Stockfish " + v });
      candidates.push({ file: base + "stockfish-" + v + ".js", requireWasm: false, label: "Stockfish " + v });
    }
    candidates.push({ file: base + "stockfish.wasm.js", requireWasm: false, label: "Stockfish (wasm)" });
    candidates.push({ file: base + "stockfish.js", requireWasm: false, label: "Stockfish" });
    const reasons = [];
    for (const { file, requireWasm, label } of candidates) {
      try {
        await this._preflight(file, requireWasm);
        await this._tryLoad(file);
        this.loadedFile = file;
        this.loadedLabel = label;
        if (reasons.length) console.info("[Stockfish] memakai " + label + " (" + file + ") setelah " + reasons.length + " kandidat gagal/tidak tersedia");
        return true;
      } catch (e) {
        reasons.push(file + ": " + (e && e.message ? e.message : String(e)));
        console.warn("[Stockfish] gagal memuat " + file, e);
        this.ready = false;
      }
    }
    const err = new Error(reasons.join(" | ") || "Tidak bisa memuat file Stockfish.");
    err.reasons = reasons;
    throw err;
  }

  /* Cek BERKAS-nya dulu (bukan hanya "Worker berhasil dibuat"): Worker tidak pernah gagal di konstruktor kalau
     berkasnya tidak ada. Server dev dengan fallback SPA (mis. `serve -s`) menjawab 404 dengan index.html, yang
     baru ketahuan sebagai "Unexpected token '<'" di dalam worker, atau sebagai timeout. Dengan cek ini penyebabnya
     (tidak ada / dijawab HTML / berkas .wasm pasangannya tidak ada) langsung muncul sebagai pesan yang jelas. */
  async _preflight(file, requireWasm) {
    const probe = async (url) => {
      let res;
      try {
        res = await fetch(url, { cache: "no-store" });
      } catch (e) {
        throw new Error("tidak bisa diambil dari " + url + " (" + (e && e.message ? e.message : e) + ")");
      }
      const type = (res.headers.get("content-type") || "").toLowerCase();
      if (!res.ok) throw new Error(url + " dijawab HTTP " + res.status + " (berkas tidak ada di server)");
      if (type.indexOf("text/html") !== -1) throw new Error(url + " dijawab sebagai HTML (berkas tidak ada; server mengembalikan index.html)");
      return res;
    };
    await probe(file);
    // Build WASM Stockfish memuat <nama-berkas>.wasm dari folder yang sama: namanya harus pasangan persis.
    const wasm = file.replace(/\.js$/, ".wasm");
    if (requireWasm && wasm !== file) {
      try {
        const r = await probe(wasm);
        if (r.body && r.body.cancel) r.body.cancel();
      } catch (e) {
        throw new Error("berkas .js ada tetapi pasangan WASM-nya bermasalah: " + e.message);
      }
    }
  }

  _tryLoad(filename) {
    return new Promise((resolve, reject) => {
      let settled = false;
      let timer = null;
      let resent = false;
      let worker;
      const fail = (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        try { worker.terminate(); } catch (e) { /* abaikan */ }
        if (this.worker === worker) this.worker = null;
        reject(err);
      };
      try {
        worker = new Worker(filename);
      } catch (e) {
        reject(e);
        return;
      }
      this.worker = worker;
      const onMsg = (e) => {
        const line = typeof e.data === "string" ? e.data : "";
        // Banner "Stockfish ..." berarti mesin sudah hidup; kirim "uci" sekali lagi kalau perintah pertama
        // (dikirim sebelum WASM siap) sempat tidak diproses.
        if (!resent && line.indexOf("Stockfish") === 0) { resent = true; worker.postMessage("uci"); }
        if (line === "uciok") {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            worker.removeEventListener("message", onMsg);
            this.ready = true;
            worker.onmessage = (ev) => this._handleMessage(ev);
            resolve();
          }
        }
      };
      worker.addEventListener("message", onMsg);
      worker.onerror = (err) => {
        const detail = err && (err.message || err.filename) ? (err.message || "galat worker di " + err.filename) : "galat worker";
        fail(new Error(detail));
      };
      worker.postMessage("uci");
      // Mengunduh + mengompilasi WASM engine (beberapa MB) di HP bisa lebih dari 4 detik: beri waktu yang wajar.
      timer = setTimeout(() => fail(new Error("Timeout memuat " + filename + " (tidak ada balasan 'uciok' dalam 20 detik)")), 20000);
    });
  }

  _handleMessage(e) {
    const line = typeof e.data === "string" ? e.data : "";
    if (line.startsWith("bestmove")) {
      const resolver = this.pendingResolvers.shift();
      if (resolver) {
        const parts = line.split(" ");
        resolver(parts[1]); // UCI move string e.g. "e2e4" atau "e7e8q"
      }
    }
  }

  send(cmd) {
    if (this.worker) this.worker.postMessage(cmd);
  }

  setElo(elo) {
    this.send("setoption name UCI_LimitStrength value true");
    // Rentang UCI_Elo sistem ini: 1320-3190 (sama dengan rentang Elo lawan
    // di server/lib/elo-ranges.js, termasuk Elo lawan custom). Elo yang
    // dipilih HARUS sampai ke mesin apa adanya - clamp lama 1350-2850
    // membuat lawan 3000 diam-diam dimainkan di 2850.
    this.send("setoption name UCI_Elo value " + Math.max(1320, Math.min(3190, elo)));
  }

  newGame() {
    this.send("ucinewgame");
    this.send("isready");
  }

  getBestMove(fen, movetimeMs) {
    return new Promise((resolve) => {
      this.pendingResolvers.push(resolve);
      this.send("position fen " + fen);
      this.send("go movetime " + Math.round(movetimeMs));
    });
  }

  quit() {
    if (this.worker) {
      this.send("quit");
      this.worker.terminate();
    }
  }
}

/* =======================================================================
   STOCKFISH SERVER ENGINE (OPSIONAL, TIDAK AKTIF SECARA DEFAULT)
   Lihat catatan besar di atas berkas ini. Interface method-nya
   (init/setElo/newGame/getBestMove/quit) dibuat IDENTIK dengan
   StockfishEngine (WASM lokal) supaya andai suatu saat memang ingin
   dipakai, app.js bisa memakai keduanya secara bergantian tanpa
   mengubah kode pemanggil sama sekali - hanya beda class mana yang
   diinstansiasi.
   ======================================================================= */
class StockfishServerEngine {
  constructor(serverUrl) {
    this.serverUrl = serverUrl.replace(/\/$/, "");
    this.elo = 1500;
    this.ready = false;
  }

  async init() {
    const res = await fetch(this.serverUrl + "/health", { method: "GET" });
    if (!res.ok) throw new Error("Server Stockfish tidak merespon (status " + res.status + ")");
    const data = await res.json();
    if (!data || data.ok !== true) throw new Error("Server Stockfish membalas status tidak valid");
    this.ready = true;
    return true;
  }

  setElo(elo) {
    this.elo = Math.max(1320, Math.min(3190, elo));
  }

  newGame() {
    // Server bersifat stateless per-request (FEN selalu dikirim penuh),
    // jadi tidak perlu memberi tahu server soal newgame secara eksplisit.
  }

  async getBestMove(fen, movetimeMs) {
    const res = await fetch(this.serverUrl + "/bestmove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fen: fen,
        elo: this.elo,
        movetime: Math.round(movetimeMs)
      })
    });
    if (!res.ok) throw new Error("Server Stockfish gagal membalas (status " + res.status + ")");
    const data = await res.json();
    if (!data || !data.bestmove) throw new Error("Server Stockfish tidak mengirim bestmove");
    return data.bestmove; // format UCI sama seperti WASM lokal, mis. "e2e4"
  }

  quit() {
    // Tidak ada koneksi persisten yang perlu ditutup (HTTP request biasa).
  }
}

window.NusantaraChess = window.NusantaraChess || {};
window.NusantaraChess.StockfishEngine = StockfishEngine;
window.NusantaraChess.StockfishServerEngine = StockfishServerEngine;

})();
