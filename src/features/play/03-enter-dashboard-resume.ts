/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
function enterDashboard() {
    const user = state.currentUser;
    if (!user) {
      const router = window.NusantaraChess.router;
      if (router && typeof router.navigate === "function") router.navigate("/");
      else location.href = "/";
      return;
    }
    applyProfilePhotoToUI(user.profilePhoto);
    resetTimeControlSelection();
    checkForActiveGame();
    showPage("dashboard-page");
  }

  let pendingResumeMatch: any = null;
  let pendingResumeTimeControl: any = null;

  async function checkForActiveGame() {
    const banner = document.getElementById("resume-banner");
    try {
      const res = await api.getActiveMatch();
      if (res.match && res.timeControl) {
        pendingResumeMatch = res.match;
        pendingResumeTimeControl = res.timeControl;
        const categoryLabels: Record<string, any> = { bullet: "Bullet", blitz: "Blitz", rapid: "Rapid" };
        const catLabel = categoryLabels[res.match.category] || res.match.category;
        document.getElementById("resume-banner-subtitle").textContent =
          "vs " + res.match.bot.name + " · " + catLabel;
        banner.classList.remove("hidden");
      } else {
        pendingResumeMatch = null;
        pendingResumeTimeControl = null;
        banner.classList.add("hidden");
      }
    } catch (e) {
      pendingResumeMatch = null;
      pendingResumeTimeControl = null;
      banner.classList.add("hidden");
    }
  }

  document.getElementById("resume-game-btn").addEventListener("click", async () => {
    if (!pendingResumeMatch || !pendingResumeTimeControl) return;
    const match = pendingResumeMatch;
    const timeControl = pendingResumeTimeControl;
    await startGame(match, timeControl, {
      sanHistory: match.sanHistory,
      plySnapshots: match.plySnapshots,
      lastMoveSquaresPerPly: match.lastMoveSquaresPerPly
    });
  });

  function setTimeTriggerIcon(category: any) {
    const icon = document.getElementById("time-dropdown-trigger-icon");
    if (!icon) return;
    if (category === "bullet" || category === "blitz" || category === "rapid") {
      icon.innerHTML = '<img class="time-trigger-img" src="images/' + category + '.svg" alt="" onerror="this.style.visibility=\'hidden\'">';
    } else {
      icon.innerHTML = '<svg class="time-trigger-default" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/></svg>';
    }
  }

  function resetTimeControlSelection() {
    state.timeControl = null;
    document.querySelectorAll(".time-option").forEach(o => o.classList.remove("selected"));
    const customToggle = document.getElementById("time-custom-toggle");
    if (customToggle) customToggle.classList.remove("selected");
    const label = document.getElementById("time-dropdown-trigger-label");
    if (label) label.textContent = "Pilih kontrol waktu";
    setTimeTriggerIcon(null);
    updateFindMatchButton();
  }

  function applyProfilePhotoToUI(photoDataUrl: any) {
    const wrap = document.getElementById("player-panel-avatar-wrap");
    if (!wrap) return;
    const cu = window.NusantaraChess.currentUser;
    window.NusantaraChess.renderProfileAvatar(wrap, cu ? (cu.profilePhoto || null) : (photoDataUrl || null));
    window.NusantaraChess.bindProfileAvatar(wrap);
  }

  