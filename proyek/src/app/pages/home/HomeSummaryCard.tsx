export function HomeSummaryCard() {
  return (
    <section className="home-summary-card" aria-labelledby="menu-username">
      <div className="home-summary-top">
        <div className="home-summary-avatar-wrap">
          <button
            type="button"
            className="home-summary-avatar"
            id="home-avatar"
            aria-label="Ganti foto profil"
            title="Ganti foto profil"
          >
            <svg
              className="avatar-default-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="12" cy="8" r="4.2" />
              <path d="M3.8 21.2c0-4.5 3.7-8.1 8.2-8.1s8.2 3.6 8.2 8.1z" />
            </svg>
          </button>
          <span className="home-summary-avatar-edit" aria-hidden="true">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </span>
          <input
            type="file"
            id="home-avatar-input"
            accept="image/png,image/jpeg,image/webp"
            className="visually-hidden"
            aria-hidden="true"
          />
        </div>
        <div>
          <h1 id="menu-username" />
          <button type="button" className="home-edit-name-btn" id="home-edit-name">Edit Nama</button>
        </div>
      </div>
      <div className="home-rating-row">
        <div className="home-rating-box">
          <span className="home-rating-label"><img className="home-cat-icon" src="/images/bullet.svg" alt="" width="16" height="16" />Bullet</span>
          <span className="home-rating-value" id="home-elo-bullet">—</span>
        </div>
        <div className="home-rating-box">
          <span className="home-rating-label"><img className="home-cat-icon" src="/images/blitz.svg" alt="" width="16" height="16" />Blitz</span>
          <span className="home-rating-value" id="home-elo-blitz">—</span>
        </div>
        <div className="home-rating-box">
          <span className="home-rating-label"><img className="home-cat-icon" src="/images/rapid.svg" alt="" width="16" height="16" />Rapid</span>
          <span className="home-rating-value" id="home-elo-rapid">—</span>
        </div>
      </div>
      <p className="home-record-line" id="home-record-line" />
    </section>
  );
}
