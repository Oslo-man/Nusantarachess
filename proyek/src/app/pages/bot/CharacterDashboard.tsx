import { CharacterCard } from "./CharacterCard";
import { SORTED_BOTS, FIRST_ROW_SIZE } from "./bot-roster";

// Baris pertama = 4 bot dengan Elo terendah. Tidak ada kartu yang terpilih di awal:
// pemain harus memilih lawan sendiri (tombol Mulai Bermain aktif setelah ada bot terpilih).
// Baris kedua (Elo lebih tinggi) ada di PlaceholderBotRow.tsx.
export function CharacterDashboard() {
  return (
    <div className="character-dashboard" id="characterDashboard" role="radiogroup" aria-label="Pilih karakter lawan">
      {SORTED_BOTS.slice(0, FIRST_ROW_SIZE).map((c) => (
        <CharacterCard key={c.id} id={c.id} name={c.name} elo={c.elo} image={c.image} />
      ))}
    </div>
  );
}
