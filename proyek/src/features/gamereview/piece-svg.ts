(function () {
"use strict";

const BC_PIECE_BASE = "/images/bc/pieces/";
const PIECE_SVG: Record<string, string> = {};
["w", "b"].forEach((c) => {
  ["K", "Q", "R", "B", "N", "P"].forEach((t) => {
    PIECE_SVG[c + t] = '<img class="piece-img" src="' + BC_PIECE_BASE + c + t + '.svg" alt="" draggable="false" decoding="async">';
  });
});

const _preloaded: HTMLImageElement[] = [];
Object.keys(PIECE_SVG).forEach((k) => {
  try { const img = new Image(); img.decoding = "async"; img.src = BC_PIECE_BASE + k + ".svg"; _preloaded.push(img); } catch (e) { }
});

window.NusantaraChess = window.NusantaraChess || {};
window.NusantaraChess.gameReviewPieceSvg = PIECE_SVG;

})();
