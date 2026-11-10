import { hideImgInvisible } from "../../components/dom-handlers";

export function TimeControlDropdown() {
  return (
    <div className="time-dropdown" id="time-dropdown">
      <button
        type="button"
        className="time-dropdown-trigger"
        id="time-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        <span className="time-dropdown-trigger-icon" id="time-dropdown-trigger-icon">
          <svg
            className="time-trigger-default"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2.5 2.5M9 2h6" />
          </svg>
        </span>
        <span className="time-dropdown-trigger-label" id="time-dropdown-trigger-label">Pilih kontrol waktu</span>
        <span className="time-dropdown-caret" aria-hidden="true"><span className="ui-ico ui-ico-caret-down" aria-hidden="true" /></span>
      </button>
      <div
        className="time-dropdown-panel"
        id="time-dropdown-panel"
        role="listbox"
        aria-label="Pilih kontrol waktu"
      >
        <p className="time-category">
          <img className="time-category-icon" src="images/bullet.svg" alt="" onError={hideImgInvisible} />
          Bullet
        </p>
        <div className="time-option-row">
          <button
            type="button"
            className="time-option"
            role="option"
            data-time="60"
            data-inc="0"
            data-category="bullet"
          >
            1+0
          </button>
          <button
            type="button"
            className="time-option"
            role="option"
            data-time="60"
            data-inc="1"
            data-category="bullet"
          >
            1+1
          </button>
          <button
            type="button"
            className="time-option"
            role="option"
            data-time="120"
            data-inc="1"
            data-category="bullet"
          >
            2+1
          </button>
        </div>
        <p className="time-category">
          <img className="time-category-icon" src="images/blitz.svg" alt="" onError={hideImgInvisible} />
          Blitz
        </p>
        <div className="time-option-row">
          <button
            type="button"
            className="time-option"
            role="option"
            data-time="180"
            data-inc="0"
            data-category="blitz"
          >
            3+0
          </button>
          <button
            type="button"
            className="time-option"
            role="option"
            data-time="180"
            data-inc="2"
            data-category="blitz"
          >
            3+2
          </button>
          <button
            type="button"
            className="time-option"
            role="option"
            data-time="300"
            data-inc="0"
            data-category="blitz"
          >
            5+0
          </button>
        </div>
        <p className="time-category">
          <img className="time-category-icon" src="images/rapid.svg" alt="" onError={hideImgInvisible} />
          Rapid
        </p>
        <div className="time-option-row">
          <button
            type="button"
            className="time-option"
            role="option"
            data-time="600"
            data-inc="0"
            data-category="rapid"
          >
            10+0
          </button>
          <button
            type="button"
            className="time-option"
            role="option"
            data-time="900"
            data-inc="10"
            data-category="rapid"
          >
            15+10
          </button>
          <button
            type="button"
            className="time-option"
            role="option"
            data-time="1800"
            data-inc="0"
            data-category="rapid"
          >
            30+0
          </button>
        </div>
        <div className="time-custom" id="time-custom">
          <button
            type="button"
            className="time-custom-toggle"
            id="time-custom-toggle"
            aria-expanded="false"
            aria-controls="time-custom-panel"
          >
            <span className="time-custom-toggle-label">Kendali Waktu Kustom</span>
            <svg
              className="time-custom-chevron time-custom-chevron-down"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
              focusable="false"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
            <svg
              className="time-custom-chevron time-custom-chevron-up"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
              focusable="false"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
          <div className="time-custom-panel" id="time-custom-panel" role="group" aria-label="Kendali Waktu Kustom">
            <div className="time-custom-field">
              <label className="time-custom-label" htmlFor="time-custom-minutes">
                <span>Waktu Awal</span>
                <output id="time-custom-minutes-out" htmlFor="time-custom-minutes">10 menit</output>
              </label>
              <input type="range" id="time-custom-minutes" min="0" max="120" step="1" defaultValue="10" />
            </div>
            <div className="time-custom-field">
              <label className="time-custom-label" htmlFor="time-custom-bonus">
                <span>Bonus Waktu</span>
                <output id="time-custom-bonus-out" htmlFor="time-custom-bonus">0 detik</output>
              </label>
              <input type="range" id="time-custom-bonus" min="0" max="60" step="1" defaultValue="0" />
            </div>
            <button type="button" className="btn-primary time-custom-apply" id="time-custom-apply">Pilih</button>
          </div>
        </div>
      </div>
    </div>
  );
}
