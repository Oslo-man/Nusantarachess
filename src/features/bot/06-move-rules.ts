/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
function IsPlayersTurn() {
    return !((g_playerWhite && g_toMove === 0) || (!g_playerWhite && g_toMove !== 0));
}

function GetPieceAtUI(uiX: any, uiY: any) {
    var ix = g_playerWhite ? uiX : 7 - uiX;
    var iy = g_playerWhite ? uiY : 7 - uiY;
    return g_board[((iy + 2) * 0x10) + ix + 4];
}

function GetPieceSvgKey(piece: any) {
    if (!piece) return null;
    var t;
    switch (piece & 0x7) {
        case piecePawn:   t = 'P'; break;
        case pieceKnight: t = 'N'; break;
        case pieceBishop: t = 'B'; break;
        case pieceRook:   t = 'R'; break;
        case pieceQueen:  t = 'Q'; break;
        case pieceKing:   t = 'K'; break;
        default: return null;
    }
    return ((piece & 0x8) ? 'w' : 'b') + t;
}

function GetPieceSoundLetter(piece: any) {
    if (!piece) return null;
    switch (piece & 0x7) {
        case piecePawn:   return 'p';
        case pieceKnight: return 'n';
        case pieceBishop: return 'b';
        case pieceRook:   return 'r';
        case pieceQueen:  return 'q';
        case pieceKing:   return 'k';
    }
    return null;
}

function SquareToAlgebraic(x: any, y: any) {
    return 'abcdefgh'[x] + (8 - y);
}

function ClearSelectionHighlight() {
    if (!g_uiBoard) return;
    for (var i = 0; i < g_uiBoard.length; i++) {
        if (g_uiBoard[i]) g_uiBoard[i].classList.remove('selected');
    }
}

function FindKingSquare(sideIsWhite: any) {
    for (var y = 0; y < 8; y++) {
        for (var x = 0; x < 8; x++) {
            var p = g_board[MakeSquare(y, x)];
            if (p && (p & 0x7) === pieceKing && ((p & 0x8) !== 0) === sideIsWhite) {
                return { y: y, x: x };
            }
        }
    }
    return null;
}

function IsSquareAttacked(targetY: any, targetX: any, byWhite: any) {
    var knightDeltas = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
    for (var i = 0; i < knightDeltas.length; i++) {
        var ny = targetY + knightDeltas[i][0], nx = targetX + knightDeltas[i][1];
        if (ny < 0 || ny > 7 || nx < 0 || nx > 7) continue;
        var np = g_board[MakeSquare(ny, nx)];
        if (np && (np & 0x7) === pieceKnight && ((np & 0x8) !== 0) === byWhite) return true;
    }

    for (var dy = -1; dy <= 1; dy++) {
        for (var dx = -1; dx <= 1; dx++) {
            if (dy === 0 && dx === 0) continue;
            var ky = targetY + dy, kx = targetX + dx;
            if (ky < 0 || ky > 7 || kx < 0 || kx > 7) continue;
            var kp = g_board[MakeSquare(ky, kx)];
            if (kp && (kp & 0x7) === pieceKing && ((kp & 0x8) !== 0) === byWhite) return true;
        }
    }

    var pawnY = byWhite ? targetY + 1 : targetY - 1;
    if (pawnY >= 0 && pawnY <= 7) {
        for (var pdx = -1; pdx <= 1; pdx += 2) {
            var pawnX = targetX + pdx;
            if (pawnX < 0 || pawnX > 7) continue;
            var pp = g_board[MakeSquare(pawnY, pawnX)];
            if (pp && (pp & 0x7) === piecePawn && ((pp & 0x8) !== 0) === byWhite) return true;
        }
    }

    var orthoDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (var od = 0; od < orthoDirs.length; od++) {
        var oy = targetY + orthoDirs[od][0], ox = targetX + orthoDirs[od][1];
        while (oy >= 0 && oy <= 7 && ox >= 0 && ox <= 7) {
            var op = g_board[MakeSquare(oy, ox)];
            if (op) {
                var otype = op & 0x7;
                if (((op & 0x8) !== 0) === byWhite && (otype === pieceRook || otype === pieceQueen)) return true;
                break;
            }
            oy += orthoDirs[od][0];
            ox += orthoDirs[od][1];
        }
    }

    var diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (var dd = 0; dd < diagDirs.length; dd++) {
        var diy = targetY + diagDirs[dd][0], dix = targetX + diagDirs[dd][1];
        while (diy >= 0 && diy <= 7 && dix >= 0 && dix <= 7) {
            var dp = g_board[MakeSquare(diy, dix)];
            if (dp) {
                var dtype = dp & 0x7;
                if (((dp & 0x8) !== 0) === byWhite && (dtype === pieceBishop || dtype === pieceQueen)) return true;
                break;
            }
            diy += diagDirs[dd][0];
            dix += diagDirs[dd][1];
        }
    }

    return false;
}

function IsSideInCheckNow(sideIsWhite: any) {
    var kingPos = FindKingSquare(sideIsWhite);
    if (!kingPos) return false;
    return IsSquareAttacked(kingPos.y, kingPos.x, !sideIsWhite);
}

