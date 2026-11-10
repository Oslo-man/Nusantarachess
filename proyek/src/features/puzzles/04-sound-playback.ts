/*__SPLIT_BANNER_START__*/
/*__SPLIT_BANNER_END__*/
function getAudioCtx() {
            if (!sharedAudioCtx) {
                try {
                    sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
                } catch (e) {
                    return null;
                }
            }
            if (sharedAudioCtx.state === 'suspended') {
                sharedAudioCtx.resume().catch(() => {});
            }
            return sharedAudioCtx;
        }

        function initAudio() {
            const ctx = getAudioCtx();
            if (!ctx) return;
            for (const key in SOUND_FILES) {
                if (soundBuffers[key] || soundLoadPromises[key]) continue;
                soundLoadPromises[key] = fetch(SOUND_FILES[key])
                    .then(res => res.arrayBuffer())
                    .then(data => ctx.decodeAudioData(data))
                    .then(buffer => { soundBuffers[key] = buffer; })
                    .catch(() => {
                        delete soundLoadPromises[key];
                    });
            }
        }

        function playBufferAt(key: any, startAt?: any) {
            const ctx = getAudioCtx();
            if (!ctx) return null;
            const t = (startAt !== undefined && startAt !== null) ? startAt : ctx.currentTime;
            const buffer = soundBuffers[key];
            if (!buffer) {
                initAudio();
                return t;
            }
            try {
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                const gain = ctx.createGain();
                gain.gain.value = 1.0;
                source.connect(gain);
                gain.connect(ctx.destination);
                source.start(t);
                return t;
            } catch (e) {
                return t;
            }
        }

        function playSound(key: any) {
            playBufferAt(key);
        }

        function resolveMoveSoundKey(piece: any, captured: any, options: any) {
            const flags = options?.flags || '';
            const promotion = options?.promotion;
            const isCheck = !!(options?.isCheck);
            const isCastle = flags.includes('k') || flags.includes('q');

            if (promotion && piece === 'p') return 'promote';
            if (isCastle) return 'castle';
            if (isCheck) return 'check';
            if (captured) return 'capture';
            return 'move';
        }

        function playMoveSound(piece: any, from: any, to: any, captured: any, options: any) {
            if (!settings.soundMoves) return null;
            initAudio();
            const key = resolveMoveSoundKey(piece, captured, options);
            return playBufferAt(key);
        }

        function playMoveSoundWithFollowUp(piece: any, from: any, to: any, captured: any, options: any, followUpFn: any) {
            if (!settings.soundMoves) {
                if (typeof followUpFn === 'function') followUpFn(undefined);
                return;
            }
            initAudio();
            const ctx = getAudioCtx();
            const key = resolveMoveSoundKey(piece, captured, options);
            const startAt = ctx ? ctx.currentTime : undefined;
            playBufferAt(key, startAt);
            if (typeof followUpFn === 'function') followUpFn(startAt);
        }

        function playSolvedSound(startAt: any) {
            if (!settings.soundEffects) return;
            const ctx = getAudioCtx();
            if (!ctx) return;
            try {
                const nowActual = ctx.currentTime;
                const requested = (startAt !== undefined && startAt !== null) ? startAt : nowActual;
                const now = Math.max(requested, nowActual);
                const notes = [523.25, 659.25, 783.99];
                notes.forEach((freq, i) => {
                    const t = now + i * 0.09;
                    const osc = ctx.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, t);
                    const gain = ctx.createGain();
                    gain.gain.setValueAtTime(0.0001, t);
                    gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(t);
                    osc.stop(t + 0.4);
                });
            } catch (e) {
            }
        }

        function playWrongSound(startAt?: any) {
            if (!settings.soundEffects) return;
            const ctx = getAudioCtx();
            if (!ctx) return;
            try {
                const nowActual = ctx.currentTime;
                const requested = (startAt !== undefined && startAt !== null) ? startAt : nowActual;
                const now = Math.max(requested, nowActual);
                const notes = [440, 330];
                notes.forEach((freq, i) => {
                    const t = now + i * 0.10;
                    const osc = ctx.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, t);
                    osc.frequency.exponentialRampToValueAtTime(freq * 0.92, t + 0.15);
                    const gain = ctx.createGain();
                    gain.gain.setValueAtTime(0.2, t);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(t);
                    osc.stop(t + 0.22);
                });
            } catch (e) {
            }
        }

        function playTimeUpSound(startAt?: any) {
            if (!settings.soundEffects) return;
            const ctx = getAudioCtx();
            if (!ctx) return;
            try {
                const nowActual = ctx.currentTime;
                const requested = (startAt !== undefined && startAt !== null) ? startAt : nowActual;
                const now = Math.max(requested, nowActual);
                const freqs = [220, 277, 220, 277, 220, 277, 220, 277, 220, 277, 220, 277];
                freqs.forEach((freq, i) => {
                    const t = now + i * 0.08;
                    const osc = ctx.createOscillator();
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(freq, t);
                    const gain = ctx.createGain();
                    gain.gain.setValueAtTime(0.12, t);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(t);
                    osc.stop(t + 0.08);
                });
            } catch (e) {
            }
        }

        
        