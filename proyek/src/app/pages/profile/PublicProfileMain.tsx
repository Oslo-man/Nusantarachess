import type { SsrPageData } from "../../ssr/types";
import { formatJoinedLabel } from "./public-profile-format";
import { GameHistoryRow } from "../../components/GameHistoryRow";

type ProfileData = Extract<SsrPageData, { kind: "public-profile" }>;

function DefaultAvatar() {
  return (
    <svg className="avatar-default-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <circle cx="12" cy="8" r="4.2" />
      <path d="M3.8 21.2c0-4.5 3.7-8.1 8.2-8.1s8.2 3.6 8.2 8.1z" />
    </svg>
  );
}

export function PublicProfileNotFoundMain({ username }: { username: string }) {
  return (
    <main className="profile-page">
      <section className="profile-hero">
        <h1>Pemain tidak ditemukan</h1>
        <p className="profile-joined">{"Tidak ada pemain dengan username \"" + username + "\"."}</p>
        <a href="/leaderboard" data-route-link="">Kembali ke Leaderboard</a>
      </section>
    </main>
  );
}

export function PublicProfileMain({ data }: { data?: ProfileData }) {
  const user = data ? data.user : null;
  const games = data ? data.recentGames : [];
  return (
    <main className="profile-page">
      <section className="profile-hero" aria-labelledby="profileNameHeading">
        <div className="profile-hero-top">
          <div className="profile-avatar" id="profileAvatar">
            {user && user.profilePhoto ? <img src={user.profilePhoto} alt="" /> : <DefaultAvatar />}
          </div>
          <div className="profile-hero-info">
            <h1 id="profileNameHeading">{user ? user.username : null}</h1>
            <p className="profile-joined" id="profileJoined">{user ? formatJoinedLabel(user.createdAt) : null}</p>
          </div>
        </div>
        <div className="profile-rating-grid">
          <div className="profile-rating-card">
            <span className="profile-rating-label">Bullet</span>
            <span className="profile-rating-value" id="ratingBullet">{user ? user.eloBullet : "—"}</span>
          </div>
          <div className="profile-rating-card">
            <span className="profile-rating-label">Blitz</span>
            <span className="profile-rating-value" id="ratingBlitz">{user ? user.eloBlitz : "—"}</span>
          </div>
          <div className="profile-rating-card">
            <span className="profile-rating-label">Rapid</span>
            <span className="profile-rating-value" id="ratingRapid">{user ? user.eloRapid : "—"}</span>
          </div>
          <div className="profile-rating-card profile-rating-card-puzzle">
            <span className="profile-rating-label">Puzzle</span>
            <span className="profile-rating-value" id="ratingPuzzle">{user ? user.puzzleRating : "—"}</span>
          </div>
        </div>
        <div className="profile-record-row">
          <div className="profile-record-item">
            <span className="profile-record-value profile-record-win" id="recordWins">{user ? user.wins : 0}</span>
            <span className="profile-record-label">Menang</span>
          </div>
          <div className="profile-record-item">
            <span className="profile-record-value profile-record-draw" id="recordDraws">{user ? user.draws : 0}</span>
            <span className="profile-record-label">Remi</span>
          </div>
          <div className="profile-record-item">
            <span className="profile-record-value profile-record-loss" id="recordLosses">{user ? user.losses : 0}</span>
            <span className="profile-record-label">Kalah</span>
          </div>
          <div className="profile-record-item">
            <span className="profile-record-value" id="recordPuzzleSolved">{user ? user.puzzleSolved : 0}</span>
            <span className="profile-record-label">Puzzle terpecahkan</span>
          </div>
        </div>
      </section>
      <section className="profile-section" aria-labelledby="recentHeading">
        <div className="profile-section-header">
          <h2 id="recentHeading">Partai</h2>
        </div>
        <div id="recentGamesList" className="gh-list">
          {games.map((g, i) => <GameHistoryRow game={g} key={i} reviewHref={g.id != null ? "/gamereview?publicGameId=" + encodeURIComponent(String(g.id)) : undefined} />)}
        </div>
        <div className="gh-more" id="recentGamesMore" hidden={!data || data.totalGames <= games.length}>
          <button type="button" className="gh-more-btn" id="recentViewAllBtn">Lihat Semua</button>
        </div>
        <p className="profile-empty-msg" id="recentGamesEmpty" hidden={!data || games.length > 0}>Belum ada partai online tercatat.</p>
      </section>
      <p className="profile-not-found" id="profileNotFound" hidden>Pemain tidak ditemukan.</p>
    </main>
  );
}
