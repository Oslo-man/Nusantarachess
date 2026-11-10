export function SavedGamesPage() {
  return (
    <div id="saved-games-page" className="page">
      <div className="topbar">
        <button className="btn-icon" id="saved-games-back-btn" title="Kembali" aria-label="Kembali"><span className="ui-ico ui-ico-arrow-left" aria-hidden="true" /></button>
        <div className="brand-row">
          <span className="brand-text">Riwayat Permainan</span>
        </div>
        <span style={{ width: "32px" }} />
      </div>
      <div className="dashboard-content">
        <ul id="saved-games-list" className="saved-games-list" />
        <p id="saved-games-empty" className="saved-games-empty hidden">Belum ada permainan yang tersimpan.</p>
      </div>
    </div>
  );
}
