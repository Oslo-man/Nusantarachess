/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
function initDailyCard() {
            const now = new Date();
            const dateStr = now.toLocaleDateString(({ de: 'de-DE', id: 'id-ID', hi: 'hi-IN', fil: 'fil-PH' } as any)[currentLang] || 'en-US', { day: 'numeric', month: 'short' });
            document.getElementById('daily-link-text').textContent = 
                ' \u00b7 ' + dateStr;
        }
        
        async function startDailyPuzzle() {
            sfTerminate();

            let resp;
            try {
                resp = await window.NusantaraChess.api.dailyPuzzle();
            } catch (e) {
                console.warn('Gagal memuat puzzle harian dari server:', e);
                showTemporaryAlert(t('errorLoadingpuzzle'));
                return;
            }

            dailyMode = true;
            dailyPuzzleId = resp.puzzleId;
            puzzleSessionId = resp.sessionId;
            
            settings.timeLimit = 0;
            settings.maxErrors = 0;
            settings.startRating = resp.rating;
            settings.ratingIncrease = 0;
            settings.currentRating = resp.rating;
            settings.soundMoves = document.getElementById('sound-moves-cb').checked;
            settings.soundEffects = document.getElementById('sound-effects-cb').checked;
            settings.tipstemas = document.getElementById('tips-temas-cb').checked;
            settings.tipsPiece = document.getElementById('tips-piece-cb').checked;
            settings.showRating = document.getElementById('show-rating').value === '1';
            settings.errorBehavior = 'retry';
            settings.bonusTime = 0;
            settings.colorChoice = 'mixed';
            settings.themeFilter = [];
            settings.themeMatchAll = false;
            settings.pieceCountMin = 3;
            settings.pieceCountMax = 32;
            settings.animationDuration = getAnimationDuration();

            if (settings.soundMoves || settings.soundEffects) {
                initAudio();
            }

            solved = 0;
            errors = 0;
            timeLeft = 0;
            gameActive = true;
            selectedSquare = null;
            lastMoveFrom = null;
            lastMoveTo = null;
            usedpuzzle.clear();
            cleanupDrag();
            
            playedpuzzle = [];
            performanceResults = [];
            currentpuzzletartTime = 0;
            currentPuzzleAttempts = 0;
            currentPuzzleWrongMoves = [];
            currentPuzzleUniqueErrors.clear();
            currentPuzzleUsedThemeHint = false;
            currentPuzzleUsedPieceHint = false;
            
            document.getElementById('setup-screen').classList.remove('active');
            document.getElementById('game-screen').classList.add('active');
            
            document.getElementById('solved').textContent = '0';
            document.getElementById('errors').innerHTML = '0/' + '<span class="ui-ico ui-ico-infinity" aria-hidden="true"></span>';
            document.getElementById('current-rating').textContent = resp.rating;
            document.getElementById('timer').innerHTML = '<span class="ui-ico ui-ico-infinity" aria-hidden="true"></span>';
            document.getElementById('skip-btn').style.display = 'none';

            const ratingBox = document.getElementById('current-rating').closest('.stat-box');
            if (ratingBox) ratingBox.style.display = settings.showRating ? '' : 'none';

            document.getElementById('help-themes-btn').style.display = settings.tipstemas ? '' : 'none';
            document.getElementById('help-piece-btn').style.display = settings.tipsPiece ? '' : 'none';
            
            applyDailyPuzzleResponse(resp);
        }
        
        function applyDailyPuzzleResponse(resp: any) {
            currentpuzzletartTime = Date.now();
            currentPuzzleAttempts = 0;
            currentPuzzleWrongMoves = [];
            currentPuzzleUniqueErrors.clear();
            currentPuzzleUsedThemeHint = false;
            currentPuzzleUsedPieceHint = false;
            document.getElementById('skip-btn').style.display = 'none';
            document.querySelector('.move-input-container').classList.remove('visible');
            document.getElementById('move-input').value = '';
            clearHint();
            
            currentPuzzle = [resp.puzzleId, resp.fen, '', resp.rating, resp.themes];
            usedpuzzle.add(resp.puzzleId);

            puzzleMoves = new Array(resp.totalMoves).fill('');
            moveIndex = 1;
            playerColor = resp.playerColor;
            
            try {
                game = new Chess(resp.fen);
            } catch (e) {
                showTemporaryAlert(t('invalidPosition'));
                return;
            }
            
            renderBoard();
            
            document.getElementById('current-rating').textContent = resp.rating;
            setFeedback(t('findBestMove'), 'neutral');
            updateProgress();
        }
        
        function showDailyResult(wasSolved: any) {
            const timeSpent = playedpuzzle.length > 0 ? playedpuzzle[0].timeSpent : 0;
            const attempts = playedpuzzle.length > 0 ? playedpuzzle[0].attempts : 0;
            const puzzle = currentPuzzle;
            
            const resultEl = document.getElementById('daily-result');
            const rating = puzzle[3];
            const themes = formatThemes(puzzle[4]);
            
            let emoji = wasSolved ? '<span class="ui-ico ui-ico-check" aria-hidden="true"></span>' : '<span class="ui-ico ui-ico-close" aria-hidden="true"></span>';
            let title = wasSolved ? t('dailySolved') : t('dailyUnsolved');
            let titleColor = wasSolved ? 'var(--accent-green)' : 'var(--accent-red)';
            
            let starsHtml = '';
            if (wasSolved) {
                const wrongCount = attempts - 1;
                const stars = wrongCount === 0 ? 3 : wrongCount <= 2 ? 2 : 1;
                starsHtml = '<div style="font-size:2rem;margin:8px 0;">' + 
                    '<span class="ui-ico ui-ico-star" aria-hidden="true"></span>'.repeat(stars) + '<span class="ui-ico ui-ico-star-empty" aria-hidden="true"></span>'.repeat(3 - stars) + '</div>';
            }
            
            document.getElementById('daily-result-content').innerHTML = `
                <div style="font-size:3rem;margin-bottom:4px;">${emoji}</div>
                <h2 style="color:${titleColor};margin-bottom:8px;">${title}</h2>
                ${starsHtml}
                <div style="color:var(--text-secondary);margin:12px 0;">
                    Rating: <strong>${rating}</strong><br>
                    ${t('dailyThemes')}${themes}<br>
                    ${wasSolved ? t('dailyTime') + formatTime(timeSpent) + '<br>' : ''}
                    ${attempts > 1 ? t('dailyMistakes') + (attempts - 1) : t('dailyFirstTry')}
                </div>
            `;
            
            document.getElementById('game-screen').classList.remove('active');
            resultEl.classList.add('active');
        }

        function setupDailyCardOnLoad() {
            applyLanguage();
            initDailyCard();
        }
        var __setupDailyCardPending = true;
        
        function setFeedback(text: any, type: any) {
            const feedback = document.getElementById('feedback');
            feedback.innerHTML = text;
            feedback.className = 'feedback ' + type;
        }
        
        function showTemporaryAlert(message: any) {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            `;
            
            const box = document.createElement('div');
            box.style.cssText = `
                background: var(--bg-panel);
                padding: 24px 32px;
                border-radius: 8px;
                text-align: center;
                font-size: 1.1rem;
                color: var(--text-primary);
                max-width: 80%;
            `;
            box.textContent = message;
            
            overlay.appendChild(box);
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', () => overlay.remove());
            
            setTimeout(() => {
                if (overlay.parentNode) overlay.remove();
            }, ANIMATION.ALERT_AUTO_CLOSE);
        }
        
        
        