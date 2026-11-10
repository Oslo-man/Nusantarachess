export function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <h1>Catur Indonesia, dari latihan sampai rating.</h1>
        <p>
          Main online dengan sistem Elo, latihan bebas melawan karakter bot, ribuan puzzle personal, dan bedah setiap partaimu dengan analisis Stockfish — semua di satu tempat.
        </p>
        <button type="button" className="btn hero-cta" id="heroCta">Mulai Bermain</button>
      </div>
      <div className="hero-board" aria-hidden="true">
        <div className="hero-board-grid" id="heroBoardGrid" />
      </div>
    </section>
  );
}
