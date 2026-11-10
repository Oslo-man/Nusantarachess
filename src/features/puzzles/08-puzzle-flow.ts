/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
async function loadNextPuzzle(skipRetries = 0) {
            if (skipRetries > 10) {
                console.error('Too many invalid puzzle, stopping');
                showTemporaryAlert(t('errorLoadingpuzzle'));
                endGame();
                return false;
            }
            document.getElementById('skip-btn').style.display = 'none';
            document.querySelector('.move-input-container').classList.remove('visible');
            document.getElementById('move-input').value = '';
            clearHint();
            
            currentpuzzletartTime = Date.now();
            currentPuzzleAttempts = 0;
            currentPuzzleWrongMoves = [];
            currentPuzzleUniqueErrors.clear();
            currentPuzzleUsedThemeHint = false;
            currentPuzzleUsedPieceHint = false;

            const colorPref = settings.colorChoice === 'random' ? settings._randomColor : settings.colorChoice;
            let resp;
            try {
                resp = await window.NusantaraChess.api.nextPuzzle({
                    themeFilter: settings.themeFilter || [],
                    themeMatchAll: settings.themeMatchAll || false,
                    colorChoice: (colorPref === 'white' || colorPref === 'black') ? colorPref : 'mixed',
                    pieceCountMin: settings.pieceCountMin,
                    pieceCountMax: settings.pieceCountMax,
                    currentRating: settings.currentRating,
                    ratingIncrease: settings.ratingIncrease
                });
            } catch (e) {
                if (e && e.message === 'no-match-for-filter') {
                    showTemporaryAlert(t('nopuzzleForFilter'));
                    return false;
                }
                if (e && e.message === 'all-played') {
                    gameActive = false;
                    showTemporaryAlert(t('allpuzzlePlayed'));
                    setTimeout(() => endGame(), ANIMATION.END_GAME_DELAY);
                    return false;
                }
                console.warn('Gagal memuat puzzle dari server:', e);
                showTemporaryAlert(t('errorLoadingpuzzle'));
                return false;
            }

            puzzleSessionId = resp.sessionId;
            currentPuzzle = [resp.puzzleId, resp.fen, '', resp.rating, resp.themes];
            usedpuzzle.add(resp.puzzleId);

            puzzleMoves = new Array(resp.totalMoves).fill('');
            moveIndex = 1;
            playerColor = resp.playerColor;

            try {
                game = new Chess(resp.fen);
            } catch (e) {
                console.warn('Server mengembalikan FEN tidak valid:', resp.fen);
                return loadNextPuzzle(skipRetries + 1);
            }

            renderBoard();
            document.getElementById('current-rating').textContent = resp.rating;
            setFeedback(t('findBestMove'), 'neutral');
            updateProgress();
            
            return true;
        }
        
        function puzzleolved() {
            const timeSpent = (Date.now() - currentpuzzletartTime) / 1000;
            playedpuzzle.push({
                puzzle: currentPuzzle,
                solved: true,
                attempts: currentPuzzleAttempts + 1,
                timeSpent: timeSpent,
                wrongMoves: [...currentPuzzleWrongMoves]
            });
            
            recordPuzzlePerformance(currentPuzzle[3], true, timeSpent, currentPuzzleAttempts);
            
            solved++;
            document.getElementById('solved').textContent = solved;
            document.getElementById('solved').classList.add('pulse');
            setTimeout(() => document.getElementById('solved').classList.remove('pulse'), ANIMATION.PULSE_DURATION);
            
            setFeedback(t('solvedMsg'), 'correct');
            playSolvedSound(lastMoveSoundTime);

            if (dailyMode) {
                gameActive = false;
                setTimeout(() => showDailyResult(true), 1200);
                return;
            }
            
            settings.currentRating += settings.ratingIncrease;
            
            if (gameActive) {
                loadNextPuzzle();
            }
        }
        
        function wrongMove(playerUCI: any) {
            currentPuzzleAttempts++;
            currentPuzzleWrongMoves.push({
                expected: puzzleMoves[moveIndex],
                moveIndex: moveIndex
            });
            
            if (!currentPuzzleUniqueErrors.has(playerUCI)) {
                currentPuzzleUniqueErrors.add(playerUCI);
                errors++;
                const maxErrors = settings.maxErrors === 0 ? '<span class="ui-ico ui-ico-infinity" aria-hidden="true"></span>' : settings.maxErrors;
                document.getElementById('errors').innerHTML = errors + '/' + maxErrors;
                
                if (settings.maxErrors > 0 && errors >= settings.maxErrors) {
                    playWrongSound(lastMoveSoundTime);
                    endGame();
                    return;
                }
            }
            
            playWrongSound(lastMoveSoundTime);

            setFeedback(t('wrongMsg'), 'wrong');
            document.querySelector('.board').classList.add('shake');
            setTimeout(() => document.querySelector('.board').classList.remove('shake'), ANIMATION.SHAKE_DURATION);

            if (settings.errorBehavior === 'next' && !dailyMode) {
                setTimeout(() => {
                    if (gameActive) skipPuzzle();
                }, ANIMATION.SHAKE_DURATION + 300);
            } else {
                setFeedback(t('wrongTryAgainMsg'), 'wrong');
                document.getElementById('skip-btn').style.display = 'block';
            }
        }
        
        function skipPuzzle() {
            const timeSpent = (Date.now() - currentpuzzletartTime) / 1000;
            playedpuzzle.push({
                puzzle: currentPuzzle,
                solved: false,
                attempts: currentPuzzleAttempts,
                timeSpent: timeSpent,
                wrongMoves: [...currentPuzzleWrongMoves]
            });
            
            recordPuzzlePerformance(currentPuzzle[3], false, timeSpent, currentPuzzleAttempts);
            
            if (dailyMode) {
                gameActive = false;
                document.getElementById('skip-btn').style.display = 'none';
                showDailyResult(false);
                return;
            }
            
            document.getElementById('skip-btn').style.display = 'none';
            loadNextPuzzle();
        }

        function toggleCustomInput(type: any) {
            const selectId = ({
                'time': 'time-limit',
                'errors': 'max-errors',
                'rating': 'start-rating',
                'increase': 'rating-increase',
                'bonus': 'bonus-time'
            } as any)[type];

            const select = document.getElementById(selectId);
            const customDiv = document.getElementById(type + '-custom');

            if (select.value === 'custom') {
                customDiv.style.display = 'flex';
            } else {
                customDiv.style.display = 'none';
            }
        }

        function toggleExtendedSettings() {
            const btn = document.querySelector('.extended-toggle');
            const content = document.getElementById('extended-content');
            btn.classList.toggle('open');
            content.classList.toggle('open');
        }

        async function startGame() {
            sfTerminate();
            const timeSelect = document.getElementById('time-limit');
            if (timeSelect.value === 'custom') {
                const mins = parseInt(document.getElementById('time-custom-value').value) || 5;
                settings.timeLimit = Math.min(999, Math.max(1, mins)) * 60;
            } else {
                settings.timeLimit = parseInt(timeSelect.value);
            }
            
            const errorsSelect = document.getElementById('max-errors');
            if (errorsSelect.value === 'custom') {
                const errs = parseInt(document.getElementById('errors-custom-value').value) || 3;
                settings.maxErrors = Math.min(99, Math.max(1, errs));
            } else {
                settings.maxErrors = parseInt(errorsSelect.value);
            }
            
            const ratingSelect = document.getElementById('start-rating');
            if (ratingSelect.value === 'custom') {
                const rat = parseInt(document.getElementById('rating-custom-value').value) || 1400;
                settings.startRating = Math.min(3200, Math.max(0, rat));
            } else {
                settings.startRating = parseInt(ratingSelect.value);
            }
            
            const increaseSelect = document.getElementById('rating-increase');
            if (increaseSelect.value === 'custom') {
                const inc = parseInt(document.getElementById('increase-custom-value').value) || 15;
                settings.ratingIncrease = Math.min(1000, Math.max(0, inc));
            } else {
                settings.ratingIncrease = parseInt(increaseSelect.value);
            }
            
            settings.currentRating = settings.startRating;

            settings.soundMoves = document.getElementById('sound-moves-cb').checked;
            settings.soundEffects = document.getElementById('sound-effects-cb').checked;

            const bonusSelect = document.getElementById('bonus-time');
            if (bonusSelect.value === 'custom') {
                settings.bonusTime = Math.min(60, Math.max(0, parseInt(document.getElementById('bonus-custom-value').value) || 0));
            } else {
                settings.bonusTime = parseInt(bonusSelect.value) || 0;
            }

            settings.errorBehavior = document.getElementById('error-behavior').value;

            settings.tipstemas = document.getElementById('tips-temas-cb').checked;
            settings.tipsPiece = document.getElementById('tips-piece-cb').checked;

            settings.colorChoice = document.getElementById('color-choice').value;

            if (settings.colorChoice === 'random') {
                settings._randomColor = Math.random() < 0.5 ? 'white' : 'black';
            }

            settings.showRating = document.getElementById('show-rating').value === '1';

            settings.pieceCountMin = parseInt(document.getElementById('piece-count-min').value);
            settings.pieceCountMax = parseInt(document.getElementById('piece-count-max').value);

            const checkedThemes = Array.from(document.querySelectorAll('.theme-checkbox:checked'))
                .map(cb => cb.value);
            settings.themeFilter = checkedThemes;
            settings.themeMatchAll = document.querySelector('input[name="theme-match"]:checked').value === 'all';

            const stappenLevels = checkedThemes.filter(t => t.startsWith('stufe'));
            if (stappenLevels.length > 0) {
                const highestLevel = stappenLevels.sort().pop();
                const [minRating, ] = STUFEN_RATINGS[highestLevel];
                settings.currentRating = minRating;
            }

            settings.animationDuration = getAnimationDuration();

            saveSettings();

            if (settings.soundMoves || settings.soundEffects) {
                initAudio();
            }
            
            solved = 0;
            errors = 0;
            timeLeft = settings.timeLimit;
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
            document.getElementById('skip-btn').style.display = 'none';
            
            document.getElementById('solved').textContent = '0';
            const maxErrors = settings.maxErrors === 0 ? '<span class="ui-ico ui-ico-infinity" aria-hidden="true"></span>' : settings.maxErrors;
            document.getElementById('errors').innerHTML = '0/' + maxErrors;
            document.getElementById('current-rating').textContent = settings.currentRating;
            updateTimerDisplay();

            const ratingBox = document.getElementById('current-rating').closest('.stat-box');
            if (ratingBox) ratingBox.style.display = settings.showRating ? '' : 'none';

            document.getElementById('help-themes-btn').style.display = settings.tipstemas ? '' : 'none';
            document.getElementById('help-piece-btn').style.display = settings.tipsPiece ? '' : 'none';
            
            document.getElementById('setup-screen').classList.remove('active');
            document.getElementById('game-screen').classList.add('active');
            
            if (settings.timeLimit > 0) {
                timerInterval = setInterval(updateTimer, 1000);
            } else {
                document.getElementById('timer').innerHTML = '<span class="ui-ico ui-ico-infinity" aria-hidden="true"></span>';
            }
            
            const puzzleLoaded = await loadNextPuzzle();
            if (!puzzleLoaded) {
                gameActive = false;
                if (timerInterval) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                }
                document.getElementById('game-screen').classList.remove('active');
                document.getElementById('setup-screen').classList.add('active');
            }
        }
        
        function updateTimer() {
            if (!gameActive) return;
            
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                playTimeUpSound();
                endGame();
            }
        }
        
        function updateTimerDisplay() {
            const timerEl = document.getElementById('timer');
            
            if (settings.timeLimit === 0) {
                timerEl.innerHTML = '<span class="ui-ico ui-ico-infinity" aria-hidden="true"></span>';
                return;
            }
            
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerEl.textContent = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
            
            timerEl.classList.remove('countdown-warning', 'countdown-critical');
            
            if (timeLeft <= TIMER_THRESHOLDS.CRITICAL) {
                timerEl.style.color = 'var(--accent-red)';
                timerEl.classList.add('countdown-critical');
            } else if (timeLeft <= TIMER_THRESHOLDS.WARNING) {
                timerEl.style.color = 'var(--accent-warning)';
                timerEl.classList.add('countdown-warning');
            } else {
                timerEl.style.color = 'var(--accent-red-id)';
            }
        }
        
        function endGame() {
            gameActive = false;
            cleanupDrag();
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            
            if (currentPuzzle && currentpuzzletartTime > 0) {
                const timeSpent = (Date.now() - currentpuzzletartTime) / 1000;
                playedpuzzle.push({
                    puzzle: currentPuzzle,
                    solved: false,
                    attempts: currentPuzzleAttempts,
                    timeSpent: timeSpent,
                    wrongMoves: [...currentPuzzleWrongMoves]
                });
                recordPuzzlePerformance(currentPuzzle[3], false, timeSpent, currentPuzzleAttempts);
                currentpuzzletartTime = 0;
            }
            
            document.getElementById('final-score').textContent = solved;
            
            const perfRating = calculatePerformanceRating();
            let statsHtml = t('puzzleSolved') + '<br>' +
                '<span style="font-size: 0.9em;">' + t('highestRating') + Math.round(settings.currentRating) + '</span>';
            if (perfRating !== null && performanceResults.length >= 3) {
                statsHtml += '<br><span style="font-size: 0.9em; color: var(--accent-red-id);">Performance Rating: ~' + perfRating + '</span>';
            }
            document.getElementById('stats-summary').innerHTML = statsHtml;
            
            renderHighscoreComparison();
            
            document.getElementById('game-over').classList.add('active');
        }
        
        function resetGame() {
            document.getElementById('game-over').classList.remove('active');
            document.getElementById('review-screen').classList.remove('active');
            document.getElementById('review-detail').classList.remove('active');
            document.getElementById('daily-result').classList.remove('active');
            if (dailyMode) { startDailyPuzzle(); } else { startGame(); }
        }
        
        function backToSettings() {
            sfTerminate();
            document.getElementById('game-over').classList.remove('active');
            document.getElementById('review-screen').classList.remove('active');
            document.getElementById('review-detail').classList.remove('active');
            document.getElementById('game-screen').classList.remove('active');
            document.getElementById('daily-result').classList.remove('active');
            document.getElementById('setup-screen').classList.add('active');
            dailyMode = false;
            dailyPuzzleId = null;
        }
        
        