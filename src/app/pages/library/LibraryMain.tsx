import { LineIcon } from "../../components/LineIcon";

export function LibraryMain() {
  return (
    <main className="library-page">
      <h1 className="library-title">Game Library</h1>
      <div className="library-controls">
        <div className="library-search-row">
          <LineIcon className="library-search-icon" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </LineIcon>
          <input
            type="search"
            id="librarySearch"
            className="library-search-input"
            placeholder={"Cari nama lawan…"}
            aria-label="Cari nama lawan"
          />
        </div>
        <div className="library-filter-row">
          <select id="libraryCategoryFilter" className="library-select" aria-label="Filter kategori">
            <option value="all">Semua kategori</option>
            <option value="bullet">Bullet</option>
            <option value="blitz">Blitz</option>
            <option value="rapid">Rapid</option>
            <option value="bot">Bot</option>
          </select>
          <select id="libraryResultFilter" className="library-select" aria-label="Filter hasil">
            <option value="all">Semua hasil</option>
            <option value="win">Menang</option>
            <option value="loss">Kalah</option>
            <option value="draw">Remi</option>
          </select>
        </div>
      </div>
      <div id="libraryList" className="gh-list" aria-live="polite" />
      <p className="library-empty-msg" id="libraryEmptyMsg" hidden>Tidak ada game yang cocok dengan filter ini.</p>
      <p className="library-loading-msg" id="libraryLoadingMsg">Memuat game…</p>
      <nav className="library-pagination" id="libraryPagination" aria-label="Navigasi halaman" hidden>
        <button type="button" className="library-page-btn" id="libraryPrevBtn">Sebelumnya</button>
        <span className="library-page-status" id="libraryPageStatus" />
        <button type="button" className="library-page-btn" id="libraryNextBtn">Berikutnya</button>
      </nav>
    </main>
  );
}
