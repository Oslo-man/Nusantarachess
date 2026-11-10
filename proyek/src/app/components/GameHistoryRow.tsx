import { CATEGORY_LABEL, RESULT_LABEL } from "../pages/profile/public-profile-format";

export interface GameHistoryRowData {
  opponentName: string;
  opponentElo: number;
  category: string;
  result: string;
  eloChange: number;
  playedAt: number;
}

const RESULT_MARK: Record<string, string> = { win: "plus", loss: "minus", draw: "equal" };

function BotModeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <path d="M12 8V4" />
      <circle cx="12" cy="3.2" r="1" fill="currentColor" />
      <path d="M2 13v3M22 13v3" />
      <circle cx="9" cy="13" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13" r="1.3" fill="currentColor" stroke="none" />
      <path d="M9 17h6" />
    </svg>
  );
}

export function GameHistoryRow({ game, reviewHref }: { game: GameHistoryRowData; reviewHref?: string }) {
  const result = game.result === "win" ? "win" : game.result === "loss" ? "loss" : "draw";
  const change = Number(game.eloChange) || 0;
  const changeClass = change > 0 ? "positive" : change < 0 ? "negative" : "neutral";
  const changeText = change > 0 ? "+" + change : String(change);
  const catLabel = CATEGORY_LABEL[game.category] || game.category;
  const resultLabel = RESULT_LABEL[result];
  const known = game.category === "bullet" || game.category === "blitz" || game.category === "rapid";
  return (
    <div className={"gh-row" + (reviewHref ? " is-linked" : "")}>
      {reviewHref ? (
        <a className="gh-row-link" href={reviewHref} data-route-link="" aria-label={"Buka di Game Review: " + game.opponentName} title="Buka di Game Review" />
      ) : null}
      {game.category === "bot" ? (
        <span className="gh-mode gh-mode-bot" title="Bot"><BotModeIcon /></span>
      ) : (
        <span className="gh-mode" title={catLabel}>
          {known ? <img src={"/images/" + game.category + ".svg"} alt="" width={22} height={22} draggable={false} /> : null}
        </span>
      )}
      <span className="gh-avatar" aria-hidden="true">
        <svg className="avatar-default-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
          <circle cx="12" cy="8" r="4.2" />
          <path d="M3.8 21.2c0-4.5 3.7-8.1 8.2-8.1s8.2 3.6 8.2 8.1z" />
        </svg>
      </span>
      <span className="gh-main">
        <span className="gh-name">
          <span className="gh-name-text">{game.opponentName}</span>
          <span className="gh-elo">{"(" + game.opponentElo + ")"}</span>
          <span className={"gh-badge " + changeClass} title="Perubahan Elo">{changeText}</span>
        </span>
      </span>
      <span className={"gh-result " + result} role="img" aria-label={resultLabel} title={resultLabel}><span className={"ui-ico ui-ico-" + RESULT_MARK[result]} aria-hidden="true" /></span>
      {reviewHref ? (
        <a className="gh-action" href={reviewHref + (reviewHref.includes("?") ? "&" : "?") + "scan=1"} data-route-link="" aria-label="Ulasan Permainan (pindai otomatis)" title="Ulasan Permainan">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path fill="#fff" fillRule="evenodd" d="M12 1.6a10.4 10.4 0 1 1 0 20.8a10.4 10.4 0 1 1 0-20.8ZM12.00 5.90 L13.70 10.15 L18.28 10.46 L14.76 13.40 L15.88 17.84 L12.00 15.40 L8.12 17.84 L9.24 13.40 L5.72 10.46 L10.30 10.15Z" />
          </svg>
        </a>
      ) : null}
    </div>
  );
}
