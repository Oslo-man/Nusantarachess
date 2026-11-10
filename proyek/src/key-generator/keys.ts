import { ALPHABET, CHECK_LEN, MIN_SECRET_LEN, SELF_TEST_SECRET, SPECS, TYPE_ORDER } from "./spec";
import type { KeyType } from "./spec";
import { hmacSha256, sha256, toHex } from "./sha256";

const enc = new TextEncoder();

// null = rahasia belum valid (kosong / < MIN_SECRET_LEN): kunci TIDAK boleh dibuat.
export function effectiveSecret(entered: unknown): string | null {
  return typeof entered === "string" && entered.length >= MIN_SECRET_LEN ? entered : null;
}

export function computeCheck(type: KeyType, payload: string, secret: string): string {
  const mac = hmacSha256(enc.encode(secret), enc.encode(type + ":" + payload));
  let out = "";
  for (let i = 0; i < CHECK_LEN; i++) out += ALPHABET[mac[i] & 31];
  return out;
}

function splitGroups(str: string, sizes: number[]): string[] {
  const out: string[] = [];
  let pos = 0;
  for (const size of sizes) {
    out.push(str.slice(pos, pos + size));
    pos += size;
  }
  return out;
}

function randomPayload(n: number): string {
  if (!(window.crypto && crypto.getRandomValues)) {
    throw new Error("Peramban ini tidak punya crypto.getRandomValues, jadi kunci tidak bisa dibuat dengan aman.");
  }
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  let s = "";
  for (let i = 0; i < n; i++) s += ALPHABET[bytes[i] & 31];
  return s;
}

export function buildKey(type: KeyType, payload: string, secret: string): string {
  const s = SPECS[type];
  const check = computeCheck(type, payload, secret);
  return [s.prefix].concat(splitGroups(payload, s.payload), splitGroups(check, s.check)).join("-");
}

export function generateKey(type: KeyType, secret: string): string {
  if (typeof secret !== "string" || secret.length < MIN_SECRET_LEN) {
    throw new Error("Rahasia penandatangan minimal " + MIN_SECRET_LEN + " karakter.");
  }
  return buildKey(type, randomPayload(SPECS[type].payloadLen), secret);
}

export interface VerifiedKey {
  type: KeyType;
  normalized: string;
}

export function verifyLikeServer(input: unknown, secret: string): VerifiedKey | null {
  if (typeof input !== "string" || input.length === 0 || input.length > 100) return null;
  const k = input.trim().toUpperCase();
  for (const type of TYPE_ORDER) {
    const spec = SPECS[type];
    if (!spec.re.test(k)) continue;
    const parts = k.split("-");
    const n = spec.payload.length;
    const payload = parts.slice(1, 1 + n).join("");
    const check = parts.slice(1 + n).join("");
    return computeCheck(type, payload, secret) === check ? { type, normalized: k } : null;
  }
  return null;
}

const VECTORS: Record<KeyType, { payload: string; check: string }> = {
  master: { payload: "GPW5CKSZ8FNV4BJ", check: "KWMUAGEG" },
  grandmaster: { payload: "MU3AHQX6DLT29GPW", check: "S9XN92DW" },
  supergm: { payload: "HQX6DLT29GPW5CKS", check: "77TYE8YA" },
  admin: { payload: "FNV4BJRY7EMU3AHQX6", check: "YN8SMP5R" }
};

export function runSelfTest(): string[] {
  const problems: string[] = [];
  const abc = toHex(sha256(enc.encode("abc")));
  if (abc !== "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad") problems.push("SHA-256");
  const key = new Uint8Array(20);
  key.fill(0x0b);
  const mac = toHex(hmacSha256(key, enc.encode("Hi There")));
  if (mac !== "b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7") problems.push("HMAC-SHA256");
  for (const t of TYPE_ORDER) {
    if (computeCheck(t, VECTORS[t].payload, SELF_TEST_SECRET) !== VECTORS[t].check) problems.push("kode cek " + t);
    const full = buildKey(t, VECTORS[t].payload, SELF_TEST_SECRET);
    const v = verifyLikeServer(full, SELF_TEST_SECRET);
    if (!v || v.type !== t) problems.push("pola " + t);
  }
  return problems;
}
