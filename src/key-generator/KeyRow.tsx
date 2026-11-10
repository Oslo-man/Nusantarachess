import { Fragment } from "react";
import { SPECS, TYPE_ORDER } from "./spec";
import type { KeyType } from "./spec";
import { copyText } from "./clipboard";
import { useFlash } from "./useFlash";

interface KeyRowProps {
  type: KeyType;
  value: string;
  onCopyFailed: () => void;
}

function KeyParts({ value }: { value: string }) {
  const parts = value.split("-");
  const type = TYPE_ORDER.find((t) => SPECS[t].prefix === parts[0]) as KeyType;
  const n = SPECS[type].payload.length;
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="dash">-</span>}
          <span className={i === 0 ? "pre" : i <= n ? "pay" : "chk"}>{p}</span>
        </Fragment>
      ))}
    </>
  );
}

export function KeyRow({ type, value, onCopyFailed }: KeyRowProps) {
  const [label, flash] = useFlash("Salin");
  const copy = (): void => {
    copyText(value).then(
      () => flash("Tersalin"),
      () => {
        flash("Gagal");
        onCopyFailed();
      }
    );
  };
  return (
    <li className="row">
      <div className="row-main">
        <div className="row-meta">
          <b>{SPECS[type].label}</b> <span className="okmark">lolos pemeriksaan lokal</span>
        </div>
        <div className="key">
          <KeyParts value={value} />
        </div>
      </div>
      <button type="button" className="btn btn-small" onClick={copy}>
        {label}
      </button>
    </li>
  );
}
