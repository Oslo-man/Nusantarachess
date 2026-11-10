declare var $: any;

declare var g_board: any;
declare var g_toMove: any;
declare var g_timeout: any;

declare var piecePawn: any;
declare var pieceKnight: any;
declare var pieceBishop: any;
declare var pieceRook: any;
declare var pieceQueen: any;
declare var pieceKing: any;

declare var moveflagEPC: any;
declare var moveflagCastleKing: any;
declare var moveflagCastleQueen: any;
declare var moveflagPromotion: any;

declare function MakeSquare(row: any, column: any): any;
declare function GetFen(): any;
declare function MakeMove(move: any): any;
declare function UnmakeMove(move: any): any;
declare function InitializeFromFen(fen: any): any;
declare function GenerateValidMoves(): any;
declare function FormatMove(move: any): any;
declare function Search(finishMoveCallback: any, maxPly: any, finishPlyCallback: any): any;
declare function ResetGame(): any;
declare function GetMoveSAN(move: any, validMoves?: any): any;
declare function GetMoveFromString(moveString: any): any;
declare function BuildPVMessage(bestMove: any, value: any, timeTaken: any, ply: any): any;
