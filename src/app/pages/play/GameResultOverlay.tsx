export function GameResultOverlay() {
  return (
    <div className="game-result-overlay hidden" id="game-result-overlay">
      <div className="game-result-box">
        <div className="game-result-title" id="game-result-title">Menang</div>
        <div className="game-result-subtitle" id="game-result-subtitle" />
        <div className="game-result-elo" id="game-result-elo" />
        <button type="button" className="btn-primary game-result-full-btn" id="game-result-again-btn">
          Main Lagi
        </button>
        <button type="button" className="btn-secondary game-result-full-btn" id="game-result-review-btn">
          Ulasan Permainan
        </button>
        <button type="button" className="btn-secondary game-result-full-btn" id="game-result-close-btn">Tutup</button>
      </div>
    </div>
  );
}
