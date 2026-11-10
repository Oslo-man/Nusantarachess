/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
function GetActiveEngineFile() {
    if (g_character === 'fahri') {
        return g_engineFiles[g_engineLevel];
    }
    return g_characterFiles[g_character];
}

function GetActiveEngineInfo() {
    if (g_character === 'fahri') {
        return g_engineInfo[g_engineLevel];
    }
    return g_characterInfo[g_character];
}

// Nama tampilan bot dari id (tanpa angka Elo di belakangnya), mis. id "udin" -> "Udin".
function GetCharacterDisplayName(id: any) {
    var info = (id === 'fahri') ? g_characterInfo.fahri : g_characterInfo[id];
    if (!info) return id ? String(id) : '';
    return String(info.name).replace(/\s*\d+$/, '');
}

// Badge gelar + bendera di baris lawan (tata letak seperti Play: [gelar] nama [bendera]).
function UpdateOpponentBadges() {
    var title = g_characterTitles[g_character] || '';
    var titleEl = document.getElementById('botOpponentTitle');
    if (titleEl) {
        if (title) {
            titleEl.textContent = title;
            titleEl.setAttribute('data-title', String(title).toUpperCase());
            titleEl.classList.remove('hidden');
        } else {
            titleEl.textContent = '';
            titleEl.removeAttribute('data-title');
            titleEl.classList.add('hidden');
        }
    }
    var flagEl = document.getElementById('botOpponentFlag');
    if (flagEl) flagEl.textContent = g_characterFlag;
}

function UpdateOpponentAvatar() {
    var img = document.getElementById('opponentAvatar');
    if (!img) return;
    var src = g_characterAvatars[g_character] ||
        (g_character ? 'images/' + g_character + '.svg' : g_defaultOpponentAvatar);
    // Gambar hilang/gagal dimuat -> siluet netral, bukan foto bot lain.
    img.onerror = function () {
        img.onerror = null;
        img.setAttribute('src', g_defaultOpponentAvatar);
    };
    img.setAttribute('src', src);
    img.setAttribute('alt', GetCharacterDisplayName(g_character));
    img.style.display = '';
}

function UIChangeCharacter() {
    var sel = document.getElementById("CharacterSelect");
    g_character = sel.value;

    if (g_character === 'fahri') {
        g_engineLevel = 3;
        g_fahriTimeControlActive = true;
        g_timeout = 2000;
        var timeInputEl = document.getElementById("TimePerMove");
        if (timeInputEl) timeInputEl.value = g_timeout;
    }

    var info = GetActiveEngineInfo();
    var nameEl = document.getElementById("engineName");
    if (nameEl) nameEl.textContent = info.name;
    UpdateOpponentAvatar();
    UpdateOpponentBadges();

    if (g_backgroundEngine != null) {
        g_backgroundEngine.terminate();
        g_backgroundEngine = null;
    }
    g_backgroundEngineValid = true;
    UpdateTimeRowVisibility();
    UINewGame();
    UISyncCharacterDashboard();
}

function UISelectCharacterCard(characterKey: any) {
    var sel = document.getElementById("CharacterSelect");
    if (!sel || sel.value === characterKey) {
        UISyncCharacterDashboard();
        return;
    }
    sel.value = characterKey;
    UIChangeCharacter();
}

function UISyncCharacterDashboard() {
    var sel = document.getElementById("CharacterSelect");
    var current = sel ? sel.value : null;
    var cards = document.querySelectorAll('.character-card');
    cards.forEach(function (card) {
        var isSelected = card.dataset.character === current;
        card.classList.toggle('is-selected', isSelected);
        card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
    UIUpdatePlaceholderState();
}

// ---- Slot bot cadangan (belum punya nama/Elo/engine) -------------------
// Hanya UI: tidak menyentuh g_character, #CharacterSelect, maupun engine.
function UISelectPlaceholderBot(slotKey: any) {
    document.querySelectorAll('.character-card').forEach(function (card: any) {
        var isSelected = card.dataset.placeholder === slotKey;
        card.classList.toggle('is-selected', isSelected);
        card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
    UIUpdatePlaceholderState();
}

// Status diturunkan dari DOM (tanpa variabel global) agar aman saat halaman dimuat ulang.
function UIUpdatePlaceholderState() {
    var active = !!document.querySelector('.character-card.is-selected[data-placeholder]');
    // Tombol Mulai juga nonaktif selama belum ada bot yang dipilih (tidak ada bot bawaan).
    var noneChosen = !document.querySelector('.character-card.is-selected');
    var startBtn = document.getElementById('opponent-select-start-btn');
    if (startBtn) {
        startBtn.disabled = active || noneChosen;
        startBtn.setAttribute('aria-disabled', (active || noneChosen) ? 'true' : 'false');
    }
    var hint = document.getElementById('placeholderBotHint');
    if (hint) hint.classList.toggle('hidden', !active);
}

var g_cellSize = 44;

function RecalcCellSize() {
    var mainContent = document.querySelector('.main-content');
    var availW = window.innerWidth - 16;
    var availH = window.innerHeight - 16;

    var isDesktopLayout = window.innerWidth >= 900;
    var widthSourceEl = isDesktopLayout
        ? (document.querySelector('.board-wrapper') || mainContent)
        : mainContent;

    if (widthSourceEl) {
        var rect = widthSourceEl.getBoundingClientRect();
        if (rect.width > 10)  availW = rect.width;
    }
    if (mainContent) {
        var mcRect = mainContent.getBoundingClientRect();
        if (mcRect.height > 10) availH = mcRect.height;
    }

    var chromeSelectors = isDesktopLayout
        ? ['.app-header', '.opponent-row', '.player-panel']
        : ['.app-header', '.opponent-row', '.player-panel', '.controls-panel', '.history-nav-row'];
    var chromeH = 0;
    for (var i = 0; i < chromeSelectors.length; i++) {
        var el = document.querySelector(chromeSelectors[i]);
        if (el) chromeH += el.getBoundingClientRect().height;
    }
    availH = availH - chromeH - 12;

    availW = availW - 6;

    var size = Math.floor(Math.min(availW, availH) / 8);
    g_cellSize = Math.max(28, Math.min(88, size));
    return g_cellSize;
}

