"use strict";

// Peta Elo dasar level awal -> jenis kunci sekali pakai yang dibutuhkan
// (lihat KEY_SPECS di one-time-keys.ts). Level di luar peta ini bebas kunci.
const PROTECTED_TIERS: Record<string, any> = {
  2700: "master",
  3000: "grandmaster",
  3100: "supergm"
};

function protectedTierKeyForBase(base: any) {
  return PROTECTED_TIERS[base] || null;
}

module.exports = { protectedTierKeyForBase, PROTECTED_TIERS };
