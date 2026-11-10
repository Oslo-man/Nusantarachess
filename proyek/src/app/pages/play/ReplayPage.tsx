import { NavIcon } from "../../components/NavIcons";

export function ReplayPage() {
  return (
    <div id="replay-page" className="page">
      <div className="main-content">
        <div className="app-header">
          <button type="button" className="quit-btn-corner" id="replay-back-btn" title="Kembali">
            <span style={{ fontSize: "20px" }}><span className="ui-ico ui-ico-arrow-left" aria-hidden="true" /></span>
          </button>
          <div className="app-header-row">
            <div className="brand-row brand-row-center">
              <span className="brand-text" id="replay-title">Riwayat Permainan</span>
            </div>
          </div>
        </div>
        <div className="game-area">
          <div className="board-wrapper replay-board-wrapper">
            <div id="replay-chessboard" className="chessboard" />
          </div>
          <div className="move-nav-panel">
            <button type="button" className="nav-btn" id="replay-nav-first-btn" title="Ke Awal" aria-label="Ke Awal"><NavIcon name="first" /></button>
            <button type="button" className="nav-btn" id="replay-nav-back-btn" title="Mundur" aria-label="Mundur"><NavIcon name="prev" /></button>
            <button type="button" className="nav-btn" id="replay-nav-forward-btn" title="Maju" aria-label="Maju"><NavIcon name="next" /></button>
            <button type="button" className="nav-btn" id="replay-nav-last-btn" title="Ke Terbaru" aria-label="Ke Terbaru"><NavIcon name="last" /></button>
            <div className="replay-autoplay">
              <button type="button" className="replay-autoplay-btn" id="replay-autoplay-btn" aria-pressed="false" title="Putar otomatis">
                <NavIcon name="play" className="replay-ap-icon replay-ap-play" />
                <NavIcon name="pause" className="replay-ap-icon replay-ap-pause" />
                <span id="replay-autoplay-label">Putar otomatis</span>
              </button>
              <label className="replay-autoplay-speed">
                <span className="replay-autoplay-speed-text">Kecepatan</span>
                <select id="replay-autoplay-speed" defaultValue="1200" aria-label="Kecepatan putar otomatis">
                  <option value="2000">Lambat</option>
                  <option value="1200">Normal</option>
                  <option value="700">Cepat</option>
                  <option value="350">Sangat cepat</option>
                </select>
              </label>
            </div>
          </div>
          <button type="button" className="btn-secondary" id="replay-copy-pgn-btn">Salin PGN</button>
          <div className="move-history-wrap">
            <h3>Riwayat Langkah</h3>
            <ol id="replay-move-history" className="move-history" />
          </div>
        </div>
      </div>
    </div>
  );
}
