import { callGlobal } from "../../components/dom-handlers";
import { NavIcon } from "../../components/NavIcons";

export function ReviewDetailBody() {
  return (
    <div className="review-detail-body">
      <div className="review-detail-board-section" id="review-detail-board-section">
        <div className="eval-bar hidden" id="eval-bar">
          <div className="eval-bar-fill" id="eval-bar-fill" style={{ height: "50%" }} />
          <div className="eval-bar-text" id="eval-bar-text">0.0</div>
        </div>
        <div className="review-board-col">
          <div id="review-board" />
          <div className="review-turn-indicator" id="review-turn-indicator" />
        </div>
      </div>
      <div className="review-detail-info">
        <div className="stockfish-panel hidden" id="stockfish-panel">
          <div className="stockfish-status" id="sf-status" />
          <div className="stockfish-variants" id="sf-variants" />
        </div>
        <div className="analysis-controls hidden" id="analysis-controls">
          <div className="analysis-playback">
            <button
              onClick={() => callGlobal("analysisGoToStart")}
              data-i18n-title="goToStart"
              title="Go to Start"
            >
              <NavIcon name="first" />
            </button>
            <button onClick={() => callGlobal("analysisGoBack")} data-i18n-title="back" title="Back"><NavIcon name="prev" /></button>
            <button onClick={() => callGlobal("analysisGoForward")} data-i18n-title="forward" title="Forward"><NavIcon name="next" /></button>
            <button onClick={() => callGlobal("analysisGoToEnd")} data-i18n-title="goToEnd" title="Go to End">
              <NavIcon name="last" />
            </button>
          </div>
        </div>
        <div className="review-mode-buttons" id="review-mode-buttons">
          <button
            className="review-mode-btn active"
            id="mode-btn-solution"
            onClick={() => callGlobal("reviewNeuerVersuch")}
            data-i18n="retry"
          >
            Retry
          </button>
          <button
            className="review-mode-btn"
            id="mode-btn-loesung"
            onClick={() => callGlobal("switchReviewMode", "loesung")}
            data-i18n="solution"
          >
            Solution
          </button>
          <button
            className="review-mode-btn"
            id="mode-btn-analysis"
            onClick={() => callGlobal("switchReviewMode", "analysis")}
            data-i18n="analysis"
          >
            Analysis
          </button>
          <button
            className="review-mode-btn"
            id="mode-btn-stockfish"
            onClick={() => callGlobal("switchReviewMode", "stockfish")}
          >
            Stockfish
          </button>
        </div>
        <div className="review-puzzle-info">
          <p>
            <span className="label" data-i18n="attemptsLabel">Attempts:</span>
            {" "}
            <span id="review-detail-attempts">1</span>
          </p>
          {" "}
          <p>
            <span className="label" data-i18n="timeLabel">Time:</span>
            {" "}
            <span id="review-detail-time">0:00</span>
          </p>
          {" "}
          <p>
            <span className="label" data-i18n="ratingLabel">Rating:</span>
            {" "}
            <span id="review-detail-rating">1200</span>
          </p>
          <p>
            <span className="label" data-i18n="themesLabel">Themes:</span>
            {" "}
            <span id="review-detail-themes">-</span>
          </p>
          <p>
            <a
              id="review-lichess-link"
              href="#"
              target="_blank"
              className="review-lichess-link"
            >
              <span data-i18n="puzzleOnLichess">Puzzle on Lichess</span> <span className="ui-ico ui-ico-external" aria-hidden="true" />
            </a>
          </p>
        </div>
        <div className="review-feedback neutral" id="review-feedback" data-i18n="findBestMove">
          Find the best move!
        </div>
        <div className="review-solution hidden" id="review-solution">
          <div className="review-solution-content">
            <div className="review-solution-moves" id="review-solution-moves" />
            <div className="review-playback">
              <button
                onClick={() => callGlobal("reviewGoToStart")}
                data-i18n-title="goToStart"
                title="Go to Start"
              >
                <NavIcon name="first" />
              </button>
              <button onClick={() => callGlobal("reviewPrevMove")} data-i18n-title="back" title="Back"><NavIcon name="prev" /></button>
              <button onClick={() => callGlobal("reviewNextMove")} data-i18n-title="forward" title="Forward"><NavIcon name="next" /></button>
              <button onClick={() => callGlobal("reviewGoToEnd")} data-i18n-title="goToEnd" title="Go to End">
                <NavIcon name="last" />
              </button>
              <button
                onClick={() => callGlobal("reviewPlaySolution")}
                data-i18n-title="play"
                title="Play"
                id="review-play-btn"
              ><NavIcon name="play" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
