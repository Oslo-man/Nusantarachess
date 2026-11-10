(function () {
"use strict";

window.NusantaraChess = window.NusantaraChess || {};

var STORAGE_KEY = "nusantara_lang";
var DEFAULT_LANG = "id";
var SUPPORTED = [
  { code: "id", label: "Indonesia" },
  { code: "en", label: "English" }
];

function isSupported(code: any) {
  for (var i = 0; i < SUPPORTED.length; i++) {
    if (SUPPORTED[i].code === code) return true;
  }
  return false;
}

function get() {
  var stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { }
  return isSupported(stored) ? stored : DEFAULT_LANG;
}

function applyToDocument(code: any) {
  try { document.documentElement.lang = code; } catch (e) { }
}

function announce(code: any) {
  try {
    window.dispatchEvent(new CustomEvent("nusantara:language-changed", { detail: { lang: code } }));
  } catch (e) { }
}

function set(code: any) {
  if (!isSupported(code)) return get();
  try { localStorage.setItem(STORAGE_KEY, code); } catch (e) { }
  applyToDocument(code);
  announce(code);
  return code;
}

function bindSelect(selectEl: any) {
  if (!selectEl) return;
  selectEl.innerHTML = SUPPORTED.map(function (l) {
    return '<option value="' + l.code + '">' + l.label + '</option>';
  }).join("");
  selectEl.value = get();
  selectEl.addEventListener("change", function () { set(selectEl.value); });
  window.addEventListener("nusantara:language-changed", function (e: any) {
    if (e && e.detail && selectEl.value !== e.detail.lang) selectEl.value = e.detail.lang;
  });
}

function bindMenu(pickerEl: any) {
  if (!pickerEl) return;
  var btn = pickerEl.querySelector("[data-lang-btn]");
  var menu = pickerEl.querySelector("[data-lang-menu]");
  if (!btn || !menu) return;
  if (pickerEl.getAttribute("data-lang-bound") === "1") return;
  pickerEl.setAttribute("data-lang-bound", "1");

  menu.innerHTML = SUPPORTED.map(function (l) {
    return '<button type="button" class="lang-menu-item" role="menuitemradio" data-lang="' + l.code + '">' +
             '<span class="lang-menu-check" aria-hidden="true"><span class="ui-ico ui-ico-check"></span></span>' +
             '<span class="lang-menu-label">' + l.label + '</span>' +
           '</button>';
  }).join("");

  function refreshChecked() {
    var cur = get();
    var items = menu.querySelectorAll(".lang-menu-item");
    for (var i = 0; i < items.length; i++) {
      var on = items[i].getAttribute("data-lang") === cur;
      items[i].setAttribute("aria-checked", on ? "true" : "false");
      items[i].classList.toggle("is-active", on);
    }
  }
  function isOpen() { return !menu.hasAttribute("hidden"); }
  function open() {
    refreshChecked();
    menu.removeAttribute("hidden");
    btn.setAttribute("aria-expanded", "true");
  }
  function close() {
    menu.setAttribute("hidden", "");
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", function (e: any) {
    e.stopPropagation();
    if (isOpen()) close(); else open();
  });
  menu.addEventListener("click", function (e: any) {
    var item = e.target.closest ? e.target.closest(".lang-menu-item") : null;
    if (!item) return;
    set(item.getAttribute("data-lang"));
    refreshChecked();
    close();
    btn.focus();
  });

  function alive() { return document.body.contains(pickerEl); }
  document.addEventListener("click", function (e) {
    if (alive() && isOpen() && !pickerEl.contains(e.target)) close();
  });
  document.addEventListener("keydown", function (e) {
    if (alive() && isOpen() && e.key === "Escape") { close(); btn.focus(); }
  });
  window.addEventListener("nusantara:language-changed", function () {
    if (alive()) refreshChecked();
  });
  refreshChecked();
}

window.NusantaraChess.language = {
  SUPPORTED: SUPPORTED,
  get: get,
  set: set,
  bindSelect: bindSelect,
  bindMenu: bindMenu
};

window.addEventListener("storage", function (e) {
  if (e.key !== STORAGE_KEY) return;
  var code = get();
  applyToDocument(code);
  announce(code);
});

applyToDocument(get());

})();
