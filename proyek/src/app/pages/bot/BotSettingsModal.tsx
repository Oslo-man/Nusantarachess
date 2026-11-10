import { callGlobal, onNativeChange } from "../../components/dom-handlers";
import { SettingsIcon } from "../../components/ActionIcons";
import { SORTED_BOTS } from "./bot-roster";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function BotSettingsModal() {
  return (
    <div
      className="modal-overlay"
      id="settingsModal"
      onClick={(e) => { if (e.target === e.currentTarget) callGlobal("UICloseSettings"); }}
    >
      <div className="modal-panel bs-modal" role="dialog" aria-modal="true" aria-labelledby="botSettingsTitle">
        <div className="modal-header bs-header">
          <span className="modal-title bs-title" id="botSettingsTitle">
            <SettingsIcon />
            <span>Pengaturan</span>
          </span>
          <button type="button" className="modal-close" onClick={() => callGlobal("UICloseSettings")} aria-label="Tutup">
            <CloseIcon />
          </button>
        </div>

        <section className="bs-group">
          <h1 className="bs-sec-title">Permainan</h1>
          <div className="bs-field">
            <label className="bs-label" htmlFor="StartPlayerSelect">Warna Bermain</label>
            <select id="StartPlayerSelect" className="level-select bs-select" onChange={() => callGlobal("UIChangeStartPlayer")}>
              <option value="white">Main Putih</option>
              <option value="black">Main Hitam</option>
            </select>
          </div>
          <div className="bs-field">
            <label className="bs-label" htmlFor="ModeSelect">Mode Permainan</label>
            <select
              id="ModeSelect"
              className="level-select bs-select"
              onChange={() => callGlobal("UISetModeFromSelect")}
              defaultValue="challenge"
            >
              <option value="friendly">Dengan alat</option>
              <option value="challenge">Tanpa alat</option>
            </select>
          </div>
        </section>

        <section className="bs-group">
          <h1 className="bs-sec-title">Lawan</h1>
          <div className="bs-field">
            <label className="bs-label" htmlFor="CharacterSelect">Pilih Karakter</label>
            <select
              id="CharacterSelect"
              className="level-select bs-select"
              onChange={() => callGlobal("UIChangeCharacter")}
              defaultValue=""
            >
              {/* Kosong = belum ada lawan dipilih (Agus tidak lagi default). Opsi daftar bot dibuat otomatis & urut Elo dari bot-roster.ts. */}
              <option value="" disabled hidden></option>
              {SORTED_BOTS.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.elo} Elo)</option>
              ))}
            </select>
          </div>
          <div className="bs-field bs-time-row input-row" id="timeRow">
            <label className="bs-label input-label" htmlFor="TimePerMove">Waktu per gerakan</label>
            <div className="bs-time-input">
              <input
                id="TimePerMove"
                type="number"
                defaultValue="2000"
                ref={onNativeChange("UIChangeTimePerMove")}
              />
              <span className="bs-unit">milidetik</span>
            </div>
          </div>
        </section>

        <div className="bs-group bs-field" id="fenSection">
          <h1 className="bs-sec-title">Lanjutan</h1>
          <label className="bs-label bs-sr" htmlFor="FenTextBox">Posisi Papan (FEN)</label>
          <input id="FenTextBox" type="text" ref={onNativeChange("UIChangeFEN")} />
        </div>
        <div className="bs-group bs-field" id="statusSection">
          <h1 className="bs-sec-title">Status Mesin</h1>
          <div id="output">Selamat bermain…</div>
        </div>
        <section className="bs-group">
          <h1 className="bs-sec-title">Riwayat Gerakan (PGN)</h1>
          <label className="bs-label bs-sr" htmlFor="PgnTextBox">Riwayat Gerakan (PGN)</label>
          <textarea id="PgnTextBox" readOnly />
        </section>
      </div>
    </div>
  );
}
