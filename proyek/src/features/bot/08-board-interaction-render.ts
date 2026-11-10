/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
function SetSelection(uiX: any, uiY: any) {
    g_selectedSquare = { x: uiX, y: uiY };
    g_legalTargets = GetLegalTargetsForSquare(g_selectedSquare);
    RedrawPieces();
}

function ClearSelection() {
    g_selectedSquare = null;
    g_legalTargets = [];
    RedrawPieces();
}

function CreateGhostPiece(pieceKey: any, clientX: any, clientY: any, isTouch: any) {
    var el = document.createElement('div');
    el.className = 'piece-ghost';
    el.innerHTML = PIECE_SVG[pieceKey];
    var size = Math.round(g_cellSize * 1.18);
    el.style.width  = size + 'px';
    el.style.height = size + 'px';
    el.style.left = clientX + 'px';
    el.style.top  = clientY + 'px';
    if (isTouch) el.style.transform = 'translate(-50%,-135%)';
    document.body.appendChild(el);
    return el;
}

var g_activeDrag: any = null;

function OnSquarePointerDown(e: any, uiX: any, uiY: any) {
    if (!IsAtLivePosition()) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (g_gameOver) return;
    e.preventDefault();
    if (g_activeDrag) return;

    if (!IsPlayersTurn()) {
        OnSquarePointerDownForPremove(uiX, uiY, e);
        return;
    }

    var piece = GetPieceAtUI(uiX, uiY);
    var isOwn = piece && (((piece & 0x8) !== 0) === g_playerWhite);

    if (g_selectedSquare && g_selectedSquare.x === uiX && g_selectedSquare.y === uiY) {
        if (isOwn && IsPlayersTurn()) {
            StartDrag(e, uiX, uiY, piece, true);
        }
        return;
    }

    if (g_selectedSquare) {
        var from = g_selectedSquare;
        var didMove = TryMakeMove(from, { x: uiX, y: uiY });
        if (didMove) { ClearSelection(); return; }

        if (isOwn && IsPlayersTurn()) {
            SetSelection(uiX, uiY);
            StartDrag(e, uiX, uiY, piece, false);
        } else {
            ClearSelection();
        }
        return;
    }

    if (isOwn && IsPlayersTurn()) {
        SetSelection(uiX, uiY);
        StartDrag(e, uiX, uiY, piece, false);
    }
}

function OnSquarePointerDownForPremove(uiX: any, uiY: any, e?: any) {
    var piece = GetPieceAtUI(uiX, uiY);
    var isOwn = piece && (((piece & 0x8) !== 0) === g_playerWhite);

    if (g_premove && g_premove.from.x === uiX && g_premove.from.y === uiY) {
        if (!g_premove.to && e) {
            StartDrag(e, uiX, uiY, piece, true, true);
            return;
        }
        ClearPremove();
        RedrawPieces();
        return;
    }

    if (g_premove) {
        var isTarget = g_premoveTargets.some(function (t) { return t.x === uiX && t.y === uiY; });
        if (isTarget) {
            g_premove = { from: g_premove.from, to: { x: uiX, y: uiY } };
            g_premoveTargets = [];
            RedrawPieces();
            return;
        }
        ClearPremove();
        if (isOwn) {
            g_premove = { from: { x: uiX, y: uiY }, to: null };
            g_premoveTargets = GetPremoveTargetsForSquare(g_premove.from);
        }
        RedrawPieces();
        if (isOwn && e) StartDrag(e, uiX, uiY, piece, false, true);
        return;
    }

    if (isOwn) {
        g_premove = { from: { x: uiX, y: uiY }, to: null };
        g_premoveTargets = GetPremoveTargetsForSquare(g_premove.from);
        RedrawPieces();
        if (e) StartDrag(e, uiX, uiY, piece, false, true);
    }
}

