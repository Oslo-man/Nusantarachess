const PROMOTION_PIECES = ["q", "r", "b", "n"] as const;

export function PromotionDialog() {
  return (
    <div className="promotion-dialog" id="promotion-dialog">
      {PROMOTION_PIECES.map((piece) => (
        <div key={piece} className="promotion-option" data-piece={piece} />
      ))}
    </div>
  );
}
