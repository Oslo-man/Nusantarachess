export function ProfileHero() {
  return (
    <section className="profile-hero" aria-labelledby="profileNameHeading">
      <div className="profile-hero-top">
        <div className="profile-avatar" id="profileAvatar">
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
        </div>
        <div className="profile-hero-info">
          <h1 id="profileNameHeading" />
          <p className="profile-joined" id="profileJoined" />
          <p className="profile-joined" id="profileCountry" hidden />
        </div>
      </div>
      <div className="profile-rating-grid">
        <div className="profile-rating-card">
          <span className="profile-rating-label">Bullet</span>
          <span className="profile-rating-value" id="ratingBullet">—</span>
        </div>
        <div className="profile-rating-card">
          <span className="profile-rating-label">Blitz</span>
          <span className="profile-rating-value" id="ratingBlitz">—</span>
        </div>
        <div className="profile-rating-card">
          <span className="profile-rating-label">Rapid</span>
          <span className="profile-rating-value" id="ratingRapid">—</span>
        </div>
        <div className="profile-rating-card profile-rating-card-puzzle">
          <span className="profile-rating-label">Puzzle</span>
          <span className="profile-rating-value" id="ratingPuzzle">—</span>
        </div>
      </div>
      <div className="profile-record-row">
        <div className="profile-record-item">
          <span className="profile-record-value profile-record-win" id="recordWins">0</span>
          <span className="profile-record-label">Menang</span>
        </div>
        <div className="profile-record-item">
          <span className="profile-record-value profile-record-draw" id="recordDraws">0</span>
          <span className="profile-record-label">Remi</span>
        </div>
        <div className="profile-record-item">
          <span className="profile-record-value profile-record-loss" id="recordLosses">0</span>
          <span className="profile-record-label">Kalah</span>
        </div>
        <div className="profile-record-item">
          <span className="profile-record-value" id="recordPuzzleSolved">0</span>
          <span className="profile-record-label">Puzzle terpecahkan</span>
        </div>
      </div>
    </section>
  );
}
