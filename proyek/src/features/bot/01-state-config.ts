/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
var moveNumber = 1;

var g_allMoves: any[] = [];

var g_boardHistory: any[] = [];
var g_viewIndex = 0;
var g_playerWhite = true;
var g_changingFen = false;
var g_analyzing = false;

var g_uiBoard: any;

var g_engineLevel = 3;

var g_fahriTimeControlActive = true;

// Fahri hanya punya satu tingkat: level utama (3). Pemilih level dan level 1/2 dihapus.
var g_engineFiles: any = {
    3: "vendor/chess-engines/fahriengine.js"
};

var g_engineInfo: any = {
    3: { name: "Fahri serius 2300" }
};

// Tidak ada karakter bawaan: pemain memilih lawan sendiri di layar Pilih Lawan (nilai terisi lewat UIChangeCharacter / UIResumePractice).
// Daftar & urutan kartu (urut Elo) ada di src/app/pages/bot/bot-roster.ts.
var g_character = '';

var g_characterFiles: any = {
    udin:  "vendor/chess-engines/udin.js",    // salinan mesin Dimas, kedalaman 2
    adit:  "vendor/chess-engines/adit.js",
    dimas: "vendor/chess-engines/dimas.js",
    agus:  "vendor/chess-engines/agus.js",
    ilham: "vendor/chess-engines/ilham.js",
    josep: "vendor/chess-engines/josep.js",
    asep: "vendor/chess-engines/asep.js"
};

var g_characterInfo: any = {
    udin:  { name: "Udin 1250" },
    adit:  { name: "Adit 1000" },
    dimas: { name: "Dimas 1650" },
    agus:  { name: "Agus 1600" },
    ilham: { name: "Ilham 2450" },
    josep: { name: "Josep 2200" },
    asep: { name: "Asep 1850" },
    fahri: { name: "Fahri 2300" }
};

// Gelar yang tampil di baris lawan (desain badge sama dengan halaman Play). Bot yang tidak tercantum = tanpa gelar.
var g_characterTitles: any = {
    ilham: "NM",
    josep: "NM",
    fahri: "NM"
};
// Bendera yang tampil di samping nama lawan (sama seperti bot di Play: Indonesia). Berlaku untuk semua bot.
var g_characterFlag = "🇮🇩";

var g_characterAvatars: any = {
    udin: "images/udin.svg",   // sama dengan images/<id>.svg yang dipakai kartu di bot-roster.ts
    adit: "images/adit.svg",
    dimas: "images/dimas.svg",
    agus: "images/agus.svg",
    ilham: "images/ilham.svg",
    josep: "images/josep.svg",
    asep: "images/asep.svg",
    fahri: "images/fahri.svg"
};
// Cadangan netral (siluet) bila gambar bot tidak ada / gagal dimuat. Dulu memakai foto Fahri,
// sehingga bot tanpa entri avatar tampil dengan wajah Fahri.
var g_defaultOpponentAvatar = "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#939291">' +
    '<circle cx="12" cy="8" r="4.2"/><path d="M3.8 21.2c0-4.5 3.7-8.1 8.2-8.1s8.2 3.6 8.2 8.1z"/></svg>');

