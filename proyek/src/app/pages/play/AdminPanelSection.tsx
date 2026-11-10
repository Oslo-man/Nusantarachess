export function AdminPanelSection() {
  return (
    <div id="admin-panel-section" className="hidden">
      <p className="admin-unlocked-badge"><span className="ui-ico ui-ico-check" aria-hidden="true" /> <span>Fitur admin aktif</span></p>
      <div className="admin-group">
        <div className="admin-group-title">Elo Akun</div>
        <label className="admin-toggle-row">
          <input type="checkbox" id="admin-elo-protection-toggle" />
          <span>Elo tidak turun saat kalah</span>
        </label>
        <p className="admin-hint-text">
          Proteksi langsung tersimpan saat dicentang. Angka Elo di bawah tersimpan lewat tombol Simpan Elo.
        </p>
        <label className="admin-field-label" htmlFor="admin-elo-bullet">Bullet</label>
        <input
          type="number"
          id="admin-elo-bullet"
          className="admin-text-input"
          inputMode="numeric"
          min="1300"
          max="3200"
          step="1"
        />
        <label className="admin-field-label" htmlFor="admin-elo-blitz">Blitz</label>
        <input
          type="number"
          id="admin-elo-blitz"
          className="admin-text-input"
          inputMode="numeric"
          min="1300"
          max="3200"
          step="1"
        />
        <label className="admin-field-label" htmlFor="admin-elo-rapid">Rapid</label>
        <input
          type="number"
          id="admin-elo-rapid"
          className="admin-text-input"
          inputMode="numeric"
          min="1300"
          max="3200"
          step="1"
        />
        <p className="admin-hint-text">Rentang Elo akun pemain: 1300–3200.</p>
        <p className="admin-error-text hidden" id="admin-elo-error" />
        <button type="button" className="btn-primary admin-full-btn" id="admin-elo-save-btn">Simpan Elo</button>
      </div>
      <div className="admin-group">
        <div className="admin-group-title">Lawan Custom</div>
        <label className="admin-field-label" htmlFor="admin-custom-name">Nama</label>
        <input
          type="text"
          id="admin-custom-name"
          className="admin-text-input"
          maxLength="40"
          placeholder="Nama lawan"
        />
        <label className="admin-field-label" htmlFor="admin-custom-photo">Foto Profil</label>
        <div className="admin-photo-row">
          <img
            id="admin-custom-photo-preview"
            className="admin-photo-preview hidden"
            alt="Foto lawan custom"
          />
          <input
            type="file"
            id="admin-custom-photo"
            className="admin-text-input"
            accept="image/png,image/jpeg,image/webp"
          />
        </div>
        <label className="admin-field-label" htmlFor="admin-custom-country">Negara</label>
        <select id="admin-custom-country" className="admin-text-input" />
        <label className="admin-field-label" htmlFor="admin-custom-title">Gelar Catur Resmi</label>
        <select id="admin-custom-title" className="admin-text-input">
          <option value="">Tanpa gelar</option>
          <option value="CM">CM – Candidate Master</option>
          <option value="NM">NM – National Master</option>
          <option value="FM">FM – FIDE Master</option>
          <option value="IM">IM – International Master</option>
          <option value="GM">GM – Grandmaster</option>
          <option value="WCM">WCM – Woman Candidate Master</option>
          <option value="WFM">WFM – Woman FIDE Master</option>
          <option value="WIM">WIM – Woman International Master</option>
          <option value="WGM">WGM – Woman Grandmaster</option>
        </select>
        <label className="admin-field-label" htmlFor="admin-custom-elo">Elo Lawan (1320–3190)</label>
        <div className="admin-elo-pick">
          <input
            type="range"
            id="admin-custom-elo-range"
            min="1320"
            max="3190"
            step="1"
            defaultValue="1320"
            aria-label="Geser untuk memilih Elo lawan"
          />
          <input
            type="number"
            id="admin-custom-elo"
            className="admin-text-input"
            inputMode="numeric"
            min="1320"
            max="3190"
            step="1"
            placeholder="Contoh: 2500"
          />
        </div>
        <p className="admin-hint-text">
          Elo lawan custom (1320–3190) otomatis dipakai sebagai Elo UCI Stockfish lawan. Foto dipilih dari galeri/berkas perangkat. Negara menentukan bendera lawan di papan.
        </p>
        <p className="admin-error-text hidden" id="admin-custom-error" />
        <div className="admin-btn-row">
          <button type="button" className="btn-primary admin-full-btn" id="admin-custom-save-btn">
            Simpan Lawan Custom
          </button>
          <button type="button" className="btn-secondary admin-full-btn" id="admin-custom-clear-btn">
            Hapus Lawan Custom
          </button>
        </div>
        <p className="admin-status-text hidden" id="admin-custom-status" />
      </div>
    </div>
  );
}
