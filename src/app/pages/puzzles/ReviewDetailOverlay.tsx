import { callGlobal } from "../../components/dom-handlers";
import { ReviewDetailBody } from "./ReviewDetailBody";

export function ReviewDetailOverlay() {
  return (
    <div className="review-detail-overlay" id="review-detail">
      <div className="review-detail-content">
        <div className="review-detail-header">
          <div className="review-detail-title">
            <h3 id="review-detail-title">Puzzle #1</h3>
            <span className="review-detail-status" id="review-detail-status" data-i18n="reviewSolvedStatus">
              Solved
            </span>
          </div>
          <button className="review-detail-close" onClick={() => callGlobal("closeReviewDetail")} aria-label="Tutup"><span className="ui-ico ui-ico-close" aria-hidden="true" /></button>
        </div>
        <ReviewDetailBody />
        <div className="review-detail-nav">
          <button
            className="review-nav-btn"
            id="review-prev-btn"
            onClick={() => callGlobal("reviewPrevPuzzle")}
          >
            <span className="ui-ico ui-ico-arrow-left" aria-hidden="true" /> <span data-i18n="previous">Previous</span>
          </button>
          <button
            className="review-nav-btn"
            id="review-next-btn"
            onClick={() => callGlobal("reviewNextPuzzle")}
          >
            <span data-i18n="next">Next</span> <span className="ui-ico ui-ico-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
