import { callGlobal } from "../../components/dom-handlers";
import { CharacterCard } from "./CharacterCard";
import { SORTED_BOTS, FIRST_ROW_SIZE } from "./bot-roster";

// Baris kedua ("Bot lain"): bot-bot sisanya setelah baris pertama, urut Elo naik (daftar & urutan dari bot-roster.ts).
// Slot cadangan SENGAJA belum punya nama, Elo, maupun mesin catur. Saat ada bot baru yang belum lengkap,
// tambahkan entri { slot, label } di bawah; saat detailnya sudah ada, daftarkan di bot-roster.ts
// dan daftarkan engine-nya. Kini tidak ada slot cadangan.
const PLACEHOLDER_SLOTS: { slot: string; label: string }[] = [];

export function PlaceholderBotRow() {
  return (
    <>
      <div className="character-dashboard character-dashboard-extra" id="characterDashboardExtra" role="radiogroup" aria-label="Bot lain">
        {SORTED_BOTS.slice(FIRST_ROW_SIZE).map((c) => (
          <CharacterCard key={c.id} id={c.id} name={c.name} elo={c.elo} image={c.image} />
        ))}
        {PLACEHOLDER_SLOTS.map(({ slot, label }) => (
          <button
            key={slot}
            type="button"
            className="character-card character-card-placeholder"
            data-placeholder={slot}
            role="radio"
            aria-checked="false"
            onClick={() => callGlobal("UISelectPlaceholderBot", slot)}
          >
            <span className="character-card-avatar">
              <span className="character-card-avatar-fallback" aria-hidden="true">?</span>
            </span>
            <span className="character-card-name">{label}</span>
            <span className="character-card-elo">Segera hadir</span>
            <span className="character-card-check" aria-hidden="true"><span className="ui-ico ui-ico-check" aria-hidden="true" /></span>
          </button>
        ))}
      </div>
      <p className="opponent-select-hint hidden" id="placeholderBotHint" role="status">Bot ini belum tersedia. Pilih bot lain untuk mulai bermain.</p>
    </>
  );
}
