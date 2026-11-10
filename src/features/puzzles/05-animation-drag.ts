/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
function getAnimationDuration() {
            const stappenLevels = (settings.themeFilter || []).filter((t: any) => t.startsWith('stufe'));
            
            if (stappenLevels.length > 0) {
                const highestLevel = stappenLevels.sort().pop();
                switch (highestLevel) {
                    case 'stufe1': return 500;
                    case 'stufe2': return 400;
                    case 'stufe3': return 350;
                    case 'stufe4': return 250;
                    case 'stufe5': return 100;
                    default: return 300;
                }
            }
            
            if (settings.timeLimit === 0) {
                return 300;
            }
            
            return 100;
        }
        

        function animateMoveGeneric(boardId: any, isFlipped: any, duration: any, from: any, to: any, pieceKey: any, callback: any) {
            const board = document.getElementById(boardId);
            if (!board) {
                if (callback) callback();
                return;
            }
            
            const boardRect = board.getBoundingClientRect();
            const squareSize = boardRect.width / 8;
            
            function getSquarePosition(square: any) {
                const fileIndex = square.charCodeAt(0) - 97;
                const rankIndex = parseInt(square[1]) - 1;
                const col = isFlipped ? 7 - fileIndex : fileIndex;
                const row = isFlipped ? rankIndex : 7 - rankIndex;
                return {
                    left: boardRect.left + col * squareSize,
                    top: boardRect.top + row * squareSize
                };
            }
            
            const fromPos = getSquarePosition(from);
            const toPos = getSquarePosition(to);
            const pieceSize = squareSize * PIECE_SCALE;
            const offset = (squareSize - pieceSize) / 2;
            
            const animEl = document.createElement('div');
            animEl.className = 'animated-piece';
            animEl.innerHTML = PIECE_SVG[pieceKey];
            animEl.style.width = pieceSize + 'px';
            animEl.style.height = pieceSize + 'px';
            animEl.style.left = (fromPos.left + offset) + 'px';
            animEl.style.top = (fromPos.top + offset) + 'px';
            animEl.style.transitionDuration = duration + 'ms';
            
            document.body.appendChild(animEl);
            
            const fromSquareEl = board.querySelector('[data-square="' + from + '"]');
            if (fromSquareEl) {
                const pieceSvg = fromSquareEl.querySelector('svg, img');
                if (pieceSvg) pieceSvg.style.visibility = 'hidden';
            }
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    animEl.style.left = (toPos.left + offset) + 'px';
                    animEl.style.top = (toPos.top + offset) + 'px';
                });
            });
            
            setTimeout(() => {
                animEl.remove();
                if (callback) callback();
            }, duration + 10);
        }

        function animateMove(from: any, to: any, pieceKey: any, callback: any) {
            animateMoveGeneric('board', playerColor === 'b', settings.animationDuration, from, to, pieceKey, callback);
        }
        
        function animateReviewMove(from: any, to: any, pieceKey: any, callback: any) {
            animateMoveGeneric('review-board', reviewState.playerColor === 'b', ANIMATION.REVIEW_DURATION, from, to, pieceKey, callback);
        }

        function renderBoardGeneric(cfg: any) {
            const board = document.getElementById(cfg.boardId);
            board.innerHTML = '';
            
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const actualRow = cfg.isFlipped ? 7 - row : row;
                    const actualCol = cfg.isFlipped ? 7 - col : col;
                    const file = 'abcdefgh'[actualCol];
                    const rank = 8 - actualRow;
                    const square = file + rank;
                    
                    const div = document.createElement('div');
                    div.className = 'square ' + ((actualRow + actualCol) % 2 === 0 ? 'light' : 'dark');
                    div.dataset.square = square;
                    
                    if (square === cfg.lastMoveFrom || square === cfg.lastMoveTo) {
                        div.classList.add('last-move');
                    }
                    
                    if (cfg.selectedSquare === square) {
                        div.classList.add('selected');
                    }
                    
                    if (cfg.showValidMoves && cfg.selectedSquare) {
                        const moves = cfg.chessGame.moves({ square: cfg.selectedSquare, verbose: true });
                        const move = moves.find((m: any) => m.to === square);
                        if (move) {
                            div.classList.add(move.captured ? 'valid-capture' : 'valid-move');
                        }
                    }
                    
                    const piece = cfg.chessGame.get(square);
                    if (piece) {
                        const pieceKey = (piece.color === 'w' ? 'w' : 'b') + piece.type.toUpperCase();
                        div.innerHTML = PIECE_SVG[pieceKey];
                        const svg = div.querySelector('svg, img');
                        if (svg) svg.classList.add('piece');
                        
                        if (cfg.canInteract && piece.color === cfg.playerColor) {
                            div.style.cursor = 'grab';
                            div.addEventListener('mousedown', (e) => cfg.onDragStart(e, square));
                        }
                    }
                    
                    if (col === 7) {
                        const rankCoord: any = document.createElement('span');
                        rankCoord.className = 'coord-rank';
                        rankCoord.textContent = rank;
                        div.appendChild(rankCoord);
                    }
                    if (row === 7) {
                        const fileCoord = document.createElement('span');
                        fileCoord.className = 'coord-file';
                        fileCoord.textContent = file;
                        div.appendChild(fileCoord);
                    }
                    
                    div.addEventListener('click', (e) => cfg.onSquareClick(square, e));
                    
                    if (cfg.hintSquare === square) {
                        div.classList.add('hint-square');
                    }
                    
                    board.appendChild(div);
                }
            }
        }

        function createMouseDragHandler(cfg: any) {
            let _draggedFrom: any = null;
            let _dragElement: any = null;
            let _isDragging = false;
            
            function start(e: any, square: any) {
                if (!cfg.getCanInteract()) return;
                
                const piece = cfg.chessGame().get(square);
                if (!piece || piece.color !== cfg.getPlayerColor()) return;
                
                if (cfg.getSelectedSquare && cfg.getSelectedSquare() === square) {
                    e.preventDefault();
                    cfg.setSelectedSquare(null);
                    cfg.renderFn();
                    return;
                }
                
                e.preventDefault();
                _draggedFrom = square;
                cfg.setSelectedSquare(square);
                
                const pieceKey = (piece.color === 'w' ? 'w' : 'b') + piece.type.toUpperCase();
                const board = document.getElementById(cfg.boardId);
                const squareSize = board ? board.getBoundingClientRect().width / 8 : 60;
                const dragSize = Math.round(squareSize * DRAG_SCALE);
                
                _dragElement = document.createElement('div');
                _dragElement.innerHTML = PIECE_SVG[pieceKey];
                _dragElement.style.cssText =
                    'position:fixed;pointer-events:none;z-index:1000;opacity:0.9;' +
                    'transform:translate(-50%,-50%);' +
                    'width:' + dragSize + 'px;height:' + dragSize + 'px;' +
                    'left:' + e.clientX + 'px;top:' + e.clientY + 'px;';
                document.body.appendChild(_dragElement);
                
                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', end);
                
                cfg.renderFn();
            }
            
            function move(e: any) {
                if (!_dragElement) return;
                _isDragging = true;
                _dragElement.style.left = e.clientX + 'px';
                _dragElement.style.top = e.clientY + 'px';
            }
            
            function end(e: any) {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', end);
                
                if (_dragElement) {
                    _dragElement.remove();
                    _dragElement = null;
                }
                
                if (!_draggedFrom) {
                    _isDragging = false;
                    return;
                }
                
                const targetElement = document.elementFromPoint(e.clientX, e.clientY);
                const targetSquareEl: any = targetElement?.closest('.square');
                const targetSquare = targetSquareEl?.dataset.square;
                
                if (_isDragging && targetSquare && _draggedFrom !== targetSquare) {
                    const from = _draggedFrom;
                    _draggedFrom = null;
                    const result = cfg.onMoveAttempt(from, targetSquare, e.clientX, e.clientY);
                    if (result) {
                        _isDragging = false;
                        return;
                    }
                }
                
                if (!_isDragging) {
                    _draggedFrom = null;
                    return;
                }
                
                cfg.setSelectedSquare(null);
                _draggedFrom = null;
                _isDragging = false;
                cfg.renderFn();
            }
            
            return {
                start,
                isDragging: () => _isDragging,
                resetDrag: () => { _isDragging = false; },
                cleanup: () => {
                    const existingDrag = document.getElementById('drag-piece');
                    if (existingDrag) existingDrag.remove();
                    if (_dragElement) { _dragElement.remove(); _dragElement = null; }
                    _draggedFrom = null;
                    _isDragging = false;
                }
            };
        }

        function createTouchHandler(cfg: any) {
            let _draggedFrom: any = null;
            let _dragElement: any = null;
            let _isDragging = false;
            let _touchStartSquare = null;
            const transformY = cfg.touchTransformY || '-80%';
            
            function getSquareFromTouch(touch: any) {
                const el = document.elementFromPoint(touch.clientX, touch.clientY);
                const squareEl: any = el?.closest('.square');
                return squareEl?.dataset.square || null;
            }
            
            function onTouchStart(e: any) {
                if (!cfg.getCanInteract()) return;
                
                const touch = e.touches[0];
                const square = getSquareFromTouch(touch);
                if (!square) return;
                
                const chessGame = cfg.chessGame();
                const playerCol = cfg.getPlayerColor();
                const piece = chessGame.get(square);
                const isOwnPiece = piece && piece.color === playerCol;
                
                if (cfg.getSelectedSquare() && cfg.getSelectedSquare() !== square) {
                    e.preventDefault();
                    const result = cfg.onMoveAttempt(cfg.getSelectedSquare(), square, touch.clientX, touch.clientY);
                    if (result) {
                        _touchStartSquare = null;
                        return;
                    }
                    if (!isOwnPiece) {
                        cfg.setSelectedSquare(null);
                        _touchStartSquare = null;
                        cfg.renderFn();
                        return;
                    }
                }
                
                if (isOwnPiece) {
                    e.preventDefault();
                    
                    if (cfg.getSelectedSquare() === square) {
                        cfg.setSelectedSquare(null);
                        _touchStartSquare = null;
                        _draggedFrom = null;
                        cfg.renderFn();
                        return;
                    }
                    
                    _touchStartSquare = square;
                    cfg.setSelectedSquare(square);
                    _draggedFrom = square;
                    _isDragging = false;
                    
                    const pieceKey = (piece.color === 'w' ? 'w' : 'b') + piece.type.toUpperCase();
                    const board = document.getElementById(cfg.boardId);
                    const squareSize = board ? board.getBoundingClientRect().width / 8 : 60;
                    const dragSize = Math.round(squareSize * DRAG_SCALE);
                    
                    if (_dragElement) _dragElement.remove();
                    _dragElement = document.createElement('div');
                    _dragElement.id = 'drag-piece';
                    _dragElement.innerHTML = PIECE_SVG[pieceKey];
                    _dragElement.style.cssText =
                        'position:fixed;pointer-events:none;z-index:1000;opacity:0.9;' +
                        'transform:translate(-50%,' + transformY + ');' +
                        'width:' + dragSize + 'px;height:' + dragSize + 'px;' +
                        'left:' + touch.clientX + 'px;top:' + touch.clientY + 'px;';
                    document.body.appendChild(_dragElement);
                    
                    const boardEl = document.getElementById(cfg.boardId);
                    boardEl.querySelectorAll('.square.selected').forEach((el: any) => el.classList.remove('selected'));
                    const squareEl = boardEl.querySelector('.square[data-square="' + square + '"]');
                    if (squareEl) squareEl.classList.add('selected');
                }
            }
            
            function onTouchMove(e: any) {
                if (!_dragElement || !_draggedFrom) return;
                e.preventDefault();
                _isDragging = true;
                const touch = e.touches[0];
                _dragElement.style.left = touch.clientX + 'px';
                _dragElement.style.top = touch.clientY + 'px';
            }
            
            function onTouchEnd(e: any) {
                if (!_draggedFrom) return;
                e.preventDefault();
                
                const touch = e.changedTouches[0];
                const targetSquare = getSquareFromTouch(touch);
                const fromSquare = _draggedFrom;
                const wasDragging = _isDragging;
                
                if (_dragElement) { _dragElement.remove(); _dragElement = null; }
                _draggedFrom = null;
                _isDragging = false;
                
                if (wasDragging && targetSquare && targetSquare !== fromSquare) {
                    const result = cfg.onMoveAttempt(fromSquare, targetSquare, touch.clientX, touch.clientY);
                    if (result) {
                        _touchStartSquare = null;
                        return;
                    }
                }
                
                _touchStartSquare = null;
                cfg.renderFn();
            }
            
            function onTouchCancel(e: any) {
                if (_dragElement) { _dragElement.remove(); _dragElement = null; }
                _draggedFrom = null;
                _isDragging = false;
                _touchStartSquare = null;
                cfg.setSelectedSquare(null);
                cfg.renderFn();
            }
            
            function setup() {
                const board = document.getElementById(cfg.boardId);
                if (!board) return;
                board.addEventListener('touchstart', onTouchStart, { passive: false });
                board.addEventListener('touchmove', onTouchMove, { passive: false });
                board.addEventListener('touchend', onTouchEnd, { passive: false });
                board.addEventListener('touchcancel', onTouchCancel, { passive: false });
            }
            
            return { setup, isDragging: () => _isDragging, resetDrag: () => { _isDragging = false; } };
        }

        