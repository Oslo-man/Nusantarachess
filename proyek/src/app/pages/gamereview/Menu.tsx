import Lens from "./svg/lens";
import Pawn from "./svg/pawn";
import Star from "./svg/star";
import BoardIcon from "./svg/boardIcon";
import { Form } from "./Form";
import { SelectGame } from "./SelectGame";
import { Loading } from "./Loading";
import { Summary } from "./Summary";
import { Moves } from "./Moves";

export function Menu() {
  return (
    <section className="bc-menu" id="reviewMenu" aria-label="Analisis permainan">
      <menu className="bc-tabs tabs" role="tablist">
        <button type="button" role="tab" data-tab="import" className="active">
          <Lens class="bc-tab-ico" size={20} /><span data-tab-label="import">Analisis Game</span>
        </button>
        <button type="button" role="tab" data-tab="select" hidden>
          <Pawn class="bc-tab-ico" size={20} /><span>Pilih Game</span>
        </button>
        <button type="button" role="tab" data-tab="review" hidden>
          <Star class="bc-tab-ico" size={20} /><span>Ringkasan</span>
        </button>
        <button type="button" role="tab" data-tab="moves">
          <BoardIcon class="bc-tab-ico" size={20} /><span>Langkah</span>
        </button>
      </menu>
      <div className="bc-menu-body">
        <div id="gameInfoPanel" className="game-info-panel" style={{ display: "none" }} />
        <div className="tabpane active" id="tab-import"><Form /></div>
        <div className="tabpane" id="tab-select"><SelectGame /></div>
        <div className="tabpane" id="tab-loading"><Loading /></div>
        <div className="tabpane" id="tab-review"><Summary /></div>
        <div className="tabpane" id="tab-moves"><Moves /></div>
      </div>
    </section>
  );
}
