/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
const gameDrag = createMouseDragHandler({
            boardId: 'board',
            getCanInteract: () => gameActive && game.turn() === playerColor,
            getPlayerColor: () => playerColor,
            chessGame: () => game,
            getSelectedSquare: () => selectedSquare,
            setSelectedSquare: (sq: any) => { selectedSquare = sq; },
            onMoveAttempt: (from: any, to: any, clientX: any, clientY: any) => {
                const move = tryMove(from, to);
                if (move === 'promotion') {
                    showPromotionDialog(from, to, clientX, clientY);
                    return true;
                } else if (move) {
                    selectedSquare = null;
                    renderBoard();
                    checkPlayerMove(move);
                    return true;
                }
                return false;
            },
            renderFn: () => renderBoard()
        });
        
        const gameTouch = createTouchHandler({
            boardId: 'board',
            getCanInteract: () => gameActive && game.turn() === playerColor,
            getPlayerColor: () => playerColor,
            chessGame: () => game,
            getSelectedSquare: () => selectedSquare,
            setSelectedSquare: (sq: any) => { selectedSquare = sq; },
            onMoveAttempt: (from: any, to: any, clientX: any, clientY: any) => {
                const move = tryMove(from, to);
                if (move === 'promotion') {
                    showPromotionDialog(from, to, clientX, clientY);
                    return true;
                } else if (move) {
                    selectedSquare = null;
                    renderBoard();
                    checkPlayerMove(move);
                    return true;
                }
                return false;
            },
            renderFn: () => renderBoard()
        });
        
        const reviewDrag = createMouseDragHandler({
            boardId: 'review-board',
            getCanInteract: () => reviewState.mode === 'solution' && !reviewState.puzzleolved && !reviewState.solutionVisible && reviewState.game && reviewState.game.turn() === reviewState.playerColor,
            getPlayerColor: () => reviewState.playerColor,
            chessGame: () => reviewState.game,
            getSelectedSquare: () => reviewState.selectedSquare,
            setSelectedSquare: (sq: any) => { reviewState.selectedSquare = sq; },
            onMoveAttempt: (from: any, to: any) => {
                tryReviewMove(from, to);
                return true;
            },
            renderFn: () => renderReviewBoard()
        });
        
        const reviewTouch = createTouchHandler({
            boardId: 'review-board',
            getCanInteract: () => reviewState.mode === 'solution' && !reviewState.puzzleolved && !reviewState.solutionVisible && reviewState.game && reviewState.game.turn() === reviewState.playerColor,
            getPlayerColor: () => reviewState.playerColor,
            chessGame: () => reviewState.game,
            getSelectedSquare: () => reviewState.selectedSquare,
            setSelectedSquare: (sq: any) => { reviewState.selectedSquare = sq; },
            onMoveAttempt: (from: any, to: any) => {
                tryReviewMove(from, to);
                return true;
            },
            renderFn: () => renderReviewBoard()
        });

        const analysisDrag = createMouseDragHandler({
            boardId: 'review-board',
            getCanInteract: () => reviewState.mode !== 'solution' && analysisState.game !== null,
            getPlayerColor: () => analysisState.game ? analysisState.game.turn() : 'w',
            chessGame: () => analysisState.game,
            getSelectedSquare: () => analysisState.selectedSquare,
            setSelectedSquare: (sq: any) => { analysisState.selectedSquare = sq; },
            onMoveAttempt: (from: any, to: any) => {
                analysisMakeMove(from, to, null);
                return true;
            },
            renderFn: () => renderAnalysisBoard()
        });

        const analysisTouch = createTouchHandler({
            boardId: 'review-board',
            getCanInteract: () => reviewState.mode !== 'solution' && analysisState.game !== null,
            getPlayerColor: () => analysisState.game ? analysisState.game.turn() : 'w',
            chessGame: () => analysisState.game,
            getSelectedSquare: () => analysisState.selectedSquare,
            setSelectedSquare: (sq: any) => { analysisState.selectedSquare = sq; },
            onMoveAttempt: (from: any, to: any) => {
                analysisMakeMove(from, to, null);
                return true;
            },
            renderFn: () => renderAnalysisBoard()
        });

        function renderBoard() {
            renderBoardGeneric({
                boardId: 'board',
                chessGame: game,
                isFlipped: playerColor === 'b',
                selectedSquare: selectedSquare,
                lastMoveFrom: lastMoveFrom,
                lastMoveTo: lastMoveTo,
                canInteract: gameActive,
                playerColor: playerColor,
                showValidMoves: gameActive && game.turn() === playerColor,
                hintSquare: hintSquare,
                onSquareClick: handleSquareClick,
                onDragStart: gameDrag.start
            });
            
            updateTurnIndicator();
        }
        
        
        function updateTurnIndicator() {
            const indicator = document.getElementById('turn-indicator');
            indicator.classList.remove('white', 'black');
            if (game.turn() === 'w') {
                indicator.classList.add('white');
            } else {
                indicator.classList.add('black');
            }
        }

        function handleSquareClick(square: any, event: any) {
            if (gameDrag.isDragging()) {
                gameDrag.resetDrag();
                return;
            }
            if (!gameActive) return;
            if (game.turn() !== playerColor) return;
            
            const piece = game.get(square);
            
            if (selectedSquare) {
                if (selectedSquare === square) {
                    selectedSquare = null;
                    renderBoard();
                    return;
                }
                const move = tryMove(selectedSquare, square);
                if (move === 'promotion') {
                    const rect = event?.target?.closest('.square')?.getBoundingClientRect();
                    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
                    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
                    showPromotionDialog(selectedSquare, square, x, y);
                } else if (move) {
                    selectedSquare = null;
                    renderBoard();
                    checkPlayerMove(move);
                } else if (piece && piece.color === playerColor) {
                    selectedSquare = square;
                    renderBoard();
                } else {
                    selectedSquare = null;
                    renderBoard();
                }
            } else {
                if (piece && piece.color === playerColor) {
                    selectedSquare = square;
                    renderBoard();
                }
            }
        }
        
        function setupBoardTouchHandlers() {
            gameTouch.setup();
        }
        
        function cleanupDrag() {
            gameDrag.cleanup();
        }
        
        function tryMove(from: any, to: any, promotion?: any) {
            const piece = game.get(from);
            
            if (piece && piece.type === 'p' && !promotion) {
                const targetRank = to[1];
                if ((piece.color === 'w' && targetRank === '8') || 
                    (piece.color === 'b' && targetRank === '1')) {
                    const legalMoves = game.moves({ square: from, verbose: true });
                    const isLegalPromotion = legalMoves.some((m: any) => m.to === to && m.flags.includes('p'));
                    if (isLegalPromotion) {
                        return 'promotion';
                    }
                }
            }
            
            const captured = game.get(to);
            
            const move = game.move({
                from: from,
                to: to,
                promotion: promotion
            });
            
            if (move) {
                lastMoveFrom = from;
                lastMoveTo = to;
                lastMoveSoundTime = playMoveSound(piece.type, from, to, captured ? captured.type : null, {
                    flags: move.flags || '',
                    promotion: move.promotion,
                    isCheck: !!(move.san && (move.san.includes('+') || move.san.includes('#')))
                });
            }
            
            return move;
        }
        
        function showPromotionDialog(from: any, to: any, x: any, y: any) {
            const piece = game.get(from);
            if (!piece) return;
            
            pendingPromotion = { from, to, color: piece.color };
            
            const dialog = document.getElementById('promotion-dialog');
            const colorPrefix = piece.color === 'w' ? 'w' : 'b';
            
            const options = dialog.querySelectorAll('.promotion-option');
            const pieces = ['Q', 'N', 'R', 'B'];
            const pieceData = ['q', 'n', 'r', 'b'];
            options.forEach((opt: any, i: any) => {
                opt.innerHTML = PIECE_SVG[colorPrefix + pieces[i]];
                opt.dataset.piece = pieceData[i];
            });
            
            const board = document.getElementById('board');
            const boardRect = board.getBoundingClientRect();
            const squareSize = boardRect.width / 8;
            
            options.forEach((opt: any) => {
                opt.style.width = squareSize + 'px';
                opt.style.height = squareSize + 'px';
            });
            
            const isFlipped = playerColor === 'b';
            const fileIndex = to.charCodeAt(0) - 97;
            const rankIndex = parseInt(to[1]) - 1;
            
            const col = isFlipped ? 7 - fileIndex : fileIndex;
            const row = isFlipped ? rankIndex : 7 - rankIndex;
            
            const squareLeft = boardRect.left + col * squareSize;
            const squareTop = boardRect.top + row * squareSize;
            
            let left = squareLeft - 2;
            
            let top = squareTop - 2;
            
            dialog.style.left = left + 'px';
            dialog.style.top = top + 'px';
            dialog.classList.add('active');
        }
        
        function hidePromotionDialog() {
            const dialog = document.getElementById('promotion-dialog');
            dialog.classList.remove('active');
            pendingPromotion = null;
        }

        function handlePromotionChoice(piece: any) {
            if (pendingAnalysisPromotion) {
                handleAnalysisPromotionChoice(piece);
                return;
            }
            if (pendingReviewPromotion) {
                handleReviewPromotionChoice(piece);
                return;
            }

            if (!pendingPromotion) return;
            
            const { from, to } = pendingPromotion;
            hidePromotionDialog();
            
            const move = tryMove(from, to, piece);
            if (move && move !== 'promotion') {
                selectedSquare = null;
                renderBoard();
                checkPlayerMove(move);
            }
        }
        
        function setupPromotionDialogHandlers() {
            document.querySelectorAll('.promotion-option').forEach(opt => {
                opt.addEventListener('click', (e: any) => {
                    e.stopPropagation();
                    handlePromotionChoice(opt.dataset.piece);
                });
                opt.addEventListener('touchend', (e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePromotionChoice(opt.dataset.piece);
                });
            });
            
            document.addEventListener('click', (e: any) => {
                if ((pendingPromotion || pendingReviewPromotion || pendingAnalysisPromotion)
                    && !e.target.closest('.promotion-dialog')) {
                    hidePromotionDialog();
                    pendingReviewPromotion = null;
                    pendingAnalysisPromotion = null;
                }
            });
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupPromotionDialogHandlers);
        } else {
            setupPromotionDialogHandlers();
        }
        
        