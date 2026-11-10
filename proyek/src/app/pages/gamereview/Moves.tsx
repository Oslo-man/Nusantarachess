export function Moves() {
  return (
    <div className="bc-moves">
      <div className="bc-comments" id="analysisBox" hidden>
        <div hidden>
          Mesin: <b id="bestText">—</b> <span id="depthText" className="small" />
        </div>
        <div id="pvText" className="small" hidden />
        <div id="judgeText" />
      </div>
      <ul className="bc-movelist" id="moveList" aria-label="Riwayat langkah" />
      <div className="bc-moves-foot">
        <div className="variation-bar" id="variationBar" hidden />
        <button type="button" className="ms-chip bc-copy-pgn" id="copyPgnBtn" disabled>Salin PGN</button>
      </div>
      <div className="bc-chart-slot" id="movesChartSlot" hidden>
        <div className="bc-chart" data-chart="moves" />
      </div>
    </div>
  );
}
