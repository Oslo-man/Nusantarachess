(function () {
"use strict";

let audioCtx: any = null, noiseBuf: any = null;
function getNoise() {
  if (noiseBuf) return noiseBuf;
  const len = Math.floor(audioCtx.sampleRate * 0.2);
  noiseBuf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return noiseBuf;
}
function tap({ t = 0, vol = 0.5, base = 420, partials = [1, 2.0, 3.1], decay = 0.085, attackFilt = 2200, attackVol = 0.5 } = {}) {
  const now = audioCtx.currentTime + t;
  const src = audioCtx.createBufferSource(); src.buffer = getNoise();
  const bp = audioCtx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = attackFilt; bp.Q.value = 1.2;
  const ng = audioCtx.createGain();
  ng.gain.setValueAtTime(vol * attackVol, now);
  ng.gain.exponentialRampToValueAtTime(0.0006, now + 0.018);
  src.connect(bp); bp.connect(ng); ng.connect(audioCtx.destination);
  src.start(now); src.stop(now + 0.03);
  partials.forEach((mult, i) => {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = "sine"; o.frequency.value = base * mult;
    const amp = vol * (i === 0 ? 0.9 : 0.45 / i);
    const d = decay * (i === 0 ? 1 : 0.7 / Math.sqrt(i + 1));
    g.gain.setValueAtTime(amp, now);
    g.gain.exponentialRampToValueAtTime(0.0006, now + d);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(now); o.stop(now + d + 0.02);
  });
}
function sfxSynth(type: any) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    switch (type) {
      case "capture": tap({ vol: 0.6, base: 300, partials: [1, 2.1, 3.0, 4.2], decay: 0.12, attackFilt: 1700, attackVol: 0.7 }); break;
      case "castle":  tap({ vol: 0.5, base: 420, decay: 0.08 }); tap({ t: 0.085, vol: 0.45, base: 400, decay: 0.08 }); break;
      case "check":   tap({ vol: 0.5, base: 440, decay: 0.09 }); tap({ t: 0.0, vol: 0.2, base: 1200, partials: [1, 2.4], decay: 0.05, attackVol: 0.2 }); break;
      case "promote": tap({ vol: 0.5, base: 430, decay: 0.09 }); tap({ t: 0.06, vol: 0.3, base: 880, partials: [1, 2.5], decay: 0.07, attackVol: 0.2 }); break;
      case "end":     tap({ vol: 0.5, base: 240, partials: [1, 2.0, 3.0], decay: 0.16, attackFilt: 1400 }); tap({ t: 0.13, vol: 0.45, base: 200, decay: 0.18 }); break;
      default:        tap({ vol: 0.5, base: 430, partials: [1, 2.0, 3.1], decay: 0.075, attackFilt: 2200 });
    }
  } catch (e) {}
}

const SOUND_MAP = {
  move: "sounds/move-self.mp3",
  capture: "sounds/capture.mp3",
  castle: "sounds/castle.mp3",
  check: "sounds/move-check.mp3",
  promote: "sounds/promote.mp3",
  end: "sounds/move-check.mp3"
};
const soundBank: Record<string, any> = {};
function initSounds() {
  for (const [type, src] of Object.entries(SOUND_MAP)) {
    const bank: Record<string, any> = { pool: [], idx: 0, ok: false };
    soundBank[type] = bank;
    try {
      for (let i = 0; i < 3; i++) { const a = new Audio(src); a.preload = "auto"; bank.pool.push(a); }
      bank.pool[0].addEventListener("canplaythrough", () => { bank.ok = true; }, { once: true });
      bank.pool[0].addEventListener("loadeddata", () => { bank.ok = true; }, { once: true });
      bank.pool[0].addEventListener("error", () => { bank.ok = false; }, { once: true });
    } catch (e) {}
  }
}
function sfx(type: any) {
  const bank = soundBank[type] || (soundBank as any).move;
  if (!bank || !bank.ok) { sfxSynth(type); return; }
  try {
    const a = bank.pool[bank.idx++ % bank.pool.length];
    a.pause(); a.currentTime = 0; a.volume = 1.0;
    a.playbackRate = 1;
    const p = a.play(); if (p && p.catch) p.catch(() => {});
  } catch (e) { sfxSynth(type); }
}
function sfxFor(mv: any) {
  if (!mv) { sfx("move"); return; }
  if (mv.san && mv.san.includes("#")) { sfx("end"); return; }
  if (mv.san && mv.san.includes("+")) { sfx("check"); return; }
  if (mv.flags && (mv.flags.includes("k") || mv.flags.includes("q"))) { sfx("castle"); return; }
  if (mv.flags && mv.flags.includes("p")) { sfx("promote"); return; }
  sfx(mv.captured ? "capture" : "move");
}

window.NusantaraChess = window.NusantaraChess || {};
window.NusantaraChess.gameReviewSound = { initSounds, sfx, sfxFor, sfxSynth };

})();
