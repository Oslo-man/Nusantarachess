import { callGlobal } from "../../components/dom-handlers";

export function BotGameOverModal() {
  return (
    <div className="modal-overlay-bottom" id="gameOverModal">
      <div className="gameover-panel">
        <div className="gameover-message" id="gameOverMessage">Permainan selesai</div>
        <div className="gameover-buttons">
          <button
            type="button"
            className="gameover-btn gameover-btn-primary"
            onClick={() => callGlobal("UIGameOverNewGame")}
          >
            Permainan Baru
          </button>
          <button
            type="button"
            className="gameover-btn gameover-btn-secondary"
            onClick={() => callGlobal("UIOpenGameReview")}
          >
            Ulasan Permainan
          </button>
          <button
            type="button"
            className="gameover-btn gameover-btn-secondary"
            onClick={() => callGlobal("UIGameOverWait")}
          >
            Tunggu
          </button>
        </div>
      </div>
    </div>
  );
}
