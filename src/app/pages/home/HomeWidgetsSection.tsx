export function HomeWidgetsSection() {
  return (
    <section aria-labelledby="home-widgets-heading" className="home-widgets-section">
      <h2 id="home-widgets-heading" className="home-section-heading">Ringkasan progres</h2>
      <div className="home-widget-grid">
        <article className="home-widget-card" aria-labelledby="home-widget-recent-heading">
          <div className="home-widget-card-head">
            <h3 id="home-widget-recent-heading">Partai</h3>
            <a href="/library" data-route-link="" className="home-widget-link">Lihat semua</a>
          </div>
          <div id="homeRecentGamesList" className="gh-list" />
          <p id="homeRecentGamesEmpty" className="home-widget-empty" hidden>Belum ada partai online tercatat.</p>
        </article>
        <article className="home-widget-card" aria-labelledby="home-widget-puzzle-heading">
          <div className="home-widget-card-head">
            <h3 id="home-widget-puzzle-heading">Puzzle</h3>
            <a href="/puzzles" data-route-link="" className="home-widget-link">Latihan</a>
          </div>
          <p className="home-widget-big-stat" id="homePuzzleRating">—</p>
          <p className="home-widget-sub-stat" id="homePuzzleRecord">Rating puzzle</p>
        </article>
        <article className="home-widget-card" aria-labelledby="home-widget-lessons-heading">
          <div className="home-widget-card-head">
            <h3 id="home-widget-lessons-heading">Lesson</h3>
            <a href="/lessons" data-route-link="" className="home-widget-link">Lanjutkan</a>
          </div>
          <p className="home-widget-big-stat" id="homeLessonsCount">—</p>
          <div className="home-progress-track" aria-hidden="true">
            <div className="home-progress-fill" id="homeLessonsProgressFill" />
          </div>
          <p className="home-widget-sub-stat" id="homeLessonsSub">pelajaran selesai</p>
        </article>
        <article className="home-widget-card home-widget-card-stats" aria-labelledby="home-widget-stats-heading">
          <div className="home-widget-card-head">
            <h3 id="home-widget-stats-heading">Statistik Partai</h3>
          </div>
          <div className="home-stats-grid">
            <div className="home-stats-cell">
              <span className="home-stats-cell-label"><img className="home-cat-icon" src="/images/bullet.svg" alt="" width="16" height="16" />Bullet</span>
              <span className="home-stats-cell-value" id="homeStatsBullet">0</span>
            </div>
            <div className="home-stats-cell">
              <span className="home-stats-cell-label"><img className="home-cat-icon" src="/images/blitz.svg" alt="" width="16" height="16" />Blitz</span>
              <span className="home-stats-cell-value" id="homeStatsBlitz">0</span>
            </div>
            <div className="home-stats-cell">
              <span className="home-stats-cell-label"><img className="home-cat-icon" src="/images/rapid.svg" alt="" width="16" height="16" />Rapid</span>
              <span className="home-stats-cell-value" id="homeStatsRapid">0</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
