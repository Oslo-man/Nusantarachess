import { callGlobal } from "../../components/dom-handlers";
import { ResignIcon, UndoIcon, ReviewIcon } from "../../components/ActionIcons";

export function BotControlsPanel() {
  return (
    <div className="controls-panel">
      <button
        type="button"
        className="ctrl-btn"
        id="btnReview"
        onClick={() => callGlobal("UIOpenGameReview")}
        title="Ulasan Permainan"
        aria-label="Ulasan Permainan"
        style={{ display: "none" }}
      >
        <ReviewIcon />
      </button>
      <button
        type="button"
        className="ctrl-btn"
        id="btnResign"
        onClick={() => callGlobal("UIResetOrSurrender")}
        title="Menyerah"
        aria-label="Menyerah"
      >
        <ResignIcon />
      </button>
      <button
        type="button"
        className="ctrl-btn"
        id="btnUndo"
        onClick={() => callGlobal("UIUndoMove")}
        title="Batalkan"
        aria-label="Batalkan"
      >
        <UndoIcon />
      </button>
    </div>
  );
}
