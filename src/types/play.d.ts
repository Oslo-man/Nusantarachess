interface PlayState {
  currentUser: any;
  matchId: any;
  game: any;
  engine: any;
  engineReady: boolean;
  selectedSquare: any;
  legalMovesForSelected: any[];
  playerColor: string;
  timeControl: any;
  bot: any;
  playerMs: number;
  botMs: number;
  clockInterval: any;
  lastMoveTime: number;
  gameActive: boolean;
  gameSession: number;
  lastMoveSquares: any;
  drawOffersUsed: number;
  matchmakingCancelled: boolean;
  moveCount: number;
  pendingServerCall: boolean;
  moveSnapshots: any[];
  plySnapshots: any[];
  sanHistory: any[];
  lastMoveSquaresPerPly: any[];
  viewPly: number;
  gameStartTime: any;
  gameSaved: boolean;
  premove: any;
  premoveTargets: any[];
  deferredPlayerSubmit: any;
  lastGameResult?: any;
}

declare var st: any;
