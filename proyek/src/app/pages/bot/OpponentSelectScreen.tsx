import { CharacterDashboard } from "./CharacterDashboard";
import { PlaceholderBotRow } from "./PlaceholderBotRow";
import { callGlobal } from "../../components/dom-handlers";

export function OpponentSelectScreen() {
  return (
    <div id="opponent-select-screen" className="opponent-select-screen">
      <div className="opponent-select-box">
        <h1 className="opponent-select-title">Pilih Lawan</h1>
        <p className="opponent-select-subtitle">Pilih karakter yang ingin kamu lawan sebelum mulai bermain.</p>
        <CharacterDashboard />
        <PlaceholderBotRow />
        <label className="mode-toggle" htmlFor="opponent-tools-toggle">
          <span className="mode-toggle-text">
            <span className="mode-toggle-title">Dengan Alat</span>
            <span className="mode-toggle-desc">Batalkan langkah, analisis, dan posisi kustom</span>
          </span>
          <input
            type="checkbox"
            id="opponent-tools-toggle"
            className="mode-toggle-input"
            role="switch"
            onChange={() => callGlobal("UIToggleToolsMode")}
          />
          <span className="mode-toggle-switch" aria-hidden="true">
            <span className="mode-toggle-thumb" />
          </span>
        </label>
        <button type="button" className="btn-start-match" id="opponent-select-start-btn" disabled aria-disabled="true">Mulai Bermain</button>
        <button type="button" className="btn-resume-match hidden" id="opponent-resume-btn" onClick={() => callGlobal("UIResumePractice")}>
          <span>Lanjutkan Permainan</span> (<span id="opponent-resume-name"></span>)
        </button>
      </div>
    </div>
  );
}
