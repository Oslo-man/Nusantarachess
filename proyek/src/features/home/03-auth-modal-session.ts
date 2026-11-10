function openAuthModal() {
  authContainer.classList.remove("hidden");
  document.body.classList.add("auth-modal-open");
  const firstInput = document.getElementById("login-username");
  if (firstInput) firstInput.focus();
}

function closeAuthModal() {
  authContainer.classList.add("hidden");
  document.body.classList.remove("auth-modal-open");
}

["landingHeaderCta", "heroCta"].forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("click", () => openAuthModal());
});

document.getElementById("authModalCloseBtn").addEventListener("click", closeAuthModal);
authContainer.addEventListener("click", (e) => {
  if (e.target === authContainer) closeAuthModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !authContainer.classList.contains("hidden")) closeAuthModal();
});

(async function checkExistingSession() {
  if (!api.isLoggedIn()) {
    showLanding();
    if (getNextParam()) openAuthModal();
    return;
  }
  try {
    const user = await api.verifySession();
    if (user.isGuest && getGuestBlockedParam()) {
      showLanding();
      openAuthModal();
      const registerTab = document.querySelector('.tab-btn[data-tab="register-form"]');
      if (registerTab) (registerTab as HTMLElement).click();
      const registerErrorEl = document.getElementById("register-error");
      if (registerErrorEl) registerErrorEl.textContent = "Fitur ini butuh akun - daftar dulu atau masuk untuk melanjutkan.";
      return;
    }
    showMenu(user);
  } catch (err) {
    if (err && err.status === 401) {
      api.logout();
    } else if (api.isLoggedIn()) {
      window.addEventListener("online", () => location.reload(), { once: true });
    }
    showLanding();
    if (getNextParam()) openAuthModal();
  }
})();

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById((btn as HTMLElement).dataset.tab).classList.add("active");
  });
});

(function setupLanguageAndCountry() {
  const NC = window.NusantaraChess || {};
  const lang = NC.language;
  if (lang) {
    const pickers = document.querySelectorAll("[data-lang-picker]");
    for (let i = 0; i < pickers.length; i++) lang.bindMenu(pickers[i]);
  }

  const countrySelect = document.getElementById("register-country");
  if (!countrySelect || !NC.COUNTRIES) return;

  function fillCountryOptions() {
    const current = (countrySelect as HTMLInputElement).value;
    const code = lang ? lang.get() : "id";
    const placeholder = countrySelect.querySelector('option[value=""]');
    countrySelect.innerHTML = "";
    if (placeholder) countrySelect.appendChild(placeholder);
    NC.COUNTRIES.forEach(function (c: any) {
      const opt = document.createElement("option");
      opt.value = c.code;
      opt.textContent = NC.flagEmojiForCountry(c.code) + " " + NC.countryDisplayName(c.code, code);
      countrySelect.appendChild(opt);
    });
    (countrySelect as HTMLInputElement).value = current || NC.DEFAULT_COUNTRY_CODE || "";
  }

  fillCountryOptions();
  window.addEventListener("nusantara:language-changed", function () {
    if (document.body.contains(countrySelect)) fillCountryOptions();
  });
})();
