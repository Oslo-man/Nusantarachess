/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
const dashboardSettingsBtn = document.getElementById("dashboard-settings-btn");
  if (dashboardSettingsBtn) {
    dashboardSettingsBtn.addEventListener("click", () => {
      openDashboardSettings();
    });
  }
  let settingsReturnFocusEl: any = null;
  function openDashboardSettings() {
    settingsReturnFocusEl = document.activeElement;
    document.getElementById("dashboard-settings-modal").classList.remove("hidden");
    renderAdminSection({ fillCustomForm: true });
    const codeInput = document.getElementById("admin-code-input");
    const gateVisible = !document.getElementById("admin-unlock-section").classList.contains("hidden");
    const focusTarget: any = gateVisible && codeInput ? codeInput : document.querySelector("#dashboard-settings-modal .dashboard-settings-box");
    if (focusTarget && focusTarget.focus) focusTarget.focus();
  }
  function closeDashboardSettings() {
    document.getElementById("dashboard-settings-modal").classList.add("hidden");
    const codeInput = document.getElementById("admin-code-input") as HTMLInputElement | null;
    if (codeInput) codeInput.value = "";
    ["admin-unlock-error", "admin-elo-error", "admin-custom-error"].forEach(hideAdminError);
    if (settingsReturnFocusEl && settingsReturnFocusEl.focus && document.contains(settingsReturnFocusEl)) settingsReturnFocusEl.focus();
    settingsReturnFocusEl = null;
  }
  const dashboardSettingsCloseBtn = document.getElementById("dashboard-settings-close-btn");
  if (dashboardSettingsCloseBtn) {
    dashboardSettingsCloseBtn.addEventListener("click", closeDashboardSettings);
  }
  const dashboardSettingsModal = document.getElementById("dashboard-settings-modal");
  if (dashboardSettingsModal) {
    dashboardSettingsModal.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "dashboard-settings-modal") closeDashboardSettings();
    });
    const NCg: any = (window.NusantaraChess = window.NusantaraChess || {});
    if (NCg._dashboardSettingsKeydown) document.removeEventListener("keydown", NCg._dashboardSettingsKeydown);
    NCg._dashboardSettingsKeydown = (e: KeyboardEvent) => {
      if (!document.body.contains(dashboardSettingsModal) || dashboardSettingsModal.classList.contains("hidden")) return;
      if (e.key === "Escape") { e.preventDefault(); closeDashboardSettings(); return; }
      if (e.key !== "Tab") return;
      const focusables = Array.prototype.filter.call(
        dashboardSettingsModal.querySelectorAll("button, input, select, textarea"),
        (el: any) => !el.disabled && el.offsetParent !== null
      ) as HTMLElement[];
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement;
      const outside = !dashboardSettingsModal.contains(active) || active.classList.contains("dashboard-settings-box");
      if (e.shiftKey && (active === first || outside)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (active === last || outside)) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", NCg._dashboardSettingsKeydown);
  }

  const adminCountrySelect = document.getElementById("admin-custom-country");
  if (adminCountrySelect && window.NusantaraChess && window.NusantaraChess.COUNTRIES) {
    const NC = window.NusantaraChess;
    const langCode = NC.language ? NC.language.get() : "id";
    NC.COUNTRIES.forEach((c: any) => {
      const opt = document.createElement("option");
      opt.value = c.code;
      opt.textContent = NC.flagEmojiForCountry(c.code) + " " + NC.countryDisplayName(c.code, langCode);
      adminCountrySelect.appendChild(opt);
    });
    (adminCountrySelect as HTMLInputElement).value = NC.DEFAULT_COUNTRY_CODE;
  }

  const PLAYER_ELO_MIN = 1300, PLAYER_ELO_MAX = 3200;
  const UCI_ELO_MIN = 1320, UCI_ELO_MAX = 3190;

  function parseWholeNumber(raw: any) {
    const t = String(raw == null ? "" : raw).trim();
    return /^\d{1,6}$/.test(t) ? parseInt(t, 10) : NaN;
  }

  function parseJsonObject(str: any) {
    if (!str) return null;
    try {
      const v = JSON.parse(str);
      return (v && typeof v === "object" && !Array.isArray(v)) ? v : null;
    } catch (e) { return null; }
  }

  const adminCustomEloInput = document.getElementById("admin-custom-elo");
  const adminCustomEloRange = document.getElementById("admin-custom-elo-range");
  function setCustomEloValue(elo: any) {
    if (adminCustomEloInput) (adminCustomEloInput as HTMLInputElement).value = (elo === "" || elo == null) ? "" : String(elo);
    if (adminCustomEloRange) {
      const n = parseInt(elo, 10);
      (adminCustomEloRange as any).value = Number.isFinite(n) ? Math.max(UCI_ELO_MIN, Math.min(UCI_ELO_MAX, n)) : UCI_ELO_MIN;
    }
  }
  if (adminCustomEloRange && adminCustomEloInput) {
    adminCustomEloRange.addEventListener("input", () => {
      (adminCustomEloInput as HTMLInputElement).value = (adminCustomEloRange as HTMLInputElement).value;
    });
    adminCustomEloInput.addEventListener("input", () => {
      const n = parseInt((adminCustomEloInput as HTMLInputElement).value, 10);
      if (Number.isFinite(n)) (adminCustomEloRange as any).value = Math.max(UCI_ELO_MIN, Math.min(UCI_ELO_MAX, n));
    });
  }

  const adminCustomPhotoInput = document.getElementById("admin-custom-photo");
  const adminCustomPhotoPreview = document.getElementById("admin-custom-photo-preview");
  let customPhotoObjectUrl: any = null;
  function setCustomPhotoPreview(src: any) {
    if (customPhotoObjectUrl) { URL.revokeObjectURL(customPhotoObjectUrl); customPhotoObjectUrl = null; }
    if (!adminCustomPhotoPreview) return;
    if (src) {
      (adminCustomPhotoPreview as HTMLImageElement).src = src;
      adminCustomPhotoPreview.classList.remove("hidden");
    } else {
      adminCustomPhotoPreview.removeAttribute("src");
      adminCustomPhotoPreview.classList.add("hidden");
    }
  }
  if (adminCustomPhotoInput) {
    adminCustomPhotoInput.addEventListener("change", () => {
      const file = (adminCustomPhotoInput as HTMLInputElement).files && (adminCustomPhotoInput as HTMLInputElement).files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setCustomPhotoPreview(url);
      customPhotoObjectUrl = url;
    });
  }

  function renderAdminSection(opts?: any) {
    const unlocked = !!(state.currentUser && state.currentUser.isAdminUnlocked);
    document.getElementById("admin-unlock-section").classList.toggle("hidden", unlocked);
    document.getElementById("admin-panel-section").classList.toggle("hidden", !unlocked);
    const gateTitle = document.getElementById("dashboard-settings-title-gate");
    const adminTitle = document.getElementById("dashboard-settings-title-admin");
    if (gateTitle) gateTitle.classList.toggle("hidden", unlocked);
    if (adminTitle) adminTitle.classList.toggle("hidden", !unlocked);
    const settingsBox = document.querySelector("#dashboard-settings-modal .dashboard-settings-box");
    if (settingsBox) settingsBox.setAttribute("aria-labelledby", unlocked ? "dashboard-settings-title-admin" : "dashboard-settings-title-gate");
    if (unlocked) {
      const user = state.currentUser;
      (document.getElementById("admin-elo-bullet") as HTMLInputElement).value = user.eloBullet;
      (document.getElementById("admin-elo-blitz") as HTMLInputElement).value = user.eloBlitz;
      (document.getElementById("admin-elo-rapid") as HTMLInputElement).value = user.eloRapid;
      (document.getElementById("admin-elo-protection-toggle") as HTMLInputElement).checked = !!user.eloProtected;
      const customOpponent = parseJsonObject(user.customOpponent);
      const statusEl = document.getElementById("admin-custom-status");
      const NCc = window.NusantaraChess || {};
      if (customOpponent && customOpponent.name) {
        const flag = NCc.flagEmojiForCountry ? NCc.flagEmojiForCountry(customOpponent.country || NCc.DEFAULT_COUNTRY_CODE) : "";
        statusEl.textContent = "Lawan custom aktif: " + (flag ? flag + " " : "") + customOpponent.name + " (" + customOpponent.elo + " Elo)";
        statusEl.classList.remove("hidden");
      } else {
        statusEl.textContent = "";
        statusEl.classList.add("hidden");
      }

      const fillForm = !!(opts && opts.fillCustomForm && customOpponent && customOpponent.name);
      if (fillForm) {
        (document.getElementById("admin-custom-name") as HTMLInputElement).value = customOpponent.name;
        setCustomEloValue(customOpponent.elo);
        const titleSel = document.getElementById("admin-custom-title");
        if (titleSel) {
          const savedTitle = String(customOpponent.title || "").toUpperCase();
          (titleSel as HTMLInputElement).value = Array.prototype.some.call((titleSel as HTMLSelectElement).options, (o: any) => o.value === savedTitle) ? savedTitle : "";
        }
        if (adminCountrySelect) (adminCountrySelect as HTMLInputElement).value = customOpponent.country || (NCc.DEFAULT_COUNTRY_CODE || "");
        if (adminCustomPhotoInput) (adminCustomPhotoInput as HTMLInputElement).value = "";
        const savedOverrides = parseJsonObject(user.botAvatarOverrides) || {};
        setCustomPhotoPreview(savedOverrides[customOpponent.name] || "");
      }
    }
  }

  function showAdminError(elId: any, message: any) {
    const el = document.getElementById(elId);
    el.textContent = message;
    el.classList.remove("hidden");
  }
  function hideAdminError(elId: any) {
    const el = document.getElementById(elId);
    el.textContent = "";
    el.classList.add("hidden");
  }

  const adminUnlockBtn = document.getElementById("admin-unlock-btn");
  if (adminUnlockBtn) {
    adminUnlockBtn.addEventListener("click", async () => {
      hideAdminError("admin-unlock-error");
      const code = (document.getElementById("admin-code-input") as HTMLInputElement).value;
      if (!code) { showAdminError("admin-unlock-error", "Masukkan kode akses terlebih dahulu."); return; }
      (adminUnlockBtn as HTMLInputElement).disabled = true;
      try {
        const result = await api.verifyAdminCode(code);
        if (result && result.valid && result.user) {
          state.currentUser = result.user;
          (document.getElementById("admin-code-input") as HTMLInputElement).value = "";
          renderAdminSection({ fillCustomForm: true });
        } else {
          showAdminError("admin-unlock-error", "Kode akses salah.");
        }
      } catch (err) {
        if (err && err.status === 409 && err.payload && err.payload.code === "ADMIN_ALREADY_UNLOCKED") {
          try {
            const fresh = await api.me();
            if (fresh && fresh.isAdminUnlocked) {
              state.currentUser = fresh;
              (document.getElementById("admin-code-input") as HTMLInputElement).value = "";
              renderAdminSection({ fillCustomForm: true });
              return;
            }
          } catch (e2) { }
        }
        showAdminError("admin-unlock-error", (err && err.payload && err.payload.error) || (err && err.message) || "Kode akses salah.");
      } finally {
        (adminUnlockBtn as HTMLInputElement).disabled = false;
      }
    });
  }

  function submitOnEnter(inputIds: string[], buttonId: string) {
    inputIds.forEach((id) => {
      const input = document.getElementById(id);
      const btn = document.getElementById(buttonId) as HTMLButtonElement | null;
      if (!input || !btn) return;
      input.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key !== "Enter" || e.isComposing) return;
        e.preventDefault();
        if (!btn.disabled) btn.click();
      });
    });
  }
  submitOnEnter(["admin-code-input"], "admin-unlock-btn");
  submitOnEnter(["admin-elo-bullet", "admin-elo-blitz", "admin-elo-rapid"], "admin-elo-save-btn");
  submitOnEnter(["admin-custom-name", "admin-custom-elo"], "admin-custom-save-btn");

  const adminEloSaveBtn = document.getElementById("admin-elo-save-btn");
  if (adminEloSaveBtn) {
    adminEloSaveBtn.addEventListener("click", async () => {
      hideAdminError("admin-elo-error");
      const patch: Record<string, any> = {
        eloBullet: parseWholeNumber((document.getElementById("admin-elo-bullet") as HTMLInputElement).value),
        eloBlitz: parseWholeNumber((document.getElementById("admin-elo-blitz") as HTMLInputElement).value),
        eloRapid: parseWholeNumber((document.getElementById("admin-elo-rapid") as HTMLInputElement).value)
      };
      for (const key of Object.keys(patch)) {
        if (!Number.isFinite(patch[key])) { showAdminError("admin-elo-error", "Semua kolom Elo harus diisi bilangan bulat tanpa desimal."); return; }
        if (patch[key] < PLAYER_ELO_MIN || patch[key] > PLAYER_ELO_MAX) {
          showAdminError("admin-elo-error", "Elo akun harus angka antara " + PLAYER_ELO_MIN + " dan " + PLAYER_ELO_MAX + ".");
          return;
        }
      }
      (adminEloSaveBtn as HTMLInputElement).disabled = true;
      try {
        const updated = await api.setAdminElo(patch);
        state.currentUser = updated;
        const bulletEl = document.getElementById("rating-bullet");
        const blitzEl = document.getElementById("rating-blitz");
        const rapidEl = document.getElementById("rating-rapid");
        if (bulletEl) bulletEl.textContent = updated.eloBullet;
        if (blitzEl) blitzEl.textContent = updated.eloBlitz;
        if (rapidEl) rapidEl.textContent = updated.eloRapid;
        renderAdminSection();
      } catch (err) {
        showAdminError("admin-elo-error", (err && err.payload && err.payload.error) || "Gagal menyimpan Elo.");
      } finally {
        (adminEloSaveBtn as HTMLInputElement).disabled = false;
      }
    });
  }

  const adminEloProtectionToggle = document.getElementById("admin-elo-protection-toggle");
  if (adminEloProtectionToggle) {
    adminEloProtectionToggle.addEventListener("change", async () => {
      hideAdminError("admin-elo-error");
      const enabled = (adminEloProtectionToggle as HTMLInputElement).checked;
      (adminEloProtectionToggle as HTMLInputElement).disabled = true;
      try {
        const updated = await api.setAdminEloProtection(enabled);
        state.currentUser = updated;
      } catch (err) {
        (adminEloProtectionToggle as HTMLInputElement).checked = !enabled;
        showAdminError("admin-elo-error", (err && err.payload && err.payload.error) || "Gagal menyimpan proteksi Elo.");
      } finally {
        (adminEloProtectionToggle as HTMLInputElement).disabled = false;
      }
    });
  }

  const adminCustomSaveBtn = document.getElementById("admin-custom-save-btn");
  if (adminCustomSaveBtn) {
    adminCustomSaveBtn.addEventListener("click", async () => {
      hideAdminError("admin-custom-error");
      const name = (document.getElementById("admin-custom-name") as HTMLInputElement).value.trim();
      const elo = parseWholeNumber((document.getElementById("admin-custom-elo") as HTMLInputElement).value);
      const titleEl = document.getElementById("admin-custom-title");
      const title = titleEl ? (titleEl as HTMLInputElement).value : "";
      const country = adminCountrySelect ? (adminCountrySelect as HTMLInputElement).value : "";
      if (!name) { showAdminError("admin-custom-error", "Nama lawan custom wajib diisi."); return; }
      if (!Number.isFinite(elo)) { showAdminError("admin-custom-error", "Elo lawan custom wajib diisi bilangan bulat tanpa desimal."); return; }
      if (elo < UCI_ELO_MIN || elo > UCI_ELO_MAX) {
        showAdminError("admin-custom-error", "Elo lawan custom harus angka antara " + UCI_ELO_MIN + " dan " + UCI_ELO_MAX + ".");
        return;
      }
      (adminCustomSaveBtn as HTMLInputElement).disabled = true;
      try {
        const payload = { name, elo, title, country };
        const photoFile = adminCustomPhotoInput && (adminCustomPhotoInput as HTMLInputElement).files && (adminCustomPhotoInput as HTMLInputElement).files[0];
        if (photoFile) {
          (payload as any).avatarImage = await window.NusantaraChess.imageResize.fileToResizedDataUrl(photoFile, {
            targetDimension: 256,
            maxDataUrlChars: 95000
          });
        }
        const updated = await api.setAdminCustomOpponent(payload);
        state.currentUser = updated;
        renderAdminSection({ fillCustomForm: true });
      } catch (err) {
        showAdminError("admin-custom-error", (err && err.payload && err.payload.error) || (err && err.message) || "Gagal menyimpan lawan custom.");
      } finally {
        (adminCustomSaveBtn as HTMLInputElement).disabled = false;
      }
    });
  }

  const adminCustomClearBtn = document.getElementById("admin-custom-clear-btn");
  if (adminCustomClearBtn) {
    adminCustomClearBtn.addEventListener("click", async () => {
      hideAdminError("admin-custom-error");
      (adminCustomClearBtn as HTMLInputElement).disabled = true;
      try {
        const updated = await api.clearAdminCustomOpponent();
        state.currentUser = updated;
        (document.getElementById("admin-custom-name") as HTMLInputElement).value = "";
        setCustomEloValue("");
        (document.getElementById("admin-custom-title") as HTMLInputElement).value = "";
        if (adminCustomPhotoInput) (adminCustomPhotoInput as HTMLInputElement).value = "";
        setCustomPhotoPreview("");
        if (adminCountrySelect && window.NusantaraChess) (adminCountrySelect as HTMLInputElement).value = window.NusantaraChess.DEFAULT_COUNTRY_CODE;
        renderAdminSection();
      } catch (err) {
        showAdminError("admin-custom-error", (err && err.payload && err.payload.error) || "Gagal menghapus lawan custom.");
      } finally {
        (adminCustomClearBtn as HTMLInputElement).disabled = false;
      }
    });
  }

  state.currentUser = initialUser;
  enterDashboard();

  