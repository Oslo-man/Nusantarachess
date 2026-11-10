import { callGlobal } from "../../components/dom-handlers";

export function GameOverOverlay() {
  return (
    <div className="game-over-overlay" id="game-over">
      <div className="game-over-content">
        <h2 data-i18n="gameOver">Game Over!</h2>
        <div className="final-score" id="final-score">0</div>
        <div className="stats-summary" id="stats-summary">puzzle gelöst</div>
        <button
          className="btn btn-primary"
          onClick={() => callGlobal("showReviewScreen")}
          data-i18n="reviewpuzzle"
        >
          Review puzzle
        </button>
        {" "}
        <button className="btn btn-secondary" onClick={() => callGlobal("resetGame")} data-i18n="playAgain">
          Play Again
        </button>
        {" "}
        <button
          className="btn btn-secondary"
          onClick={() => callGlobal("backToSettings")}
          data-i18n="settings"
        >
          Settings
        </button>
        <div className="highscore-section" id="highscore-section" style={{ display: "none" }}>
          <div id="highscore-comparison" />
        </div>
      </div>
    </div>
  );
}
