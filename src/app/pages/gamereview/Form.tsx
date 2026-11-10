import Arrow from "./svg/arrow";

export const FORMATS: Array<[string, string, string, string]> = [
  ["chesscom", "Chess.com", "/images/bc-chesscom.svg", "platform"],
  ["lichess", "Lichess.org", "/images/bc-lichess.svg", "platform"],
  ["pgn", "PGN", "/images/bc-pgn.svg", "format"],
  ["fen", "FEN", "/images/bc-json.svg", "format"],
];
export const TYPES: Array<[string, string, string]> = [
  ["Cepat", "/images/bc-quick.svg", "14"],
  ["Dasar", "/images/bc-standard.svg", "16"],
  ["Kustom", "/images/bc-deep.svg", "custom"],
];
const CUSTOM_DEPTHS: Array<[number, string]> = [
  [12, "kilat"], [13, ""], [14, "cepat"], [15, "disarankan"], [16, "seimbang"], [17, ""], [18, "akurat"], [20, "dalam"], [22, "maksimal"],
];

export function Form() {
  return (
    <form className="bc-form" id="importForm" autoComplete="off">
      <div className="bc-error" id="importError" role="alert" hidden />
      <label className="sr-only" htmlFor="importInput">Isian impor</label>
      <textarea id="importInput" rows={1} spellCheck={false} placeholder="Masukkan pengguna Chess.com di sini" />
      <div className="fmt-select" id="importChoices">
        <button type="button" className="fmt-current" id="fmtToggle" aria-expanded="false" aria-controls="fmtOptions">
          <img id="fmtIcon" src="/images/bc-chesscom.svg" alt="" width={28} height={28} draggable={false} />
          <span id="fmtLabel">Chess.com</span>
          <span className="bc-chevron" aria-hidden="true"><Arrow class="bc-arrow-fill" /></span>
        </button>
        <div className="fmt-options" id="fmtOptions" hidden>
          <h6 className="fmt-head">
            <img src="/images/bc-formats.svg" alt="" width={18} height={18} draggable={false} />
            Format Game
          </h6>
          <ul className="fmt-grid">
            {FORMATS.map(([key, label, icon]) => (
              <li key={key}>
                <button type="button" className="import-choice fmt-opt" data-import={key} data-label={label}>
                  <img src={icon} alt="" draggable={false} />
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <h6 className="fmt-head">
            <img src="/images/bc-type.svg" alt="" width={20} height={20} draggable={false} />
            Tipe Analisis
          </h6>
          <ul className="depth-grid" id="depthOptions">
            {TYPES.map(([label, icon, d]) => (
              <li key={d}>
                <button type="button" className="depth-opt" data-depth={String(d)} title={d === "custom" ? "Pilih kedalaman sendiri" : `Kedalaman: ${d}`} aria-pressed="false">
                  <img src={icon} alt="" draggable={false} />
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <div className="bc-custom-depth" id="customDepthBox" hidden>
            <h6 className="fmt-head">Kedalaman (Depth)</h6>
            <ul className="depth-grid" id="customDepthOptions">
              {CUSTOM_DEPTHS.map(([d, note]) => (
                <li key={d}>
                  <button type="button" className="depth-opt depth-num" data-cdepth={String(d)} aria-pressed="false" title={`Kedalaman ${d}`}>
                    <b>{d}</b>{note ? <small>{note}</small> : null}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <select id="reviewDepth" defaultValue="16" hidden aria-hidden="true" tabIndex={-1}>
            {[12, 13, 14, 15, 16, 17, 18, 20, 22].map(d => <option key={d} value={String(d)}>{d}</option>)}
          </select>
        </div>
      </div>
      <button type="submit" className="bc-primary" id="importSubmit">Daftar permainan</button>
      <div className="bc-fen-extra" id="fenExtra" hidden>
        <button type="button" className="bc-secondary" id="copyFen">Salin FEN saat ini</button>
        <div className="bc-small" id="fenOut" style={{ wordBreak: "break-all" }} />
      </div>
    </form>
  );
}
