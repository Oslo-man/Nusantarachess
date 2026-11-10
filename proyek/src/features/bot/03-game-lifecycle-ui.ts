/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
var g_mode = 'challenge';

var g_soundEnabled = true;

var g_selectedSquare: any = null;

var g_legalTargets: any[] = [];

var g_gameOver = false;
var g_gameStartFen: any = null;
var g_lastGameResult: any = null;

var g_practiceMatchId: any = null;

var g_serverBusy = false;
var g_deferredPlayerMove: any = null;

function PlayerColorLetter() {
    return g_playerWhite ? 'w' : 'b';
}

function StartPracticeSession(startFen?: any) {
    g_practiceMatchId = null;
    if (!window.NusantaraChess || !window.NusantaraChess.api) return;
    window.NusantaraChess.api.startPractice(g_character, PlayerColorLetter(), startFen, { mode: g_mode, level: g_engineLevel }).then(function (data: any) {
        g_practiceMatchId = data.match.id;
        if (!g_playerWhite && !g_gameOver) {
            SearchAndRedraw();
        }
    }).catch(function (err: any) {
        alert("Tidak bisa memulai sesi di server: " + (err && err.message ? err.message : err));
    });
}

function FindLegalMoveByUci(uci: any) {
    var moves = GenerateValidMoves();
    for (var i = 0; i < moves.length; i++) {
        if (FormatMove(moves[i]) === uci) return moves[i];
    }
    return null;
}

function SameFenPosition(a: any, b: any) {
    return String(a).split(' ').slice(0, 2).join(' ') === String(b).split(' ').slice(0, 2).join(' ');
}

function RebuildFromPracticeMatch(m: any) {
    if (g_backgroundEngine != null) {
        g_backgroundEngine.terminate();
        g_backgroundEngine = null;
    }
    g_backgroundEngineValid = true;
    g_serverBusy = false;
    g_deferredPlayerMove = null;
    g_selectedSquare = null;
    g_legalTargets = [];
    ClearPremove();
    UICloseGameOverDialog();

    moveNumber = 1;
    g_allMoves = [];
    g_pgnSnapshots = [];
    g_gameStartFen = null;
    g_lastGameResult = null;
    var pgnTextBox = document.getElementById("PgnTextBox");
    if (pgnTextBox) pgnTextBox.value = "";

    var ucis = m.uciHistory || [];
    var customStart = !!m.startFen;
    var replayed = false;

    if (ucis.length === (m.sanHistory || []).length) {
        ResetGame();
        var startOk = true;
        if (customStart) startOk = (String(InitializeFromFen(m.startFen)).indexOf('Invalid FEN') !== 0);
        if (startOk) {
            if (customStart) g_gameStartFen = GetFen();
            g_boardHistory = [g_board.slice()];
            replayed = true;
            for (var i = 0; i < ucis.length; i++) {
                var mv = FindLegalMoveByUci(ucis[i]);
                if (mv == null) { replayed = false; break; }
                UpdatePgnTextBox(mv);
                g_allMoves[g_allMoves.length] = mv;
                MakeMove(mv);
                g_boardHistory.push(g_board.slice());
            }
            if (replayed && !SameFenPosition(GetFen(), m.fen)) replayed = false;
        }
    }

    if (!replayed) {
        moveNumber = 1;
        g_allMoves = [];
        g_pgnSnapshots = [];
        g_gameStartFen = null;
        if (pgnTextBox) pgnTextBox.value = "";
        ResetGame();
        var fenResult: any;
        try { fenResult = InitializeFromFen(m.fen); } catch (e) { return false; }
        if (String(fenResult).indexOf('Invalid FEN') === 0) return false;
        g_boardHistory = [g_board.slice()];
        g_gameStartFen = GetFen();
    }

    g_viewIndex = g_boardHistory.length - 1;

    if (InitializeBackgroundEngine()) {
        g_backgroundEngine.postMessage("position " + GetFen());
    }

    RedrawBoard();
    UpdateControlVisibility();
    UpdateHistoryNavButtons();
    return true;
}

var g_pendingPracticeResume: any = null;

