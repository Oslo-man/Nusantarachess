export function ResumeBanner() {
  return (
    <div className="resume-banner hidden" id="resume-banner">
      <div className="resume-banner-text">
        <div className="resume-banner-title">Permainan Sedang Berlangsung</div>
        <div className="resume-banner-subtitle" id="resume-banner-subtitle" />
      </div>
      <button type="button" className="btn-primary resume-banner-btn" id="resume-game-btn">Lanjutkan Permainan</button>
    </div>
  );
}
