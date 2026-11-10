export function PrivacyDialog() {
  return (
    <dialog className="legal-dialog" id="legal-privacy" aria-labelledby="legal-privacy-title">
      <div className="legal-dialog-head">
        <h2 id="legal-privacy-title">Privacy Policy</h2>
        <button type="button" className="legal-close" data-legal-close="" aria-label="Tutup"><span className="ui-ico ui-ico-close" aria-hidden="true" /></button>
      </div>
      <div className="legal-dialog-body">
        <p className="legal-updated">Terakhir diperbarui: Oktober 2026</p>
        <h3>Data yang kami simpan</h3>
        <p>
          Saat mendaftar kami menyimpan username dan password (disimpan sebagai hash, bukan teks asli). Selama bermain kami menyimpan rating Elo, hasil dan riwayat partai (PGN), progres puzzle dan lesson, serta foto profil jika kamu memilih mengunggahnya.
        </p>
        <h3>Sesi login</h3>
        <p>
          Token sesi disimpan di penyimpanan lokal (localStorage) peramban agar kamu tetap masuk saat menutup dan membuka kembali situs. Token berlaku sekitar 30 hari dan dihapus saat kamu keluar atau saat server menyatakannya tidak berlaku.
        </p>
        <h3>Layanan pihak ketiga</h3>
        <p>
          Fitur Game Review dapat mengirim posisi papan (FEN) ke layanan analisis cloud Lichess, dan fitur impor membaca partai publik dari Chess.com atau Lichess atas permintaanmu. Analisis Stockfish berjalan di peramban kamu sendiri.
        </p>
        <h3>Akun tamu</h3>
        <p>
          Akun tamu bersifat sementara dan dengan fitur terbatas; datanya tidak dimaksudkan untuk disimpan jangka panjang.
        </p>
        <h3>Pertanyaan</h3>
        <p>Untuk permintaan terkait data akunmu, hubungi kami lewat kontak di footer.</p>
      </div>
    </dialog>
  );
}
