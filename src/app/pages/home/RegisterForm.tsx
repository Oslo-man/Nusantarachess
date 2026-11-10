export function RegisterForm() {
  return (
    <form id="register-form" className="auth-form">
      <input type="text" id="register-username" placeholder="Username" autoComplete="username" required />
      {" "}
      <input
        type="password"
        id="register-password"
        placeholder="Password"
        autoComplete="new-password"
        required
      />
      {" "}
      <input
        type="password"
        id="register-password2"
        placeholder="Ulangi Password"
        autoComplete="new-password"
        required
      />
      {" "}
      <select
        id="register-country"
        className="auth-select"
        aria-label="Negara"
        autoComplete="country"
        required
        defaultValue=""
      >
        <option value="" disabled>Pilih negara</option>
      </select>
      <button type="submit" className="btn">Buat Akun</button>
      <p className="error-msg" id="register-error" />
    </form>
  );
}
