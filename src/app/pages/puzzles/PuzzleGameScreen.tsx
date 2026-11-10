import { callGlobal } from "../../components/dom-handlers";

export function PuzzleGameScreen() {
  return (
    <div id="game-screen" className="screen">
      <div className="game-container">
        <div className="board-section">
          <div className="board-wrapper">
            <div className="board" id="board" />
          </div>
          <div className="turn-indicator" id="turn-indicator" />
        </div>
        <div className="side-panel">
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-label" data-i18n="time">Time</div>
              <div className="stat-value time" id="timer">5:00</div>
            </div>
            <div className="stat-box">
              <div className="stat-label" data-i18n="solved">Solved</div>
              <div className="stat-value solved" id="solved">0</div>
            </div>
            <div className="stat-box">
              <div className="stat-label" data-i18n="mistakesLabel">Mistakes</div>
              <div className="stat-value errors" id="errors">0/3</div>
            </div>
            <div className="stat-box">
              <div className="stat-label" data-i18n="rating">Rating</div>
              <div className="stat-value rating" id="current-rating">1200</div>
            </div>
          </div>
          <div className="progress-section" style={{ display: "none" }}>
            <div className="progress-label" data-i18n="puzzleProgress">Puzzle Progress</div>
            <div className="progress-bar">
              <div className="progress-fill" id="progress-fill" style={{ width: "0%" }} />
            </div>
          </div>
          <div className="feedback neutral" id="feedback" data-i18n="findBestMove">Find the best move!</div>
          <div className="move-input-container">
            <input
              type="text"
              id="move-input"
              data-i18n-placeholder="moveInputPlaceholder"
              placeholder="Enter move (e.g. Nf3)"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            {" "}
            <button className="btn-move-submit" onClick={() => callGlobal("submitMoveInput")} aria-label="Enter"><span className="ui-ico ui-ico-enter" aria-hidden="true" /></button>
          </div>
          <button
            className="btn btn-skip"
            id="skip-btn"
            onClick={() => callGlobal("skipPuzzle")}
            style={{ display: "none" }}
            data-i18n="continue_"
          >
            Continue
          </button>
          <div className="help-buttons">
            <button className="help-btn" id="help-themes-btn" onClick={() => callGlobal("showThemeHint")}>
              <span data-i18n="themesHintBtn">Themes</span>
            </button>
            <button className="help-btn" id="help-piece-btn" onClick={() => callGlobal("showPieceHint")}>
              <span className="help-icon"><span className="ui-ico ui-ico-pawn" aria-hidden="true" /></span>
              <span data-i18n="showPieceBtn">Show Piece</span>
            </button>
          </div>
          <button
            className="btn btn-secondary btn-end-game"
            onClick={() => callGlobal("endGame")}
            data-i18n="endGame"
          >
            End Game
          </button>
        </div>
      </div>
    </div>
  );
}
