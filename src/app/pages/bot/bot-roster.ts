// Sumber tunggal daftar bot untuk halaman Pilih Lawan (kartu + dropdown pengaturan).
// Urutan tampilan DIHITUNG OTOMATIS dari Elo (rendah -> tinggi): ubah angka `elo` di sini
// dan urutan kartu/dropdown ikut menyesuaikan, tidak perlu memindahkan baris apa pun.
//
// `id` = kunci internal (server, database sesi latihan, state di 01-state-config.ts, nama file engine di
// public/vendor/chess-engines/<id>.js). Sejak penggantian nama, id sama dengan nama tampilan: udin, ilham, dst.
// `image` (opsional) = nama file gambar di public/images/<image>.svg; bila kosong dipakai `id` (udin.svg, adit.svg, dst.).
// Udin memakai mesin salinan Dimas (udin.js) dengan kedalaman 2; Ilham memakai mesin dari rizky lama (ilham.js).

// Elo di sini harus sama dengan: g_characterInfo (src/features/bot/01-state-config.ts)
// dan PRACTICE_OPPONENTS (server/routes/practice.ts).

export interface BotInfo {
  id: string;
  name: string;
  elo: number;
  image?: string;
}

const BOTS: BotInfo[] = [
  { id: "udin", name: "Udin", elo: 1250 },
  { id: "adit", name: "Adit", elo: 1000 },
  { id: "dimas", name: "Dimas", elo: 1650 },
  { id: "agus", name: "Agus", elo: 1600 },
  { id: "ilham", name: "Ilham", elo: 2450 },
  { id: "josep", name: "Josep", elo: 2200 },
  { id: "asep", name: "Asep", elo: 1850 },
  { id: "fahri", name: "Fahri", elo: 2300 }
];

// Urut Elo naik; jika Elo sama, urutan awal di BOTS dipertahankan (sort stabil).
export const SORTED_BOTS: BotInfo[] = BOTS
  .map((bot, index) => ({ bot, index }))
  .sort((a, b) => a.bot.elo - b.bot.elo || a.index - b.index)
  .map(({ bot }) => bot);

// Jumlah kartu di baris pertama; sisanya masuk ke baris "Bot lain" (tata letak dua baris tetap sama).
export const FIRST_ROW_SIZE = 4;
