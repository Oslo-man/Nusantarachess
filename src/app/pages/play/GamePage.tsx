import { swapOpponentAvatar } from "../../components/dom-handlers";
import { NavIcon } from "../../components/NavIcons";
import { ResignIcon, OptionsIcon } from "../../components/ActionIcons";
import { OptionsMenuOverlay } from "./OptionsMenuOverlay";
import { GameResultOverlay } from "./GameResultOverlay";

export function GamePage() {
  return (
    <div id="game-page" className="page">
      <div className="main-content">
        <div className="app-header">
          <div className="app-header-row" />
        </div>
        <div className="game-area">
          <div className="opponent-row">
            <div className="player-avatar" id="game-opponent-avatar">
              <img
                id="game-opponent-avatar-img"
                className="opponent-avatar-img hidden"
                alt=""
                onError={swapOpponentAvatar}
              />
              <span id="game-opponent-avatar-default" className="avatar-default-wrap" />
            </div>
            <div className="player-info">
              <div className="player-name">
                <span id="game-opponent-title" className="opponent-title hidden" />
                <span id="game-opponent-name">Bot</span>
                {" "}
                <span className="elo-muted">
                  (
                  <span id="game-opponent-elo">1500</span>
                  <span id="game-opponent-elo-change" className="elo-change-inline hidden" />
                  )
                </span>
                {" "}
                <span id="game-opponent-flag"><img src="/images/ui-flag.svg" width="14" height="14" alt="" draggable={false} /></span>
              </div>
            </div>
            <div className="player-clock" id="opponent-clock">05:00</div>
          </div>
          <div className="board-wrapper">
            <div id="chessboard" className="chessboard" />
          </div>
          <div className="player-panel">
            <div className="player-avatar" id="player-panel-avatar-wrap" />
            <div className="player-info">
              <div className="player-name">
                <span id="game-player-flag" className="player-flag" />
                <span id="game-player-name">Anda</span>
                {" "}
                <span className="elo-muted">
                  (
                  <span id="game-player-elo">1500</span>
                  <span id="game-player-elo-change" className="elo-change-inline hidden" />
                  )
                </span>
              </div>
            </div>
            <div className="player-clock" id="player-clock">05:00</div>
          </div>
          <div className="move-nav-panel">
            <button type="button" className="nav-btn" id="nav-back-btn" title="Mundur" aria-label="Mundur"><NavIcon name="prev" /></button>
            <button type="button" className="nav-btn" id="nav-forward-btn" title="Maju" aria-label="Maju"><NavIcon name="next" /></button>
          </div>
          <div className="controls-panel">
            <button type="button" className="ctrl-btn" id="resign-btn" title="Menyerah" aria-label="Menyerah">
              <ResignIcon />
            </button>
            <button type="button" className="ctrl-btn" id="options-btn" title="Pilihan" aria-label="Pilihan">
              <OptionsIcon />
            </button>
          </div>
          <OptionsMenuOverlay />
          <GameResultOverlay />
          <div className="move-history-wrap">
            <h3>Riwayat Langkah</h3>
            <ol id="move-history" className="move-history" />
          </div>
        </div>
      </div>
    </div>
  );
}
