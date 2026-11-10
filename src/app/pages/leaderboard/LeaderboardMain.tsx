import type { SsrPageData, SsrLeaderboardCategory } from "../../ssr/types";

type LeaderboardData = Extract<SsrPageData, { kind: "leaderboard" }>;

const CATEGORIES: Array<[SsrLeaderboardCategory, string]> = [["bullet", "Bullet"], ["blitz", "Blitz"], ["rapid", "Rapid"], ["puzzle", "Puzzle"]];

export function LeaderboardMain({ data }: { data?: LeaderboardData }) {
  const active: SsrLeaderboardCategory = data ? data.category : "bullet";
  const rows = data ? data.rows : [];
  const searchResults = data ? data.searchResults : null;
  return (
    <main className="leaderboard-page">
      <h1 className="leaderboard-title">Leaderboard</h1>
      <form className="leaderboard-search" id="leaderboardSearchForm" action="/leaderboard" method="get" role="search">
        <input type="hidden" name="category" value={active} />
        <input
          type="search"
          name="search"
          id="leaderboardSearchInput"
          className="leaderboard-search-input"
          placeholder={"Cari pemain berdasarkan username…"}
          defaultValue={data ? data.searchQuery : ""}
          minLength={2}
          maxLength={20}
          autoComplete="off"
        />
        <button type="submit" className="leaderboard-search-btn">Cari</button>
      </form>
      <div id="leaderboardSearchResults" className="leaderboard-list" hidden={!searchResults}>
        {searchResults &&
          searchResults.map((r) => (
            <a className="leaderboard-row" href={"/profile/" + encodeURIComponent(r.username)} data-route-link="" key={r.username}>
              <span className="leaderboard-username">{r.username}</span>
              <span className="leaderboard-rating">{r.eloBlitz}</span>
            </a>
          ))}
      </div>
      {searchResults && searchResults.length === 0 && <p className="leaderboard-empty-msg">Tidak ada pemain dengan nama itu.</p>}
      <div className="leaderboard-tabs" role="tablist" aria-label="Pilih kategori leaderboard">
        {CATEGORIES.map(([cat, label]) => (
          <a
            className={"leaderboard-tab" + (cat === active ? " is-active" : "")}
            data-cat={cat}
            href={"/leaderboard?category=" + cat}
            role="tab"
            aria-selected={cat === active ? "true" : "false"}
            key={cat}
          >
            {label}
          </a>
        ))}
      </div>
      <div id="leaderboardList" className="leaderboard-list" aria-live="polite">
        {rows.map((row) => (
          <a className="leaderboard-row" href={"/profile/" + encodeURIComponent(row.username)} data-route-link="" key={row.rank + ":" + row.username}>
            <span className={"leaderboard-rank " + (row.rank <= 3 ? "top3" : "")}>{"#" + row.rank}</span>
            <span className="leaderboard-username">{row.username}</span>
            <span className="leaderboard-games-played">{row.gamesPlayed != null ? row.gamesPlayed + " partai" : ""}</span>
            <span className="leaderboard-rating">{row.rating}</span>
          </a>
        ))}
      </div>
      <p className="leaderboard-loading-msg" id="leaderboardLoadingMsg" hidden={!!data}>Memuat peringkat…</p>
      <p className="leaderboard-empty-msg" id="leaderboardEmptyMsg" hidden={!data || rows.length > 0}>Belum ada pemain aktif di kategori ini.</p>
      <div className="leaderboard-my-rank" id="leaderboardMyRank" hidden />
    </main>
  );
}