function RestoreActivePracticeSession() {
    if (!window.NusantaraChess || !window.NusantaraChess.api || !window.NusantaraChess.api.getActivePractice) return;
    window.NusantaraChess.api.getActivePractice().then(function (data: any) {
        var m = data && data.match;
        if (!m || m.status !== 'active') return;

        var selectScreen = document.getElementById('opponent-select-screen');
        var resumeBtn = document.getElementById('opponent-resume-btn');
        if (!selectScreen || !resumeBtn || selectScreen.classList.contains('hidden')) return;

        g_pendingPracticeResume = m;
        var who = document.getElementById('opponent-resume-name');
        if (who) who.textContent = GetCharacterDisplayName(m.character);
        resumeBtn.classList.remove('hidden');
    }).catch(function () {
    });
}

function UIResumePractice() {
    var m = g_pendingPracticeResume;
    var selectScreen = document.getElementById('opponent-select-screen');
    var mainContent = document.getElementById('mainContent');
    if (!m || !selectScreen || !mainContent) return;

    g_character = (m.character === 'udin' || m.character === 'adit' || m.character === 'dimas' || m.character === 'agus' || m.character === 'ilham' || m.character === 'josep' || m.character === 'asep') ? m.character : 'fahri';
    var charSel = document.getElementById("CharacterSelect");
    if (charSel) charSel.value = g_character;
    if (g_character === 'fahri') {
        g_engineLevel = 3;   // level tunggal: sesi lama bertingkat 1/2 tetap dilanjutkan di level utama
        g_fahriTimeControlActive = true;
        g_timeout = 2000;
        var timeInputEl = document.getElementById("TimePerMove");
        if (timeInputEl) timeInputEl.value = g_timeout;
    }
    g_playerWhite = (m.playerColor === 'w');
    var colorSel = document.getElementById("StartPlayerSelect");
    if (colorSel) colorSel.value = g_playerWhite ? 'white' : 'black';
    g_mode = (m.mode === 'challenge') ? 'challenge' : 'friendly';
    ApplyModeUI(g_mode);

    var nameEl = document.getElementById("engineName");
    if (nameEl) nameEl.textContent = GetActiveEngineInfo().name;
    UpdateOpponentAvatar();
    UpdateOpponentBadges();
    UpdateTimeRowVisibility();
    UISyncCharacterDashboard();

    selectScreen.classList.add('hidden');
    mainContent.classList.remove('hidden');
    PreloadChessSounds();

    g_practiceMatchId = m.id;
    if (!RebuildFromPracticeMatch(m)) {
        g_practiceMatchId = null;
        mainContent.classList.add('hidden');
        selectScreen.classList.remove('hidden');
        return;
    }
    g_pendingPracticeResume = null;

    if (!IsPlayersTurn()) setTimeout(SearchAndRedraw, 0);
}

var g_premove: any = null;

var g_premoveTargets: any[] = [];

function ClearPremove() {
    g_premove = null;
    g_premoveTargets = [];
}

function UIOpenSettings() {
    var modal = document.getElementById('settingsModal');
    if (modal) modal.style.display = 'flex';
    UISyncCharacterDashboard();
}

function UICloseSettings() {
    var modal = document.getElementById('settingsModal');
    if (modal) modal.style.display = 'none';
}

function UpdateTimeRowVisibility() {
    var timeRow = document.getElementById('timeRow');
    if (!timeRow) return;
    var show = (g_mode === 'friendly') && (g_character === 'fahri') && g_fahriTimeControlActive;
    timeRow.style.display = show ? 'flex' : 'none';
}

function UISetModeFromSelect() {
    var sel = document.getElementById("ModeSelect");
    UISetMode(sel.value);
}

function ApplyModeUI(mode: any) {
    var sel = document.getElementById("ModeSelect");
    if (sel) sel.value = mode;
    var toolsToggle = document.getElementById("opponent-tools-toggle");
    if (toolsToggle) toolsToggle.checked = (mode === 'friendly');

    var btnUndo      = document.getElementById('btnUndo');
    var statusSection = document.getElementById('statusSection');
    var fenSection   = document.getElementById('fenSection');

    var show = (mode === 'friendly');
    if (btnUndo)    btnUndo.style.display    = show ? 'flex' : 'none';
    if (statusSection) statusSection.style.display = show ? 'block' : 'none';
    if (fenSection) fenSection.style.display = show ? 'block' : 'none';
    UpdateTimeRowVisibility();

    if (mode === 'challenge') {
        document.body.classList.add('mode-challenge');
    } else {
        document.body.classList.remove('mode-challenge');
    }
}

function UISetMode(mode: any) {
    if (!confirm("Apakah Anda yakin?")) {
        var sel = document.getElementById("ModeSelect");
        if (sel) sel.value = g_mode;
        return;
    }

    g_mode = mode;
    ApplyModeUI(mode);

    if (mode === 'challenge' && g_analyzing) {
        UIAnalyzeToggle();
    }

    UINewGame();
}

