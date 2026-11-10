import { LineIcon } from "../../components/LineIcon";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthModal() {
  return (
    <div className="auth-modal-overlay hidden" id="auth-container">
      <div className="auth-box" role="dialog" aria-modal="true" aria-labelledby="authModalHeading">
        <button type="button" className="auth-modal-close" id="authModalCloseBtn" aria-label="Tutup">
          <LineIcon>
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </LineIcon>
        </button>
        <h2 id="authModalHeading" className="sr-only">Masuk atau daftar akun</h2>
        <div className="tabs">
          <button className="tab-btn active" data-tab="login-form" type="button">Masuk</button>
          <button className="tab-btn" data-tab="register-form" type="button">Daftar</button>
        </div>
        <LoginForm />
        <RegisterForm />
        <div className="auth-guest-divider" role="separator" aria-label="atau">
          <span>atau</span>
        </div>
        <button type="button" className="btn-guest" id="guestModeBtn">Main sebagai Tamu</button>
        <p className="auth-guest-hint">
          Tanpa daftar - progres tidak tersimpan permanen. Profil, Game Library, dan Leaderboard tetap butuh akun.
        </p>
        <p className="error-msg" id="guest-error" />
      </div>
    </div>
  );
}
