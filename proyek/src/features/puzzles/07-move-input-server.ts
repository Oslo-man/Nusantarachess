/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
function makeUCIMove(uci: any) {
            const from = uci.substring(0, 2);
            const to = uci.substring(2, 4);
            const promotion = uci.length > 4 ? uci[4] : undefined;
            
            const move = game.move({
                from: from,
                to: to,
                promotion: promotion
            });
            
            if (move) {
                lastMoveFrom = from;
                lastMoveTo = to;
            }
            
            return move;
        }
        
        const PIECE_NAMES: any = {
            de: {
                'k\u00f6nig': 'k', 'k': 'k',
                'dame': 'q', 'd': 'q',
                'turm': 'r', 't': 'r',
                'l\u00e4ufer': 'b', 'l': 'b',
                'springer': 'n', 's': 'n',
                'bauer': 'p', 'b': 'b',
                'king': 'k', 'queen': 'q', 'q': 'q', 'rook': 'r', 'r': 'r',
                'bishop': 'b', 'knight': 'n', 'n': 'n', 'pawn': 'p', 'p': 'p'
            },
            en: {
                'king': 'k', 'k': 'k',
                'queen': 'q', 'q': 'q',
                'rook': 'r', 'r': 'r',
                'bishop': 'b', 'b': 'b',
                'knight': 'n', 'n': 'n',
                'pawn': 'p', 'p': 'p'
            }
        };
        
        function parseMoveInput(input: any) {
            if (!input || !gameActive || game.turn() !== playerColor) return null;
            
            let text = input.trim().toLowerCase();
            text = text.replace(currentLang === 'de' ? /schl\u00e4gt|takes|captures|x|:/g : /takes|captures|x|:/g, '');
            text = text.replace(/\s+/g, ' ').trim();

            if (text === 'o-o' || text === '0-0' || text === 'kurze rochade' || text === 'castle short' || text === 'castle' || text === 'kingside' || text === 'short') {
                return game.move('O-O');
            }
            if (text === 'o-o-o' || text === '0-0-0' || text === 'lange rochade' || text === 'castle long' || text === 'queenside' || text === 'long') {
                return game.move('O-O-O');
            }
            
            const uciMatch = text.match(/^([a-h][1-8])([a-h][1-8])([qrbn])?$/);
            if (uciMatch) {
                const move = game.move({
                    from: uciMatch[1],
                    to: uciMatch[2],
                    promotion: uciMatch[3]
                });
                if (move) {
                    lastMoveFrom = uciMatch[1];
                    lastMoveTo = uciMatch[2];
                    return move;
                }
            }
            
            const langformMatch = text.match(/^(\w+)\s+([a-h][1-8])([qrbn])?$/);
            if (langformMatch) {
                const pieceName = langformMatch[1];
                const targetSquare = langformMatch[2];
                const promotion = langformMatch[3];
                
                const pieceType = (PIECE_NAMES[currentLang] || PIECE_NAMES.en)[pieceName];
                if (pieceType) {
                    const moves = game.moves({ verbose: true });
                    const matchingMove = moves.find((m: any) => 
                        m.piece === pieceType && 
                        m.to === targetSquare
                    );
                    if (matchingMove) {
                        const move = game.move({
                            from: matchingMove.from,
                            to: matchingMove.to,
                            promotion: promotion || matchingMove.promotion
                        });
                        if (move) {
                            lastMoveFrom = matchingMove.from;
                            lastMoveTo = matchingMove.to;
                            return move;
                        }
                    }
                }
            }
            
            let san = input.trim();
            if (currentLang === 'de') {
                san = san.replace(/^D/i, 'Q');
                san = san.replace(/^T/i, 'R');
                san = san.replace(/^L/i, 'B');
                san = san.replace(/^S/i, 'N');
            }
            san = san.replace(/^K/i, 'K');
            san = san.replace(/[:]/g, 'x');
            
            try {
                const move = game.move(san, { sloppy: true });
                if (move) {
                    lastMoveFrom = move.from;
                    lastMoveTo = move.to;
                    return move;
                }
            } catch (e) {}
            
            const pawnMatch = text.match(/^([a-h][1-8])$/);
            if (pawnMatch) {
                const moves = game.moves({ verbose: true });
                const pawnMove = moves.find((m: any) => m.piece === 'p' && m.to === pawnMatch[1]);
                if (pawnMove) {
                    const move = game.move({
                        from: pawnMove.from,
                        to: pawnMove.to,
                        promotion: 'q'
                    });
                    if (move) {
                        lastMoveFrom = pawnMove.from;
                        lastMoveTo = pawnMove.to;
                        return move;
                    }
                }
            }
            
            return null;
        }
        
        function submitMoveInput() {
            const container = document.querySelector('.move-input-container');
            const input = document.getElementById('move-input');
            const text = input.value.trim();
            
            if (!text) {
                hideInputField();
                return;
            }
            
            const move = parseMoveInput(text);
            
            if (move) {
                hideInputField();
                selectedSquare = null;
                if (settings.soundMoves) {
                    initAudio();
                    lastMoveSoundTime = playMoveSound(move.piece, move.from, move.to, move.captured ? move.captured : null, {
                        flags: move.flags || '',
                        promotion: move.promotion,
                        isCheck: !!(move.san && (move.san.includes('+') || move.san.includes('#')))
                    });
                }
                renderBoard();
                checkPlayerMove(move);
            } else {
                input.classList.add('shake');
                setTimeout(() => input.classList.remove('shake'), ANIMATION.SHAKE_DURATION);
                setFeedback(t('invalidMoveWith') + text, 'wrong');
            }
        }
        
        function showInputField() {
            const container = document.querySelector('.move-input-container');
            const input = document.getElementById('move-input');
            container.classList.add('visible');
            input.focus();
        }
        
        function hideInputField() {
            const container = document.querySelector('.move-input-container');
            const input = document.getElementById('move-input');
            container.classList.remove('visible');
            input.value = '';
            input.blur();
        }
        
        document.addEventListener('keydown', function(e) {
            if (!gameActive) return;
            if (document.activeElement.tagName === 'SELECT') return;
            
            if (e.code === 'Space' && document.getElementById('skip-btn').style.display !== 'none') {
                e.preventDefault();
                skipPuzzle();
                return;
            }
            
            if (/^[a-zA-Z0-9]$/.test(e.key)) {
                showInputField();
            }
        });
        
        function setupMoveInputKeyHandlers() {
            const input = document.getElementById('move-input');
            if (input) {
                input.addEventListener('keydown', function(e: any) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        submitMoveInput();
                    }
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        hideInputField();
                    }
                });
            }
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupMoveInputKeyHandlers);
        } else {
            setupMoveInputKeyHandlers();
        }
        
        async function checkPlayerMove(move: any) {
            if (puzzleServerBusy || !puzzleSessionId) {
                game.undo();
                renderBoard();
                return;
            }
            puzzleServerBusy = true;

            const playerUCI = move.from + move.to + (move.promotion || '');
            clearHint();

            let resp;
            try {
                resp = await window.NusantaraChess.api.submitPuzzleMove(puzzleSessionId, move.from, move.to, move.promotion || null);
            } catch (e) {
                puzzleServerBusy = false;
                console.warn('Gagal menghubungi server untuk validasi langkah:', e);
                game.undo();
                renderBoard();
                return;
            }
            puzzleServerBusy = false;

            if (!resp.correct) {
                game.undo();
                lastMoveFrom = null;
                lastMoveTo = null;
                wrongMove(playerUCI);
                renderBoard();
                return;
            }

            moveIndex = resp.moveIndex;
            updateProgress();

            if (settings.bonusTime > 0 && settings.timeLimit > 0) {
                timeLeft += settings.bonusTime;
                updateTimerDisplay();
            }

            if (resp.solved) {
                try { game.load(resp.fen); } catch (e) {}
                puzzleolved();
            } else {
                if (gameActive) {
                    makeOpponentMove(resp.fen);
                }
            }
        }
        
        function makeOpponentMove(serverFen: any) {
            const beforeFen = game.fen();
            let afterGame;
            try {
                afterGame = new Chess(serverFen);
            } catch (e) {
                console.warn('FEN lawan dari server tidak valid:', serverFen);
                renderBoard();
                return;
            }

            const diff = diffBoardsForAnimation(beforeFen, serverFen);
            if (!diff) {
                game.load(serverFen);
                moveIndex++;
                renderBoard();
                setFeedback(t('yourMove'), 'neutral');
                updateProgress();
                return;
            }

            const piece = game.get(diff.from);
            if (!piece) {
                game.load(serverFen);
                moveIndex++;
                renderBoard();
                setFeedback(t('yourMove'), 'neutral');
                updateProgress();
                return;
            }
            const pieceKey = (piece.color === 'w' ? 'w' : 'b') + piece.type.toUpperCase();

            animateMove(diff.from, diff.to, pieceKey, () => {
                game.load(serverFen);
                moveIndex++;
                renderBoard();
                setFeedback(t('yourMove'), 'neutral');
                updateProgress();
            });
        }

        function diffBoardsForAnimation(beforeFen: any, afterFen: any) {
            try {
                const before = new Chess(beforeFen);
                const after = new Chess(afterFen);
                const squares = 'abcdefgh'.split('').flatMap(f => '12345678'.split('').map(r => f + r));
                let from = null, to = null, changedCount = 0;
                for (const sq of squares) {
                    const b = before.get(sq), a = after.get(sq);
                    const same = (!b && !a) || (b && a && b.type === a.type && b.color === a.color);
                    if (!same) {
                        changedCount++;
                        if (b && !a) from = sq;
                        if (a) to = sq;
                    }
                }
                if (changedCount !== 2 || !from || !to) return null;
                return { from, to };
            } catch (e) {
                return null;
            }
        }
        
        function updateProgress() {
            const playerMoves = Math.ceil((puzzleMoves.length - 1) / 2);
            const completedPlayerMoves = Math.ceil((moveIndex - 1) / 2);
            const progress = playerMoves > 0 ? (completedPlayerMoves / playerMoves) * 100 : 0;
            document.getElementById('progress-fill').style.width = progress + '%';
        }
        
        function countPieces(fen: any) {
            const board = fen.split(' ')[0];
            return board.replace(/[^a-zA-Z]/g, '').length;
        }

        