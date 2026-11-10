import { callGlobal } from "../../components/dom-handlers";
import { SettingsGrid } from "./SettingsGrid";
import { ExtendedSettings } from "./ExtendedSettings";

export function SetupScreen() {
  return (
    <div id="setup-screen" className="screen active">
      <div className="settings-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 style={{ margin: "0" }} data-i18n="settings">Settings</h2>
          <div style={{ display: "flex", gap: "12px", alignItems: "baseline" }}>
            <a
              href="#"
              id="daily-link"
              onClick={(e) => { e.preventDefault(); callGlobal("startDailyPuzzle"); }}
              className="daily-link"
            >
              <span data-i18n="dailyPuzzle">Daily Puzzle</span>
              <span id="daily-link-text" />
              {" "}
              <span className="ui-ico ui-ico-arrow-right" aria-hidden="true" />
            </a>
            <span className="lang-toggle" id="lang-toggle">‎</span>
          </div>
        </div>
        <SettingsGrid />
        <ExtendedSettings />
        <div className="settings-actions">
          <button className="btn btn-primary" onClick={() => callGlobal("startGame")} data-i18n="startGame">
            Start Game
          </button>
          <button className="btn btn-secondary" onClick={() => callGlobal("resetSettings")} data-i18n="reset">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
