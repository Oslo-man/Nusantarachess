/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
let game: any = null;
        let selectedSquare: any = null;
        let currentPuzzle: any = null;
        let puzzleMoves: any[] = [];
        let moveIndex = 0;
        let playerColor = 'w';
        let solved = 0;
        let errors = 0;
        let timeLeft = 300;
        let timerInterval: any = null;
        let gameActive = false;
        let lastMoveFrom: any = null;
        let lastMoveTo: any = null;
        let lastMoveSoundTime: any = null;
        let usedpuzzle = new Set();

        let puzzleSessionId: any = null;
        let puzzleServerBusy = false;
        
        let dailyMode = false;
        let dailyPuzzleId = null;
        
        let pendingPromotion: any = null;
        let pendingReviewPromotion: any = null;
        let pendingAnalysisPromotion: any = null;
        
        let playedpuzzle: any[] = [];
        let currentpuzzletartTime = 0;
        let currentPuzzleAttempts = 0;
        let currentPuzzleWrongMoves: any[] = [];
        let currentPuzzleUniqueErrors = new Set();
        let currentPuzzleUsedThemeHint = false;
        let currentPuzzleUsedPieceHint = false;
        
        let performanceResults: any[] = [];
        
        const reviewState: any = {
            filter: 'all',
            view: 'grid',
            sort: 'number',
            currentIndex: 0,
            game: null,
            moves: [],
            moveIndex: 0,
            playInterval: null,
            playerColor: 'w',
            solutionVisible: false,
            puzzleolved: false,
            selectedSquare: null,
            lastMoveFrom: null,
            lastMoveTo: null,
            mode: 'solution'
        };

        const analysisState: any = {
            game: null,
            history: [],
            moves: [],
            index: -1,
            selectedSquare: null
        };

        const sfState: any = {
            worker: null,
            ready: false,
            lines: [],
            pendingFen: null,
            generation: 0,
            activeGeneration: 0,
            analyzing: false,
            pendingAnalysis: null
        };

        
        let settings: any = {
            timeLimit: 300,
            maxErrors: 3,
            startRating: 1400,
            ratingIncrease: 15,
            currentRating: 1400,
            soundMoves: true,
            soundEffects: true,
            themeFilter: [],
            themeMatchAll: false,
            animationDuration: 100,
            bonusTime: 0,
            errorBehavior: 'retry',
            tipstemas: true,
            tipsPiece: true,
            colorChoice: 'mixed',
            showRating: true,
            pieceCountMin: 3,
            pieceCountMax: 32
        };
        
        const SOUND_FILES: any = {
            move: '/sounds/move-self.mp3',
            capture: '/sounds/capture.mp3',
            check: '/sounds/move-check.mp3',
            castle: '/sounds/castle.mp3',
            promote: '/sounds/promote.mp3',
        };

        let sharedAudioCtx: any = null;
        const soundBuffers: any = {};
        const soundLoadPromises: any = {};

        