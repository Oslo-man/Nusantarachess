import type { SsrLeaderboardRow } from "../../ssr/types";

export function TopPlayersSection({ players }: { players?: SsrLeaderboardRow[] }) {
  if (!players || players.length === 0) return null;
  return (
    <section className="top-players" id="pemain-teratas" aria-labelledby="topPlayersHeading">
      <div className="top-players-header">
        <div>
          <h2 id="topPlayersHeading">Pemain Teratas</h2>
          <p className="top-players-sub">Peringkat rating Bullet</p>
        </div>
        <a className="top-players-all" href="/leaderboard" data-route-link="">Lihat leaderboard lengkap</a>
      </div>
      <ol className="top-players-list">
        {players.map((p) => (
          <li key={p.rank + ":" + p.username}>
            <a className="top-player" href={"/profile/" + encodeURIComponent(p.username)} data-route-link="">
              <span className={"top-player-rank" + (p.rank <= 3 ? " top3" : "")}>{"#" + p.rank}</span>
              <span className="top-player-name">{p.username}</span>
              <span className="top-player-rating">{p.rating}</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
