import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { hideImgInvisible } from "../../components/dom-handlers";
import { HomeSummaryCard } from "./HomeSummaryCard";
import { HomeWidgetsSection } from "./HomeWidgetsSection";

function TopbarLangPicker() {
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let el: HTMLElement | null = null;
    let waitObserver: MutationObserver | null = null;
    let visibilityObserver: MutationObserver | null = null;
    const container = document.getElementById("menu-container");

    const syncVisibility = () => {
      if (el && container) el.hidden = container.classList.contains("hidden");
    };

    const mount = () => {
      if (el) return true;
      const actions = document.querySelector(".site-topbar-actions");
      if (!actions) return false;
      el = document.createElement("div");
      el.className = "site-topbar-lang";
      actions.insertBefore(el, actions.firstChild);
      syncVisibility();
      if (container) {
        visibilityObserver = new MutationObserver(syncVisibility);
        visibilityObserver.observe(container, { attributes: true, attributeFilter: ["class"] });
      }
      setHost(el);
      return true;
    };

    if (!mount()) {
      waitObserver = new MutationObserver(() => {
        if (mount() && waitObserver) {
          waitObserver.disconnect();
          waitObserver = null;
        }
      });
      waitObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      if (waitObserver) waitObserver.disconnect();
      if (visibilityObserver) visibilityObserver.disconnect();
      if (el) el.remove();
    };
  }, []);

  useEffect(() => {
    if (!host) return;
    const picker = host.querySelector("[data-lang-picker]");
    const lang = (window as any).NusantaraChess && (window as any).NusantaraChess.language;
    if (picker && lang && typeof lang.bindMenu === "function") lang.bindMenu(picker);
  }, [host]);

  if (!host) return null;
  return createPortal(
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
    </div>,
    host
  );
}

export function HomeDashboard() {
  return (
    <div className="container hidden" id="menu-container">
      <div className="home-dashboard">
        <TopbarLangPicker />
        <HomeSummaryCard />
        <HomeWidgetsSection />
        <a href="/play" data-route-link="" className="home-play-btn">
          <span>Bermain</span>
        </a>
      </div>
    </div>
  );
}
