import { markWordmarkLogo, hideImg, hideImgInvisible } from "../../components/dom-handlers";

export function LandingHeader() {
  return (
    <header className="landing-header">
      <div className="brand-wrapper">
        <img
          src="/favicon.svg"
          alt=""
          className="brand-logo"
          onLoad={markWordmarkLogo}
          onError={hideImg}
        />
        <span className="brand">NusantaraChess</span>
      </div>
      <div className="landing-header-actions">
        <div className="lang-picker" data-lang-picker="" data-no-i18n="">
          <button
            type="button"
            className="lang-btn"
            data-lang-btn=""
            aria-haspopup="menu"
            aria-expanded="false"
            aria-label="Bahasa / Language"
            title="Bahasa / Language"
          >
            <img
              className="lang-btn-icon"
              src="/images/ui-globe.svg"
              width="22"
              height="22"
              alt=""
              aria-hidden="true"
              onError={hideImgInvisible}
            />
          </button>
          <div className="lang-menu" data-lang-menu="" role="menu" aria-label="Bahasa / Language" hidden />
        </div>
        <button type="button" className="landing-header-cta" id="landingHeaderCta">Masuk</button>
      </div>
    </header>
  );
}
