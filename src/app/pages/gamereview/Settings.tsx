import Lens from "./svg/lens";

function MiniBoard({ children }: { children?: React.ReactNode }) {
  return (
    <span className="bc-mini" aria-hidden="true">
      {[0, 1, 2, 3].map(i => (
        <span key={i} className={"bc-mini-sq " + (((i % 2) + Math.floor(i / 2)) % 2 === 0 ? "l" : "d")}>
          {i === 2 ? <img src="/images/bc/pieces/wQ.svg" alt="" width={20} height={20} draggable={false} /> : null}
        </span>
      ))}
      {children}
    </span>
  );
}

export function Settings() {
  return (
    <div className="bc-settings" id="reviewSettingsMenu" role="group" aria-label="Pengaturan" hidden>
      <section>
        <h1 className="bc-st-title">Analisis</h1>
        <label className="bc-st" htmlFor="autoAnalyze">
          <span className="bc-st-ico"><Lens class="bc-st-lens" size={32} /></span>
          <span className="bc-st-text">Analisis otomatis</span>
          <input type="checkbox" id="autoAnalyze" className="bc-st-input" defaultChecked />
          <span className="bc-st-dot" />
        </label>
      </section>
      <section>
        <h1 className="bc-st-title">Langkah Terbaik</h1>
        <label className="bc-st" htmlFor="showArrow">
          <MiniBoard>
            <svg className="bc-mini-arrow" viewBox="0 0 40 40" aria-hidden="true"><polygon points="4,29 22,29 22,24 34,30 22,36 22,31 4,31" fill="var(--arrow-best)" opacity="0.8" /></svg>
          </MiniBoard>
          <span className="bc-st-text">Tampilkan panah</span>
          <input type="checkbox" id="showArrow" className="bc-st-input" defaultChecked />
          <span className="bc-st-dot" />
        </label>
        <label className="bc-st bc-st-select" htmlFor="arrowCount">
          <span className="bc-st-text">Jumlah panah</span>
          <select id="arrowCount" defaultValue="3">
            {[1, 2, 3, 4, 5].map(n => <option key={n} value={String(n)}>{n}</option>)}
          </select>
        </label>
      </section>
      <section>
        <h1 className="bc-st-title">Putar Otomatis</h1>
        <label className="bc-st bc-st-select" htmlFor="autoPlaySpeed">
          <span className="bc-st-text">Kecepatan putar</span>
          <select id="autoPlaySpeed" defaultValue="1200">
            <option value="2000">Lambat</option>
            <option value="1200">Normal</option>
            <option value="700">Cepat</option>
            <option value="350">Sangat cepat</option>
          </select>
        </label>
      </section>
    </div>
  );
}
