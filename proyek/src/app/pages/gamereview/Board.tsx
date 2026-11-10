export function Board() {
  return (
    <div className="bc-boardbox" id="boardBox">
      <div id="board" onContextMenu={(e) => e.preventDefault()} />
      <svg id="arrowsvg" viewBox="0 0 8 8" preserveAspectRatio="none" aria-hidden="true" />
      <div className="bc-promo" id="promoPicker" hidden />
    </div>
  );
}
