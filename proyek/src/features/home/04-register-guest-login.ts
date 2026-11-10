document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = (document.getElementById("register-username") as HTMLInputElement).value.trim();
  const password = (document.getElementById("register-password") as HTMLInputElement).value;
  const password2 = (document.getElementById("register-password2") as HTMLInputElement).value;
  const countryEl = document.getElementById("register-country");
  const country = countryEl ? (countryEl as HTMLInputElement).value : "";
  const errEl = document.getElementById("register-error");
  const submitBtn = (e.target as HTMLElement).querySelector("button[type=submit]");

  if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) { errEl.textContent = "Username harus 3-20 karakter, huruf/angka/underscore saja."; return; }
  if (password.length < 6) { errEl.textContent = "Password minimal 6 karakter."; return; }
  if (password.length > 128) { errEl.textContent = "Password maksimal 128 karakter."; return; }
  if (password !== password2) { errEl.textContent = "Password tidak sama."; return; }
  if (!country) { errEl.textContent = "Pilih negara asalmu."; return; }

  errEl.textContent = "";
  if (submitBtn) (submitBtn as HTMLInputElement).disabled = true;
  try {
    const user = await api.register(username, password, country);
    showMenu(user);
  } catch (err) {
    errEl.textContent = err.message || "Gagal mendaftar. Coba lagi.";
  } finally {
    if (submitBtn) (submitBtn as HTMLInputElement).disabled = false;
  }
});

const guestModeBtn = document.getElementById("guestModeBtn");
const guestErrorEl = document.getElementById("guest-error");
if (guestModeBtn) {
  guestModeBtn.addEventListener("click", async () => {
    guestErrorEl.textContent = "";
    (guestModeBtn as HTMLInputElement).disabled = true;
    const originalText = guestModeBtn.textContent;
    guestModeBtn.textContent = "Menyiapkan sesi tamu…";
    try {
      const user = await api.guestLogin();
      showMenu(user);
    } catch (err) {
      guestErrorEl.textContent = err.message || "Gagal memulai sesi tamu. Coba lagi.";
    } finally {
      (guestModeBtn as HTMLInputElement).disabled = false;
      guestModeBtn.textContent = originalText;
    }
  });
}

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = (document.getElementById("login-username") as HTMLInputElement).value.trim();
  const password = (document.getElementById("login-password") as HTMLInputElement).value;
  const errEl = document.getElementById("login-error");
  const submitBtn = (e.target as HTMLElement).querySelector("button[type=submit]");

  errEl.textContent = "";
  if (submitBtn) (submitBtn as HTMLInputElement).disabled = true;
  try {
    const user = await api.login(username, password);
    showMenu(user);
  } catch (err) {
    errEl.textContent = err.message || "Gagal masuk. Coba lagi.";
  } finally {
    if (submitBtn) (submitBtn as HTMLInputElement).disabled = false;
  }
});

