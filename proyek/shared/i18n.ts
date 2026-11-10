(function () {
"use strict";

var NC = window.NusantaraChess = window.NusantaraChess || {};
var DICT = NC.i18nDict;
if (!DICT || !NC.language) return;

var ATTRS = ["placeholder", "title", "aria-label", "alt"];
var SKIP_TAGS: any = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, CODE: 0 };
var EXACT = DICT.exact;
var PATTERNS = DICT.patterns.map(function (p: any) { return { re: new RegExp(p[0]), to: p[1] }; });
var MONTHS: any = {
  januari: "January", februari: "February", maret: "March", mei: "May", juni: "June", juli: "July",
  agustus: "August", oktober: "October", desember: "December",
  agu: "Aug", agt: "Aug", okt: "Oct", des: "Dec"
};
var MONTH_RE = /(\d{1,2}\s)?\b(Januari|Februari|Maret|Mei|Juni|Juli|Agustus|Oktober|Desember|Agu|Agt|Okt|Des)\b(\s\d{4})?/g;

var enabled = false;
var cache = Object.create(null);
var textOrig = new WeakMap();
var attrOrig = new WeakMap();
var observer: any = null;

function hasLetters(s: any) { return /[A-Za-z\u00C0-\u00FF]{2}/.test(s); }

function fixMonths(s: any) {
  return s.replace(MONTH_RE, function (m: any, d: any, mon: any, y: any) {
    if (!d && !y) return m;
    return (d || "") + MONTHS[mon.toLowerCase()] + (y || "");
  });
}

function lookup(n: any, depth: any) {
  if (Object.prototype.hasOwnProperty.call(EXACT, n)) return EXACT[n];
  for (var i = 0; i < PATTERNS.length; i++) {
    var m = PATTERNS[i].re.exec(n);
    if (!m) continue;
    return PATTERNS[i].to
      .replace(/\$T(\d)/g, function (x: any, g: any) { return m[g] ? translateCore(m[g], depth + 1) : ""; })
      .replace(/\$(\d)/g, function (x: any, g: any) { return m[g] || ""; });
  }
  return null;
}

function translateCore(core: any, depth: any) {
  var n = core.replace(/\s+/g, " ");
  if (!hasLetters(n)) return core;
  if (depth > 4) return core;
  var hit = depth === 0 ? cache[n] : undefined;
  if (hit !== undefined) return hit;
  var res = lookup(n, depth);
  if (res === null) res = n;
  var fixed = fixMonths(res);
  if (depth === 0) cache[n] = fixed;
  return fixed;
}

function t(raw: any) {
  if (typeof raw !== "string" || !raw) return raw;
  var core = raw.trim();
  if (!core) return raw;
  var out = translateCore(core, 0);
  if (out === core.replace(/\s+/g, " ")) return raw;
  return raw.slice(0, raw.length - raw.replace(/^\s+/, "").length) + out +
         raw.slice(raw.replace(/\s+$/, "").length);
}

function skipNode(node: any) {
  for (var p = node.parentNode; p && p.nodeType === 1; p = p.parentNode) {
    if (SKIP_TAGS[p.tagName] === 1) return true;
    if (p.hasAttribute && p.hasAttribute("data-no-i18n")) return true;
  }
  return false;
}

function doText(node: any) {
  var rec = textOrig.get(node);
  var cur = node.data;
  if (rec && cur === rec.out) return;
  if (skipNode(node)) return;
  var out = t(cur);
  if (out !== cur) { textOrig.set(node, { orig: cur, out: out }); node.data = out; }
  else if (rec) textOrig.delete(node);
}

function attrApplies(el: any, attr: any) {
  if (attr === "value") {
    var ty = el.tagName === "INPUT" && (el.getAttribute("type") || "").toLowerCase();
    return ty === "button" || ty === "submit" || ty === "reset";
  }
  if (attr === "content") return el.tagName === "META";
  return true;
}

function doAttr(el: any, attr: any) {
  if (!el.hasAttribute(attr) || !attrApplies(el, attr)) return;
  var map = attrOrig.get(el) || {};
  var cur = el.getAttribute(attr);
  if (map[attr] && cur === map[attr].out) return;
  var out = t(cur);
  if (out !== cur) {
    map[attr] = { orig: cur, out: out };
    attrOrig.set(el, map);
    el.setAttribute(attr, out);
  } else if (map[attr]) { delete map[attr]; }
}

var ALL_ATTRS = ATTRS.concat(["value", "content"]);
var ATTR_SELECTOR = "[placeholder],[title],[aria-label],[alt],input[type=button],input[type=submit],input[type=reset],meta[content]";

function apply(root: any) {
  if (!root) return;
  if (root.nodeType === 3) { doText(root); return; }
  if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
  var base = root.nodeType === 9 ? root.documentElement : root;
  if (!base) return;
  if (base.nodeType === 1) {
    for (var a = 0; a < ALL_ATTRS.length; a++) doAttr(base, ALL_ATTRS[a]);
  }
  var walker = document.createTreeWalker(base, NodeFilter.SHOW_TEXT, null);
  var n: any;
  while ((n = walker.nextNode())) doText(n);
  var els = base.querySelectorAll ? base.querySelectorAll(ATTR_SELECTOR) : [];
  for (var i = 0; i < els.length; i++) {
    for (var j = 0; j < ALL_ATTRS.length; j++) doAttr(els[i], ALL_ATTRS[j]);
  }
}

function restore(root: any) {
  var base = root || document.documentElement;
  var walker = document.createTreeWalker(base, NodeFilter.SHOW_TEXT, null);
  var n: any;
  while ((n = walker.nextNode())) {
    var rec = textOrig.get(n);
    if (rec) { if (n.data === rec.out) n.data = rec.orig; textOrig.delete(n); }
  }
  var els = base.querySelectorAll ? base.querySelectorAll("*") : [];
  for (var i = 0; i < els.length; i++) {
    var map = attrOrig.get(els[i]);
    if (!map) continue;
    for (var k in map) {
      if (els[i].getAttribute(k) === map[k].out) els[i].setAttribute(k, map[k].orig);
    }
    attrOrig.delete(els[i]);
  }
}

function onMutations(records: any) {
  for (var r = 0; r < records.length; r++) {
    var rec = records[r];
    if (rec.type === "childList") {
      for (var i = 0; i < rec.addedNodes.length; i++) apply(rec.addedNodes[i]);
    } else if (rec.type === "characterData") {
      doText(rec.target);
    } else if (rec.type === "attributes") {
      doAttr(rec.target, rec.attributeName);
    }
  }
}

function start() {
  if (observer) return;
  observer = new MutationObserver(onMutations);
  observer.observe(document.documentElement, {
    childList: true, subtree: true, characterData: true,
    attributes: true, attributeFilter: ALL_ATTRS
  });
}

function stop() {
  if (observer) { observer.disconnect(); observer = null; }
}

function setLang(code: any) {
  var on = code === "en";
  if (on === enabled) { if (on) apply(document); return; }
  enabled = on;
  if (on) { apply(document); start(); }
  else { stop(); restore(document.documentElement); }
}

["alert", "confirm", "prompt"].forEach(function (name) {
  var orig = (window as any)[name];
  if (typeof orig !== "function") return;
  (window as any)[name] = function () {
    var args = Array.prototype.slice.call(arguments);
    if (enabled && typeof args[0] === "string") args[0] = t(args[0]);
    return orig.apply(window, args);
  };
});

NC.i18n = {
  t: function (s: any) { return enabled ? t(s) : s; },
  isEnglish: function () { return enabled; },
  refresh: function () { if (enabled) apply(document); }
};

window.addEventListener("nusantara:language-changed", function (e: any) {
  setLang(e && e.detail ? e.detail.lang : NC.language.get());
});

function init() { setLang(NC.language.get()); }
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();

})();
