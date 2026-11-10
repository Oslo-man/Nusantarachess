const fs = require("fs");
const path = require("path");

const FILES = ["chess-rules.js", "countries.js"];

function syncOne(name: any) {
  const SRC = path.join(__dirname, "..", "..", "shared", name);
  const DEST = path.join(__dirname, "..", "lib", name);
  if (!fs.existsSync(SRC)) {
    console.error("[sync-shared] Sumber tidak ditemukan:", SRC);
    process.exit(1);
  }
  const destDir = path.dirname(DEST);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  const content = fs.readFileSync(SRC, "utf8");
  const banner =
    "/* =======================================================================\n" +
    "   BERKAS INI DIHASILKAN OTOMATIS - JANGAN EDIT LANGSUNG DI SINI.\n" +
    "   Sumber asli: shared/" + name + " (di root proyek).\n" +
    "   Jalankan `npm run sync-shared` di folder server/ setelah mengedit\n" +
    "   sumber aslinya, untuk menyalin ulang perubahan ke sini.\n" +
    "   ======================================================================= */\n";
  fs.writeFileSync(DEST, banner + content);
  console.log("[sync-shared] Disalin:", SRC, "->", DEST);
}

function main() {
  FILES.forEach(syncOne);
}

main();
