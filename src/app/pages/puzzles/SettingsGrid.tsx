import { callGlobal } from "../../components/dom-handlers";

export function SettingsGrid() {
  return (
    <div className="settings-grid">
      <div className="setting-group">
        <label htmlFor="time-limit" data-i18n="timeLimit">Time Limit</label>
        <select id="time-limit" onChange={() => callGlobal("toggleCustomInput", "time")} defaultValue="300">
          <option value="60" data-i18n="minute1">1 Minute</option>
          <option value="180" data-i18n="minutes3">3 Minutes</option>
          <option value="300" data-i18n="minutes5">5 Minutes</option>
          <option value="600" data-i18n="minutes10">10 Minutes</option>
          <option value="0" data-i18n="unlimited">Unlimited</option>
          <option value="custom">kustom...</option>
        </select>
        <div id="time-custom" className="custom-input" style={{ display: "none" }}>
          <input
            type="number"
            id="time-custom-value"
            min="1"
            max="999"
            defaultValue="5"
            placeholder="1-999"
          />
          {" "}
          <span className="custom-unit" data-i18n="minutesUnit">Minutes</span>
        </div>
      </div>
      <div className="setting-group">
        <label htmlFor="start-rating" data-i18n="startRating">Start Rating</label>
        <select
          id="start-rating"
          onChange={() => callGlobal("toggleCustomInput", "rating")}
          defaultValue="1400"
        >
          <option value="600" data-i18n="veryEasy">Very Easy (~600)</option>
          <option value="1000" data-i18n="easy">Easy (~1000)</option>
          <option value="1400" data-i18n="medium">Medium (~1400)</option>
          <option value="1800" data-i18n="advanced">Advanced (~1800)</option>
          <option value="2200" data-i18n="hard">Hard (~2200)</option>
          <option value="2600" data-i18n="veryHard">Very Hard (~2600)</option>
          <option value="3000" data-i18n="insane">Insane (~3000)</option>
          <option value="custom">kustom...</option>
        </select>
        <div id="rating-custom" className="custom-input" style={{ display: "none" }}>
          <input
            type="number"
            id="rating-custom-value"
            min="0"
            max="3200"
            defaultValue="1400"
            placeholder="0-3200"
          />
          {" "}
          <span className="custom-unit">Rating</span>
        </div>
      </div>
      <div className="setting-group">
        <label htmlFor="max-errors" data-i18n="mistakes">Mistakes</label>
        <select id="max-errors" onChange={() => callGlobal("toggleCustomInput", "errors")} defaultValue="3">
          <option value="1" data-i18n="mistake1">1 Mistake</option>
          <option value="3" data-i18n="mistakes3">3 Mistakes</option>
          <option value="5" data-i18n="mistakes5">5 Mistakes</option>
          <option value="0" data-i18n="unlimited">Unlimited</option>
          <option value="custom">kustom...</option>
        </select>
        <div id="errors-custom" className="custom-input" style={{ display: "none" }}>
          <input
            type="number"
            id="errors-custom-value"
            min="1"
            max="99"
            defaultValue="3"
            placeholder="1-99"
          />
          {" "}
          <span className="custom-unit" data-i18n="mistakesUnit">Mistakes</span>
        </div>
      </div>
      <div className="setting-group">
        <label htmlFor="rating-increase" data-i18n="increasePerPuzzle">Increase per Puzzle</label>
        <select
          id="rating-increase"
          onChange={() => callGlobal("toggleCustomInput", "increase")}
          defaultValue="15"
        >
          <option value="0" data-i18n="none">None</option>
          <option value="10" data-i18n="slow">Slow (+10)</option>
          <option value="15" data-i18n="normal">Normal (+15)</option>
          <option value="25" data-i18n="fast">Fast (+25)</option>
          <option value="50" data-i18n="veryFast">Very Fast (+50)</option>
          <option value="custom">kustom...</option>
        </select>
        <div id="increase-custom" className="custom-input" style={{ display: "none" }}>
          <input
            type="number"
            id="increase-custom-value"
            min="0"
            max="1000"
            defaultValue="15"
            placeholder="0-1000"
          />
          {" "}
          <span className="custom-unit" data-i18n="perPuzzle">per Puzzle</span>
        </div>
      </div>
      <div className="setting-group">
        <label htmlFor="theme-filter-toggle" data-i18n="themeFilter">Theme Filter</label>
        <div className="theme-dropdown-wrapper">
          <div className="theme-dropdown-toggle" id="theme-filter-toggle">
            <span id="theme-filter-display" data-i18n="allThemes">All Themes</span>
            <span className="theme-dropdown-arrow"><span className="ui-ico ui-ico-caret-down" aria-hidden="true" /></span>
          </div>
          <div className="theme-dropdown-panel" id="theme-dropdown-panel">
            <div className="theme-dropdown-scroll">
              <div className="theme-item theme-item-all">
                <button type="button" id="theme-reset-btn" className="theme-reset-btn" data-i18n="reset">Reset</button>
              </div>
              <div className="theme-match-mode">
                <label>
                  <input type="radio" name="theme-match" value="any" defaultChecked />
                  <span data-i18n="atLeastOneTheme">At least one theme</span>
                  <span
                    className="info-icon"
                    data-i18n-title="atLeastOneThemeTooltip"
                    title="Puzzle must contain at least one selected theme"
                  >
                    <span className="ui-ico ui-ico-info" aria-hidden="true" />
                  </span>
                </label>
                <label>
                  <input type="radio" name="theme-match" value="all" />
                  <span data-i18n="allThemesMatch">All themes</span>
                  <span
                    className="info-icon"
                    data-i18n-title="allThemesMatchTooltip"
                    title="Puzzle must contain all selected themes"
                  >
                    <span className="ui-ico ui-ico-info" aria-hidden="true" />
                  </span>
                </label>
              </div>
              <div id="theme-filter-container">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="setting-group">
        <label data-i18n="sound">Sound</label>
        <div className="toggle-dropdown-wrapper">
          <div className="toggle-dropdown-toggle" id="sound-toggle">
            <span id="sound-display" data-i18n="soundAllOn">All On</span>
            <span className="toggle-dropdown-arrow"><span className="ui-ico ui-ico-caret-down" aria-hidden="true" /></span>
          </div>
          <div className="toggle-dropdown-panel" id="sound-panel">
            <label>
              <input type="checkbox" id="sound-moves-cb" defaultChecked />
              <span data-i18n="soundMoves">Moves</span>
            </label>
            <label>
              <input type="checkbox" id="sound-effects-cb" defaultChecked />
              <span data-i18n="soundEffects">Effects</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
