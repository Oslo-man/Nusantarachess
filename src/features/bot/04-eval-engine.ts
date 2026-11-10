/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/

function ShowGameOverDialog(result: any) {
    var modal = document.getElementById('gameOverModal');
    var msgEl = document.getElementById('gameOverMessage');
    if (!modal || !msgEl) return;

    g_lastGameResult = (result === 'win' || result === 'draw') ? result : 'loss';
    var lawan = GetActiveEngineInfo().name.replace(/\s*\d+$/, '');
    var msg;
    if (result === 'win') msg = 'Kamu mengalahkan ' + lawan + '!';
    else if (result === 'draw') msg = 'Kamu berhasil bertahan melawan ' + lawan + '!';
    else msg = 'haha masih bisa kalah sama ' + lawan + '!';

    msgEl.textContent = msg;
    modal.style.display = 'flex';
}

function UICloseGameOverDialog() {
    var modal = document.getElementById('gameOverModal');
    if (modal) modal.style.display = 'none';
}

function UIGameOverNewGame() {
    UICloseGameOverDialog();
    UINewGame();
}

function UIGameOverWait() {
    UICloseGameOverDialog();
    UpdateControlVisibility();
}

function UIResetOrSurrender() {
    if (g_gameOver) {
        UINewGame();
        return;
    }
    if (!confirm("Apakah Anda yakin?")) return;

    if (g_practiceMatchId && window.NusantaraChess && window.NusantaraChess.api) {
        window.NusantaraChess.api.resignPractice(g_practiceMatchId).catch(function () {
        }).then(UINewGame);
    } else {
        UINewGame();
    }
}

function UpdateControlVisibility() {
    var btnResign = document.getElementById('btnResign');
    var btnReview = document.getElementById('btnReview');
    if (!btnResign) return;
    var pgnBox = document.getElementById('PgnTextBox');
    if (btnReview) btnReview.style.display = (g_gameOver && pgnBox && pgnBox.value.trim()) ? 'flex' : 'none';

    btnResign.style.display = g_gameOver ? 'none' : 'flex';
}

function UpdatePVDisplay(pv: any) {
    if (pv != null) {
        var outputDiv = document.getElementById("output");
        if (outputDiv.firstChild != null) {
            outputDiv.removeChild(outputDiv.firstChild);
        }
        outputDiv.appendChild(document.createTextNode(pv));
    }
}

function SearchAndRedraw() {
    if (g_analyzing) {
        EnsureAnalysisStopped();
        InitializeBackgroundEngine();
        g_backgroundEngine.postMessage("position " + GetFen());
        g_backgroundEngine.postMessage("analyze");
        return;
    }

    if (InitializeBackgroundEngine()) {
        g_backgroundEngine.postMessage("search " + g_timeout);
    } else {
        Search(FinishMove, 99, null);
    }
}

var g_backgroundEngineValid = true;
var g_backgroundEngine: any;

function InitializeBackgroundEngine() {
    if (!g_backgroundEngineValid) return false;

    if (g_backgroundEngine == null) {
        g_backgroundEngineValid = true;
        try {
            g_backgroundEngine = new Worker(GetActiveEngineFile());
            g_backgroundEngine.onmessage = function (e: any) {
                if (e.data.match("^pv") == "pv") {
                    UpdatePVDisplay(e.data.substr(3, e.data.length - 3));
                } else if (e.data.match("^message") == "message") {
                    EnsureAnalysisStopped();
                    UpdatePVDisplay(e.data.substr(8, e.data.length - 8));
                } else {
                    UIPlayMove(GetMoveFromString(e.data), null);
                }
            }
            g_backgroundEngine.error = function (e: any) {
                alert("Kesalahan dari background worker:" + e.message);
            }
            g_backgroundEngine.postMessage("position " + GetFen());
        } catch (error) {
            g_backgroundEngineValid = false;
        }
    }

    return g_backgroundEngineValid;
}

        