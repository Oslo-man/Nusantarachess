(function () {
"use strict";

const PIECE_CDN_BASE = "/images/bc/pieces/";
const COLORS = ["w", "b"];
const TYPES = ["K", "Q", "R", "B", "N", "P"];

function pieceUrl(color: string, type: string): string {
  return PIECE_CDN_BASE + color + type.toUpperCase() + ".svg";
}

function pieceImgHtml(color: string, type: string): string {
  return '<img class="piece-img" src="' + pieceUrl(color, type) + '" alt="" draggable="false" decoding="async">';
}

function buildPieceSet(keyCase: "lower" | "upper"): Record<string, string> {
  const set: Record<string, string> = {};
  COLORS.forEach((c) => {
    TYPES.forEach((t) => {
      const key = c + (keyCase === "lower" ? t.toLowerCase() : t);
      set[key] = pieceImgHtml(c, t);
    });
  });
  return set;
}

const _preloaded: HTMLImageElement[] = [];
function preloadPieceSet(): void {
  if (_preloaded.length) return;
  COLORS.forEach((c) => {
    TYPES.forEach((t) => {
      try {
        const img = new Image();
        img.decoding = "async";
        img.src = pieceUrl(c, t);
        _preloaded.push(img);
      } catch (e) { }
    });
  });
}

const w: any = window;
w.NusantaraChess = w.NusantaraChess || {};
w.NusantaraChess.PIECE_CDN_BASE = PIECE_CDN_BASE;
w.NusantaraChess.pieceUrl = pieceUrl;
w.NusantaraChess.buildPieceSet = buildPieceSet;
w.NusantaraChess.preloadPieceSet = preloadPieceSet;

preloadPieceSet();

})();
