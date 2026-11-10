export function TermsDialog() {
  return (
    <dialog className="legal-dialog" id="legal-terms" aria-labelledby="legal-terms-title">
      <div className="legal-dialog-head">
        <h2 id="legal-terms-title">Terms & Conditions</h2>
        <button type="button" className="legal-close" data-legal-close="" aria-label="Tutup"><span className="ui-ico ui-ico-close" aria-hidden="true" /></button>
      </div>
      <div className="legal-dialog-body">
        <p className="legal-updated">Terakhir diperbarui: Oktober 2026</p>
        <h3>Penggunaan layanan</h3>
        <p>
          Dengan memakai NusantaraChess kamu setuju menggunakannya secara wajar dan sesuai hukum yang berlaku. Kamu bertanggung jawab atas keamanan username dan password akunmu.
        </p>
        <h3>Permainan yang adil</h3>
        <p>
          Dilarang memakai mesin catur atau bantuan eksternal, mengakali sistem rating, atau mengganggu layanan. Kami dapat menyesuaikan atau menonaktifkan akun yang melanggar.
        </p>
        <h3>Rating dan data</h3>
        <p>
          Rating Elo, statistik, dan riwayat partai dihitung oleh server dan dapat berubah seiring pembaruan sistem. Kami tidak menjamin data tersimpan selamanya.
        </p>
        <h3>Tanpa jaminan</h3>
        <p>
          Layanan disediakan apa adanya, tanpa jaminan selalu tersedia atau bebas gangguan. Dalam batas yang diizinkan hukum, pengembang tidak bertanggung jawab atas kerugian dari penggunaan layanan.
        </p>
        <h3>Perubahan</h3>
        <p>
          Ketentuan ini dapat diperbarui sewaktu-waktu; penggunaan berkelanjutan berarti kamu menerima versi terbaru.
        </p>
      </div>
    </dialog>
  );
}
