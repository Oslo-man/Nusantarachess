import type { ReactNode } from "react";
import { LineIcon } from "../../components/LineIcon";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="feature-card">
      <div className="feature-icon">
        <LineIcon>{icon}</LineIcon>
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export function FeatureStrip() {
  return (
    <section className="feature-strip" id="fitur">
      <FeatureCard
        title="Bermain"
        description="Matchmaking otomatis berdasarkan rating Bullet/Blitz/Rapid, jam sungguhan, validasi langkah di server."
        icon={
          <>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </>
        }
      />
      <FeatureCard
        title="Lawan Bot"
        description="Fahri, Adit, Dimas, dan Udin — tiap karakter punya gaya bermain sendiri untuk latihan tanpa tekanan rating."
        icon={
          <>
            <path d="M12 3v4" />
            <path d="M9 21h6" />
            <path d="M8 21c0-4 1-5 1-8a5 5 0 0 1 10 0c0 3 1 4 1 8" />
            <path d="M5 21h4" />
          </>
        }
      />
      <FeatureCard
        title="Puzzle"
        description="Puzzle diambil dari basis data 49.796 posisi Lichess, disesuaikan dengan rating puzzle pribadimu."
        icon={
          <>
            <path d="M6 8h4.5a2 2 0 1 1 3 0H18a1 1 0 0 1 1 1v3.5a2 2 0 1 0 0 3V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
          </>
        }
      />
      <FeatureCard
        title="Game Review"
        description="Analisis Stockfish per langkah: akurasi, klasifikasi Brilliant sampai Blunder, estimasi rating performa."
        icon={
          <>
            <circle cx="10.5" cy="10.5" r="7" />
            <path d="m15.7 15.7 4.8 4.8" />
            <path d="M10.5 7.3v6.4M7.3 10.5h6.4" />
            <path d="M10.5 10.5V7.3a3.2 3.2 0 0 1 3.2 3.2zM10.5 10.5v3.2a3.2 3.2 0 0 1-3.2-3.2z" fill="currentColor" />
          </>
        }
      />
    </section>
  );
}
