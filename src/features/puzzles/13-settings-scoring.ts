/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
const TIME_BONUS_ANCHORS = [
            [1, 1000],
            [10, 500],
            [60, 100],
            [180, 0],
            [300, -50],
            [600, -100]
        ];
        
        function getTimeBonus(seconds: any) {
            if (seconds <= TIME_BONUS_ANCHORS[0][0]) return TIME_BONUS_ANCHORS[0][1];
            if (seconds >= TIME_BONUS_ANCHORS[TIME_BONUS_ANCHORS.length - 1][0]) {
                return TIME_BONUS_ANCHORS[TIME_BONUS_ANCHORS.length - 1][1];
            }
            
            for (let i = 0; i < TIME_BONUS_ANCHORS.length - 1; i++) {
                const [t0, b0] = TIME_BONUS_ANCHORS[i];
                const [t1, b1] = TIME_BONUS_ANCHORS[i + 1];
                if (seconds >= t0 && seconds <= t1) {
                    const logT0 = Math.log(t0);
                    const logT1 = Math.log(t1);
                    const logT = Math.log(seconds);
                    const fraction = (logT - logT0) / (logT1 - logT0);
                    return b0 + fraction * (b1 - b0);
                }
            }
            return 0;
        }
        
        function getActualScore(result: any) {
            if (!result.solved) return 0;
            
            let score = 1.0;
            
            const usedTheme = result.usedThemeHint;
            const usedPiece = result.usedPieceHint;
            const hadWrongAttempts = result.attempts > 0;
            
            if (usedTheme && usedPiece) {
                score = 0.2;
            } else if (usedPiece) {
                score = 0.3;
            } else if (usedTheme) {
                score = 0.6;
            } else if (hadWrongAttempts) {
                score = 0.3;
            }
            
            if (hadWrongAttempts && (usedTheme || usedPiece)) {
                score = Math.max(score * 0.5, 0.1);
            }
            
            return score;
        }
        
        function getEffectiveRating(result: any) {
            return result.puzzleRating + getTimeBonus(result.timeSpent);
        }
        
        function getExpectedScore(playerRating: any, effectiveRating: any) {
            const diff = effectiveRating - playerRating;
            return 1 / (1 + Math.pow(10, diff / 400));
        }
        
        function calculatePerformanceRating() {
            if (performanceResults.length === 0) return null;
            
            let lo = 0, hi = 4000;
            
            const actualTotal = performanceResults.reduce((sum, r) => {
                return sum + getActualScore(r);
            }, 0);
            
            if (actualTotal === 0) return 0;
            
            for (let iter = 0; iter < 50; iter++) {
                const mid = (lo + hi) / 2;
                const expectedTotal = performanceResults.reduce((sum, r) => {
                    return sum + getExpectedScore(mid, getEffectiveRating(r));
                }, 0);
                
                if (expectedTotal < actualTotal) {
                    lo = mid;
                } else {
                    hi = mid;
                }
            }
            
            return Math.round((lo + hi) / 2);
        }
        
        function recordPuzzlePerformance(puzzleRating: any, solved: any, timeSpent: any, attempts: any) {
            performanceResults.push({
                puzzleRating: puzzleRating,
                solved: solved,
                timeSpent: timeSpent,
                attempts: attempts,
                usedThemeHint: currentPuzzleUsedThemeHint,
                usedPieceHint: currentPuzzleUsedPieceHint
            });
        }

        function buildThemeFilter() {
            const container = document.getElementById('theme-filter-container');
            const checkedThemes = new Set();
            container.querySelectorAll('.theme-checkbox:checked').forEach(function(cb: any) {
                checkedThemes.add(cb.value);
            });
            container.innerHTML = '';
            for (const [category, themes] of Object.entries<any>(getPuzzleThemes())) {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'theme-category-group';
                const categoryLabel = document.createElement('div');
                categoryLabel.className = 'theme-category-label';
                categoryLabel.textContent = category;
                categoryDiv.appendChild(categoryLabel);
                for (const [key, label] of Object.entries<any>(themes)) {
                    const itemLabel = document.createElement('label');
                    itemLabel.className = 'theme-item';
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.value = key;
                    checkbox.className = 'theme-checkbox';
                    if (checkedThemes.has(key)) checkbox.checked = true;
                    const span = document.createElement('span');
                    span.textContent = label;
                    itemLabel.appendChild(checkbox);
                    itemLabel.appendChild(span);
                    categoryDiv.appendChild(itemLabel);
                }
                container.appendChild(categoryDiv);
            }
            updateThemeFilterDisplay();
        }

        var updateThemeFilterDisplay: any;

        function populateThemeFilter() {
            const container = document.getElementById('theme-filter-container');
            const resetBtn = document.getElementById('theme-reset-btn');
            const toggle = document.getElementById('theme-filter-toggle');
            const panel = document.getElementById('theme-dropdown-panel');
            const display = document.getElementById('theme-filter-display');

            updateThemeFilterDisplay = updateThemeDisplay;

            buildThemeFilter();
            
            toggle.addEventListener('click', function(e: any) {
                e.stopPropagation();
                toggle.classList.toggle('open');
                panel.classList.toggle('open');
            });
            
            document.addEventListener('click', function(e) {
                if (!toggle.contains(e.target) && !panel.contains(e.target)) {
                    toggle.classList.remove('open');
                    panel.classList.remove('open');
                }
            });
            
            panel.addEventListener('click', function(e: any) {
                e.stopPropagation();
            });
            
            resetBtn.addEventListener('click', function() {
                const allCheckboxes = document.querySelectorAll('.theme-checkbox');
                allCheckboxes.forEach(cb => cb.checked = false);
                updateThemeDisplay();
            });
            
            container.addEventListener('change', function(e: any) {
                if (e.target.classList.contains('theme-checkbox')) {
                    updateThemeDisplay();
                }
            });
            
            function updateThemeDisplay() {
                const checkedBoxes = document.querySelectorAll('.theme-checkbox:checked');
                const count = checkedBoxes.length;
                const totalCount = document.querySelectorAll('.theme-checkbox').length;

                if (count === 0 || count === totalCount) {
                    display.textContent = t('allThemes');
                } else if (count === 1) {
                    const themeKey = checkedBoxes[0].value;
                    let themeName = '';
                    for (const [category, themes] of Object.entries<any>(getPuzzleThemes())) {
                        if (themes[themeKey]) {
                            themeName = themes[themeKey];
                            break;
                        }
                    }
                    display.textContent = themeName;
                } else {
                    display.textContent = count + ' ' + t('allThemes').split(' ').pop();
                }
            }
        }

        function initToggleDropdown(toggleId: any, panelId: any, displayId: any, updateFn: any) {
            const toggle = document.getElementById(toggleId);
            const panel = document.getElementById(panelId);
            if (!toggle || !panel) return;

            toggle.addEventListener('click', function(e: any) {
                e.stopPropagation();
                toggle.classList.toggle('open');
                panel.classList.toggle('open');
            });

            document.addEventListener('click', function(e) {
                if (!toggle.contains(e.target) && !panel.contains(e.target)) {
                    toggle.classList.remove('open');
                    panel.classList.remove('open');
                }
            });

            panel.addEventListener('click', function(e: any) {
                e.stopPropagation();
            });

            panel.addEventListener('change', updateFn);
        }

        function updateSoundDisplay() {
            const moves = document.getElementById('sound-moves-cb').checked;
            const effects = document.getElementById('sound-effects-cb').checked;
            const display = document.getElementById('sound-display');
            if (moves && effects) display.textContent = t('soundAllOn');
            else if (moves) display.textContent = t('soundMoves');
            else if (effects) display.textContent = t('soundEffects');
            else display.textContent = t('soundOff');
        }

        function updateTipsDisplay() {
            const temas = document.getElementById('tips-temas-cb').checked;
            const piece = document.getElementById('tips-piece-cb').checked;
            const display = document.getElementById('tips-display');
            if (temas && piece) display.textContent = t('hintsAll');
            else if (temas) display.textContent = t('hintsThemes');
            else if (piece) display.textContent = t('hintsPiece');
            else display.textContent = t('hintsNone');
        }

        const SETTINGS_KEY = 'kustompuzzle_settings_v1';

        function saveSettings() {
            try {
                const data = {
                    timeLimit: document.getElementById('time-limit').value,
                    timeLimitCustom: parseInt(document.getElementById('time-custom-value').value) || 5,
                    startRating: document.getElementById('start-rating').value,
                    startRatingCustom: parseInt(document.getElementById('rating-custom-value').value) || 1400,
                    maxErrors: document.getElementById('max-errors').value,
                    maxErrorsCustom: parseInt(document.getElementById('errors-custom-value').value) || 3,
                    ratingIncrease: document.getElementById('rating-increase').value,
                    ratingIncreaseCustom: parseInt(document.getElementById('increase-custom-value').value) || 15,
                    soundMoves: document.getElementById('sound-moves-cb').checked,
                    soundEffects: document.getElementById('sound-effects-cb').checked,
                    themeFilter: Array.from(document.querySelectorAll('.theme-checkbox:checked')).map(cb => cb.value),
                    themeMatchAll: document.querySelector('input[name="theme-match"]:checked').value === 'all',
                    bonusTime: document.getElementById('bonus-time').value,
                    bonusTimeCustom: parseInt(document.getElementById('bonus-custom-value').value) || 0,
                    errorBehavior: document.getElementById('error-behavior').value,
                    tipstemas: document.getElementById('tips-temas-cb').checked,
                    tipsPiece: document.getElementById('tips-piece-cb').checked,
                    colorChoice: document.getElementById('color-choice').value,
                    showRating: document.getElementById('show-rating').value,
                    pieceCountMin: parseInt(document.getElementById('piece-count-min').value),
                    pieceCountMax: parseInt(document.getElementById('piece-count-max').value)
                };
                localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
            } catch (e) {
            }
        }

        function loadSettings() {
            try {
                const raw = localStorage.getItem(SETTINGS_KEY);
                if (!raw) return;
                const data = JSON.parse(raw);

                const selectFields = [
                    { id: 'time-limit', key: 'timeLimit', customId: 'time-custom-value', customKey: 'timeLimitCustom', customContainerId: 'time-custom' },
                    { id: 'start-rating', key: 'startRating', customId: 'rating-custom-value', customKey: 'startRatingCustom', customContainerId: 'rating-custom' },
                    { id: 'max-errors', key: 'maxErrors', customId: 'errors-custom-value', customKey: 'maxErrorsCustom', customContainerId: 'errors-custom' },
                    { id: 'rating-increase', key: 'ratingIncrease', customId: 'increase-custom-value', customKey: 'ratingIncreaseCustom', customContainerId: 'increase-custom' },
                    { id: 'bonus-time', key: 'bonusTime', customId: 'bonus-custom-value', customKey: 'bonusTimeCustom', customContainerId: 'bonus-custom' }
                ];

                selectFields.forEach(f => {
                    if (data[f.key] !== undefined) {
                        document.getElementById(f.id).value = data[f.key];
                        if (data[f.key] === 'custom') {
                            document.getElementById(f.customContainerId).style.display = 'block';
                            document.getElementById(f.customId).value = data[f.customKey] || '';
                        }
                    }
                });

                if (data.errorBehavior !== undefined) document.getElementById('error-behavior').value = data.errorBehavior;
                if (data.colorChoice !== undefined) document.getElementById('color-choice').value = data.colorChoice;
                if (data.showRating !== undefined) document.getElementById('show-rating').value = data.showRating;

                if (data.soundMoves !== undefined) document.getElementById('sound-moves-cb').checked = data.soundMoves;
                if (data.soundEffects !== undefined) document.getElementById('sound-effects-cb').checked = data.soundEffects;
                if (data.tipstemas !== undefined) document.getElementById('tips-temas-cb').checked = data.tipstemas;
                if (data.tipsPiece !== undefined) document.getElementById('tips-piece-cb').checked = data.tipsPiece;

                if (data.themeFilter && data.themeFilter.length > 0) {
                    document.querySelectorAll('.theme-checkbox').forEach(cb => {
                        cb.checked = data.themeFilter.includes(cb.value);
                    });
                }
                if (data.themeMatchAll !== undefined) {
                    const radio = document.querySelector('input[name="theme-match"][value="' + (data.themeMatchAll ? 'all' : 'any') + '"]');
                    if (radio) radio.checked = true;
                }

                if (data.pieceCountMin !== undefined) document.getElementById('piece-count-min').value = data.pieceCountMin;
                if (data.pieceCountMax !== undefined) document.getElementById('piece-count-max').value = data.pieceCountMax;

                updateSoundDisplay();
                updateTipsDisplay();
                if (typeof updateThemeFilterDisplay === 'function') updateThemeFilterDisplay();
                updatePieceCountDisplay();
            } catch (e) {
            }
        }

        function resetSettings() {
            localStorage.removeItem(SETTINGS_KEY);

            document.getElementById('time-limit').value = '300';
            document.getElementById('start-rating').value = '1400';
            document.getElementById('max-errors').value = '3';
            document.getElementById('rating-increase').value = '15';

            ['time-custom', 'rating-custom', 'errors-custom', 'increase-custom', 'bonus-custom'].forEach(id => {
                document.getElementById(id).style.display = 'none';
            });
            document.getElementById('time-custom-value').value = 5;
            document.getElementById('rating-custom-value').value = 1400;
            document.getElementById('errors-custom-value').value = 3;
            document.getElementById('increase-custom-value').value = 15;
            document.getElementById('bonus-custom-value').value = 0;

            document.getElementById('bonus-time').value = '0';
            document.getElementById('error-behavior').value = 'retry';
            document.getElementById('color-choice').value = 'mixed';
            document.getElementById('show-rating').value = '1';

            document.getElementById('sound-moves-cb').checked = true;
            document.getElementById('sound-effects-cb').checked = true;
            document.getElementById('tips-temas-cb').checked = true;
            document.getElementById('tips-piece-cb').checked = true;

            document.querySelectorAll('.theme-checkbox').forEach(cb => cb.checked = false);
            const anyRadio = document.querySelector('input[name="theme-match"][value="any"]');
            if (anyRadio) anyRadio.checked = true;

            document.getElementById('piece-count-min').value = 3;
            document.getElementById('piece-count-max').value = 32;

            updateSoundDisplay();
            updateTipsDisplay();
            if (typeof updateThemeFilterDisplay === 'function') updateThemeFilterDisplay();
            updatePieceCountDisplay();

            const content = document.getElementById('extended-content');
            const toggle = document.querySelector('.extended-toggle');
            if (content) content.classList.remove('open');
            if (toggle) toggle.classList.remove('open');

            const btn = document.querySelector('.btn-secondary');
            if (btn) {
                const original = btn.textContent;
                btn.textContent = t('done');
                setTimeout(() => { btn.textContent = original; }, 1200);
            }
        }

        function updatePieceCountDisplay() {
            const min = parseInt(document.getElementById('piece-count-min').value);
            const max = parseInt(document.getElementById('piece-count-max').value);
            const display = document.getElementById('piece-count-display');
            if (min === 3 && max === 32) {
                display.textContent = t('hintsAll');
            } else {
                display.textContent = min + ' \u2013 ' + max;
            }
            const track = document.getElementById('piece-count-track');
            const range = 32 - 3;
            const leftPct = ((min - 3) / range) * 100;
            const rightPct = ((max - 3) / range) * 100;
            track.style.left = leftPct + '%';
            track.style.width = (rightPct - leftPct) + '%';
        }

        function initPieceCountSlider() {
            const minSlider = document.getElementById('piece-count-min');
            const maxSlider = document.getElementById('piece-count-max');

            function enforceMinMax() {
                const minVal = parseInt(minSlider.value);
                const maxVal = parseInt(maxSlider.value);
                if (minVal > maxVal) {
                    minSlider.value = maxVal;
                }
                if (maxVal < minVal) {
                    maxSlider.value = minVal;
                }
                updatePieceCountDisplay();
            }

            minSlider.addEventListener('input', enforceMinMax);
            maxSlider.addEventListener('input', enforceMinMax);
            updatePieceCountDisplay();
        }

        