export function LoginForm() {
  return (
    <form id="login-form" className="auth-form active">
      <input type="text" id="login-username" placeholder="Username" autoComplete="username" required />
      <input
        type="password"
        id="login-password"
        placeholder="Password"
        autoComplete="current-password"
        required
      />
      <button type="submit" className="btn">Masuk</button>
      <p className="error-msg" id="login-error" />
    </form>
  );
}
