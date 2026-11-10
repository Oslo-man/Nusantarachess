/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
const PIECE_SVG: any = window.NusantaraChess.buildPieceSet("upper");


var SOUND_FILES: any = {
    move:    'sounds/move-self.mp3',
    capture: 'sounds/capture.mp3',
    check:   'sounds/move-check.mp3',
    castle:  'sounds/castle.mp3',
    promote: 'sounds/promote.mp3'
};

var g_soundElements: any = {};
var g_soundsPreloaded = false;

function PreloadChessSounds() {
    if (g_soundsPreloaded) return;
    g_soundsPreloaded = true;
    for (var key in SOUND_FILES) {
        try {
            var audio = new Audio(SOUND_FILES[key]);
            audio.preload = 'auto';
            g_soundElements[key] = audio;
        } catch (e) {
            console.warn('PreloadChessSounds failed for', key, e);
        }
    }
}

function PlayChessSoundFile(type: any) {
    if (!g_soundEnabled) return;
    var src = SOUND_FILES[type];
    if (!src) return;

    try {
        var base = g_soundElements[type];
        var node = base ? base.cloneNode(true) : new Audio(src);
        node.volume = 1.0;
        var playPromise = node.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
            });
        }
    } catch (e) {
        console.warn('PlayChessSoundFile failed:', e);
    }
}

