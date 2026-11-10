/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
var PREMOVE_KNIGHT_STEPS = [[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]];
var PREMOVE_KING_STEPS   = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
var PREMOVE_BISHOP_DIRS  = [[1,1],[1,-1],[-1,1],[-1,-1]];
var PREMOVE_ROOK_DIRS    = [[1,0],[-1,0],[0,1],[0,-1]];

function InBoardUI(x: any, y: any) { return x >= 0 && x <= 7 && y >= 0 && y <= 7; }

function GetPremoveTargetsForSquare(fromUI: any) {
    var piece = GetPieceAtUI(fromUI.x, fromUI.y);
    if (!piece) return [];
    var isWhite = !!(piece & 0x8);
    var type = piece & 0x7;
    var targets = [];

    function tryAdd(x: any, y: any) {
        if (!InBoardUI(x, y)) return false;
        var occ = GetPieceAtUI(x, y);
        if (occ && (!!(occ & 0x8) === isWhite)) {
            if ((occ & 0x7) !== pieceKing) targets.push({ x: x, y: y });
            return false;
        }
        targets.push({ x: x, y: y });
        return !occ;
    }

    if (type === pieceKnight) {
        for (var i = 0; i < PREMOVE_KNIGHT_STEPS.length; i++) {
            var s = PREMOVE_KNIGHT_STEPS[i];
            var tx = fromUI.x + s[0], ty = fromUI.y + s[1];
            if (InBoardUI(tx, ty)) {
                var occ = GetPieceAtUI(tx, ty);
                if (!occ || (!!(occ & 0x8) !== isWhite) || (occ & 0x7) !== pieceKing) targets.push({ x: tx, y: ty });
            }
        }
    } else if (type === pieceKing) {
        for (var i2 = 0; i2 < PREMOVE_KING_STEPS.length; i2++) {
            var s2 = PREMOVE_KING_STEPS[i2];
            var tx2 = fromUI.x + s2[0], ty2 = fromUI.y + s2[1];
            if (InBoardUI(tx2, ty2)) {
                var occ2 = GetPieceAtUI(tx2, ty2);
                if (!occ2 || (!!(occ2 & 0x8) !== isWhite) || (occ2 & 0x7) !== pieceKing) targets.push({ x: tx2, y: ty2 });
            }
        }
        var homeY = (isWhite === g_playerWhite) ? 7 : 0;
        if (fromUI.y === homeY && fromUI.x === 4) {
            var rookK = GetPieceAtUI(7, homeY);
            if (rookK && (rookK & 0x7) === pieceRook && (!!(rookK & 0x8) === isWhite) &&
                !GetPieceAtUI(5, homeY) && !GetPieceAtUI(6, homeY)) {
                targets.push({ x: 6, y: homeY });
            }
            var rookQ = GetPieceAtUI(0, homeY);
            if (rookQ && (rookQ & 0x7) === pieceRook && (!!(rookQ & 0x8) === isWhite) &&
                !GetPieceAtUI(1, homeY) && !GetPieceAtUI(2, homeY) && !GetPieceAtUI(3, homeY)) {
                targets.push({ x: 2, y: homeY });
            }
        }
    } else if (type === pieceBishop || type === pieceRook || type === pieceQueen) {
        var dirs = (type === pieceBishop) ? PREMOVE_BISHOP_DIRS :
                    (type === pieceRook)   ? PREMOVE_ROOK_DIRS :
                    PREMOVE_BISHOP_DIRS.concat(PREMOVE_ROOK_DIRS);
        for (var d = 0; d < dirs.length; d++) {
            var dx = dirs[d][0], dy = dirs[d][1];
            var x = fromUI.x + dx, y = fromUI.y + dy;
            while (tryAdd(x, y)) { x += dx; y += dy; }
        }
    } else if (type === piecePawn) {
        var forward = (isWhite === g_playerWhite) ? -1 : 1;
        var startY = (isWhite === g_playerWhite) ? 6 : 1;
        var oneY = fromUI.y + forward;
        if (InBoardUI(fromUI.x, oneY) && !GetPieceAtUI(fromUI.x, oneY)) {
            targets.push({ x: fromUI.x, y: oneY });
            var twoY = fromUI.y + forward * 2;
            if (fromUI.y === startY && InBoardUI(fromUI.x, twoY) && !GetPieceAtUI(fromUI.x, twoY)) {
                targets.push({ x: fromUI.x, y: twoY });
            }
        }
        var diagXs = [fromUI.x - 1, fromUI.x + 1];
        for (var dxi = 0; dxi < diagXs.length; dxi++) {
            var diagX = diagXs[dxi];
            if (!InBoardUI(diagX, oneY)) continue;
            var diagOcc = GetPieceAtUI(diagX, oneY);
            if (!diagOcc || (!!(diagOcc & 0x8) !== isWhite) || (diagOcc & 0x7) !== pieceKing) {
                targets.push({ x: diagX, y: oneY });
            }
        }
    }

    return targets;
}

