interface GenerateSectionProps {
  qty: string;
  onQtyChange: (value: string) => void;
  onGenerate: () => void;
  disabled: boolean;
  message: { text: string; cls: "" | "ok" | "err" | "warn" };
}

export function GenerateSection({ qty, onQtyChange, onGenerate, disabled, message }: GenerateSectionProps) {
  return (
    <section aria-labelledby="h-make">
      <h2 id="h-make">Buat kunci</h2>
      <div className="make">
        <div className="qty">
          <label htmlFor="qty">Jumlah</label>
          <input
            type="number"
            id="qty"
            min="1"
            max="100"
            value={qty}
            inputMode="numeric"
            onChange={(e) => onQtyChange(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-primary" id="generate" disabled={disabled} onClick={onGenerate}>
          Buat kunci
        </button>
      </div>
      <p className={"msg" + (message.cls ? " " + message.cls : "")} id="make-msg" role="status" aria-live="polite">
        {message.text}
      </p>
    </section>
  );
}
