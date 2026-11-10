import { callGlobal } from "../../components/dom-handlers";

export function ReviewScreen() {
  return (
    <div id="review-screen" className="screen">
      <div className="review-container">
        <div className="review-header">
          <h2 data-i18n="puzzleOverview">Puzzle Overview</h2>
          <div className="review-stats">
            <div className="review-stat">
              <span className="review-stat-label" data-i18n="total">Total:</span>
              <span className="review-stat-value" id="review-total">0</span>
            </div>
            <div className="review-stat">
              <span className="review-stat-label" data-i18n="reviewSolved">Solved:</span>
              <span className="review-stat-value solved" id="review-solved">0</span>
            </div>
            <div className="review-stat">
              <span className="review-stat-label" data-i18n="reviewUnsolved">Unsolved:</span>
              <span className="review-stat-value failed" id="review-failed">0</span>
            </div>
          </div>
        </div>
        <div className="review-controls">
          <div className="review-filters">
            <button
              className="review-filter-btn active"
              data-filter="all"
              onClick={() => callGlobal("setReviewFilter", "all")}
              data-i18n="filterAll"
            >
              All
            </button>
            <button
              className="review-filter-btn"
              data-filter="solved"
              onClick={() => callGlobal("setReviewFilter", "solved")}
            >
              <span className="ui-ico ui-ico-check" aria-hidden="true" />
            </button>
            <button
              className="review-filter-btn"
              data-filter="failed"
              onClick={() => callGlobal("setReviewFilter", "failed")}
            >
              <span className="ui-ico ui-ico-close" aria-hidden="true" />
            </button>
          </div>
          <div className="review-sort">
            <button
              className="review-sort-btn active"
              data-sort="number"
              onClick={() => callGlobal("setReviewSort", "number")}
              data-i18n-title="byNumber"
              title="By Number"
            >
              #
            </button>
            <button
              className="review-sort-btn"
              data-sort="rating"
              onClick={() => callGlobal("setReviewSort", "rating")}
              data-i18n-title="byRating"
              title="By Rating"
            >
              <span className="ui-ico ui-ico-star" aria-hidden="true" />
            </button>
            <button
              className="review-sort-btn"
              data-sort="time"
              onClick={() => callGlobal("setReviewSort", "time")}
              data-i18n-title="byTime"
              title="By Time"
            >
              <span className="ui-ico ui-ico-timer" aria-hidden="true" />
            </button>
            <button
              className="review-sort-btn"
              data-sort="attempts"
              onClick={() => callGlobal("setReviewSort", "attempts")}
              data-i18n-title="byAttempts"
              title="By Attempts"
            >
              <span className="ui-ico ui-ico-retry" aria-hidden="true" />
            </button>
          </div>
          <div className="review-views">
            <button
              className="review-view-btn active"
              data-view="grid"
              onClick={() => callGlobal("setReviewView", "grid")}
              data-i18n-title="gridView"
              title="Grid"
            >
              <span className="ui-ico ui-ico-grid" aria-hidden="true" />
            </button>
            <button
              className="review-view-btn"
              data-view="list"
              onClick={() => callGlobal("setReviewView", "list")}
              data-i18n-title="listView"
              title="List"
            >
              <span className="ui-ico ui-ico-menu" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="review-content" id="review-content" />
        <div className="review-back-section">
          <button className="btn btn-secondary" onClick={() => callGlobal("resetGame")} data-i18n="playAgain">
            Play Again
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => callGlobal("backToSettings")}
            data-i18n="settings"
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
