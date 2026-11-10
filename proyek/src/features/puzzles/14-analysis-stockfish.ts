/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
function switchReviewMode(mode: any) {
            reviewState.mode = mode;

            document.querySelectorAll('.review-mode-btn').forEach(b => b.classList.remove('active'));
            const activeBtn = document.getElementById('mode-btn-' + mode);
            if (activeBtn) activeBtn.classList.add('active');

            const solutionEl   = document.getElementById('review-solution');
            const analysisEl   = document.getElementById('analysis-controls');
            const sfPanelEl    = document.getElementById('stockfish-panel');
            const evalBarEl    = document.getElementById('eval-bar');
            const boardSection = document.getElementById('review-detail-board-section');

            if (mode === 'loesung') {
                exitAnalysisMode();
                reviewState.solutionVisible = true;
                solutionEl && solutionEl.classList.remove('hidden');
                analysisEl && analysisEl.classList.add('hidden');
                sfPanelEl  && sfPanelEl.classList.add('hidden');
                evalBarEl  && evalBarEl.classList.add('hidden');
                boardSection && boardSection.classList.remove('with-eval');
                clearReviewFeedback();
            } else if (mode === 'solution') {
                exitAnalysisMode();
                reviewState.solutionVisible = false;
                solutionEl && solutionEl.classList.add('hidden');
                analysisEl && analysisEl.classList.add('hidden');
                sfPanelEl  && sfPanelEl.classList.add('hidden');
                evalBarEl  && evalBarEl.classList.add('hidden');
                boardSection && boardSection.classList.remove('with-eval');
                if (reviewState.puzzleolved) {
                    setReviewFeedback(t('solvedMsg'), 'solved');
                } else {
                    setReviewFeedback(t('findBestMove'), 'neutral');
                }
            } else {
                enterAnalysisMode(mode === 'stockfish');
                solutionEl && solutionEl.classList.add('hidden');
                analysisEl && analysisEl.classList.remove('hidden');

                if (mode === 'stockfish') {
                    sfPanelEl  && sfPanelEl.classList.remove('hidden');
                    evalBarEl  && evalBarEl.classList.remove('hidden');
                    boardSection && boardSection.classList.add('with-eval');
                } else {
                    sfPanelEl  && sfPanelEl.classList.add('hidden');
                    evalBarEl  && evalBarEl.classList.add('hidden');
                    boardSection && boardSection.classList.remove('with-eval');
                }
                updateAnalysisGameOverFeedback();
            }
        }

        function reviewNeuerVersuch() {
            openReviewDetail(reviewState.currentIndex);
        }

        function enterAnalysisMode(withStockfish: any) {
            if (analysisState.game === null) {
                const puzzle = playedpuzzle[reviewState.currentIndex].puzzle;
                const startFen = puzzle[1];
                const tempGame = new Chess(startFen);
                const history = [tempGame.fen()];
                const moves = [];
                for (let i = 0; i < reviewState.moveIndex; i++) {
                    const uci = reviewState.moves[i];
                    const m = tempGame.move({
                        from: uci.substring(0, 2),
                        to: uci.substring(2, 4),
                        promotion: uci.length > 4 ? uci[4] : undefined
                    });
                    if (!m) break;
                    history.push(tempGame.fen());
                    moves.push(m);
                }
                analysisState.game = new Chess(reviewState.game.fen());
                analysisState.history = history;
                analysisState.moves = moves;
                analysisState.index = history.length - 1;
                analysisState.selectedSquare = null;
                renderAnalysisBoard();
                updateReviewTurnIndicator();
                updateAnalysisNavButtons();
            }

            if (withStockfish) {
                if (sfState.worker && sfState.ready) {
                    sfAnalyzePosition(analysisState.game.fen());
                } else {
                    sfState.pendingFen = analysisState.game.fen();
                    sfInit();
                }
            }
        }

        function exitAnalysisMode() {
            sfStop();
            analysisState.game = null;
            analysisState.history = [];
            analysisState.moves = [];
            analysisState.index = -1;
            analysisState.selectedSquare = null;

            renderReviewBoard();
            updateReviewTurnIndicator();
        }

        function renderAnalysisBoard() {
            if (!analysisState.game) return;
            renderBoardGeneric({
                boardId: 'review-board',
                chessGame: analysisState.game,
                isFlipped: reviewState.playerColor === 'b',
                selectedSquare: analysisState.selectedSquare,
                lastMoveFrom: null,
                lastMoveTo: null,
                canInteract: true,
                playerColor: analysisState.game.turn(),
                showValidMoves: true,
                hintSquare: null,
                onSquareClick: handleAnalysisSquareClick,
                onDragStart: analysisDrag.start
            });
        }

        function handleAnalysisSquareClick(square: any, event: any) {
            if (analysisDrag.isDragging()) {
                analysisDrag.resetDrag();
                return;
            }
            if (!analysisState.game) return;

            const piece = analysisState.game.get(square);

            if (analysisState.selectedSquare) {
                if (analysisState.selectedSquare === square) {
                    analysisState.selectedSquare = null;
                    renderAnalysisBoard();
                    return;
                }

                if (analysisMakeMove(analysisState.selectedSquare, square, null)) {
                    analysisState.selectedSquare = null;
                } else if (piece && piece.color === analysisState.game.turn()) {
                    analysisState.selectedSquare = square;
                    renderAnalysisBoard();
                } else {
                    analysisState.selectedSquare = null;
                    renderAnalysisBoard();
                }
                return;
            }

            if (piece && piece.color === analysisState.game.turn()) {
                analysisState.selectedSquare = square;
                renderAnalysisBoard();
            }
        }

        function analysisMakeMove(from: any, to: any, promo: any) {
            if (!analysisState.game) return false;

            if (!promo) {
                const movingPiece = analysisState.game.get(from);
                if (movingPiece && movingPiece.type === 'p') {
                    const targetRank = to[1];
                    if ((movingPiece.color === 'w' && targetRank === '8') ||
                        (movingPiece.color === 'b' && targetRank === '1')) {
                        const legal = analysisState.game.moves({ square: from, verbose: true });
                        if (legal.some((m: any) => m.to === to && m.flags.includes('p'))) {
                            showAnalysisPromotionDialog(from, to);
                            analysisState.selectedSquare = null;
                            renderAnalysisBoard();
                            return true;
                        }
                    }
                }
            }

            const moveObj = analysisState.game.move({ from, to, promotion: promo || undefined });
            if (!moveObj) return false;

            playMoveSound(moveObj.piece, from, to, moveObj.captured || null, {
                flags: moveObj.flags || '',
                promotion: moveObj.promotion,
                isCheck: !!(moveObj.san && (moveObj.san.includes('+') || moveObj.san.includes('#')))
            });

            analysisState.history = analysisState.history.slice(0, analysisState.index + 1);
            analysisState.moves   = analysisState.moves.slice(0, analysisState.index);
            analysisState.history.push(analysisState.game.fen());
            analysisState.moves.push(moveObj);
            analysisState.index = analysisState.history.length - 1;

            analysisState.selectedSquare = null;
            renderAnalysisBoard();
            updateReviewTurnIndicator();
            updateAnalysisNavButtons();

            if (reviewState.mode === 'stockfish') {
                sfAnalyzePosition(analysisState.game.fen());
            }
            updateAnalysisGameOverFeedback();
            return true;
        }

        function showAnalysisPromotionDialog(from: any, to: any) {
            const piece = analysisState.game.get(from);
            if (!piece) return;

            pendingAnalysisPromotion = { from, to, color: piece.color };

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

            dialog.style.left = (squareLeft - 2) + 'px';
            dialog.style.top = (squareTop - 2) + 'px';
            dialog.classList.add('active');
        }

        function handleAnalysisPromotionChoice(piece: any) {
            if (!pendingAnalysisPromotion) return;

            const { from, to } = pendingAnalysisPromotion;
            const dialog = document.getElementById('promotion-dialog');
            dialog.classList.remove('active');
            pendingAnalysisPromotion = null;

            analysisMakeMove(from, to, piece);
        }

        function playAnalysisNavSound(moveObj: any) {
            if (!moveObj) return;
            playMoveSound(moveObj.piece, moveObj.from, moveObj.to, moveObj.captured || null, {
                flags: moveObj.flags || '',
                promotion: moveObj.promotion,
                isCheck: !!(moveObj.san && (moveObj.san.includes('+') || moveObj.san.includes('#')))
            });
        }

        function analysisGoBack() {
            if (analysisState.index <= 0) return;
            const undoneMove = analysisState.moves[analysisState.index - 1];
            analysisState.index--;
            analysisState.game = new Chess(analysisState.history[analysisState.index]);
            analysisState.selectedSquare = null;
            playAnalysisNavSound(undoneMove);
            renderAnalysisBoard();
            updateReviewTurnIndicator();
            updateAnalysisNavButtons();
            if (reviewState.mode === 'stockfish') sfAnalyzePosition(analysisState.game.fen());
            updateAnalysisGameOverFeedback();
        }

        function analysisGoForward() {
            if (analysisState.index >= analysisState.history.length - 1) return;
            const nextMove = analysisState.moves[analysisState.index];
            analysisState.index++;
            analysisState.game = new Chess(analysisState.history[analysisState.index]);
            analysisState.selectedSquare = null;
            playAnalysisNavSound(nextMove);
            renderAnalysisBoard();
            updateReviewTurnIndicator();
            updateAnalysisNavButtons();
            if (reviewState.mode === 'stockfish') sfAnalyzePosition(analysisState.game.fen());
            updateAnalysisGameOverFeedback();
        }

        function analysisGoToStart() {
            if (analysisState.history.length === 0) return;
            analysisState.index = 0;
            analysisState.game = new Chess(analysisState.history[0]);
            analysisState.selectedSquare = null;
            renderAnalysisBoard();
            updateReviewTurnIndicator();
            updateAnalysisNavButtons();
            if (reviewState.mode === 'stockfish') sfAnalyzePosition(analysisState.game.fen());
            updateAnalysisGameOverFeedback();
        }

        function analysisGoToEnd() {
            if (analysisState.history.length === 0) return;
            analysisState.index = analysisState.history.length - 1;
            analysisState.game = new Chess(analysisState.history[analysisState.index]);
            analysisState.selectedSquare = null;
            renderAnalysisBoard();
            updateReviewTurnIndicator();
            updateAnalysisNavButtons();
            if (reviewState.mode === 'stockfish') sfAnalyzePosition(analysisState.game.fen());
            updateAnalysisGameOverFeedback();
        }

        function updateAnalysisNavButtons() {
            const btns = document.querySelectorAll('.analysis-playback button');
            if (btns.length < 4) return;
            btns[0].disabled = analysisState.index <= 0;
            btns[1].disabled = analysisState.index <= 0;
            btns[2].disabled = !analysisState.history.length || analysisState.index >= analysisState.history.length - 1;
            btns[3].disabled = !analysisState.history.length || analysisState.index >= analysisState.history.length - 1;
        }

        const SF_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js';

        async function sfInit() {
            if (sfState.worker) return;
            const sfStatusEl = document.getElementById('sf-status');
            if (sfStatusEl) sfStatusEl.textContent = t('loadingStockfish');

            try {
                const response = await fetch(SF_CDN);
                if (!response.ok) throw new Error('HTTP ' + response.status);
                const code = await response.text();
                const blob = new Blob([code], { type: 'application/javascript' });
                const url = URL.createObjectURL(blob);
                sfState.worker = new Worker(url);
                URL.revokeObjectURL(url);

                sfState.worker.onmessage = function(e: any) {
                    sfHandleMessage(e.data);
                };
                sfState.worker.onerror = function(err: any) {
                    console.error('Stockfish Worker Fehler:', err);
                    if (sfStatusEl) sfStatusEl.textContent = t('stockfishError');
                };

                sfState.worker.postMessage('uci');
                sfState.worker.postMessage('setoption name MultiPV value 3');
                sfState.worker.postMessage('setoption name Hash value 64');
                sfState.worker.postMessage('setoption name Threads value ' + (navigator.hardwareConcurrency || 2));
                sfState.worker.postMessage('isready');

            } catch (err) {
                console.error('Stockfish laden fehlgeschlagen:', err);
                if (sfStatusEl) sfStatusEl.textContent = t('stockfishUnavailable');
            }
        }

        function sfHandleMessage(line: any) {
            if (line === 'readyok') {
                sfState.ready = true;
                const sfStatusEl = document.getElementById('sf-status');
                if (sfStatusEl) sfStatusEl.textContent = t('analyzing');
                if (sfState.pendingFen) {
                    const fen = sfState.pendingFen;
                    sfState.pendingFen = null;
                    sfAnalyzePosition(fen);
                }
                return;
            }

            if (line.startsWith('bestmove')) {
                sfState.analyzing = false;
                if (sfState.pendingAnalysis) {
                    const { fen, gen } = sfState.pendingAnalysis;
                    sfState.pendingAnalysis = null;
                    if (sfState.generation === gen) {
                        sfState.activeGeneration = gen;
                        sfState.worker.postMessage('position fen ' + fen);
                        sfState.worker.postMessage('go depth 24');
                        sfState.analyzing = true;
                    }
                }
                return;
            }

            if (!line.startsWith('info')) return;

            if (sfState.generation !== sfState.activeGeneration) return;

            const pvMatch  = line.match(/multipv (\d+)/);
            const scMatch  = line.match(/score (cp|mate) (-?\d+)/);
            const mvsMatch = line.match(/ pv (.+)/);

            if (!pvMatch || !scMatch || !mvsMatch) return;

            const pvNum = parseInt(pvMatch[1]);
            const scType = scMatch[1];
            const scVal  = parseInt(scMatch[2]);
            const uciMoves = mvsMatch[1].trim().split(' ');

            const sideToMove = analysisState.game ? analysisState.game.turn() : 'w';
            const whiteVal = (sideToMove === 'b') ? -scVal : scVal;
            const playerVal = (reviewState.playerColor === 'b') ? -whiteVal : whiteVal;

            let evalStr;
            if (scType === 'mate') {
                evalStr = (playerVal > 0 ? '+' : '') + 'M' + Math.abs(playerVal);
            } else {
                const cp = playerVal / 100;
                evalStr = (cp > 0 ? '+' : '') + cp.toFixed(1);
            }

            if (!sfState.lines) sfState.lines = [];
            sfState.lines[pvNum - 1] = {
                eval: evalStr,
                moves: uciMoves
            };

            if (pvNum === 1) {
                updateEvalBar(evalStr);
            }
            updateSFVariants();
        }

        function sfAnalyzePosition(fen: any) {
            if (!sfState.worker) return;
            if (!sfState.ready) {
                sfState.pendingFen = fen;
                return;
            }
            sfState.generation++;
            const gen = sfState.generation;
            sfState.lines = [];
            updateSFVariants();

            const tmp = new Chess(fen);
            if (tmp.game_over()) {
                if (sfState.analyzing) {
                    sfState.worker.postMessage('stop');
                }
                sfState.analyzing = false;
                sfState.pendingAnalysis = null;
                sfState.activeGeneration = gen;
                const sfStatusEl = document.getElementById('sf-status');
                if (sfStatusEl) {
                    if (tmp.in_checkmate()) {
                        const winner = tmp.turn() === 'w' ? 'b' : 'w';
                        const playerWins = winner === reviewState.playerColor;
                        const evalStr = (playerWins ? '+' : '-') + 'M0';
                        updateEvalBar(evalStr);
                        sfStatusEl.textContent = '#';
                    } else {
                        updateEvalBar('0.0');
                        sfStatusEl.textContent = '½–½';
                    }
                }
                return;
            }

            if (sfState.analyzing) {
                sfState.pendingAnalysis = { fen: fen, gen: gen };
                sfState.worker.postMessage('stop');
            } else {
                sfState.activeGeneration = gen;
                sfState.worker.postMessage('position fen ' + fen);
                sfState.worker.postMessage('go depth 24');
                sfState.analyzing = true;
                const sfStatusEl = document.getElementById('sf-status');
                if (sfStatusEl) sfStatusEl.textContent = t('analyzing');
            }
        }

        function sfStop() {
            if (sfState.worker && sfState.ready) {
                sfState.worker.postMessage('stop');
            }
            sfState.analyzing = false;
            sfState.pendingAnalysis = null;
        }

        function sfTerminate() {
            sfStop();
            if (sfState.worker) {
                sfState.worker.terminate();
                sfState.worker = null;
                sfState.ready = false;
            }
        }

        function evalToPercent(evalStr: any) {
            if (evalStr.includes('M')) {
                return evalStr.startsWith('+') ? 100 : 0;
            } else {
                const cp = parseFloat(evalStr);
                return Math.max(0, Math.min(100, Math.round(50 + cp * 12.5)));
            }
        }

        function updateEvalBar(evalStr: any) {
            const fillEl = document.getElementById('eval-bar-fill');
            const textEl = document.getElementById('eval-bar-text');
            if (!fillEl || !textEl) return;

            const pct = evalToPercent(evalStr);
            fillEl.style.height = pct + '%';

            textEl.textContent = evalStr;
            if (pct >= 50) {
                textEl.style.top = 'auto';
                textEl.style.bottom = '4px';
                textEl.style.color = '#333';
            } else {
                textEl.style.top = '4px';
                textEl.style.bottom = 'auto';
                textEl.style.color = '#ccc';
            }
        }

        function updateSFVariants() {
            const container = document.getElementById('sf-variants');
            const sfStatusEl = document.getElementById('sf-status');
            if (!container) return;

            if (!sfState.lines || sfState.lines.filter(Boolean).length === 0) {
                container.innerHTML = '';
                return;
            }

            const fen = analysisState.game ? analysisState.game.fen() : null;
            let html = '';

            sfState.lines.filter(Boolean).forEach((line: any, i: any) => {
                const evalStr = line.eval;
                const evalClass = evalStr.startsWith('+') ? 'positive' :
                                  evalStr.startsWith('-') ? 'negative' : 'neutral';
                const sans = fen ? uciToSan(fen, line.moves.slice(0, 10)) : line.moves.slice(0, 5);
                const movesStr = sans.join(' ');

                html += '<div class="stockfish-variant">';
                html += '<span class="sf-eval ' + evalClass + '">' + (i + 1) + '. ' + evalStr + '</span>';
                html += '<span class="sf-moves">' + movesStr + '</span>';
                html += '</div>';
            });

            container.innerHTML = html;
            if (sfStatusEl && sfState.lines.filter(Boolean).length > 0) {
                sfStatusEl.textContent = '';
            }
        }

        function uciToSan(fen: any, uciMoves: any) {
            const tmp = new Chess(fen);
            const sans = [];
            for (const uci of uciMoves) {
                const m = tmp.move({
                    from: uci.slice(0, 2),
                    to: uci.slice(2, 4),
                    promotion: uci[4] || undefined
                });
                if (!m) break;
                sans.push(convertNotation(m.san));
            }
            return sans;
        }

        game = new Chess();
        populateThemeFilter();
        initToggleDropdown('sound-toggle', 'sound-panel', 'sound-display', updateSoundDisplay);
        initToggleDropdown('tips-toggle', 'tips-panel', 'tips-display', updateTipsDisplay);
        initPieceCountSlider();
        loadSettings();

        if (__setupDailyCardPending) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', setupDailyCardOnLoad);
            } else {
                setupDailyCardOnLoad();
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupBoardTouchHandlers);
        } else {
            setupBoardTouchHandlers();
        }
