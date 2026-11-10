(function () {
"use strict";

window.NusantaraChess = window.NusantaraChess || {};

const MENU_ITEMS = [
  {
    href: "/",
    label: "Beranda",
    icon: '<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9"/>',
    bottom: true
  },
  {
    href: "/play",
    label: "Bermain",
    icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    bottom: true
  },
  {
    href: "/puzzles",
    label: "Puzzle",
    icon: '<path d="M6 8h4.5a2 2 0 1 1 3 0H18a1 1 0 0 1 1 1v3.5a2 2 0 1 0 0 3V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>',
    bottom: true
  },
  {
    href: "/lessons",
    label: "Lesson",
    icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    bottom: true,
    matchPrefix: true
  },
  {
    href: "/bot",
    label: "Lawan Bot",
    icon: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4"/><circle cx="12" cy="3.2" r="1" fill="currentColor"/><path d="M2 13v3M22 13v3"/><circle cx="9" cy="13" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="13" r="1.3" fill="currentColor" stroke="none"/><path d="M9 17h6"/>'
  },
  {
    href: "/gamereview",
    label: "Game Review",
    icon: '<circle cx="10.5" cy="10.5" r="7"/><path d="m15.7 15.7 4.8 4.8"/><path d="M10.5 7.3v6.4M7.3 10.5h6.4"/><path d="M10.5 10.5V7.3a3.2 3.2 0 0 1 3.2 3.2zM10.5 10.5v3.2a3.2 3.2 0 0 1-3.2-3.2z" fill="currentColor"/>'
  },
  {
    href: "/library",
    label: "Game Library",
    icon: '<path d="M4 4h4v16H4z"/><path d="M10 4h4v16h-4z"/><path d="M16 6l4-1 2 15-4 1z"/>'
  },
  {
    href: "/leaderboard",
    label: "Leaderboard",
    icon: '<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v6a5 5 0 0 1-10 0V4z"/><path d="M7 6H4a2 2 0 0 0 2 4"/><path d="M17 6h3a2 2 0 0 1-2 4"/>'
  },
  {
    href: "/profile",
    label: "Profil",
    icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>'
  }
];

const CLOSE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>';
const MORE_ICON = '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>';
const LOGOUT_ICON = '<svg class="site-drawer-logout-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M10 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H10"/><path d="M10 12h10"/><path d="m16.5 8.5 3.5 3.5-3.5 3.5"/></svg>';
const CHEVRON_LEFT_ICON = '<path d="M15 18l-6-6 6-6"/>';

const SIDEBAR_COLLAPSE_KEY = "nusantarachess_sidebar_collapsed";

function iconSvg(pathInner: any) {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + pathInner + '</svg>';
}

function escapeHtml(str: any) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function isCurrent(item: any, currentPage: any) {
  if (item.href === currentPage) return true;
  if (item.matchPrefix && currentPage.indexOf(item.href + "/") === 0) return true;
  return false;
}

function buildSidebarLinks(currentPage: any) {
  return MENU_ITEMS.map(item => {
    const current = isCurrent(item, currentPage);
    return '<a class="site-sidebar-link' + (current ? ' is-current' : '') + '" href="' + item.href + '" data-route-link' +
      (current ? ' aria-current="page"' : '') + '>' + iconSvg(item.icon) + '<span>' + item.label + '</span></a>';
  }).join("");
}

function buildBottombarLinks(currentPage: any) {
  return MENU_ITEMS.filter(item => item.bottom).map(item => {
    const current = isCurrent(item, currentPage);
    return '<a class="site-bottombar-link' + (current ? ' is-current' : '') + '" href="' + item.href + '" data-route-link' +
      (current ? ' aria-current="page"' : '') + '>' + iconSvg(item.icon) + '<span>' + item.label + '</span></a>';
  }).join("");
}

function buildDrawerLinks(currentPage: any) {
  return MENU_ITEMS.map(item => {
    const current = isCurrent(item, currentPage);
    return '<a class="site-drawer-link' + (current ? ' is-current' : '') + '" href="' + item.href + '" data-route-link' +
      (current ? ' aria-current="page"' : '') + '>' + iconSvg(item.icon) + '<span>' + item.label + '</span></a>';
  }).join("");
}

function buildShellSkeleton() {
  const content = document.createElement("div");
  content.className = "site-content";

  let outlet = document.getElementById("route-outlet");
  if (!outlet) {
    outlet = document.createElement("div");
    outlet.id = "route-outlet";
  }
  content.appendChild(outlet);

  const shell = document.createElement("div");
  shell.className = "site-shell";
  shell.appendChild(content);

  document.body.appendChild(shell);

  return { shell, content, outlet };
}

function updateActiveNav(currentPage: any) {
  const allLinkGroups = [
    document.querySelector(".site-sidebar-nav"),
    document.querySelector(".site-bottombar"),
    document.querySelector(".site-drawer-nav")
  ];
  MENU_ITEMS.forEach((item) => {
    allLinkGroups.forEach((group) => {
      if (!group) return;
      const links = group.querySelectorAll('a[href="' + item.href + '"]');
      links.forEach((link) => {
        const current = isCurrent(item, currentPage);
        link.classList.toggle("is-current", current);
        if (current) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    });
  });
}

function updateAccountInfo(user: any) {
  const isGuest = !!(user && user.isGuest);
  const username = isGuest ? "Tamu" : (user && user.username ? user.username : "Player");
  const nameEls = document.querySelectorAll(".site-account-name, .site-drawer-user-name");
  nameEls.forEach((el) => { el.textContent = username; });
  const accountBtn = document.getElementById("siteNavAccountBtn");
  if (accountBtn) accountBtn.setAttribute("aria-label", "Akun: " + username);

  const guestHintEl = document.getElementById("siteNavDrawerGuestHint");
  if (guestHintEl) guestHintEl.hidden = !isGuest;

  const avatarEls = [document.getElementById("siteNavTopAvatar"), document.getElementById("siteNavDrawerAvatar")];
  avatarEls.forEach((avatarEl) => {
    if (!avatarEl) return;
    if (user && user.profilePhoto) {
      let img = avatarEl.querySelector("img");
      if (!img) {
        img = document.createElement("img");
        img.alt = "";
        img.onerror = function () { renderProfileAvatar(avatarEl, null); };
        avatarEl.textContent = "";
        avatarEl.appendChild(img);
      }
      img.src = user.profilePhoto;
    } else {
      renderProfileAvatar(avatarEl, null);
    }
  });
}

function initSiteNav(user: any, currentPage: any) {
  const existingShell = document.querySelector(".site-shell");

  if (existingShell) {
    updateActiveNav(currentPage);
    updateAccountInfo(user);
    return document.getElementById("route-outlet");
  }

  const username = user && user.username ? user.username : "Player";
  const collapsed = localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "1";

  const { shell, content, outlet } = buildShellSkeleton();
  if (collapsed) shell.classList.add("is-sidebar-collapsed");

  const sidebar = document.createElement("aside");
  sidebar.className = "site-sidebar";
  sidebar.setAttribute("aria-label", "Navigasi utama");
  sidebar.innerHTML =
    '<a class="site-sidebar-header" href="/" data-route-link>' +
      '<img src="/favicon.svg" alt="" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';">' +
      '<span class="site-sidebar-header-fallback">N</span>' +
      '<span class="site-sidebar-header-text">NusantaraChess</span>' +
    '</a>' +
    '<nav class="site-sidebar-nav">' + buildSidebarLinks(currentPage) + '</nav>' +
    '<div class="site-sidebar-footer">' +
      '<button type="button" class="site-sidebar-toggle" id="siteSidebarToggleBtn" aria-label="Ciutkan sidebar">' +
        iconSvg(CHEVRON_LEFT_ICON) + '<span>Ciutkan</span>' +
      '</button>' +
    '</div>';
  shell.insertBefore(sidebar, content);

  const topbar = document.createElement("header");
  topbar.className = "site-topbar";
  topbar.innerHTML =
    '<a class="site-topbar-brand" href="/" data-route-link>' +
      '<img src="/favicon.svg" alt="" onerror="this.style.display=\'none\'">' +
      '<span>NusantaraChess</span>' +
    '</a>' +
    '<div class="site-topbar-actions">' +
      '<button type="button" class="site-account-btn" id="siteNavAccountBtn" aria-label="Akun: ' + escapeHtml(username) + '">' +
        '<span class="site-account-avatar" id="siteNavTopAvatar">' + DEFAULT_AVATAR_SVG + '</span>' +
        '<span class="site-account-name">' + escapeHtml(username) + '</span>' +
      '</button>' +
    '</div>';
  content.insertBefore(topbar, content.firstChild);
  document.body.classList.add("has-site-topbar");

  const bottombar = document.createElement("nav");
  bottombar.className = "site-bottombar";
  bottombar.setAttribute("aria-label", "Navigasi utama");
  bottombar.innerHTML =
    buildBottombarLinks(currentPage) +
    '<button type="button" class="site-bottombar-more" id="siteNavMoreBtn" aria-haspopup="true" aria-expanded="false">' +
      iconSvg(MORE_ICON) + '<span>Lainnya</span>' +
    '</button>';
  document.body.appendChild(bottombar);

  const drawerWrap = document.createElement("div");
  drawerWrap.innerHTML =
    '<div class="site-drawer-overlay" id="siteNavOverlay">' +
      '<div class="site-drawer" role="dialog" aria-modal="true" aria-label="Menu navigasi">' +
        '<div class="site-drawer-header">' +
          '<span>Menu</span>' +
          '<button type="button" class="site-drawer-close-btn" id="siteNavCloseBtn" aria-label="Tutup menu">' + CLOSE_ICON + '</button>' +
        '</div>' +
        '<div class="site-drawer-user">' +
          '<div class="site-drawer-user-avatar" id="siteNavDrawerAvatar">' + DEFAULT_AVATAR_SVG + '</div>' +
          '<div class="site-drawer-user-name">' + escapeHtml(username) + '</div>' +
        '</div>' +
        '<a href="/?next=' + encodeURIComponent(currentPage || "/") + '&guestBlocked=1" data-route-link class="site-drawer-guest-hint" id="siteNavDrawerGuestHint" hidden>Daftar untuk simpan progres <span class="ui-ico ui-ico-arrow-right" aria-hidden="true"></span></a>' +
        '<nav class="site-drawer-nav" aria-label="Menu halaman">' + buildDrawerLinks(currentPage) + '</nav>' +
        '<div class="site-drawer-footer">' +
          '<button type="button" class="site-drawer-logout-btn" id="siteNavLogoutBtn">' + LOGOUT_ICON + '<span>Keluar</span></button>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(drawerWrap.firstElementChild);

  const overlay = document.getElementById("siteNavOverlay");
  const moreBtn = document.getElementById("siteNavMoreBtn");
  const closeBtn = document.getElementById("siteNavCloseBtn");
  const logoutBtn = document.getElementById("siteNavLogoutBtn");
  const accountBtn = document.getElementById("siteNavAccountBtn");
  let lastFocused: any = null;

  function openDrawer() {
    lastFocused = document.activeElement;
    overlay.classList.add("is-open");
    moreBtn.setAttribute("aria-expanded", "true");
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }
  function closeDrawer() {
    overlay.classList.remove("is-open");
    moreBtn.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused) lastFocused.focus();
  }
  function onKeydown(e: any) {
    if (e.key === "Escape") closeDrawer();
  }

  moreBtn.addEventListener("click", openDrawer);
  accountBtn.addEventListener("click", openDrawer);
  closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", (e: any) => {
    if (e.target === overlay || (e.target.closest && e.target.closest("a[data-route-link]"))) closeDrawer();
  });
  window.addEventListener("popstate", () => { if (overlay.classList.contains("is-open")) closeDrawer(); });
  logoutBtn.addEventListener("click", () => {
    closeDrawer();
    window.NusantaraChess.api.logout();
    const router = window.NusantaraChess.router;
    if (router && typeof router.navigate === "function") router.navigate("/");
    else location.href = "/";
  });

  const sidebarToggleBtn = document.getElementById("siteSidebarToggleBtn");
  sidebarToggleBtn.addEventListener("click", () => {
    const nowCollapsed = shell.classList.toggle("is-sidebar-collapsed");
    localStorage.setItem(SIDEBAR_COLLAPSE_KEY, nowCollapsed ? "1" : "0");
    sidebarToggleBtn.setAttribute("aria-label", nowCollapsed ? "Perluas sidebar" : "Ciutkan sidebar");
  });
  sidebarToggleBtn.setAttribute("aria-label", collapsed ? "Perluas sidebar" : "Ciutkan sidebar");

  updateAccountInfo(user);

  return outlet;
}

window.NusantaraChess.initSiteNav = initSiteNav;
window.NusantaraChess.updateAccountInfo = updateAccountInfo;

const DEFAULT_AVATAR_SVG = '<svg class="avatar-default-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><circle cx="12" cy="8" r="4.2"/><path d="M3.8 21.2c0-4.5 3.7-8.1 8.2-8.1s8.2 3.6 8.2 8.1z"/></svg>';

function renderProfileAvatar(el: any, photo: any) {
  if (!el) return;
  if (photo) {
    let img = el.querySelector("img.profile-avatar-img");
    if (!img) {
      el.textContent = "";
      img = document.createElement("img");
      img.className = "profile-avatar-img";
      img.alt = "";
      el.appendChild(img);
    }
    img.onerror = function () { renderProfileAvatar(el, null); };
    if (img.getAttribute("src") !== photo) img.setAttribute("src", photo);
  } else if (!el.querySelector("svg.avatar-default-icon")) {
    el.innerHTML = DEFAULT_AVATAR_SVG;
  }
}

function bindProfileAvatar(el: any) {
  if (!el || el.__profileAvatarBound) return;
  el.__profileAvatarBound = true;
  const paint = function () {
    const u = window.NusantaraChess.currentUser;
    renderProfileAvatar(el, u && u.profilePhoto ? u.profilePhoto : null);
  };
  const onUpdate = function () {
    if (!el.isConnected) { window.removeEventListener("nusantara:user-updated", onUpdate); return; }
    paint();
  };
  window.addEventListener("nusantara:user-updated", onUpdate);
  paint();
}

window.NusantaraChess.DEFAULT_AVATAR_SVG = DEFAULT_AVATAR_SVG;
window.NusantaraChess.renderProfileAvatar = renderProfileAvatar;
window.NusantaraChess.navIconSvg = function (href: string) {
  const item = MENU_ITEMS.find((m: any) => m.href === href);
  return item ? iconSvg(item.icon) : "";
};
window.NusantaraChess.bindProfileAvatar = bindProfileAvatar;

window.addEventListener("nusantara:user-updated", function (e: any) {
  try { if (document.querySelector(".site-shell")) updateAccountInfo(e.detail.user); } catch (err) {}
});

})();
