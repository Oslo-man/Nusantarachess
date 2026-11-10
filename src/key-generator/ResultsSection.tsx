import { copyText, downloadKeys } from "./clipboard";
import { KeyRow } from "./KeyRow";
import type { GeneratedKey } from "./KeyGeneratorApp";
import { useFlash } from "./useFlash";

interface ResultsSectionProps {
  items: GeneratedKey[];
  onClear: () => void;
  onCopyFailed: () => void;
}

export function ResultsSection({ items, onClear, onCopyFailed }: ResultsSectionProps) {
  const has = items.length > 0;
  const [copyAllLabel, flashCopyAll] = useFlash("Salin semua");
  const copyAll = (): void => {
    copyText(items.map((it) => it.key).join("\n")).then(
      () => flashCopyAll("Tersalin"),
      () => flashCopyAll("Gagal")
    );
  };
  return (
    <section aria-labelledby="h-results">
      <div className="results-head">
        <h2 id="h-results">Kunci yang dibuat</h2>
        <div className="actions">
          <button type="button" className="btn btn-small" id="copy-all" disabled={!has} onClick={copyAll}>
            {copyAllLabel}
          </button>
          <button
            type="button"
            className="btn btn-small"
            id="download"
            disabled={!has}
            onClick={() => downloadKeys(items.map((it) => it.key))}
          >
            Unduh .txt
          </button>
          <button type="button" className="btn btn-small" id="clear" disabled={!has} onClick={onClear}>
            Bersihkan
          </button>
        </div>
      </div>
      <p className="empty" id="empty" hidden={has}>
        Belum ada kunci. Pilih jenis akses, lalu tekan Buat kunci.
      </p>
      <ul className="list" id="list" hidden={!has}>
        {items.map((it) => (
          <KeyRow key={it.id} type={it.type} value={it.key} onCopyFailed={onCopyFailed} />
        ))}
      </ul>
      <p className="legend" id="legend" hidden={!has}>
        <span className="pre">Hijau</span> awalan jenis, putih bagian acak, <span className="chk">kuning</span> kode cek yang
        dibaca server. Kunci hanya ada di halaman ini; menutup atau memuat ulang halaman menghapus daftarnya.
      </p>
    </section>
  );
}