function StartDrag(e: any, uiX: any, uiY: any, piece: any, wasAlreadySelected: any, premoveMode?: any) {
    var pieceKey = GetPieceSvgKey(piece);
    var isTouch = (e.pointerType === 'touch' || e.pointerType === 'pen');
    var td = g_uiBoard[uiY * 8 + uiX];
    var pieceDivEl = td ? td.querySelector('.chess-piece') : null;
    var pointerId = e.pointerId;

    var startX = e.clientX, startY = e.clientY;
    var moved = false;
    var ghostEl: any = null;

    g_activeDrag = { pointerId: pointerId };

    function ensureGhost(x: any, y: any) {
        if (!ghostEl) {
            if (pieceDivEl) pieceDivEl.classList.add('is-dragging-source');
            ghostEl = CreateGhostPiece(pieceKey, x, y, isTouch);
        } else {
            ghostEl.style.left = x + 'px';
            ghostEl.style.top  = y + 'px';
        }
    }

    function onMove(ev: any) {
        if (ev.pointerId !== pointerId) return;
        var dx = ev.clientX - startX, dy = ev.clientY - startY;
        if (!moved && (dx * dx + dy * dy) < 9) return;
        moved = true;
        ensureGhost(ev.clientX, ev.clientY);
    }

    function cleanup() {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        document.removeEventListener('pointercancel', onCancel);
        if (ghostEl) { ghostEl.remove(); ghostEl = null; }
        if (pieceDivEl) pieceDivEl.classList.remove('is-dragging-source');
        g_activeDrag = null;
    }

    function onUp(ev: any) {
        if (ev.pointerId !== pointerId) return;
        cleanup();

        var targetEl = document.elementFromPoint(ev.clientX, ev.clientY);
        var squareTd: any = targetEl ? targetEl.closest('.board-td') : null;

        if (!squareTd) {
            RedrawPieces();
            return;
        }

        var tx = parseInt(squareTd.dataset.uiX, 10);
        var ty = parseInt(squareTd.dataset.uiY, 10);

        if (premoveMode) {
            if (!g_premove || IsPlayersTurn()) { RedrawPieces(); return; }
            if (tx === uiX && ty === uiY) {
                if (!moved && wasAlreadySelected) ClearPremove();
                RedrawPieces();
                return;
            }
            if (!g_premove.to && g_premoveTargets.some(function (t: any) { return t.x === tx && t.y === ty; })) {
                g_premove = { from: g_premove.from, to: { x: tx, y: ty } };
                g_premoveTargets = [];
                RedrawPieces();
                return;
            }
            ClearPremove();
            var pdest = GetPieceAtUI(tx, ty);
            if (pdest && ((pdest & 0x8) !== 0) === g_playerWhite) {
                g_premove = { from: { x: tx, y: ty }, to: null };
                g_premoveTargets = GetPremoveTargetsForSquare(g_premove.from);
            }
            RedrawPieces();
            return;
        }

        if (tx === uiX && ty === uiY) {
            if (!moved && wasAlreadySelected) {
                ClearSelection();
            } else {
                RedrawPieces();
            }
            return;
        }

        var didMove = TryMakeMove({ x: uiX, y: uiY }, { x: tx, y: ty });
        if (didMove) {
            ClearSelection();
            return;
        }

        var destPiece = GetPieceAtUI(tx, ty);
        if (destPiece && ((destPiece & 0x8) !== 0) === g_playerWhite) {
            SetSelection(tx, ty);
        } else {
            ClearSelection();
        }
    }

    function onCancel(ev: any) {
        if (ev.pointerId !== pointerId) return;
        cleanup();
        RedrawPieces();
    }

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onCancel);
}

