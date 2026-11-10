export function LevelSelectModal() {
  return (
    <div className="auth-modal-overlay hidden" id="level-select-view">
      <div
        className="auth-box level-select-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="levelSelectHeading"
      >
        <h2 id="levelSelectHeading">Pilih Level Permainan Anda</h2>
        <p className="level-select-hint">
          Level ini menentukan rating awal permainan DAN puzzle Anda - bisa naik/turun lewat permainan sungguhan setelah ini, tapi hanya bisa dipilih sekali di sini.
        </p>
        <div className="difficulty-grid">
          <button className="difficulty-card" data-tier="Menengah" data-base="1400">
            <span className="tier-name">Menengah</span>
            <span className="tier-elo">Rating 1400</span>
          </button>
          <button className="difficulty-card" data-tier="Tingkat Lanjut" data-base="1800">
            <span className="tier-name">Tingkat Lanjut</span>
            <span className="tier-elo">Rating 1800</span>
          </button>
          <button className="difficulty-card" data-tier="Ahli" data-base="2200">
            <span className="tier-name">Ahli</span>
            <span className="tier-elo">Rating 2200</span>
          </button>
          <button className="difficulty-card" data-tier="Calon Master" data-base="2500">
            <span className="tier-name">Calon Master</span>
            <span className="tier-elo">Rating 2500</span>
          </button>
          <button className="difficulty-card" data-tier="Master" data-base="2700" data-protected="1">
            <span className="tier-name"><span className="ui-ico ui-ico-lock" aria-hidden="true" /> Master</span>
            <span className="tier-elo">Rating 2700</span>
          </button>
          <button className="difficulty-card" data-tier="Grandmaster" data-base="3000" data-protected="1">
            <span className="tier-name"><span className="ui-ico ui-ico-lock" aria-hidden="true" /> Grandmaster</span>
            <span className="tier-elo">Rating 3000</span>
          </button>
          <button
            className="difficulty-card"
            data-tier="Super Grandmaster"
            data-base="3100"
            data-protected="1"
          >
            <span className="tier-name"><span className="ui-ico ui-ico-lock" aria-hidden="true" /> Super Grandmaster</span>
            <span className="tier-elo">Rating 3100</span>
          </button>
        </div>
        <div className="level-password-prompt hidden" id="level-password-prompt">
          <label htmlFor="level-password-input" id="level-password-label">Level ini butuh password.</label>
          <div className="level-password-row">
            <input
              type="password"
              id="level-password-input"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck="false"
              placeholder="Masukkan password level"
            />
            <button type="button" className="btn-verify" id="verify-level-btn" disabled>Verifikasi</button>
          </div>
          <p className="error-msg" id="level-password-error" role="alert" />
          <p className="level-password-ok" id="level-password-ok" role="status" />
        </div>
        <button className="btn-primary" id="confirm-level-btn" disabled>Pilih level dulu</button>
      </div>
    </div>
  );
}
