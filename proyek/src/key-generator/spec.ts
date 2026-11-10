export type KeyType = "master" | "grandmaster" | "supergm" | "admin";

export interface KeySpec {
  prefix: string;
  payload: number[];
  check: number[];
  label: string;
  note: string;
  re: RegExp;
  payloadLen: number;
}

export const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const CHECK_LEN = 8;
// HANYA untuk self-test (vektor kode cek). TIDAK PERNAH dipakai membuat kunci sungguhan.
export const SELF_TEST_SECRET = "df921e471e143e42286403e9897eeb97acb671447aac6a271f226d14e5dec949";
export const MIN_SECRET_LEN = 16;

export const TYPE_ORDER: KeyType[] = ["master", "grandmaster", "supergm", "admin"];

type RawSpec = Omit<KeySpec, "re" | "payloadLen">;

const RAW: Record<KeyType, RawSpec> = {
  master: { prefix: "MST", payload: [5, 5, 5], check: [8], label: "Master", note: "Level awal Elo 2700" },
  grandmaster: { prefix: "GMR", payload: [4, 4, 4, 4], check: [4, 4], label: "Grandmaster", note: "Level awal Elo 3000" },
  supergm: { prefix: "SGM", payload: [8, 8], check: [8], label: "Super Grandmaster", note: "Level awal Elo 3100" },
  admin: { prefix: "ADM", payload: [6, 6, 6], check: [4, 4], label: "Admin Settings", note: "Kolom Masukkan Kode di Play" }
};

function group(n: number): string {
  return "[" + ALPHABET + "]{" + n + "}";
}

function buildSpec(raw: RawSpec): KeySpec {
  return {
    ...raw,
    re: new RegExp("^" + raw.prefix + "-" + raw.payload.map(group).join("-") + "-" + raw.check.map(group).join("-") + "$"),
    payloadLen: raw.payload.reduce((a, b) => a + b, 0)
  };
}

export const SPECS = Object.fromEntries(TYPE_ORDER.map((t) => [t, buildSpec(RAW[t])])) as Record<KeyType, KeySpec>;
