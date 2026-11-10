import { SPECS, TYPE_ORDER } from "./spec";
import type { KeyType } from "./spec";

interface TypePickerProps {
  value: KeyType;
  onChange: (type: KeyType) => void;
}

export function TypePicker({ value, onChange }: TypePickerProps) {
  return (
    <section aria-labelledby="h-type">
      <h2 id="h-type">Jenis akses</h2>
      <div className="types" role="radiogroup" aria-labelledby="h-type" id="types">
        {TYPE_ORDER.map((t) => (
          <label className="type" key={t}>
            <input type="radio" name="type" value={t} checked={value === t} onChange={() => onChange(t)} />
            <span className="type-face">
              <span className="type-name">{SPECS[t].label}</span>
              <span className="type-note">{SPECS[t].note}</span>
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
