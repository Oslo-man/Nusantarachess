(function () {
"use strict";

window.NusantaraChess = window.NusantaraChess || {};

const GH_CATEGORY_LABEL: Record<string, string> = { bullet: "Bullet", blitz: "Blitz", rapid: "Rapid", puzzle: "Puzzle", bot: "Bot" };
const GH_RESULT_LABEL: Record<string, string> = { win: "Menang", loss: "Kalah", draw: "Remi" };
const GH_RESULT_MARK: Record<string, string> = {
  win: '<span class="ui-ico ui-ico-plus" aria-hidden="true"></span>',
  loss: '<span class="ui-ico ui-ico-minus" aria-hidden="true"></span>',
  draw: '<span class="ui-ico ui-ico-equal" aria-hidden="true"></span>'
};
const GH_AVATAR_SVG = '<svg class="avatar-default-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><circle cx="12" cy="8" r="4.2"/><path d="M3.8 21.2c0-4.5 3.7-8.1 8.2-8.1s8.2 3.6 8.2 8.1z"/></svg>';
const GH_REVIEW_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#fff" fill-rule="evenodd" d="M12 1.6a10.4 10.4 0 1 1 0 20.8a10.4 10.4 0 1 1 0-20.8ZM12.00 5.90 L13.70 10.15 L18.28 10.46 L14.76 13.40 L15.88 17.84 L12.00 15.40 L8.12 17.84 L9.24 13.40 L5.72 10.46 L10.30 10.15Z"/></svg>';

function ghReviewHref(id: any, scan: boolean, pub?: boolean) {
  return "/gamereview?" + (pub ? "publicGameId=" : "savedGameId=") + encodeURIComponent(id) + (scan ? "&scan=1" : "");
}

function ghEscape(str: any) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function ghModeIcon(category: string) {
  if (category === "bot") {
    const nav = window.NusantaraChess.navIconSvg;
    return '<span class="gh-mode gh-mode-bot" title="Bot">' + (nav ? nav("/bot") : "") + '</span>';
  }
  const known = category === "bullet" || category === "blitz" || category === "rapid";
  const label = GH_CATEGORY_LABEL[category] || category;
  return '<span class="gh-mode" title="' + ghEscape(label) + '">' +
    (known ? '<img src="/images/' + category + '.svg" alt="" width="22" height="22" draggable="false" />' : '') + '</span>';
}

function gameHistoryRowHtml(g: any, opts?: any) {
  opts = opts || {};
  const reviewable = opts.reviewable !== false && g.id != null;
  const result = g.result === "win" ? "win" : g.result === "loss" ? "loss" : "draw";
  const change = Number(g.eloChange) || 0;
  const changeClass = change > 0 ? "positive" : change < 0 ? "negative" : "neutral";
  const changeText = change > 0 ? "+" + change : String(change);
  const resultLabel = GH_RESULT_LABEL[result];
  return (
    '<div class="gh-row' + (reviewable ? " is-linked" : "") + '">' +
      (reviewable
        ? '<a class="gh-row-link" href="' + ghReviewHref(g.id, false, opts.publicReview) + '" data-route-link aria-label="Buka di Game Review: ' + ghEscape(g.opponentName) + '" title="Buka di Game Review"></a>'
        : '') +
      ghModeIcon(g.category) +
      '<span class="gh-avatar" aria-hidden="true">' + GH_AVATAR_SVG + '</span>' +
      '<span class="gh-main">' +
        '<span class="gh-name"><span class="gh-name-text">' + ghEscape(g.opponentName) + '</span>' +
          '<span class="gh-elo">(' + ghEscape(g.opponentElo) + ')</span>' +
          '<span class="gh-badge ' + changeClass + '" title="Perubahan Elo">' + changeText + '</span></span>' +
      '</span>' +
      '<span class="gh-result ' + result + '" role="img" aria-label="' + ghEscape(resultLabel) + '" title="' + ghEscape(resultLabel) + '"><span>' + GH_RESULT_MARK[result] + '</span></span>' +
      (reviewable
        ? '<a class="gh-action" href="' + ghReviewHref(g.id, true, opts.publicReview) + '" data-route-link aria-label="Ulasan Permainan (pindai otomatis)" title="Ulasan Permainan">' + GH_REVIEW_SVG + '</a>'
        : '') +
    '</div>'
  );
}

window.NusantaraChess.gameHistoryRowHtml = gameHistoryRowHtml;

})();
