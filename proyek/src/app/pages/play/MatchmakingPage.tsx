export function MatchmakingPage() {
  return (
    <div id="matchmaking-page" className="page">
      <div className="matchmaking-box">
        <div id="searching-view">
          <div className="spinner" />
          <h2>Mencari lawan...</h2>
          <button className="btn-secondary" id="cancel-matchmaking-btn">Batalkan Pencarian</button>
        </div>
      </div>
    </div>
  );
}
