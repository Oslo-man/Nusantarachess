export function Summary() {
  return (
    <div className="bc-summary-pane">
      <div className="bc-empty" id="summaryEmpty">
        Belum ada ringkasan. Muat permainan lewat tab Analisis Game, atau pindai langkah di tab Langkah.
      </div>
      <div className="bc-summary" id="reviewList" />
    </div>
  );
}
