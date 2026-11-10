import Files from "./svg/files";

export function SelectGame() {
  return (
    <div className="bc-select" id="selectRoot">
      <div className="bc-sel-loading" id="selLoading" hidden>
        <div className="bc-sel-loadbox">
          <div className="bc-sel-loadinner">
            <Files className="bc-sel-files" size={60} />
            <span className="bc-sel-what" id="selWhat">Arsip</span>
            <span className="bc-sel-api">Mengambil API<span id="selDots" /></span>
          </div>
          <button type="button" className="bc-sel-cancel" id="selCancel">Batal</button>
        </div>
      </div>
      <div className="bc-sel-content" id="selContent" hidden>
        <h1 className="bc-sel-title"><a id="selUser" target="_blank" rel="noopener noreferrer" /> <span id="selTitleSuffix" /></h1>
        <hr className="bc-hr-full" />
        <div className="bc-sel-months" id="selMonths" />
      </div>
    </div>
  );
}
