import { Evaluation } from "./Evaluation";
import { Name } from "./Name";
import { Board } from "./Board";

export function Game() {
  return (
    <div className="bc-game" id="boardArea">
        <div className="bc-evalcol"><Evaluation /></div>
        <div className="bc-boardcol">
          <Name id="playerTop" side="b" />
          <Board />
          <Name id="playerBottom" side="w" />
        </div>
    </div>
  );
}