function UIToggleToolsMode() {
    var toggle = document.getElementById("opponent-tools-toggle");
    if (!toggle) return;
    g_mode = toggle.checked ? 'friendly' : 'challenge';
    ApplyModeUI(g_mode);
}

function UINewGameConfirm() {
    if (!confirm("Apakah Anda yakin?")) return;
    UINewGame();
}

function UINewGame() {
    PreloadChessSounds();
    moveNumber = 1;
    g_selectedSquare = null;
    g_legalTargets = [];
    g_gameOver = false;
    g_gameStartFen = null;
    g_lastGameResult = null;
    ClearPremove();
    UICloseGameOverDialog();

    var pgnTextBox = document.getElementById("PgnTextBox");
    pgnTextBox.value = "";
    g_pgnSnapshots = [];

    EnsureAnalysisStopped();
    if (g_backgroundEngine != null) {
        g_backgroundEngine.terminate();
        g_backgroundEngine = null;
    }
    g_backgroundEngineValid = true;
    ResetGame();
    if (InitializeBackgroundEngine()) {
        g_backgroundEngine.postMessage("go");
        g_backgroundEngine.postMessage("position " + GetFen());
    }
    g_allMoves = [];
    g_boardHistory = [g_board.slice()];
    g_viewIndex = 0;
    g_serverBusy = false; g_deferredPlayerMove = null;
    StartPracticeSession();
    RedrawBoard();
    UpdateControlVisibility();
    UpdateHistoryNavButtons();
}

function EnsureAnalysisStopped() {
    if (g_analyzing && g_backgroundEngine != null) {
        g_backgroundEngine.terminate();
        g_backgroundEngine = null;
    }
}

function UIAnalyzeToggle() {
    if (InitializeBackgroundEngine()) {
        if (!g_analyzing) {
            g_backgroundEngine.postMessage("analyze");
        } else {
            EnsureAnalysisStopped();
        }
        g_analyzing = !g_analyzing;
        var btn = document.getElementById("AnalysisToggleLink");
        if (btn) btn.classList.toggle('active', g_analyzing);
    } else {
        alert("Peramban Anda harus mendukung web workers untuk analisis - (chrome4, ff4, safari)");
    }
}

function UIChangeFEN() {
    if (!g_changingFen) {
        var fenTextBox = document.getElementById("FenTextBox");
        var result = InitializeFromFen(fenTextBox.value);
        if (result.length != 0) {
            UpdatePVDisplay(result);
            return;
        } else {
            UpdatePVDisplay('');
        }
        g_allMoves = [];
        g_pgnSnapshots = [];
        g_selectedSquare = null;
        g_legalTargets = [];
        ClearPremove();

        EnsureAnalysisStopped();
        InitializeBackgroundEngine();

        g_playerWhite = !!g_toMove;
        g_backgroundEngine.postMessage("position " + GetFen());

        g_boardHistory = [g_board.slice()];
        g_viewIndex = 0;
        g_serverBusy = false; g_deferredPlayerMove = null;
        g_gameStartFen = GetFen();
        g_lastGameResult = null;
        StartPracticeSession(GetFen());

        RedrawBoard();
        UpdateHistoryNavButtons();
    }
}

function UIChangeStartPlayer() {
    g_playerWhite = !g_playerWhite;
    UINewGame();
}

var g_pgnSnapshots: any[] = [];

function UpdatePgnTextBox(move: any) {
    var pgnTextBox = document.getElementById("PgnTextBox");
    g_pgnSnapshots.push({ len: pgnTextBox.value.length, num: moveNumber });
    if (g_toMove != 0) {
        pgnTextBox.value += moveNumber + ". ";
        moveNumber++;
    }
    pgnTextBox.value += GetMoveSAN(move) + " ";
}

function UIChangeTimePerMove() {
    var timePerMove = document.getElementById("TimePerMove");
    g_timeout = parseInt(timePerMove.value, 10);
}

function FinishMove(bestMove: any, value: any, timeTaken: any, ply: any) {
    if (bestMove != null) {
        UIPlayMove(bestMove, BuildPVMessage(bestMove, value, timeTaken, ply));
    } else {
        var lawan = GetActiveEngineInfo().name.replace(/\s*\d+$/, '');
        alert("Magnus aja umur 13 tahun udah jadi GM, sedangkan kamu masih kalah sama " + lawan + ", ya haha.");
    }
}

