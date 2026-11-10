import { callGlobal } from "../../components/dom-handlers";
import { SettingsIcon } from "../../components/ActionIcons";
import { NavIcon } from "../../components/NavIcons";
import { BotControlsPanel } from "./BotControlsPanel";

export function BotGameArea() {
  return (
    <div className="main-content hidden" id="mainContent">
      <div className="app-header">
        <div className="app-header-row" />
      </div>
      <div className="game-area">
        <div className="opponent-row">
          <div className="player-avatar">
            <img
              id="opponentAvatar"
              src="images/fahri.svg"
              alt=""
              style={{ width: "34px", height: "34px", borderRadius: "0", objectFit: "cover" }}
            />
          </div>
          <div className="player-info">
            <div className="player-name">
              <span id="botOpponentTitle" className="opponent-title hidden" />
              <span id="engineName" />
              {" "}
              <span id="botOpponentFlag" />
            </div>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={() => callGlobal("UIOpenSettings")}
            title="Pengaturan"
          >
            <SettingsIcon />
          </button>
        </div>
        <div className="board-wrapper">
          <div id="board" />
        </div>
        <div className="player-panel">
          <div className="player-avatar" id="botPlayerAvatar" aria-hidden="true">
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
          <div className="player-info">
            <div className="player-name">Anda</div>
          </div>
        </div>
        <div className="history-nav-row">
          <button
            type="button"
            className="nav-btn"
            id="navPrev"
            onClick={() => callGlobal("UIHistoryPrev")}
            title="Mundur"
            aria-label="Mundur"
          >
            <NavIcon name="prev" />
          </button>
          <button
            type="button"
            className="nav-btn"
            id="navNext"
            onClick={() => callGlobal("UIHistoryNext")}
            title="Maju"
            aria-label="Maju"
          >
            <NavIcon name="next" />
          </button>
        </div>
        <BotControlsPanel />
      </div>
    </div>
  );
}
