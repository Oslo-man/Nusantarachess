import { useMemo, useState } from "react";
import { MIN_SECRET_LEN, SPECS } from "./spec";
import type { KeyType } from "./spec";
import { effectiveSecret, generateKey, runSelfTest, verifyLikeServer } from "./keys";
import { TypePicker } from "./TypePicker";
import { GenerateSection } from "./GenerateSection";
import { ResultsSection } from "./ResultsSection";
import { SecretPanel } from "./SecretPanel";

export interface GeneratedKey {
  id: number;
  type: KeyType;
  key: string;
}

type Message = { text: string; cls: "" | "ok" | "err" | "warn" };

let nextId = 1;

export function KeyGeneratorApp() {
  const [type, setType] = useState<KeyType>("master");
  const [qty, setQty] = useState("1");
  const [secret, setSecret] = useState("");
  const [items, setItems] = useState<GeneratedKey[]>([]);
  const [message, setMessage] = useState<Message>({
    text: "Isi \"Rahasia penandatangan\" di bagian bawah halaman dulu (minimal " + MIN_SECRET_LEN + " karakter, sama persis dengan ONE_TIME_KEY_SECRET di server).",
    cls: "warn"
  });
  const selfTestProblems = useMemo(() => runSelfTest(), []);

  const generate = (): void => {
    const eff = effectiveSecret(secret);
    if (eff === null) {
      setMessage({ text: "Rahasia penandatangan belum diisi atau kurang dari " + MIN_SECRET_LEN + " karakter, jadi kunci tidak dibuat.", cls: "err" });
      return;
    }
    let n = parseInt(qty, 10);
    if (!(n >= 1)) n = 1;
    if (n > 100) n = 100;
    setQty(String(n));
    const seen = new Set(items.map((it) => it.key));
    const made: GeneratedKey[] = [];
    try {
      while (made.length < n) {
        const key = generateKey(type, eff);
        if (seen.has(key)) continue;
        const v = verifyLikeServer(key, eff);
        if (!v || v.type !== type || v.normalized !== key) throw new Error("Kunci yang dibuat gagal pemeriksaan internal. Tidak ditampilkan.");
        seen.add(key);
        made.push({ id: nextId++, type, key });
      }
    } catch (e) {
      setMessage({ text: (e as Error).message, cls: "err" });
      return;
    }
    setItems(made.reverse().concat(items));
    setMessage({ text: n + " kunci " + SPECS[type].label + " dibuat.", cls: "ok" });
  };

  return (
    <main className="wrap">
      <header>
        <h1>Key Generator</h1>
        <p className="lead">
          Buat kunci sekali pakai untuk level awal Master, Grandmaster, Super Grandmaster, dan Admin Settings. Server menandai
          sebuah kunci sebagai terpakai saat kunci itu pertama kali berhasil dipakai; sesudahnya kunci yang sama ditolak.
        </p>
      </header>
      <TypePicker value={type} onChange={setType} />
      <GenerateSection qty={qty} onQtyChange={setQty} onGenerate={generate} disabled={selfTestProblems.length > 0} message={message} />
      <ResultsSection
        items={items}
        onClear={() => {
          setItems([]);
          setMessage({ text: "Daftar dibersihkan. Kunci yang sudah diberikan ke orang lain tetap berlaku di server.", cls: "" });
        }}
        onCopyFailed={() => setMessage({ text: "Tidak bisa menyalin otomatis. Tekan lama pada kunci untuk memilihnya.", cls: "err" })}
      />
      <SecretPanel secret={secret} onSecretChange={setSecret} selfTestProblems={selfTestProblems} />
    </main>
  );
}
