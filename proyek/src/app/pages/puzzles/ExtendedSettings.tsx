import { callGlobal } from "../../components/dom-handlers";

export function ExtendedSettings() {
  return (
    <div className="extended-settings">
      <button type="button" className="extended-toggle" onClick={() => callGlobal("toggleExtendedSettings")}>
        <span className="arrow"><span className="ui-ico ui-ico-caret-right" aria-hidden="true" /></span>
        <span data-i18n="advancedSettings">Advanced Settings</span>
      </button>
      <div className="extended-content" id="extended-content">
        <div className="extended-grid">
          <div className="setting-group">
            <label htmlFor="bonus-time" data-i18n="bonusTimePerMove">Bonus Time per Move</label>
            <select
              id="bonus-time"
              onChange={() => callGlobal("toggleCustomInput", "bonus")}
              defaultValue="0"
            >
              <option value="0" data-i18n="none">None</option>
              <option value="1" data-i18n="second1">1 Second</option>
              <option value="2" data-i18n="seconds2">2 Seconds</option>
              <option value="3" data-i18n="seconds3">3 Seconds</option>
              <option value="5" data-i18n="seconds5">5 Seconds</option>
              <option value="custom">kustom...</option>
            </select>
            <div id="bonus-custom" className="custom-input" style={{ display: "none" }}>
              <input
                type="number"
                id="bonus-custom-value"
                min="0"
                max="60"
                defaultValue="0"
                placeholder="0-60"
              />
              {" "}
              <span className="custom-unit" data-i18n="secondsUnit">Seconds</span>
            </div>
          </div>
          <div className="setting-group">
            <label htmlFor="error-behavior" data-i18n="onMistake">On Mistake</label>
            <select id="error-behavior" defaultValue="retry">
              <option value="retry" data-i18n="tryAgain">Try Again</option>
              <option value="next" data-i18n="nextPuzzle">Next Puzzle</option>
            </select>
          </div>
          <div className="setting-group">
            <label data-i18n="showHints">Show Hints</label>
            <div className="toggle-dropdown-wrapper">
              <div className="toggle-dropdown-toggle" id="tips-toggle">
                <span id="tips-display" data-i18n="hintsAll">All</span>
                <span className="toggle-dropdown-arrow"><span className="ui-ico ui-ico-caret-down" aria-hidden="true" /></span>
              </div>
              <div className="toggle-dropdown-panel" id="tips-panel">
                <label>
                  <input type="checkbox" id="tips-temas-cb" defaultChecked />
                  <span data-i18n="hintsThemes">Themes</span>
                </label>
                <label>
                  <input type="checkbox" id="tips-piece-cb" defaultChecked />
                  <span data-i18n="hintsPiece">Piece</span>
                </label>
              </div>
            </div>
          </div>
          <div className="setting-group">
            <label htmlFor="color-choice" data-i18n="colorChoice">Color</label>
            <select id="color-choice" defaultValue="mixed">
              <option value="mixed" data-i18n="colorMixed">Mixed</option>
              <option value="white" data-i18n="colorWhite">White</option>
              <option value="black" data-i18n="colorBlack">Black</option>
              <option value="random" data-i18n="colorRandom">Random</option>
            </select>
          </div>
          <div className="setting-group">
            <label htmlFor="show-rating" data-i18n="showRating">Show Rating</label>
            <select id="show-rating" defaultValue="1">
              <option value="1" data-i18n="on">On</option>
              <option value="0" data-i18n="off">Off</option>
            </select>
          </div>
          <div className="setting-group">
            <label data-i18n="pieceCount">Piece Count</label>
            <div className="range-slider-container">
              <span className="range-value" id="piece-count-display">3 \u2013 32</span>
              <div className="range-inputs">
                <div className="range-track" />
                <div className="range-track-active" id="piece-count-track" />
                <input type="range" id="piece-count-min" min="3" max="32" defaultValue="3" />
                <input type="range" id="piece-count-max" min="3" max="32" defaultValue="32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
