(function buildHeroBoard() {
  const grid = document.getElementById("heroBoardGrid");
  if (!grid) return;
  const PIECE = window.NusantaraChess.PIECE_SVG;
  if (!PIECE) return;
  const ROWS = [
    ["br","bn","bb","bq","bk","bb","bn","br"],
    ["bp","bp","bp","bp","bp","bp","bp","bp"],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ["wp","wp","wp","wp","wp","wp","wp","wp"],
    ["wr","wn","wb","wq","wk","wb","wn","wr"]
  ];
  let html = "";
  ROWS.forEach((row, r) => {
    row.forEach((piece, c) => {
      const isLight = (r + c) % 2 === 0;
      html += '<div class="hero-square ' + (isLight ? "light" : "dark") + '">' + (piece ? PIECE[piece] : "") + '</div>';
    });
  });
  grid.innerHTML = html;
})();

function escapeHtml(str: any) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function setupHomeAvatarUpload() {
  const avatarBtn = document.getElementById("home-avatar");
  const fileInput = document.getElementById("home-avatar-input");
  if (!avatarBtn || !fileInput) return;

  avatarBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", async () => {
    const file = (fileInput as HTMLInputElement).files && (fileInput as HTMLInputElement).files[0];
    (fileInput as HTMLInputElement).value = "";
    if (!file) return;

    const originalContent = avatarBtn.innerHTML;
    (avatarBtn as HTMLInputElement).disabled = true;
    avatarBtn.textContent = "…";

    try {
      const dataUrl = await window.NusantaraChess.imageResize.fileToResizedDataUrl(file, {
        targetDimension: 256,
        maxDataUrlChars: 95000
      });
      const updatedUser = await api.updateProfile({ profilePhoto: dataUrl });
      renderHomeAvatar(updatedUser);
      if (window.NusantaraChess.updateAccountInfo) {
        window.NusantaraChess.updateAccountInfo(updatedUser);
      }
    } catch (err) {
      avatarBtn.innerHTML = originalContent;
      alert(err.message || "Gagal mengganti foto profil. Coba lagi.");
    } finally {
      (avatarBtn as HTMLInputElement).disabled = false;
    }
  });
}
setupHomeAvatarUpload();

function setupHomeEditName() {
  const editBtn = document.getElementById("home-edit-name");
  if (!editBtn) return;
  let busy = false;

  editBtn.addEventListener("click", async () => {
    if (busy) return;
    const current = menuUsernameEl.textContent || "";
    const input = window.prompt("Masukkan nama baru (3-20 karakter: huruf, angka, underscore).", current);
    if (input === null) return;
    const next = input.trim();
    if (next === current) return;
    if (!/^[A-Za-z0-9_]{3,20}$/.test(next)) {
      alert("Username harus 3-20 karakter, huruf/angka/underscore saja.");
      return;
    }
    busy = true;
    try {
      const updatedUser = await api.updateProfile({ username: next });
      menuUsernameEl.textContent = updatedUser.username;
    } catch (err) {
      alert(err.message || "Gagal mengganti nama. Coba lagi.");
    } finally {
      busy = false;
    }
  });
}
setupHomeEditName();

})();

(function initLandingFooter() {
  const footer = document.getElementById("landing-footer");
  if (!footer) return;
  const yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  footer.querySelectorAll("[data-legal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dlg = document.getElementById((btn as HTMLElement).dataset.legal);
      if (dlg && typeof (dlg as HTMLDialogElement).showModal === "function" && !(dlg as HTMLDialogElement).open) (dlg as HTMLDialogElement).showModal();
    });
  });
  footer.querySelectorAll("dialog.legal-dialog").forEach((dlg) => {
    dlg.addEventListener("click", (e) => { if (e.target === dlg) (dlg as HTMLDialogElement).close(); });
    const closeBtn = dlg.querySelector("[data-legal-close]");
    if (closeBtn) closeBtn.addEventListener("click", () => (dlg as HTMLDialogElement).close());
  });

  const featureLink = document.getElementById("footerFeatureLink");
  if (featureLink) featureLink.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.getElementById("fitur");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
