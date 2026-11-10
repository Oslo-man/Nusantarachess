/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
function showReviewScreen() {
            document.getElementById('game-over').classList.remove('active');
            document.getElementById('game-screen').classList.remove('active');
            document.getElementById('daily-result').classList.remove('active');
            document.getElementById('review-screen').classList.add('active');
            
            const totalCount = playedpuzzle.length;
            const solvedCount = playedpuzzle.filter(p => p.solved).length;
            const failedCount = totalCount - solvedCount;
            
            document.getElementById('review-total').textContent = totalCount;
            document.getElementById('review-solved').textContent = solvedCount;
            document.getElementById('review-failed').textContent = failedCount;
            
            reviewState.filter = 'all';
            reviewState.view = 'grid';
            reviewState.sort = 'number';
            
            document.querySelectorAll('.review-filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === 'all');
            });
            document.querySelectorAll('.review-sort-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.sort === 'number');
            });
            document.querySelectorAll('.review-view-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.view === 'grid');
            });
            
            renderReviewContent();
        }
        
        function setReviewFilter(filter: any) {
            reviewState.filter = filter;
            document.querySelectorAll('.review-filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === filter);
            });
            renderReviewContent();
        }
        
        function setReviewSort(sort: any) {
            reviewState.sort = sort;
            document.querySelectorAll('.review-sort-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.sort === sort);
            });
            renderReviewContent();
        }
        
        function setReviewView(view: any) {
            reviewState.view = view;
            document.querySelectorAll('.review-view-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.view === view);
            });
            renderReviewContent();
        }
        
        function getFilteredpuzzle() {
            let puzzle;
            if (reviewState.filter === 'solved') {
                puzzle = playedpuzzle.filter(p => p.solved);
            } else if (reviewState.filter === 'failed') {
                puzzle = playedpuzzle.filter(p => !p.solved);
            } else {
                puzzle = [...playedpuzzle];
            }
            
            if (reviewState.sort === 'number') {
                puzzle.sort((a, b) => playedpuzzle.indexOf(a) - playedpuzzle.indexOf(b));
            } else if (reviewState.sort === 'rating') {
                puzzle.sort((a, b) => b.puzzle[3] - a.puzzle[3]);
            } else if (reviewState.sort === 'time') {
                puzzle.sort((a, b) => b.timeSpent - a.timeSpent);
            } else if (reviewState.sort === 'attempts') {
                puzzle.sort((a, b) => b.attempts - a.attempts);
            }
            
            return puzzle;
        }
        
        function renderReviewContent() {
            const container = document.getElementById('review-content');
            const puzzle = getFilteredpuzzle();
            
            if (puzzle.length === 0) {
                container.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 40px;">' + t('nopuzzleFound') + '</div>';
                return;
            }
            
            if (reviewState.view === 'list') {
                renderReviewList(container, puzzle);
            } else {
                renderReviewGrid(container, puzzle);
            }
        }
        
        function renderReviewList(container: any, puzzle: any) {
            let html = '<div class="review-list">';
            
            puzzle.forEach((item: any, index: any) => {
                const originalIndex = playedpuzzle.indexOf(item);
                const puzzle = item.puzzle;
                const statusClass = item.solved ? 'solved' : 'failed';
                const statusIcon = item.solved ? '<span class="ui-ico ui-ico-check" aria-hidden="true"></span>' : '<span class="ui-ico ui-ico-close" aria-hidden="true"></span>';
                const themes = formatThemes(puzzle[4]);
                const time = formatTime(item.timeSpent);
                const miniBoard = createListMiniBoard(puzzle[1]);
                const attemptText = item.attempts === 0 ? t('attempts0') :
                                   item.attempts === 1 ? t('attempt1') :
                                   item.attempts + ' ' + t('attemptsN');
                
                html += '<div class="review-list-item ' + statusClass + '" onclick="openReviewDetail(' + originalIndex + ')">';
                html += miniBoard;
                html += '<span class="review-item-number">#' + (originalIndex + 1) + '</span>';
                html += '<span class="review-item-status">' + statusIcon + '</span>';
                html += '<span class="review-item-rating">' + puzzle[3] + '</span>';
                html += '<div class="review-item-info">';
                html += '<span class="review-item-themes">' + themes + '</span>';
                html += '<span class="review-item-stats">' + attemptText + ' <span class="ui-ico ui-ico-dot" aria-hidden="true"></span> ' + time + '</span>';
                html += '</div></div>';
            });
            
            html += '</div>';
            container.innerHTML = html;
        }
        
        function renderReviewGrid(container: any, puzzle: any) {
            let html = '<div class="review-grid">';
            
            puzzle.forEach((item: any, index: any) => {
                const originalIndex = playedpuzzle.indexOf(item);
                const puzzle = item.puzzle;
                const statusClass = item.solved ? 'solved' : 'failed';
                const miniBoard = createMiniBoard(puzzle[1], puzzle[2]);
                const time = formatTime(item.timeSpent);
                const attemptsClass = item.solved ? 'solved' : 'failed';
                
                html += '<div class="review-grid-item ' + statusClass + '" onclick="openReviewDetail(' + originalIndex + ')">';
                html += miniBoard;
                html += '<div class="review-grid-info">';
                html += '<span>' + puzzle[3] + '</span>';
                html += '<span>' + time + '</span>';
                html += '<span class="review-grid-attempts ' + attemptsClass + '">' + item.attempts + '</span>';
                html += '</div></div>';
            });
            
            html += '</div>';
            container.innerHTML = html;
        }
        
        function createMiniBoard(fen: any, moves: any) {
            const tempGame = new Chess(fen);
            
            const setupColor = tempGame.turn();
            const playerColor = setupColor === 'w' ? 'b' : 'w';
            const isFlipped = playerColor === 'b';
            
            if (moves) {
                const moveList = moves.split(' ');
                if (moveList.length > 0) {
                    const firstUci = moveList[0];
                    tempGame.move({
                        from: firstUci.substring(0, 2),
                        to: firstUci.substring(2, 4),
                        promotion: firstUci.length > 4 ? firstUci[4] : undefined
                    });
                }
            }
            
            let html = '<div class="review-mini-board">';
            
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const actualRow = isFlipped ? 7 - row : row;
                    const actualCol = isFlipped ? 7 - col : col;
                    const file = 'abcdefgh'[actualCol];
                    const rank = 8 - actualRow;
                    const square = file + rank;
                    const colorClass = (actualRow + actualCol) % 2 === 0 ? 'light' : 'dark';
                    
                    const piece = tempGame.get(square);
                    let pieceHtml = '';
                    if (piece) {
                        const pieceKey = (piece.color === 'w' ? 'w' : 'b') + piece.type.toUpperCase();
                        pieceHtml = PIECE_SVG[pieceKey];
                    }
                    
                    html += '<div class="review-mini-square ' + colorClass + '">' + pieceHtml + '</div>';
                }
            }
            
            html += '</div>';
            return html;
        }
        
        function createListMiniBoard(fen: any) {
            const tempGame = new Chess(fen);
            let html = '<div class="review-list-mini-board">';
            
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const file = 'abcdefgh'[col];
                    const rank = 8 - row;
                    const square = file + rank;
                    const colorClass = (row + col) % 2 === 0 ? 'light' : 'dark';
                    
                    const piece = tempGame.get(square);
                    let pieceHtml = '';
                    if (piece) {
                        const pieceKey = (piece.color === 'w' ? 'w' : 'b') + piece.type.toUpperCase();
                        pieceHtml = PIECE_SVG[pieceKey];
                    }
                    
                    html += '<div class="mini-sq ' + colorClass + '">' + pieceHtml + '</div>';
                }
            }
            
            html += '</div>';
            return html;
        }
        
        function formatThemes(themesStr: any) {
            const themeList = themesStr.split(' ');
            const germanNames = [];
            const addedConsolidated = new Set();
            
            for (const theme of themeList) {
                const consolidatedKey = REVERSE_MATE_MAPPINGS[theme.toLowerCase()];
                if (consolidatedKey && !addedConsolidated.has(consolidatedKey)) {
                    for (const [category, catThemes] of Object.entries<any>(getPuzzleThemes())) {
                        if (catThemes[consolidatedKey]) {
                            germanNames.push(catThemes[consolidatedKey]);
                            addedConsolidated.add(consolidatedKey);
                            break;
                        }
                    }
                    continue;
                }
                if (consolidatedKey && addedConsolidated.has(consolidatedKey)) continue;
                
                let found = false;
                for (const [category, themes] of Object.entries<any>(getPuzzleThemes())) {
                    if (themes[theme]) {
                        germanNames.push(themes[theme]);
                        found = true;
                        break;
                    }
                }
            }
            
            return germanNames.length > 0 ? germanNames.join(', ') : '-';
        }
        
        function formatTime(seconds: any) {
            if (!seconds || seconds < 0) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return mins + ':' + (secs < 10 ? '0' : '') + secs;
        }
        
        function openReviewDetail(index: any) {
            reviewState.currentIndex = index;
            const item = playedpuzzle[index];
            const puzzle = item.puzzle;
            
            document.getElementById('review-detail-title').textContent = 'Puzzle #' + (index + 1);
            const statusEl = document.getElementById('review-detail-status');
            statusEl.innerHTML = item.solved ? t('reviewSolvedStatus') : t('reviewUnsolvedStatus');
            statusEl.className = 'review-detail-status ' + (item.solved ? 'solved' : 'failed');
            
            document.getElementById('review-detail-rating').textContent = puzzle[3];
            document.getElementById('review-detail-themes').textContent = formatThemes(puzzle[4]);
            document.getElementById('review-detail-attempts').textContent = item.attempts;
            document.getElementById('review-detail-time').textContent = formatTime(item.timeSpent);
            document.getElementById('review-lichess-link').href = 'https://lichess.org/training/' + puzzle[0];
            
            const [id, fen, moves, rating, themes] = puzzle;
            reviewState.game = new Chess(fen);
            reviewState.moves = moves.split(' ');
            reviewState.moveIndex = 0;
            reviewState.puzzleolved = false;
            reviewState.solutionVisible = false;
            reviewState.selectedSquare = null;
            reviewState.lastMoveFrom = null;
            reviewState.lastMoveTo = null;

            sfStop();
            reviewState.mode = 'solution';
            analysisState.game = null;
            analysisState.history = [];
            analysisState.index = -1;
            analysisState.selectedSquare = null;
            document.querySelectorAll('.review-mode-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('mode-btn-solution') && document.getElementById('mode-btn-solution').classList.add('active');
            document.getElementById('analysis-controls') && document.getElementById('analysis-controls').classList.add('hidden');
            document.getElementById('stockfish-panel') && document.getElementById('stockfish-panel').classList.add('hidden');
            document.getElementById('eval-bar') && document.getElementById('eval-bar').classList.add('hidden');
            document.getElementById('review-detail-board-section') && document.getElementById('review-detail-board-section').classList.remove('with-eval');

            const firstMove = reviewState.moves[0];
            reviewState.game.move({
                from: firstMove.substring(0, 2),
                to: firstMove.substring(2, 4),
                promotion: firstMove.length > 4 ? firstMove[4] : undefined
            });
            reviewState.moveIndex = 1;
            reviewState.lastMoveFrom = firstMove.substring(0, 2);
            reviewState.lastMoveTo = firstMove.substring(2, 4);
            
            const setupColor = new Chess(fen).turn();
            reviewState.playerColor = setupColor === 'w' ? 'b' : 'w';
            
            document.getElementById('review-solution').classList.add('hidden');
            
            renderReviewSolution(reviewState.moves.slice(1), fen);
            
            setReviewFeedback(t('findBestMove'), 'neutral');
            
            renderReviewBoard();
            updateReviewTurnIndicator();
            
            setupReviewBoardTouchHandlers();
            analysisTouch.setup();

            updateReviewNavButtons();
            
            document.getElementById('review-detail').classList.add('active');
        }
        
        function closeReviewDetail() {
            if (reviewState.playInterval) {
                clearInterval(reviewState.playInterval);
                reviewState.playInterval = null;
            }
            sfStop();
            document.getElementById('review-detail').classList.remove('active');
        }
        
        function setReviewFeedback(text: any, type: any) {
            const feedback = document.getElementById('review-feedback');
            feedback.innerHTML = text;
            feedback.className = 'review-feedback' + (text ? ' ' + type : '');
        }

        function clearReviewFeedback() {
            const feedback = document.getElementById('review-feedback');
            if (!feedback) return;
            feedback.innerHTML = '';
            feedback.className = 'review-feedback';
        }

        function updateAnalysisGameOverFeedback() {
            if (!analysisState.game) { clearReviewFeedback(); return; }
            if (analysisState.game.in_checkmate()) {
                setReviewFeedback(t('checkmateMsg'), 'solved');
            } else if (analysisState.game.in_draw() || analysisState.game.in_stalemate() ||
                       analysisState.game.in_threefold_repetition() ||
                       analysisState.game.insufficient_material()) {
                setReviewFeedback(t('drawMsg'), 'solved');
            } else {
                clearReviewFeedback();
            }
        }
        
        