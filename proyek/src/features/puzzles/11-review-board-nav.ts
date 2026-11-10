/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
function renderReviewSolution(moves: any, fen: any) {
            const container = document.getElementById('review-solution-moves');
            let html = '';
            
            const tempGame = new Chess(fen);
            const firstOppMove = reviewState.moves[0];
            tempGame.move({
                from: firstOppMove.substring(0, 2),
                to: firstOppMove.substring(2, 4),
                promotion: firstOppMove.length > 4 ? firstOppMove[4] : undefined
            });
            
            let moveNum = 1;
            let isWhiteTurn = tempGame.turn() === 'w';
            
            if (!isWhiteTurn && moves.length > 0) {
                html += '<span style="color: var(--text-secondary)">1...</span> ';
            }
            
            for (let i = 0; i < moves.length; i++) {
                const uci = moves[i];
                const from = uci.substring(0, 2);
                const to = uci.substring(2, 4);
                const promotion = uci.length > 4 ? uci[4] : undefined;
                
                if (isWhiteTurn) {
                    html += '<span style="color: var(--text-secondary)">' + moveNum + '.</span> ';
                }
                
                const moveObj = tempGame.move({ from, to, promotion });
                if (!moveObj) continue;
                
                const san = convertNotation(moveObj.san);
                const colorClass = isWhiteTurn ? '' : 'black-move';
                
                html += '<span class="review-solution-move ' + colorClass + '" data-move="' + i + '">' + san + '</span> ';
                
                if (!isWhiteTurn) {
                    moveNum++;
                }
                isWhiteTurn = !isWhiteTurn;
            }
            
            container.innerHTML = html;
            
            container.querySelectorAll('.review-solution-move').forEach((el: any) => {
                el.addEventListener('click', () => {
                    if (reviewState.solutionVisible) {
                        reviewGoToMove(parseInt(el.dataset.move));
                    }
                });
            });
        }
        
        function convertNotation(san: any) {
            if (currentLang === 'de') {
                return san
                    .replace(/^K/, 'K')
                    .replace(/^Q/, 'D')
                    .replace(/^R/, 'T')
                    .replace(/^B/, 'L')
                    .replace(/^N/, 'S');
            }
            return san;
        }
        

        function renderReviewBoard() {
            renderBoardGeneric({
                boardId: 'review-board',
                chessGame: reviewState.game,
                isFlipped: reviewState.playerColor === 'b',
                selectedSquare: reviewState.selectedSquare,
                lastMoveFrom: reviewState.lastMoveFrom,
                lastMoveTo: reviewState.lastMoveTo,
                canInteract: !reviewState.puzzleolved && !reviewState.solutionVisible,
                playerColor: reviewState.playerColor,
                showValidMoves: !reviewState.puzzleolved && !reviewState.solutionVisible && reviewState.game && reviewState.game.turn() === reviewState.playerColor,
                hintSquare: null,
                onSquareClick: handleReviewSquareClick,
                onDragStart: reviewDrag.start
            });
        }
        
        function handleReviewSquareClick(square: any, event: any) {
            if (reviewDrag.isDragging()) {
                reviewDrag.resetDrag();
                return;
            }
            
            if (reviewState.puzzleolved || reviewState.solutionVisible) return;
            if (reviewState.game.turn() !== reviewState.playerColor) return;
            
            const piece = reviewState.game.get(square);
            
            if (reviewState.selectedSquare) {
                if (reviewState.selectedSquare === square) {
                    reviewState.selectedSquare = null;
                    renderReviewBoard();
                    return;
                }
                const expectedUCI = reviewState.moves[reviewState.moveIndex];
                const playerUCI = reviewState.selectedSquare + square;
                
                const movingPiece = reviewState.game.get(reviewState.selectedSquare);
                let promotion = null;
                if (movingPiece && movingPiece.type === 'p') {
                    const targetRank = square[1];
                    if ((movingPiece.color === 'w' && targetRank === '8') || 
                        (movingPiece.color === 'b' && targetRank === '1')) {
                        const legalMoves = reviewState.game.moves({ square: reviewState.selectedSquare, verbose: true });
                        const isLegalPromotion = legalMoves.some((m: any) => m.to === square && m.flags.includes('p'));
                        if (isLegalPromotion) {
                            promotion = 'q';
                        }
                    }
                }
                
                const fullUCI = playerUCI + (promotion || '');
                
                if (fullUCI === expectedUCI || playerUCI === expectedUCI.substring(0, 4)) {
                    const captured = reviewState.game.get(square);
                    const actualPromotion = expectedUCI.length > 4 ? expectedUCI[4] : promotion;
                    
                    let moveFlags = '';
                    if (movingPiece.type === 'k' && Math.abs(reviewState.selectedSquare.charCodeAt(0) - square.charCodeAt(0)) === 2) {
                        moveFlags = square.charCodeAt(0) > reviewState.selectedSquare.charCodeAt(0) ? 'k' : 'q';
                    }
                    
                    let isCheckMove = false;
                    try {
                        const cloneGame = new Chess(reviewState.game.fen());
                        const cloneResult = cloneGame.move({
                            from: reviewState.selectedSquare,
                            to: square,
                            promotion: actualPromotion
                        });
                        isCheckMove = !!(cloneResult && cloneGame.in_check());
                    } catch (e) {}
                    
                    playMoveSound(movingPiece.type, reviewState.selectedSquare, square, captured ? captured.type : null, {
                        flags: moveFlags,
                        promotion: actualPromotion,
                        isCheck: isCheckMove
                    });
                    
                    reviewState.game.move({
                        from: reviewState.selectedSquare,
                        to: square,
                        promotion: actualPromotion
                    });
                    reviewState.moveIndex++;
                    reviewState.selectedSquare = null;

                    if (reviewState.moveIndex >= reviewState.moves.length) {
                        reviewState.puzzleolved = true;
                        setReviewFeedback(t('solvedMsg'), 'solved');
                    } else {
                        setReviewFeedback(t('findBestMove'), 'neutral');
                        setTimeout(() => {
                            const oppMove = reviewState.moves[reviewState.moveIndex];
                            const oppFrom = oppMove.substring(0, 2);
                            const oppTo = oppMove.substring(2, 4);
                            const oppPromotion = oppMove.length > 4 ? oppMove[4] : undefined;

                            const oppPiece = reviewState.game.get(oppFrom);
                            if (oppPiece) {
                                const oppPieceKey = (oppPiece.color === 'w' ? 'w' : 'b') + oppPiece.type.toUpperCase();
                                animateReviewMove(oppFrom, oppTo, oppPieceKey, () => {
                                    reviewState.game.move({ from: oppFrom, to: oppTo, promotion: oppPromotion });
                                    reviewState.moveIndex++;
                                    reviewState.lastMoveFrom = oppFrom;
                                    reviewState.lastMoveTo = oppTo;
                                    renderReviewBoard();
                                    updateReviewTurnIndicator();

                                    if (reviewState.moveIndex >= reviewState.moves.length) {
                                        reviewState.puzzleolved = true;
                                        setReviewFeedback(t('solvedMsg'), 'solved');
                                    }
                                });
                            } else {
                                reviewState.game.move({ from: oppFrom, to: oppTo, promotion: oppPromotion });
                                reviewState.moveIndex++;
                                reviewState.lastMoveFrom = oppFrom;
                                reviewState.lastMoveTo = oppTo;
                                renderReviewBoard();
                                updateReviewTurnIndicator();
                            }
                        }, 150);
                    }

                    renderReviewBoard();
                    updateReviewTurnIndicator();
                } else {
                    playWrongSound();
                    setReviewFeedback(t('wrongTryAgainMsg'), 'wrong');
                    reviewState.selectedSquare = null;
                    renderReviewBoard();
                }
            } else {
                if (piece && piece.color === reviewState.playerColor) {
                    reviewState.selectedSquare = square;
                    renderReviewBoard();
                }
            }
        }

        
        function tryReviewMove(from: any, to: any, promotion?: any) {
            if (reviewState.puzzleolved || reviewState.solutionVisible) return;
            
            const expectedUCI = reviewState.moves[reviewState.moveIndex];
            const playerUCI = from + to;
            
            const movingPiece = reviewState.game.get(from);
            if (movingPiece && movingPiece.type === 'p' && !promotion) {
                const targetRank = to[1];
                if ((movingPiece.color === 'w' && targetRank === '8') || 
                    (movingPiece.color === 'b' && targetRank === '1')) {
                    const legalMoves = reviewState.game.moves({ square: from, verbose: true });
                    const isLegalPromotion = legalMoves.some((m: any) => m.to === to && m.flags.includes('p'));
                    if (isLegalPromotion) {
                        showReviewPromotionDialog(from, to);
                        return;
                    }
                }
            }
            
            const fullUCI = playerUCI + (promotion || '');
            
            const isLastMove = (reviewState.moveIndex === reviewState.moves.length - 1);
            
            const testMove = reviewState.game.move({
                from: from,
                to: to,
                promotion: promotion || (expectedUCI.length > 4 ? expectedUCI[4] : undefined)
            });
            
            if (!testMove) {
                playWrongSound();
                setReviewFeedback(t('wrongTryAgainMsg'), 'wrong');
                reviewState.selectedSquare = null;
                renderReviewBoard();
                return;
            }
            
            const isMate = reviewState.game.in_checkmate();
            
            if ((fullUCI === expectedUCI || playerUCI === expectedUCI.substring(0, 4)) || (isLastMove && isMate)) {
                const actualPromotion = testMove.promotion;

                playMoveSound(movingPiece.type, from, to, testMove.captured || null, {
                    flags: testMove.flags || '',
                    promotion: actualPromotion,
                    isCheck: reviewState.game.in_check()
                });
                
                reviewState.moveIndex++;
                reviewState.selectedSquare = null;

                if (reviewState.moveIndex >= reviewState.moves.length || (isLastMove && isMate)) {
                    reviewState.puzzleolved = true;
                    setReviewFeedback(t('solvedMsg'), 'solved');
                } else {
                    setReviewFeedback(t('findBestMove'), 'neutral');
                    setTimeout(() => {
                        const oppMove = reviewState.moves[reviewState.moveIndex];
                        const oppFrom = oppMove.substring(0, 2);
                        const oppTo = oppMove.substring(2, 4);
                        const oppPromotion = oppMove.length > 4 ? oppMove[4] : undefined;

                        const oppPiece = reviewState.game.get(oppFrom);
                        if (oppPiece) {
                            const oppPieceKey = (oppPiece.color === 'w' ? 'w' : 'b') + oppPiece.type.toUpperCase();
                            animateReviewMove(oppFrom, oppTo, oppPieceKey, () => {
                                reviewState.game.move({ from: oppFrom, to: oppTo, promotion: oppPromotion });
                                reviewState.moveIndex++;
                                reviewState.lastMoveFrom = oppFrom;
                                reviewState.lastMoveTo = oppTo;
                                renderReviewBoard();
                                updateReviewTurnIndicator();

                                if (reviewState.moveIndex >= reviewState.moves.length) {
                                    reviewState.puzzleolved = true;
                                    setReviewFeedback(t('solvedMsg'), 'solved');
                                }
                            });
                        } else {
                            reviewState.game.move({ from: oppFrom, to: oppTo, promotion: oppPromotion });
                            reviewState.moveIndex++;
                            reviewState.lastMoveFrom = oppFrom;
                            reviewState.lastMoveTo = oppTo;
                            renderReviewBoard();
                            updateReviewTurnIndicator();
                        }
                    }, 150);
                }

                renderReviewBoard();
                updateReviewTurnIndicator();
            } else {
                reviewState.game.undo();
                playWrongSound();
                setReviewFeedback(t('wrongTryAgainMsg'), 'wrong');
                reviewState.selectedSquare = null;
                renderReviewBoard();
            }
        }
        
        function showReviewPromotionDialog(from: any, to: any) {
            const piece = reviewState.game.get(from);
            if (!piece) return;
            
            pendingReviewPromotion = { from, to, color: piece.color };
            
            const dialog = document.getElementById('promotion-dialog');
            const colorPrefix = piece.color === 'w' ? 'w' : 'b';
            
            const options = dialog.querySelectorAll('.promotion-option');
            const pieces = ['Q', 'N', 'R', 'B'];
            const pieceData = ['q', 'n', 'r', 'b'];
            options.forEach((opt: any, i: any) => {
                opt.innerHTML = PIECE_SVG[colorPrefix + pieces[i]];
                opt.dataset.piece = pieceData[i];
            });
            
            const board = document.getElementById('review-board');
            const boardRect = board.getBoundingClientRect();
            const squareSize = boardRect.width / 8;
            
            options.forEach((opt: any) => {
                opt.style.width = squareSize + 'px';
                opt.style.height = squareSize + 'px';
            });
            
            const isFlipped = reviewState.playerColor === 'b';
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
        
        function handleReviewPromotionChoice(piece: any) {
            if (!pendingReviewPromotion) return;
            
            const { from, to } = pendingReviewPromotion;
            hidePromotionDialog();
            pendingReviewPromotion = null;
            
            tryReviewMove(from, to, piece);
        }
        

        function setupReviewBoardTouchHandlers() {
            reviewTouch.setup();
        }
        
        function updateReviewTurnIndicator() {
            const indicator = document.getElementById('review-turn-indicator');
            indicator.className = 'review-turn-indicator ' + (reviewState.game.turn() === 'w' ? 'white' : 'black');
        }
        
        function reviewGoToStart() {
            if (!reviewState.solutionVisible) return;

            const item = playedpuzzle[reviewState.currentIndex];
            const puzzle = item.puzzle;
            reviewState.game = new Chess(puzzle[1]);

            const firstMove = reviewState.moves[0];
            reviewState.game.move({
                from: firstMove.substring(0, 2),
                to: firstMove.substring(2, 4),
                promotion: firstMove.length > 4 ? firstMove[4] : undefined
            });
            reviewState.moveIndex = 1;
            reviewState.lastMoveFrom = firstMove.substring(0, 2);
            reviewState.lastMoveTo = firstMove.substring(2, 4);

            renderReviewBoard();
            updateReviewTurnIndicator();
            updateReviewMoveHighlight();
        }
        
        function reviewGoToEnd() {
            if (!reviewState.solutionVisible) return;

            const item = playedpuzzle[reviewState.currentIndex];
            const puzzle = item.puzzle;
            reviewState.game = new Chess(puzzle[1]);

            for (let i = 0; i < reviewState.moves.length; i++) {
                const uci = reviewState.moves[i];
                reviewState.game.move({
                    from: uci.substring(0, 2),
                    to: uci.substring(2, 4),
                    promotion: uci.length > 4 ? uci[4] : undefined
                });
            }

            reviewState.moveIndex = reviewState.moves.length;
            if (reviewState.moves.length > 0) {
                const lastUci = reviewState.moves[reviewState.moves.length - 1];
                reviewState.lastMoveFrom = lastUci.substring(0, 2);
                reviewState.lastMoveTo = lastUci.substring(2, 4);
            }
            renderReviewBoard();
            updateReviewTurnIndicator();
            updateReviewMoveHighlight();
        }
        
        function reviewPrevMove() {
            if (!reviewState.solutionVisible || reviewState.moveIndex <= 1) return;

            const item = playedpuzzle[reviewState.currentIndex];
            const puzzle = item.puzzle;
            reviewState.moveIndex--;

            reviewState.game = new Chess(puzzle[1]);
            for (let i = 0; i < reviewState.moveIndex; i++) {
                const uci = reviewState.moves[i];
                reviewState.game.move({
                    from: uci.substring(0, 2),
                    to: uci.substring(2, 4),
                    promotion: uci.length > 4 ? uci[4] : undefined
                });
            }

            const lastUci = reviewState.moves[reviewState.moveIndex - 1];
            reviewState.lastMoveFrom = lastUci.substring(0, 2);
            reviewState.lastMoveTo = lastUci.substring(2, 4);

            renderReviewBoard();
            updateReviewTurnIndicator();
            updateReviewMoveHighlight();
        }
        
        function reviewNextMove() {
            if (!reviewState.solutionVisible || reviewState.moveIndex >= reviewState.moves.length) return;

            const uci = reviewState.moves[reviewState.moveIndex];
            reviewState.lastMoveFrom = uci.substring(0, 2);
            reviewState.lastMoveTo = uci.substring(2, 4);
            reviewState.game.move({
                from: uci.substring(0, 2),
                to: uci.substring(2, 4),
                promotion: uci.length > 4 ? uci[4] : undefined
            });
            reviewState.moveIndex++;

            renderReviewBoard();
            updateReviewTurnIndicator();
            updateReviewMoveHighlight();
        }
        
        function reviewGoToMove(solutionMoveIndex: any) {
            if (!reviewState.solutionVisible) return;

            const item = playedpuzzle[reviewState.currentIndex];
            const puzzle = item.puzzle;

            const targetMoveIndex = solutionMoveIndex + 2;

            reviewState.game = new Chess(puzzle[1]);
            for (let i = 0; i < targetMoveIndex && i < reviewState.moves.length; i++) {
                const uci = reviewState.moves[i];
                reviewState.game.move({
                    from: uci.substring(0, 2),
                    to: uci.substring(2, 4),
                    promotion: uci.length > 4 ? uci[4] : undefined
                });
            }

            reviewState.moveIndex = Math.min(targetMoveIndex, reviewState.moves.length);
            if (reviewState.moveIndex > 0) {
                const lastUci = reviewState.moves[reviewState.moveIndex - 1];
                reviewState.lastMoveFrom = lastUci.substring(0, 2);
                reviewState.lastMoveTo = lastUci.substring(2, 4);
            }
            renderReviewBoard();
            updateReviewTurnIndicator();
            updateReviewMoveHighlight();
        }
        
        function reviewPlaySolution() {
            if (!reviewState.solutionVisible) return;
            
            if (reviewState.playInterval) {
                clearInterval(reviewState.playInterval);
                reviewState.playInterval = null;
                return;
            }
            
            if (reviewState.moveIndex >= reviewState.moves.length) {
                reviewGoToStart();
            }
            
            reviewState.playInterval = setInterval(() => {
                if (reviewState.moveIndex >= reviewState.moves.length) {
                    clearInterval(reviewState.playInterval);
                    reviewState.playInterval = null;
                    return;
                }
                reviewNextMove();
            }, 800);
        }
        
        function updateReviewMoveHighlight() {
            const currentSolutionIndex = reviewState.moveIndex - 2;
            document.querySelectorAll('.review-solution-move').forEach((el, i) => {
                el.classList.toggle('current', i === currentSolutionIndex);
            });
        }
        
        function updateReviewNavButtons() {
            const filteredpuzzle = getFilteredpuzzle();
            const currentInFiltered = filteredpuzzle.findIndex(p => playedpuzzle.indexOf(p) === reviewState.currentIndex);
            
            document.getElementById('review-prev-btn').disabled = currentInFiltered <= 0;
            document.getElementById('review-next-btn').disabled = currentInFiltered >= filteredpuzzle.length - 1;
        }
        
        function reviewPrevPuzzle() {
            const filteredpuzzle = getFilteredpuzzle();
            const currentInFiltered = filteredpuzzle.findIndex(p => playedpuzzle.indexOf(p) === reviewState.currentIndex);
            
            if (currentInFiltered > 0) {
                const prevItem = filteredpuzzle[currentInFiltered - 1];
                const prevIndex = playedpuzzle.indexOf(prevItem);
                if (reviewState.playInterval) {
                    clearInterval(reviewState.playInterval);
                    reviewState.playInterval = null;
                }
                openReviewDetail(prevIndex);
            }
        }
        
        function reviewNextPuzzle() {
            const filteredpuzzle = getFilteredpuzzle();
            const currentInFiltered = filteredpuzzle.findIndex(p => playedpuzzle.indexOf(p) === reviewState.currentIndex);
            
            if (currentInFiltered < filteredpuzzle.length - 1) {
                const nextItem = filteredpuzzle[currentInFiltered + 1];
                const nextIndex = playedpuzzle.indexOf(nextItem);
                if (reviewState.playInterval) {
                    clearInterval(reviewState.playInterval);
                    reviewState.playInterval = null;
                }
                openReviewDetail(nextIndex);
            }
        }

        