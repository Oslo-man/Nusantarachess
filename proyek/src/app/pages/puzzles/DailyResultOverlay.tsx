import { callGlobal } from "../../components/dom-handlers";

export function DailyResultOverlay() {
  return (
    <div className="game-over-overlay" id="daily-result">
      <div className="game-over-content">
        <div
          style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "8px" }}
          data-i18n="dailyPuzzle"
        >
          Daily Puzzle
        </div>
        <div id="daily-result-content" />
        <button
          className="btn btn-secondary"
          onClick={() => callGlobal("showReviewScreen")}
          data-i18n="viewSolution"
        >
          View Solution
        </button>
        {" "}
        <button
          className="btn btn-primary"
          onClick={() => callGlobal("backToSettings")}
          data-i18n="morepuzzle"
        >
          More puzzle!
        </button>
      </div>
    </div>
  );
}