function PlayMoveSoundForMove(move: any, movingPieceRaw: any, capturedPieceRaw: any, isEP: any) {
    var isCastle    = !!(move & (moveflagCastleKing | moveflagCastleQueen));
    var isPromotion = !!(move & moveflagPromotion);
    var isCapture   = !!(capturedPieceRaw || isEP);

    var givesCheck = false;
    try {
        givesCheck = IsSideInCheckNow(!!g_toMove);
    } catch (e) {
        givesCheck = false;
    }

    var soundType;
    if (isCastle) {
        soundType = 'castle';
    } else if (isPromotion) {
        soundType = 'promote';
    } else if (givesCheck) {
        soundType = 'check';
    } else if (isCapture) {
        soundType = 'capture';
    } else {
        soundType = 'move';
    }

    try {
        PlayChessSoundFile(soundType);
    } catch (e) {
        console.warn('PlayChessSoundFile failed:', e);
    }
}

function TryMakeMove(fromUI: any, toUI: any, allowWhileBusy?: boolean) {
    if ((g_serverBusy && !allowWhileBusy) || !g_practiceMatchId) return false;

    var fromX = fromUI.x, fromY = fromUI.y, toX = toUI.x, toY = toUI.y;
    if (!g_playerWhite) {
        fromX = 7 - fromX; fromY = 7 - fromY;
        toX   = 7 - toX;   toY   = 7 - toY;
    }

    var moves = GenerateValidMoves();
    var move = null;
    for (var i = 0; i < moves.length; i++) {
        if ((moves[i] & 0xFF) === MakeSquare(fromY, fromX) &&
            ((moves[i] >> 8) & 0xFF) === MakeSquare(toY, toX)) {
            move = moves[i];
        }
    }
    if (move == null) return false;

    var movingPiece   = g_board[MakeSquare(fromY, fromX)];
    var capturedPiece = g_board[MakeSquare(toY, toX)];
    var isEP = !!(move & moveflagEPC);

    UpdatePgnTextBox(move);
    g_allMoves[g_allMoves.length] = move;
    MakeMove(move);
    g_boardHistory.push(g_board.slice());
    g_viewIndex = g_boardHistory.length - 1;
    UpdateFromMove(move);

    PlayMoveSoundForMove(move, movingPiece, capturedPiece, isEP);
    UpdateHistoryNavButtons();

    var fenBox = document.getElementById("FenTextBox");
    if (fenBox) fenBox.value = GetFen();

    if (g_serverBusy) {
        g_deferredPlayerMove = move;
    } else {
        SubmitMoveToServer(move, 'player');
    }

    return true;
}

function SubmitMoveToServer(move: any, mover: any) {
    g_serverBusy = true;
    var uci = FormatMove(move);
    var from = uci.substr(0, 2);
    var to = uci.substr(2, 2);
    var promotion = uci.length > 4 ? uci.substr(4, 1) : null;

    window.NusantaraChess.api.submitPracticeMove(g_practiceMatchId, from, to, promotion, mover).then(function (data: any) {
        g_serverBusy = false;

        if (mover === 'player' && InitializeBackgroundEngine()) {
            g_backgroundEngine.postMessage(FormatMove(move));
        }

        if (data.gameOver) {
            g_deferredPlayerMove = null;
            g_gameOver = true;
            EnsureAnalysisStopped();
            UpdateControlVisibility();
            var m = data.match;
            if (m.result === 'draw') ShowGameOverDialog('draw');
            else if (m.result === 'win') ShowGameOverDialog('win');
            else ShowGameOverDialog('loss');
            return;
        }

        if (mover === 'player') {
            setTimeout(SearchAndRedraw, 0);
        } else {
            if (g_deferredPlayerMove) {
                var deferredMove = g_deferredPlayerMove;
                g_deferredPlayerMove = null;
                SubmitMoveToServer(deferredMove, 'player');
            } else if (g_premove && g_premove.to) {
                var pending = g_premove;
                ClearPremove();
                TryMakeMove(pending.from, pending.to);
            } else {
                ClearPremove();
            }
            RedrawPieces();
        }
    }).catch(function (err: any) {
        g_serverBusy = false;
        g_deferredPlayerMove = null;
        alert("Server menolak langkah ini: " + (err && err.message ? err.message : err));
        ResyncFromServer();
    });
}

function ResyncFromServer() {
    if (!g_practiceMatchId || !window.NusantaraChess || !window.NusantaraChess.api) return;
    window.NusantaraChess.api.getPracticeState(g_practiceMatchId).then(function (data: any) {
        var m = data.match;
        if (!RebuildFromPracticeMatch(m)) {
            alert("Tidak bisa memulihkan posisi dari server.");
            return;
        }

        if (m.status !== 'active') {
            g_gameOver = true;
            EnsureAnalysisStopped();
            UpdateControlVisibility();
        }
    }).catch(function (err: any) {
        alert("Tidak bisa menyinkronkan ulang dari server: " + (err && err.message ? err.message : err));
    });
}

function GetLegalTargetsForSquare(fromUI: any) {
    var fromX = fromUI.x, fromY = fromUI.y;
    if (!g_playerWhite) { fromX = 7 - fromX; fromY = 7 - fromY; }

    var fromSq = MakeSquare(fromY, fromX);
    var moves = GenerateValidMoves();
    var targets = [];
    var seen: any = {};

    for (var i = 0; i < moves.length; i++) {
        if ((moves[i] & 0xFF) !== fromSq) continue;
        var toSq = (moves[i] >> 8) & 0xFF;
        var toX = (toSq & 0xF) - 4;
        var toY = ((toSq >> 4) & 0xF) - 2;
        var uiX = toX, uiY = toY;
        if (!g_playerWhite) { uiX = 7 - uiX; uiY = 7 - uiY; }
        var key = uiX + ',' + uiY;
        if (!seen[key]) {
            seen[key] = true;
            targets.push({ x: uiX, y: uiY });
        }
    }
    return targets;
}