function ApplyLastMoveHighlight(index?: any) {
    if (!g_uiBoard) return;
    for (var i = 0; i < g_uiBoard.length; i++) {
        if (g_uiBoard[i]) g_uiBoard[i].classList.remove('last-move');
    }
    var idx = (index === undefined) ? g_viewIndex : index;
    if (!g_allMoves || !g_boardHistory || g_allMoves.length !== g_boardHistory.length - 1) return;
    var move = g_allMoves[idx - 1];
    if (idx < 1 || move == null) return;

    var fromX = (move & 0xF) - 4;
    var fromY = ((move >> 4) & 0xF) - 2;
    var toX = ((move >> 8) & 0xF) - 4;
    var toY = ((move >> 12) & 0xF) - 2;
    if (!g_playerWhite) {
        fromX = 7 - fromX; fromY = 7 - fromY;
        toX = 7 - toX; toY = 7 - toY;
    }
    var fromTd = g_uiBoard[fromY * 8 + fromX];
    var toTd = g_uiBoard[toY * 8 + toX];
    if (fromTd) fromTd.classList.add('last-move');
    if (toTd) toTd.classList.add('last-move');
}

function UpdateFromMove(move: any) {
    ClearSelectionHighlight();

    var fromX = (move & 0xF) - 4;
    var fromY = ((move >> 4) & 0xF) - 2;
    var toX = ((move >> 8) & 0xF) - 4;
    var toY = ((move >> 12) & 0xF) - 2;

    if (!g_playerWhite) {
        fromY = 7 - fromY;
        toY = 7 - toY;
        fromX = 7 - fromX;
        toX = 7 - toX;
    }

    if ((move & moveflagCastleKing) ||
        (move & moveflagCastleQueen) ||
        (move & moveflagEPC) ||
        (move & moveflagPromotion)) {
        RedrawPieces();
    } else {
        var fromSquare = g_uiBoard[fromY * 8 + fromX];
        var toSquare = g_uiBoard[toY * 8 + toX];
        toSquare.innerHTML = '';
        while (fromSquare.firstChild) {
            toSquare.appendChild(fromSquare.firstChild);
        }
    }
    ApplyLastMoveHighlight();
}

function RedrawPieces() {
    for (var y = 0; y < 8; ++y) {
        for (var x = 0; x < 8; ++x) {
            var td = g_uiBoard[y * 8 + x];
            td.innerHTML = '';
            td.classList.remove('selected', 'premove-square');

            var pieceY = g_playerWhite ? y : 7 - y;
            var pieceX = g_playerWhite ? x : 7 - x;
            var piece = g_board[((pieceY + 2) * 0x10) + pieceX + 4];
            var pieceKey = GetPieceSvgKey(piece);

            if (pieceKey) {
                var pieceDiv = document.createElement('div');
                pieceDiv.className = 'chess-piece';
                pieceDiv.innerHTML = PIECE_SVG[pieceKey];
                td.appendChild(pieceDiv);
            }
        }
    }

    if (g_selectedSquare) {
        var selTd = g_uiBoard[g_selectedSquare.y * 8 + g_selectedSquare.x];
        if (selTd) selTd.classList.add('selected');

        for (var i = 0; i < g_legalTargets.length; i++) {
            var t = g_legalTargets[i];
            var targetTd = g_uiBoard[t.y * 8 + t.x];
            if (!targetTd) continue;
            var hasPieceThere = !!GetPieceAtUI(t.x, t.y);
            var dot = document.createElement('div');
            dot.className = hasPieceThere ? 'move-hint move-hint-capture' : 'move-hint';
            targetTd.appendChild(dot);
        }
    }

    if (g_premove) {
        var fromTd = g_uiBoard[g_premove.from.y * 8 + g_premove.from.x];
        if (fromTd) fromTd.classList.add(g_premove.to ? 'premove-square' : 'selected');

        if (g_premove.to) {
            var toTd = g_uiBoard[g_premove.to.y * 8 + g_premove.to.x];
            if (toTd) toTd.classList.add('premove-square');
        }
    }

    ApplyLastMoveHighlight();
}

function IsAtLivePosition() {
    return g_viewIndex === (g_boardHistory.length - 1);
}

