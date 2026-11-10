export function BoardMenu() {
  return (
    <div className="bc-boardmenu">
      <div className="bc-bm-icons">
        <button type="button" className="bc-bm-btn" id="settingsBtn" title="Pengaturan" aria-label="Pengaturan"
          aria-haspopup="true" aria-expanded="false" aria-controls="reviewSettingsMenu">
          <img src="/images/bc-settings.svg" alt="" width={17} height={17} draggable={false} />
        </button>
        <button type="button" className="bc-bm-btn" id="navShare" title="Bagikan PGN" aria-label="Bagikan PGN">
          <img src="/images/bc-share.svg" alt="" width={17} height={17} draggable={false} />
        </button>
        <button type="button" className="bc-bm-btn" id="navFlip" title="Balik papan" aria-label="Balik papan">
          <img src="/images/bc-flip.svg" alt="" width={17} height={17} draggable={false} />
        </button>
      </div>
    </div>
  );
}
