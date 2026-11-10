export function FaqDialog() {
  return (
    <dialog className="legal-dialog" id="legal-faq" aria-labelledby="legal-faq-title">
      <div className="legal-dialog-head">
        <h2 id="legal-faq-title">FAQ</h2>
        <button type="button" className="legal-close" data-legal-close="" aria-label="Tutup"><span className="ui-ico ui-ico-close" aria-hidden="true" /></button>
      </div>
      <div className="legal-dialog-body">
        <h3>Apa bedanya Bermain dan Lawan Bot?</h3>
        <p>
          Bermain memakai jam dan rating Elo (Bullet, Blitz, Rapid) dengan validasi langkah di server. Lawan Bot adalah latihan bebas melawan karakter Fahri, Adit, Dimas, dan Udin tanpa tekanan rating.
        </p>
        <h3>Siapa lawan di mode Bermain?</h3>
        <p>
          Saat ini lawan adalah bot yang dicocokkan dengan ratingmu oleh server; permainan antar-pemain belum tersedia.
        </p>
        <h3>Bagaimana cara memakai Game Review?</h3>
        <p>
          Setelah partai selesai, pilih Ulasan Permainan dan pindai partainya. Kamu juga bisa menempelkan PGN atau mengimpor partai dari Chess.com dan Lichess.
        </p>
        <h3>Apakah saya harus login ulang setiap kali?</h3>
        <p>
          Tidak. Sesimu tetap tersimpan di peramban (sekitar 30 hari) selama tokennya masih berlaku; kamu hanya diminta masuk lagi jika sesi berakhir atau kamu keluar.
        </p>
        <h3>Bisa mencoba tanpa mendaftar?</h3>
        <p>Bisa, lewat mode tamu dengan fitur terbatas. Profil, Library, dan Leaderboard membutuhkan akun.</p>
      </div>
    </dialog>
  );
}
