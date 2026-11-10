/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
const HIGHSCORE_KEY = 'kustompuzzle_highscores_v2';
        const HIGHSCORE_MAX_COMBOS = 100;
        
        function getSettingsKey() {
            return [
                settings.timeLimit,
                settings.startRating,
                settings.ratingIncrease,
                settings.maxErrors
            ].join('|');
        }
        
        function getHighscoreStore() {
            try {
                const data = localStorage.getItem(HIGHSCORE_KEY);
                return data ? JSON.parse(data) : {};
            } catch (e) {
                return {};
            }
        }
        
        function saveHighscoreStore(store: any) {
            try {
                const keys = Object.keys(store);
                if (keys.length > HIGHSCORE_MAX_COMBOS) {
                    const sorted = keys.sort((a, b) => {
                        const dateA = store[a].lastPlayed || '2000-01-01';
                        const dateB = store[b].lastPlayed || '2000-01-01';
                        return dateA.localeCompare(dateB);
                    });
                    const toRemove = sorted.slice(0, keys.length - HIGHSCORE_MAX_COMBOS);
                    toRemove.forEach(k => delete store[k]);
                }
                localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(store));
            } catch (e) {
            }
        }
        
        function getHighscoreForSettings() {
            const store = getHighscoreStore();
            const key = getSettingsKey();
            return store[key] || null;
        }
        
        function saveAndCompareHighscore() {
            const store = getHighscoreStore();
            const key = getSettingsKey();
            const currentScore = solved;
            const currentMaxRating = Math.round(settings.currentRating);
            
            const existing = store[key] || null;
            const isNewHighscore = !existing || currentScore > existing.solved || 
                (currentScore === existing.solved && currentMaxRating > existing.maxRating);
            
            if (isNewHighscore) {
                store[key] = {
                    solved: currentScore,
                    maxRating: currentMaxRating,
                    errors: errors,
                    date: new Date().toISOString(),
                    lastPlayed: new Date().toISOString()
                };
            } else {
                store[key].lastPlayed = new Date().toISOString();
            }
            
            saveHighscoreStore(store);
            
            return { existing, isNewHighscore };
        }
        
        function renderHighscoreComparison() {
            const section = document.getElementById('highscore-section');
            const container = document.getElementById('highscore-comparison');
            
            const { existing, isNewHighscore } = saveAndCompareHighscore();
            const currentScore = solved;
            const currentMaxRating = Math.round(settings.currentRating);
            
            section.style.display = 'block';
            
            let html = '';
            
            if (isNewHighscore) {
                if (!existing) {
                    html += '<div style="text-align:center; margin-top:8px;">';
                    html += '<div style="color:var(--accent-red-id); font-size:1rem; margin-bottom:4px;">' + t('firstHighScore') + '</div>';
                    html += '<div style="font-family:\'JetBrains Mono\',monospace; font-size:1.4rem; color:var(--accent-green);">';
                    html += currentScore + ' ' + t('solvedCount') + '</div>';
                    html += '<div style="font-size:0.85rem; color:var(--text-secondary);">~' + currentMaxRating + ' Rating</div>';
                    html += '</div>';
                } else {
                    html += '<div style="text-align:center; margin-top:8px;">';
                    html += '<div style="color:var(--accent-red-id); font-size:1rem; margin-bottom:8px;">' + t('newHighScore') + '</div>';
                    html += '<div style="display:flex; justify-content:center; gap:30px; align-items:center;">';
                    html += '<div style="text-align:center;">';
                    html += '<div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em;">' + t('before') + '</div>';
                    html += '<div style="font-family:\'JetBrains Mono\',monospace; font-size:1.1rem; color:var(--text-secondary); text-decoration:line-through;">';
                    html += existing.solved + '</div>';
                    html += '</div>';
                    html += '<div style="color:var(--accent-red-id); font-size:1.2rem;"><span class="ui-ico ui-ico-arrow-right" aria-hidden="true"></span></div>';
                    html += '<div style="text-align:center;">';
                    html += '<div style="font-size:0.75rem; color:var(--accent-red-id); text-transform:uppercase; letter-spacing:0.05em;">' + t('new_') + '</div>';
                    html += '<div style="font-family:\'JetBrains Mono\',monospace; font-size:1.4rem; color:var(--accent-green);">';
                    html += currentScore + '</div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                }
            } else {
                html += '<div style="text-align:center; margin-top:8px;">';
                html += '<div style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:8px;">' + t('highScoreForSettings') + '</div>';
                html += '<div style="display:flex; justify-content:center; gap:30px; align-items:center;">';
                html += '<div style="text-align:center;">';
                html += '<div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em;">' + t('now') + '</div>';
                html += '<div style="font-family:\'JetBrains Mono\',monospace; font-size:1.1rem; color:var(--text-primary);">';
                html += currentScore + '</div>';
                html += '</div>';
                html += '<div style="text-align:center;">';
                html += '<div style="font-size:0.75rem; color:var(--accent-red-id); text-transform:uppercase; letter-spacing:0.05em;">' + t('highScore') + '</div>';
                html += '<div style="font-family:\'JetBrains Mono\',monospace; font-size:1.4rem; color:var(--accent-green);">';
                html += existing.solved + '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
            }
            
            container.innerHTML = html;
        }

        let hintSquare: any = null;
        
        function showThemeHint() {
            if (!gameActive || !currentPuzzle) return;
            
            currentPuzzleUsedThemeHint = true;
            
            const themes = currentPuzzle[4];
            const themeList = themes.split(' ');
            const germanNames = [];
            const addedConsolidated = new Set();
            
            const excludeThemes = new Set([
                'opening', 'middlegame', 'endgame',
                'oneMove', 'short', 'long', 'veryLong'
            ]);
            
            const mateInXThemes = new Set(['mateIn1', 'mateIn2', 'mateIn3', 'mateIn4', 'mateIn5']);
            const hasMateInX = themeList.some((t: any) => mateInXThemes.has(t));
            
            if (hasMateInX) {
                excludeThemes.add('mate');
            }
            
            for (const theme of themeList) {
                if (excludeThemes.has(theme)) continue;
                
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
                
                for (const [category, catThemes] of Object.entries<any>(getPuzzleThemes())) {
                    if (category === t('catGamePhases')) continue;
                    if (catThemes[theme]) {
                        germanNames.push(catThemes[theme]);
                        break;
                    }
                }
            }
            
            if (!hasMateInX) {
                const totalMoves = puzzleMoves.length;
                const playerMoves = Math.ceil((totalMoves - 1) / 2);
                germanNames.push(playerMoves + ' ' + (playerMoves === 1 ? t('movesSingular') : t('movesPlural')));
            }
            
            if (germanNames.length === 0) {
                germanNames.push(t('noThemesAvailable'));
            }
            
            const overlay = document.createElement('div');
            overlay.className = 'theme-overlay';
            
            let tagsHtml = germanNames.map(n => '<span class="theme-tag">' + n + '</span>').join('');
            
            overlay.innerHTML = '<div class="theme-overlay-content">' +
                '<h4>' + t('puzzleThemesTitle') + '</h4>' +
                '<div>' + tagsHtml + '</div></div>';
            
            overlay.addEventListener('click', () => overlay.remove());
            document.body.appendChild(overlay);
        }
        
        async function showPieceHint() {
            if (!gameActive || !currentPuzzle || !puzzleSessionId || moveIndex >= puzzleMoves.length) return;
            
            currentPuzzleUsedPieceHint = true;

            let resp;
            try {
                resp = await window.NusantaraChess.api.puzzleHint(puzzleSessionId);
            } catch (e) {
                console.warn('Gagal mengambil hint dari server:', e);
                return;
            }
            const startSquare = resp.fromSquare;
            
            clearHint();
            
            hintSquare = startSquare;
            const squareEl = document.querySelector('#board .square[data-square="' + startSquare + '"]');
            if (squareEl) {
                squareEl.classList.add('hint-square');
            }
        }
        
        function clearHint() {
            hintSquare = null;
            document.querySelectorAll('.hint-square').forEach(el => el.classList.remove('hint-square'));
        }

        