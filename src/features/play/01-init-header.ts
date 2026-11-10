/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
const NC = window.NusantaraChess;
  const api = NC.api;
  const { ChessGame, sqIndex, fileOf, rankOf, algebraic, fromAlgebraic } = NC;
  const { PIECE_SVG, preloadSounds, playSound, pickMoveSound } = NC;
  const { StockfishEngine } = NC;

  preloadSounds();

  function showPage(pageId: any) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
  }

  const state: PlayState = {
    currentUser: null,
    matchId: null,
    game: null,
    engine: null,
    engineReady: false,
    selectedSquare: null,
    legalMovesForSelected: [],
    playerColor: "w",
    timeControl: null,
    bot: null,
    playerMs: 0,
    botMs: 0,
    clockInterval: null,
    lastMoveTime: 0,
    gameActive: false,
    gameSession: 0,
    lastMoveSquares: null,
    drawOffersUsed: 0,
    matchmakingCancelled: false,
    moveCount: 0,
    pendingServerCall: false,

    moveSnapshots: [],
    plySnapshots: [],
    sanHistory: [],
    lastMoveSquaresPerPly: [],
    viewPly: -1,
    gameStartTime: null,
    gameSaved: false,

    premove: null,
    premoveTargets: [],
    deferredPlayerSubmit: null
  };

  