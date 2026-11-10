(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.NusantaraChess = root.NusantaraChess || {};
    var exported: any = factory();
    for (var k in exported) { root.NusantaraChess[k] = exported[k]; }
  }
}(typeof self !== "undefined" ? self : this, function () {
"use strict";

var COUNTRIES = [
  { code: "ID", name: "Indonesia" },
  { code: "IN", name: "India" },
  { code: "PH", name: "Philippines" },
  { code: "US", name: "United States" },
  { code: "RU", name: "Russia" },
  { code: "CN", name: "China" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "UA", name: "Ukraine" },
  { code: "PL", name: "Poland" },
  { code: "NL", name: "Netherlands" },
  { code: "BR", name: "Brazil" },
  { code: "AR", name: "Argentina" },
  { code: "IT", name: "Italy" },
  { code: "HU", name: "Hungary" },
  { code: "CZ", name: "Czech Republic" },
  { code: "TR", name: "Turkey" },
  { code: "IR", name: "Iran" },
  { code: "VN", name: "Vietnam" },
  { code: "AM", name: "Armenia" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "NO", name: "Norway" },
  { code: "GB", name: "United Kingdom" },
  { code: "EG", name: "Egypt" }
];

var DEFAULT_COUNTRY_CODE = "ID";

function getCountryByCode(code: any) {
  if (typeof code !== "string") return null;
  var upper = code.toUpperCase();
  for (var i = 0; i < COUNTRIES.length; i++) {
    if (COUNTRIES[i].code === upper) return COUNTRIES[i];
  }
  return null;
}

function isValidCountryCode(code: any) {
  return typeof code === "string" && code === code.toUpperCase() && getCountryByCode(code) !== null;
}

function flagEmojiForCountry(code: any) {
  var c = getCountryByCode(code);
  if (!c) return "";
  var A = 0x1F1E6;
  return String.fromCodePoint(A + c.code.charCodeAt(0) - 65, A + c.code.charCodeAt(1) - 65);
}

function countryDisplayName(code: any, lang: any) {
  var c = getCountryByCode(code);
  if (!c) return "";
  try {
    if (typeof Intl !== "undefined" && typeof Intl.DisplayNames === "function") {
      var dn = new Intl.DisplayNames([lang || "en"], { type: "region" });
      var label = dn.of(c.code);
      if (label && label !== c.code) return label;
    }
  } catch (e) { }
  return c.name;
}

return {
  COUNTRIES: COUNTRIES,
  DEFAULT_COUNTRY_CODE: DEFAULT_COUNTRY_CODE,
  getCountryByCode: getCountryByCode,
  isValidCountryCode: isValidCountryCode,
  flagEmojiForCountry: flagEmojiForCountry,
  countryDisplayName: countryDisplayName
};

}));
