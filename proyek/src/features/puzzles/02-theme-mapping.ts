/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
function t(key: any) { return (LANG[currentLang] && LANG[currentLang][key]) || LANG.id[key] || key; }

function applyLanguage() {
    document.documentElement.lang = currentLang;
    document.title = t('pageTitle');
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function(el) {
        el.title = t(el.dataset.i18nTitle);
    });
    document.querySelectorAll('option[data-i18n]').forEach(function(el) {
        el.textContent = t(el.dataset.i18n);
    });
    if (typeof updateSoundDisplay === 'function') updateSoundDisplay();
    if (typeof updateTipsDisplay === 'function') updateTipsDisplay();
    if (typeof updateThemeFilterDisplay === 'function') updateThemeFilterDisplay();
    if (typeof updatePieceCountDisplay === 'function') updatePieceCountDisplay();
    if (typeof initDailyCard === 'function') initDailyCard();
    if (typeof buildThemeFilter === 'function') buildThemeFilter();
}

        var THEME_CATEGORY_KEYS = [
            'catGamePhases', 'catCommontemas', 'catRaretemas',
            'catCheckmateGoals', 'catCheckmatePatterns', 'catSpecialMoves',
            'catLength', 'catYouthTraining'
        ];

        function getPuzzleThemes(): any {
            return {
                [t('catGamePhases')]: {
                    'opening': t('themeOpening'),
                    'middlegame': t('themeMiddlegame'),
                    'endgame': t('themeEndgame'),
                    'rookEndgame': t('themeRookEndgame'),
                    'bishopEndgame': t('themeBishopEndgame'),
                    'pawnEndgame': t('themePawnEndgame'),
                    'knightEndgame': t('themeKnightEndgame'),
                    'queenEndgame': t('themeQueenEndgame')
                },
                [t('catCommontemas')]: {
                    'fork': t('themeFork'),
                    'kingsideAttack': t('themeKingsideAttack'),
                    'sacrifice': t('themeSacrifice'),
                    'pin': t('themePin'),
                    'advancedPawn': t('themeAdvancedPawn'),
                    'defensiveMove': t('themeDefensiveMove'),
                    'discoveredAttack': t('themeDiscoveredAttack'),
                    'deflection': t('themeDeflection'),
                    'quietMove': t('themeQuietMove'),
                    'hangingPiece': t('themeHangingPiece'),
                    'attraction': t('themeAttraction'),
                    'exposedKing': t('themeExposedKing'),
                    'skewer': t('themeSkewer'),
                    'discoveredCheck': t('themeDiscoveredCheck')
                },
                [t('catRaretemas')]: {
                    'queensideAttack': t('themeQueensideAttack'),
                    'clearance': t('themeClearance'),
                    'intermezzo': t('themeIntermezzo'),
                    'trappedPiece': t('themeTrappedPiece'),
                    'zugzwang': t('themeZugzwang'),
                    'attackingF2F7': t('themeAttackingF2F7'),
                    'capturingDefender': t('themeCapturingDefender'),
                    'doubleCheck': t('themeDoubleCheck'),
                    'interference': t('themeInterference'),
                    'xRayAttack': t('themeXRayAttack')
                },
                [t('catCheckmateGoals')]: {
                    'mate': t('themeMate'),
                    'mateIn1': t('themeMateIn1'),
                    'mateIn2': t('themeMateIn2'),
                    'mateIn3': t('themeMateIn3'),
                    'mateIn4': t('themeMateIn4'),
                    'mateIn5': t('themeMateIn5')
                },
                [t('catCheckmatePatterns')]: {
                    'backRankMate': t('themeBackRankMate'),
                    'rookBishopMate': t('themeRookBishopMate'),
                    'rookKnightMate': t('themeRookKnightMate'),
                    'smotheredMate': t('themeSmotheredMate'),
                    'queenRookMate': t('themeQueenRookMate'),
                    'doubleBishopMate': t('themeDoubleBishopMate'),
                    'doubleRookMate': t('themeDoubleRookMate'),
                    'queenMate': t('themeQueenMate'),
                    'queenBishopMate': t('themeQueenBishopMate')
                },
                [t('catSpecialMoves')]: {
                    'enPassant': t('themeEnPassant'),
                    'promotion': t('themePromotion'),
                    'underPromotion': t('themeUnderPromotion')
                },
                [t('catLength')]: {
                    'oneMove': t('themeOneMove'),
                    'short': t('themeShort'),
                    'long': t('themeLong'),
                    'veryLong': t('themeVeryLong')
                },
                [t('catYouthTraining')]: {
                    'stufe1': t('themeStufe1'),
                    'stufe2': t('themeStufe2'),
                    'stufe3': t('themeStufe3'),
                    'stufe4': t('themeStufe4'),
                    'stufe5': t('themeStufe5')
                }
            };
        }

        const THEME_MAPPINGS = {
            'rookKnightMate': ['anastasiaMate', 'arabianMate', 'cornerMate', 'hookMate', 'vukovicMate'],
            'rookBishopMate': ['morphysMate', 'operaMate', 'pillsburysMate'],
            'queenRookMate': ['triangleMate', 'killBoxMate'],
            'queenBishopMate': ['balestraMate'],
            'doubleBishopMate': ['bodenMate', 'doubleBishopMate'],
            'doubleRookMate': ['blindSwineMate'],
            'queenMate': ['dovetailMate'],
            'backRankMate': ['backRankMate'],
            'smotheredMate': ['smotheredMate']
        };
        
        const REVERSE_MATE_MAPPINGS: any = {};
        for (const [consolidated, subThemes] of Object.entries(THEME_MAPPINGS)) {
            for (const sub of subThemes) {
                REVERSE_MATE_MAPPINGS[sub.toLowerCase()] = consolidated;
            }
        }
        
        const STUFEN_THEMES = {
            'stufe1': ['mateIn1', 'hangingPiece', 'defensiveMove', 'fork'],
            'stufe2': ['mateIn2', 'pin', 'discoveredAttack', 'capturingDefender', 'intermezzo', 'pawnEndgame'],
            'stufe3': ['doubleCheck', 'discoveredCheck', 'advancedPawn', 'kingsideAttack', 'xRayAttack', 'underPromotion'],
            'stufe4': ['mateIn3', 'interference', 'attraction', 'clearance', 'exposedKing'],
            'stufe5': ['mateIn4', 'mateIn5', 'zugzwang', 'trappedPiece', 'queensideAttack', 'veryLong', 'rookEndgame', 'pawnEndgame']
        };
        
        const STUFEN_RATINGS: any = {
            'stufe1': [400, 900],
            'stufe2': [900, 1400],
            'stufe3': [1400, 1900],
            'stufe4': [1900, 2400],
            'stufe5': [2400, 2900]
        };

        