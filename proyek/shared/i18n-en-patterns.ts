window.NusantaraChess = window.NusantaraChess || {};
window.NusantaraChess.i18nDictPatterns = [
  [
   "^Field yang hilang: (.+)\\. Laporkan ini ke pengembang\\.$",
   "Missing fields: $1. Please report this to the developer."
  ],
  [
   "^Kamu mengalahkan (.+)!$",
   "You beat $1!"
  ],
  [
   "^Kamu berhasil bertahan melawan (.+)!$",
   "You held your own against $1!"
  ],
  [
   "^haha masih bisa kalah sama (.+)!$",
   "haha you can still lose to $1!"
  ],
  [
   "^Magnus aja umur 13 tahun udah jadi GM, sedangkan kamu masih kalah sama (.+), ya haha\\.$",
   "Magnus was already a GM at 13, and you still lose to $1, haha."
  ],
  [
   "^Mulai sebagai (.+) \\(Rating (\\d+)\\)$",
   "Start as $T1 (Rating $2)"
  ],
  [
   "^Level (.+) butuh password\\.$",
   "Level $T1 requires a password."
  ],
  [
   "^(\\d+) partai dimainkan · (\\d+)M / (\\d+)K / (\\d+)R$",
   "$1 games played · $2W / $3L / $4D"
  ],
  [
   "^(\\d+) terpecahkan dari (\\d+) percobaan$",
   "$1 solved out of $2 attempts"
  ],
  [
   "^Bergabung (.+)$",
   "Joined $1"
  ],
  [
   "^(.+): rating bergerak dari (\\d+) menjadi (\\d+) dalam (\\d+) perubahan tercatat\\.$",
   "$1: rating moved from $2 to $3 over $4 recorded changes."
  ],
  [
   "^Akun: (.+)$",
   "Account: $1"
  ],
  [
   "^Ukuran file terlalu besar \\(maks (\\d+)MB\\)\\. Pilih foto lain atau kompres dulu\\.$",
   "File size is too large (max $1MB). Choose another photo or compress it first."
  ],
  [
   "^(\\d+) langkah dihitung pada fase ini$",
   "$1 moves counted in this phase"
  ],
  [
   "^Halaman (\\d+) dari (\\d+)$",
   "Page $1 of $2"
  ],
  [
   "^(\\d[\\d.,]*) partai$",
   "$1 games"
  ],
  [
   "^(.+) \\(kamu\\)$",
   "$1 (you)"
  ],
  [
   "^(.+) \\(lawan custom\\)$",
   "$1 (custom opponent)"
  ],
  [
   "^Tidak ada pemain dengan username \"(.+)\"\\.$",
   "No player with the username \"$1\"."
  ],
  [
   "^Lawan custom aktif: (.+)$",
   "Active custom opponent: $1"
  ],
  [
   "^Tidak bisa memuat konten rute ini \\((.+)\\)\\. Periksa koneksi Anda lalu muat ulang\\.$",
   "Unable to load this route's content ($1). Check your connection and reload."
  ],
  [
   "^Terjadi kesalahan memuat skrip halaman ini\\. Coba muat ulang\\. \\((.+)\\)$",
   "An error occurred while loading this page's script. Try reloading. ($1)"
  ],
  [
   "^Periksa koneksi Anda, lalu muat ulang halaman ini\\. \\((.+)\\)$",
   "Check your connection, then reload this page. ($1)"
  ],
  [
   "^Gagal memuat script: (.+)$",
   "Failed to load script: $1"
  ],
  [
   "^Waktu tunggu habis memuat script eksternal: (.+)$",
   "Timed out loading external script: $1"
  ],
  [
   "^Rute tidak ditemukan: (.+)$",
   "Route not found: $1"
  ],
  [
   "^Tidak bisa memulai sesi di server: (.+)$",
   "Unable to start a session on the server: $T1"
  ],
  [
   "^Bot mengirim langkah tidak valid: (.+)$",
   "Bot sent an invalid move: $1"
  ],
  [
   "^Gagal klaim timeout ke server: (.+)$",
   "Failed to claim timeout on the server: $T1"
  ],
  [
   "^Gagal menyalin PGN otomatis\\. Salin manual dari sini: (.+)$",
   "Failed to copy PGN automatically. Copy it manually from here: $1"
  ],
  [
   "^Gagal menyimpan permainan \\(localStorage penuh atau tidak tersedia\\): (.+)$",
   "Failed to save game (localStorage full or unavailable): $1"
  ],
  [
   "^Server menolak langkah ini: (.+)$",
   "The server rejected this move: $T1"
  ],
  [
   "^Tidak bisa menyinkronkan ulang dari server: (.+)$",
   "Unable to resync from the server: $T1"
  ],
  [
   "^Kesalahan dari background worker: (.+)$",
   "Error from background worker: $1"
  ],
  [
   "^Mesin siap · (.+)$",
   "Engine ready · $1"
  ],
  [
   "^(.+) — analisis tidak tersedia\\. Periksa koneksi lalu muat ulang halaman\\.$",
   "$T1 — analysis unavailable. Check your connection and reload the page."
  ],
  [
   "^Timeout memuat (.+)$",
   "Timeout loading $1"
  ],
  [
   "^Server Stockfish tidak merespon \\(status (.+)\\)$",
   "Stockfish server not responding (status $1)"
  ],
  [
   "^Server Stockfish gagal membalas \\(status (.+)\\)$",
   "Stockfish server failed to reply (status $1)"
  ],
  [
   "^Permintaan gagal \\(HTTP (.+)\\)$",
   "Request failed (HTTP $1)"
  ],
  [
   "^Lesson \"(.+)\" tidak ditemukan$",
   "Lesson \"$1\" not found"
  ],
  [
   "^Data lesson \"(.+)\" tidak lengkap$",
   "Lesson data \"$1\" is incomplete"
  ],
  [
   "^ID lesson yang tersedia: (.+)$",
   "Available lesson IDs: $1"
  ],
  [
   "^Field yang hilang: (.+)$",
   "Missing fields: $1"
  ],
  [
   "^Lesson id \"(.+)\" tidak dikenal\\.$",
   "Unknown lesson id \"$1\"."
  ],
  [
   "^Benar — (.+)$",
   "Correct — $1"
  ],
  [
   "^(.*?)\\s*Langkah terbaik di posisi ini adalah (\\S+?)\\. (.+)$",
   "$T1 The best move in this position is $2. $T3"
  ],
  [
   "^(.+) harus berupa angka\\.$",
   "$1 must be a number."
  ],
  [
   "^Elo lawan custom harus angka antara (\\d+) dan (\\d+)\\.$",
   "Custom opponent Elo must be a number between $1 and $2."
  ],
  [
   "^Elo akun harus angka antara (\\d+) dan (\\d+)\\.$",
   "Account Elo must be a number between $1 and $2."
  ],
  [
   "^Gelar lawan custom tidak valid\\. Pilih salah satu: (.+)$",
   "Invalid custom opponent title. Choose one of: $1"
  ],
  [
   "^(.+) harus angka antara (\\d+) dan (\\d+)\\.$",
   "$1 must be a number between $2 and $3."
  ],
  [
   "^Akurasi fase ini: (.+)$",
   "Accuracy this phase: $1"
  ],
  [
   "^(.+) permainan · (.+) — klik salah satu\\.$",
   "$1 games · $2 — click one."
  ],
  [
   "^(.+) — Profil NusantaraChess$",
   "$1 — NusantaraChess Profile"
  ],
  [
   "^Profil (.+) di NusantaraChess: rating Bullet (\\d+), Blitz (\\d+), Rapid (\\d+), Puzzle (\\d+)\\.$",
   "$1's profile on NusantaraChess: Bullet rating $2, Blitz $3, Rapid $4, Puzzle $5."
  ],
  [
   "^Pemain tidak ditemukan — NusantaraChess$",
   "Player not found — NusantaraChess"
  ],
  [
   "^(.+) · (Menang|Kalah|Remis)((?: \\([^)]*\\))?) · (.+)$",
   "$1 · $T2$3 · $4"
  ],
  [
   "^(.+?)\\ permainan\\ ·\\ (.+?)\\ —\\ klik\\ salah\\ satu\\.$",
   "$1 games · $2 — click one."
  ],
  [
   "^(.+?)\\ langkah\\ dihitung\\ pada\\ fase\\ ini$",
   "$1 moves counted in this phase"
  ],
  [
   "^Tidak\\ ada\\ pemain\\ dengan\\ username\\ \"(.+?)\"\\.$",
   "No player with the username \"$1\"."
  ],
  [
   "^Masukkan pengguna (.+) di sini$",
   "Enter $1 username here"
  ],
  [
   "^Tempel kode (.+) di sini$",
   "Paste $1 code here"
  ],
  [
   "^Masukkan nama pengguna (.+)\\.$",
   "Enter a $1 username."
  ],
  [
   "^(.+?) adalah langkah (Bagus|Buku)$",
   "$1 is a $T2 move"
  ],
  [
   "^(.+?) adalah (Brilian|Terbaik|Sangat Baik|Baik|Tidak Akurat|Kesalahan|Terlewat|Blunder|Terpaksa)$",
   "$1 is $T2"
  ],
  [
   "^Evaluasi (.+)$",
   "Evaluation $1"
  ],
  [
   "^Promosi ke (Menteri|Benteng|Gajah|Kuda)$",
   "Promote to $T1"
  ],
  [
   "^(\\d+) langkah dihitung pada fase ini$",
   "$1 moves counted in this phase"
  ],
  [
   "^Akurasi fase ini:$",
   "Accuracy in this phase:"
  ],
  [
   "^\u00b7 (.+)$",
   "\u00b7 $T1"
  ],
  [
   "^(Pembukaan|Permainan Tengah|Permainan Akhir) \u00b7 (Putih|Hitam)$",
   "$T1 \u00b7 $T2"
  ],
  [
   "^(Putih|Hitam) \u00b7 (.+)$",
   "$T1 \u00b7 $T2"
  ],
  [
   "^Kelas waktu: (.+)$",
   "Time class: $1"
  ],
  [
   "^Kedalaman (\\d+)$",
   "Depth $1"
  ],
  [
   "^Kedalaman: (\\d+)$",
   "Depth: $1"
  ]
];