function RenderHistorySnapshot(index: any) {
    var snapshot = g_boardHistory[index];
    if (!snapshot || !g_uiBoard) return;

    for (var y = 0; y < 8; y++) {
        for (var x = 0; x < 8; x++) {
            var td = g_uiBoard[y * 8 + x];
            if (!td) continue;
            td.innerHTML = '';
            td.classList.remove('selected', 'premove-square');

            var pieceY = g_playerWhite ? y : 7 - y;
            var pieceX = g_playerWhite ? x : 7 - x;
            var piece = snapshot[MakeSquare(pieceY, pieceX)];
            var pieceKey = GetPieceSvgKey(piece);

            if (pieceKey) {
                var pieceDiv = document.createElement('div');
                pieceDiv.className = 'chess-piece';
                pieceDiv.innerHTML = PIECE_SVG[pieceKey];
                td.appendChild(pieceDiv);
            }
        }
    }
    ApplyLastMoveHighlight(index);
}

function UpdateHistoryNavButtons() {
    var atStart = (g_viewIndex <= 0);
    var atLive  = IsAtLivePosition();

    var btnFirst = document.getElementById('navFirst');
    var btnPrev  = document.getElementById('navPrev');
    var btnNext  = document.getElementById('navNext');
    var btnLast  = document.getElementById('navLast');

    if (btnFirst) btnFirst.disabled = atStart;
    if (btnPrev)  btnPrev.disabled  = atStart;
    if (btnNext)  btnNext.disabled  = atLive;
    if (btnLast)  btnLast.disabled  = atLive;
}

function UIGoToHistoryIndex(idx: any) {
    if (!g_boardHistory || g_boardHistory.length === 0) return;
    var maxIdx = g_boardHistory.length - 1;
    if (idx < 0) idx = 0;
    if (idx > maxIdx) idx = maxIdx;

    g_viewIndex = idx;
    g_selectedSquare = null;
    g_legalTargets = [];
    ClearPremove();

    if (IsAtLivePosition()) {
        RedrawPieces();
    } else {
        RenderHistorySnapshot(g_viewIndex);
    }
    UpdateHistoryNavButtons();
}

function UIHistoryFirst() { UIGoToHistoryIndex(0); }
function UIHistoryPrev()  { UIGoToHistoryIndex(g_viewIndex - 1); }
function UIHistoryNext()  { UIGoToHistoryIndex(g_viewIndex + 1); }
function UIHistoryLast()  { UIGoToHistoryIndex(g_boardHistory.length - 1); }

function RedrawBoard() {
    RecalcCellSize();
    var div = $("#board")[0];

    var table = document.createElement("table");
    table.cellPadding = "0px";
    table.cellSpacing = "0px";
    $(table).addClass('no-highlight');

    var tbody = document.createElement("tbody");
    g_uiBoard = [];

    for (var y = 0; y < 8; ++y) {
        var tr = document.createElement("tr");
        for (var x = 0; x < 8; ++x) {
            var td: any = document.createElement("td");
            td.style.width  = g_cellSize + "px";
            td.style.height = g_cellSize + "px";
            var isDark = ((y ^ x) & 1);
            td.className = (isDark ? 'board-dark' : 'board-light') + ' board-td';
            td.style.backgroundColor = isDark
                ? "var(--board-dark)"
                : "var(--board-light)";
            td.dataset.uiX = x;
            td.dataset.uiY = y;

            (function (ux, uy) {
                td.addEventListener('pointerdown', function (e: any) { OnSquarePointerDown(e, ux, uy); });
            })(x, y);

            tr.appendChild(td);
            g_uiBoard[y * 8 + x] = td;
        }
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    RedrawPieces();
    $(div).empty();
    div.appendChild(table);

    g_changingFen = true;
    document.getElementById("FenTextBox").value = GetFen();
    g_changingFen = false;

    if (typeof UpdateHistoryNavButtons === 'function') UpdateHistoryNavButtons();
}
