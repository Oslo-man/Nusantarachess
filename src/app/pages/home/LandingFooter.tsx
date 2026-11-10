import { PrivacyDialog } from "./PrivacyDialog";
import { TermsDialog } from "./TermsDialog";
import { FaqDialog } from "./FaqDialog";

export function LandingFooter() {
  return (
    <footer className="landing-footer" id="landing-footer">
      <div className="footer-grid">
        <div className="footer-col footer-about">
          <h2 className="footer-heading">Tentang</h2>
          <p>
            Platform catur berbahasa Indonesia: main dengan rating Elo, latihan melawan karakter bot, puzzle personal, dan bedah partai dengan analisis Stockfish.
          </p>
        </div>
        <nav className="footer-col" aria-label="Navigasi footer">
          <h2 className="footer-heading">Navigasi</h2>
          <ul className="footer-links">
            <li>
              <a href="#fitur" id="footerFeatureLink">Fitur</a>
            </li>
            <li>
              <a href="/play" data-route-link="">Bermain</a>
            </li>
            <li>
              <a href="/bot" data-route-link="">Lawan Bot</a>
            </li>
            <li>
              <a href="/puzzles" data-route-link="">Puzzle</a>
            </li>
            <li>
              <a href="/leaderboard" data-route-link="">Leaderboard</a>
            </li>
            <li>
              <a
                href="https://nusantarachess.vercel.app"
                id="footerCommunityLink"
                target="_blank"
                rel="noopener noreferrer"
              >
                Community
              </a>
            </li>
          </ul>
        </nav>
        <div className="footer-col">
          <h2 className="footer-heading">Kontak</h2>
          <ul className="footer-links footer-contact">
            <li>Pengembang: Marcell Wang</li>
            <li>
              <a href="mailto:kontak@nusantara-chess.vercel.app" id="footerEmail">kontak@nusantara-chess.vercel.app</a>
            </li>
            <li>Indonesia</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copy">
          ©
          {" "}
          <span id="footerYear">2026</span>
          {" "}
          NusantaraChess. Semua hak dilindungi.
        </p>
        <ul className="footer-legal">
          <li>
            <button type="button" className="footer-link-btn" data-legal="legal-privacy">Privacy Policy</button>
          </li>
          <li>
            <button type="button" className="footer-link-btn" data-legal="legal-terms">Terms & Conditions</button>
          </li>
          <li>
            <button type="button" className="footer-link-btn" data-legal="legal-faq">FAQ</button>
          </li>
        </ul>
      </div>
      <p className="footer-credit" id="footerTikTok">
        TikTok:
        {" "}
        <span className="footer-credit-handle" data-no-i18n="">@marcxzchessofcheckers</span>
      </p>
      <PrivacyDialog />
      <TermsDialog />
      <FaqDialog />
    </footer>
  );
}
