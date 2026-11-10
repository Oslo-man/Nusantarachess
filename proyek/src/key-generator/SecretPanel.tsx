import { useState } from "react";
import { MIN_SECRET_LEN } from "./spec";

interface SecretPanelProps {
  secret: string;
  onSecretChange: (value: string) => void;
  selfTestProblems: string[];
}

function secretStatus(entered: string): { text: string; cls: "ok" | "warn" } {
  let text: string;
  let cls: "ok" | "warn";
  if (entered.length === 0) {
    text = "Wajib diisi sebelum membuat kunci. Pakai nilai yang sama persis dengan ONE_TIME_KEY_SECRET di server.";
    cls = "warn";
  } else if (entered.length < MIN_SECRET_LEN) {
    text =
      "Kurang dari " +
      MIN_SECRET_LEN +
      " karakter: server menolak semua kunci bila ONE_TIME_KEY_SECRET sependek ini, jadi kunci tidak akan dibuat.";
    cls = "warn";
  } else {
    text = "Memakai rahasia kustom (" + entered.length + " karakter). Pastikan sama persis dengan ONE_TIME_KEY_SECRET di server.";
    cls = "ok";
  }
  if (entered.length > 0 && entered !== entered.trim()) {
    text += " Ada spasi di awal atau akhir: server memakainya apa adanya.";
    cls = "warn";
  }
  return { text, cls };
}

export function SecretPanel({ secret, onSecretChange, selfTestProblems }: SecretPanelProps) {
  const [shown, setShown] = useState(false);
  const status = secretStatus(secret);
  const broken = selfTestProblems.length > 0;
  return (
    <details id="secret-box" open>
      <summary>
        <span>Rahasia penandatangan</span>
        <span className="compat" id="compat-badge" style={{ color: broken ? "var(--error)" : "var(--success)" }}>
          {broken ? "Tidak kompatibel" : "Kompatibel"}
        </span>
      </summary>
      <div className="details-body">
        <p className="fine">
          Harus sama persis dengan <b>ONE_TIME_KEY_SECRET</b> di server (minimal 16 karakter). Bila env itu kosong atau terlalu
          pendek, server menolak semua kunci.
        </p>
        <div className="field">
          <label htmlFor="secret">ONE_TIME_KEY_SECRET</label>
          <div className="field-row">
            <input
              type={shown ? "text" : "password"}
              id="secret"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              value={secret}
              onChange={(e) => onSecretChange(e.target.value)}
            />
            <button type="button" className="btn btn-small" id="toggle-secret" aria-pressed={shown} onClick={() => setShown(!shown)}>
              {shown ? "Sembunyikan" : "Tampilkan"}
            </button>
          </div>
        </div>
        <p className={"msg " + status.cls} id="secret-msg">
          {status.text}
        </p>
        <p className="compat" id="compat-detail" style={broken ? { color: "var(--error)" } : undefined}>
          {broken
            ? "Uji bawaan gagal (" +
              selfTestProblems.join(", ") +
              "). Kunci dari halaman ini tidak akan diterima server, jadi pembuatan dinonaktifkan."
            : "Uji bawaan lolos: SHA-256, HMAC-SHA256 (RFC 4231), dan 4 vektor kode cek yang dihitung oleh one-time-keys.js. Rahasia yang Anda isi tidak bisa diuji dari sini karena hanya server yang tahu nilainya."}
        </p>
        <p className="fine">Rahasia tidak disimpan dan tidak dikirim ke mana pun; hanya dipakai di peramban ini.</p>
      </div>
    </details>
  );
}
