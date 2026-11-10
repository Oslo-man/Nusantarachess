import { ProfileHero } from "./ProfileHero";

export function ProfileMain() {
  return (
    <main className="profile-page">
      <ProfileHero />
      <section className="profile-section" aria-labelledby="statsHeading">
        <div className="profile-section-header">
          <h2 id="statsHeading">Statistik rating</h2>
          <div className="profile-chart-tabs" role="tablist" aria-label="Pilih kategori grafik rating">
            <button
              className="profile-chart-tab is-active"
              data-cat="bullet"
              role="tab"
              aria-selected="true"
              type="button"
            >
              Bullet
            </button>
            <button
              className="profile-chart-tab"
              data-cat="blitz"
              role="tab"
              aria-selected="false"
              type="button"
            >
              Blitz
            </button>
            <button
              className="profile-chart-tab"
              data-cat="rapid"
              role="tab"
              aria-selected="false"
              type="button"
            >
              Rapid
            </button>
            <button
              className="profile-chart-tab"
              data-cat="puzzle"
              role="tab"
              aria-selected="false"
              type="button"
            >
              Puzzle
            </button>
          </div>
        </div>
        <div className="profile-chart-wrap">
          <svg
            id="ratingChart"
            className="profile-chart-svg"
            viewBox="0 0 600 220"
            preserveAspectRatio="none"
            role="img"
            aria-labelledby="chartTitleDesc"
          />
          <p id="chartTitleDesc" className="sr-only">
            Grafik garis menunjukkan perkembangan rating dari waktu ke waktu.
          </p>
          <p className="profile-chart-empty" id="chartEmptyMsg" hidden>
            Belum ada riwayat rating untuk kategori ini — mainkan beberapa partai atau puzzle dulu.
          </p>
        </div>
      </section>
      <section className="profile-section" aria-labelledby="recentHeading">
        <div className="profile-section-header">
          <h2 id="recentHeading">Game terbaru</h2>
          <a href="/library" data-route-link="" className="profile-see-all">Lihat semua di Game Library</a>
        </div>
        <div id="recentGamesList" className="gh-list" />
        <p className="profile-empty-msg" id="recentGamesEmpty" hidden>
          Belum ada partai online tercatat.
          {" "}
          <a href="/play" data-route-link="">Mulai bermain</a>
          {" "}
          untuk mengisi riwayat di sini.
        </p>
      </section>
    </main>
  );
}
