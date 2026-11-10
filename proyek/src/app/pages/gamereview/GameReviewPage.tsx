import { AuthGateOverlay } from "../../components/AuthGateOverlay";
import { Game } from "./Game";
import { BoardMenu } from "./BoardMenu";
import { Settings } from "./Settings";
import { Menu } from "./Menu";
import { GameButtons } from "./GameButtons";

export function GameReviewPage() {
  return (
    <>
      <AuthGateOverlay />
      <h1 className="sr-only">Game Review</h1>
      <div className="bc-root" id="bcRoot">
        <main className="bc-main" id="bcMain">
          <Settings />
          <div className="bc-left">
            <Game />
            <BoardMenu />
            <div className="bc-below"><GameButtons variant="below" /></div>
          </div>
          <Menu />
        </main>
      </div>
    </>
  );
}
