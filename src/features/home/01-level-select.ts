let chosenStartLevel: any = null;

let levelChosenPasswordVerified = false;

const LEVEL_KEY_ERROR_TEXT: Record<string, any> = {
  invalid: "Kode salah untuk level ini.",
  wrong_type: "Kode ini bukan untuk level ini.",
  used: "Kode ini sudah pernah dipakai."
};

const levelPasswordPrompt = document.getElementById("level-password-prompt");
const levelPasswordInput = document.getElementById("level-password-input");
const levelPasswordLabel = document.getElementById("level-password-label");
const levelPasswordError = document.getElementById("level-password-error");
const levelPasswordOk = document.getElementById("level-password-ok");
const verifyLevelBtn = document.getElementById("verify-level-btn");
const confirmLevelBtn = document.getElementById("confirm-level-btn");

let verifyInFlight = false;
let verifyRun = 0;
let confirmInFlight = false;

function showLevelSelect(user: any) {
  landingView.classList.add("hidden");
  authContainer.classList.add("hidden");
  document.body.classList.remove("auth-modal-open");
  menuContainer.classList.add("hidden");
  levelSelectView.classList.remove("hidden");
  document.body.classList.add("auth-modal-open");
  levelSelectView.dataset.pendingUser = "1";
}

function updateVerifyBtnState() {
  const hasCode = (levelPasswordInput as HTMLInputElement).value.trim().length > 0;
  if (verifyInFlight) {
    (verifyLevelBtn as HTMLInputElement).disabled = true;
    verifyLevelBtn.textContent = "Memverifikasi…";
  } else if (levelChosenPasswordVerified) {
    (verifyLevelBtn as HTMLInputElement).disabled = true;
    verifyLevelBtn.textContent = "Terverifikasi";
  } else {
    (verifyLevelBtn as HTMLInputElement).disabled = !hasCode;
    verifyLevelBtn.textContent = "Verifikasi";
  }
}

function updateConfirmBtnState() {
  const btn = confirmLevelBtn;
  if (!chosenStartLevel) {
    (btn as HTMLInputElement).disabled = true;
    btn.textContent = "Pilih level dulu";
    return;
  }
  if (chosenStartLevel.protected && !levelChosenPasswordVerified) {
    (btn as HTMLInputElement).disabled = true;
    btn.textContent = "Verifikasi password dulu";
    return;
  }
  (btn as HTMLInputElement).disabled = confirmInFlight;
  btn.textContent = "Mulai sebagai " + chosenStartLevel.tier + " (Rating " + chosenStartLevel.base + ")";
}

function invalidateLevelVerification() {
  verifyRun++;
  verifyInFlight = false;
  levelChosenPasswordVerified = false;
  levelPasswordError.textContent = "";
  levelPasswordOk.textContent = "";
  updateVerifyBtnState();
  updateConfirmBtnState();
}

document.querySelectorAll("#level-select-view .difficulty-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll("#level-select-view .difficulty-card").forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
    chosenStartLevel = {
      tier: (card as HTMLElement).dataset.tier,
      base: parseInt((card as HTMLElement).dataset.base, 10),
      protected: (card as HTMLElement).dataset.protected === "1"
    };
    (levelPasswordInput as HTMLInputElement).value = "";
    invalidateLevelVerification();

    if (chosenStartLevel.protected) {
      levelPasswordPrompt.classList.remove("hidden");
      levelPasswordLabel.textContent = "Level " + chosenStartLevel.tier + " butuh password.";
      levelPasswordInput.focus();
    } else {
      levelPasswordPrompt.classList.add("hidden");
    }
  });
});

async function attemptVerifyLevelPassword() {
  if (!chosenStartLevel || !chosenStartLevel.protected || verifyInFlight) return;
  const password = (levelPasswordInput as HTMLInputElement).value.trim();
  if (!password) {
    levelPasswordError.textContent = "Masukkan kode terlebih dahulu.";
    levelPasswordOk.textContent = "";
    levelPasswordInput.focus();
    return;
  }
  const run = ++verifyRun;
  const base = chosenStartLevel.base;
  levelPasswordError.textContent = "";
  levelPasswordOk.textContent = "";
  verifyInFlight = true;
  levelChosenPasswordVerified = false;
  updateVerifyBtnState();
  updateConfirmBtnState();
  try {
    const result = await api.verifyLevelPassword(base, password);
    if (run !== verifyRun) return;
    levelChosenPasswordVerified = result.valid;
    if (result.valid) {
      levelPasswordOk.textContent = "Kode valid. Lanjutkan dengan tombol di bawah.";
    } else {
      levelPasswordError.textContent = LEVEL_KEY_ERROR_TEXT[result.reason] || LEVEL_KEY_ERROR_TEXT.invalid;
    }
  } catch (err) {
    if (run !== verifyRun) return;
    levelChosenPasswordVerified = false;
    levelPasswordError.textContent = err.message || "Gagal memeriksa password. Coba lagi.";
  } finally {
    if (run === verifyRun) {
      verifyInFlight = false;
      updateVerifyBtnState();
      updateConfirmBtnState();
    }
  }
}

verifyLevelBtn.addEventListener("click", attemptVerifyLevelPassword);

levelPasswordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    attemptVerifyLevelPassword();
  }
});
levelPasswordInput.addEventListener("input", () => {
  if (verifyInFlight || levelChosenPasswordVerified || levelPasswordError.textContent || levelPasswordOk.textContent) {
    invalidateLevelVerification();
  } else {
    updateVerifyBtnState();
  }
});

async function handleLevelAlreadyChosen(message: any) {
  chosenStartLevel = null;
  levelChosenPasswordVerified = false;
  let fresh = null;
  try { fresh = await api.me(); } catch (e) { fresh = null; }
  try {
    if (fresh && fresh.levelChosen) showMenu(fresh);
  } finally {
    setTimeout(() => { alert(message); }, 0);
  }
}

confirmLevelBtn.addEventListener("click", async () => {
  if (!chosenStartLevel || confirmInFlight) return;
  if (chosenStartLevel.protected && !levelChosenPasswordVerified) return;
  const base = chosenStartLevel.base;
  const levelPassword = chosenStartLevel.protected ? (levelPasswordInput as HTMLInputElement).value.trim() : undefined;
  confirmInFlight = true;
  updateConfirmBtnState();
  try {
    const patch = {
      levelChosen: true,
      eloBullet: base,
      eloBlitz: base,
      eloRapid: base,
      puzzleRating: base
    };
    if (levelPassword !== undefined) (patch as any).levelPassword = levelPassword;
    const updated = await api.updateProfile(patch);
    chosenStartLevel = null;
    levelChosenPasswordVerified = false;
    showMenu(updated);
  } catch (err) {
    if (err && err.payload && err.payload.code === "LEVEL_ALREADY_CHOSEN") {
      await handleLevelAlreadyChosen(err.message);
    } else {
      alert(err.message || "Gagal menyimpan level awal.");
      if (chosenStartLevel && chosenStartLevel.protected) {
        levelChosenPasswordVerified = false;
        levelPasswordOk.textContent = "";
        levelPasswordError.textContent = err.message || "Password level tidak sesuai.";
        updateVerifyBtnState();
      }
    }
  } finally {
    confirmInFlight = false;
    updateConfirmBtnState();
  }
});
