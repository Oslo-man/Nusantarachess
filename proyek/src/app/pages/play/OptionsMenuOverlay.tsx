export function OptionsMenuOverlay() {
  return (
    <div className="options-menu-overlay hidden" id="options-menu-overlay">
      <div className="options-menu-box">
        <h3>Pilihan</h3>
        <button type="button" className="option-item" id="option-cancel-btn">Batalkan</button>
        <button type="button" className="option-item" id="option-draw-btn">Tawarkan Remis</button>
        <button type="button" className="option-item" id="option-copy-pgn-btn">Salin PGN</button>
        <button type="button" className="option-item" id="option-share-pgn-btn">Bagikan PGN</button>
        <button type="button" className="option-item option-item-close" id="option-close-btn">Tutup</button>
      </div>
    </div>
  );
}
