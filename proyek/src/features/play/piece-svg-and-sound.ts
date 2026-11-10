(function () {
"use strict";

const PIECE_SVG = window.NusantaraChess.buildPieceSet("lower");

const SOUND_FILES: Record<string, any> = {
  moveSelf: "sounds/move-self.mp3",
  capture: "sounds/capture.mp3",
  check: "sounds/move-check.mp3",
  promote: "sounds/promote.mp3",
  castle: "sounds/castle.mp3"
};

const _soundCache: Record<string, any> = {};
function preloadSounds() {
  Object.keys(SOUND_FILES).forEach(key => {
    try {
      const audio = new Audio(SOUND_FILES[key]);
      audio.preload = "auto";
      _soundCache[key] = audio;
    } catch (e) {
    }
  });
}

function playSound(key: any) {
  try {
    const cached = _soundCache[key];
    const audio = cached ? cached.cloneNode() : new Audio(SOUND_FILES[key]);
    audio.play().catch(() => { });
  } catch (e) {
  }
}

function pickMoveSound(move: any, wasCapture: any, causesCheck: any) {
  if (move.castle === "K" || move.castle === "Q") return "castle";
  if (move.promotion) return "promote";
  if (causesCheck) return "check";
  if (wasCapture || move.enPassant) return "capture";
  return "moveSelf";
}

window.NusantaraChess = window.NusantaraChess || {};
window.NusantaraChess.PIECE_SVG = PIECE_SVG;
window.NusantaraChess.preloadSounds = preloadSounds;
window.NusantaraChess.playSound = playSound;
window.NusantaraChess.pickMoveSound = pickMoveSound;

})();
