import Lens from "./svg/lens";

export function Loading() {
  return (
    <div className="bc-loading">
      <div className="bc-loading-title">Menganalisis<span id="loadingDots" /></div>
      <hr className="bc-hr-full" />
      <div className="bc-loading-center">
        <div className="bc-loading-box" id="progress">
          <div className="bc-loading-inner">
            <Lens class="bc-loading-lens" size={60} />
            <span className="bc-loading-fmt" id="loadingFmt">PGN</span>
            <span className="bc-loading-text">Menganalisis Permainan<span id="loadingDots2" /></span>
          </div>
          <button type="button" className="bc-loading-cancel" id="scanCancel">Batal</button>
          <div className="bc-loading-bar" id="progressbar" />
        </div>
      </div>
    </div>
  );
}
