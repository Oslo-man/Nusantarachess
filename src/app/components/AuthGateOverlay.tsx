interface AuthGateOverlayProps {
  hidden?: boolean;
}

export function AuthGateOverlay({ hidden }: AuthGateOverlayProps) {
  return (
    <div id="authGateOverlay" className="auth-gate-overlay" hidden={hidden}>
      <div className="auth-gate-spinner" />
      <div className="auth-gate-text">Memeriksa sesi masuk…</div>
    </div>
  );
}