function UIPlayMove(move: any, pv: any) {
    if (g_serverBusy || !g_practiceMatchId) return;

    var fromX = (move & 0xF) - 4;
    var fromY = ((move >> 4) & 0xF) - 2;
    var toX   = ((move >> 8) & 0xF) - 4;
    var toY   = ((move >> 12) & 0xF) - 2;
    var movingPiece   = g_board[MakeSquare(fromY, fromX)];
    var capturedPiece = g_board[MakeSquare(toY, toX)];
    var isEP = !!(move & moveflagEPC);

    UpdatePgnTextBox(move);
    g_allMoves[g_allMoves.length] = move;
    MakeMove(move);
    g_boardHistory.push(g_board.slice());
    g_viewIndex = g_boardHistory.length - 1;
    UpdatePVDisplay(pv);
    UpdateFromMove(move);

    PlayMoveSoundForMove(move, movingPiece, capturedPiece, isEP);
    UpdateHistoryNavButtons();

    SubmitMoveToServer(move, 'bot');

    if (g_premove && g_premove.to) {
        var pendingPremove = g_premove;
        ClearPremove();
        TryMakeMove(pendingPremove.from, pendingPremove.to, true);
        RedrawPieces();
    }
}

function UndoPgnEntry() {
    var snap = g_pgnSnapshots.pop();
    if (!snap) return;
    var pgnTextBox = document.getElementById("PgnTextBox");
    if (pgnTextBox) pgnTextBox.value = pgnTextBox.value.substring(0, snap.len);
    moveNumber = snap.num;
}

function UIUndoMove() {
    if (g_allMoves.length == 0) return;
    if (g_serverBusy) return;

    if (g_backgroundEngine != null) {
        g_backgroundEngine.terminate();
        g_backgroundEngine = null;
    }

    UnmakeMove(g_allMoves[g_allMoves.length - 1]);
    g_allMoves.pop();
    g_boardHistory.pop();
    UndoPgnEntry();

    if (g_playerWhite != !!g_toMove && g_allMoves.length != 0) {
        UnmakeMove(g_allMoves[g_allMoves.length - 1]);
        g_allMoves.pop();
        g_boardHistory.pop();
        UndoPgnEntry();
    }

    g_viewIndex = g_boardHistory.length - 1;
    g_selectedSquare = null;
    g_legalTargets = [];
    g_gameOver = false;
    g_lastGameResult = null;
    ClearPremove();
    UICloseGameOverDialog();

    g_serverBusy = false; g_deferredPlayerMove = null;
    StartPracticeSession(GetFen());

    RedrawBoard();
    UpdateControlVisibility();
    UpdateHistoryNavButtons();
}


function BuildGamePgn() {
    var tb = document.getElementById("PgnTextBox");
    var moves = tb ? tb.value.replace(/\s+/g, " ").trim() : "";
    if (!moves) return "";
    var user = window.NusantaraChess && window.NusantaraChess.currentUser;
    var me = (user && user.username) ? user.username : "Anda";
    var bot = GetActiveEngineInfo().name.replace(/\s*\d+$/, "");
    var resultTag = "*";
    if (g_lastGameResult === "draw") resultTag = "1/2-1/2";
    else if (g_lastGameResult === "win") resultTag = g_playerWhite ? "1-0" : "0-1";
    else if (g_lastGameResult === "loss") resultTag = g_playerWhite ? "0-1" : "1-0";
    var dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, ".");
    var pgn = '[Event "NusantaraChess"]\n[Site "NusantaraChess"]\n[Date "' + dateStr + '"]\n' +
        '[White "' + (g_playerWhite ? me : bot) + '"]\n[Black "' + (g_playerWhite ? bot : me) + '"]\n' +
        '[Result "' + resultTag + '"]\n';
    if (g_gameStartFen) pgn += '[SetUp "1"]\n[FEN "' + g_gameStartFen + '"]\n';
    return pgn + "\n" + moves + " " + resultTag;
}

function UIOpenGameReview() {
    var pgn = BuildGamePgn();
    if (!pgn) { alert("Belum ada langkah untuk diulas."); return; }
    if (!window.NusantaraChess || typeof window.NusantaraChess.openGameReview !== "function") return;
    UICloseGameOverDialog();
    window.NusantaraChess.openGameReview({
        pgn: pgn,
        playerColor: g_playerWhite ? "w" : "b",
        source: "bot"
    });
}
