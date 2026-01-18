class SoundManager {
    private ctx: AudioContext | null = null;

    private init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    playTap() {
        this.init();
        if (!this.ctx) return;
        this.playOscillator(440, 0.1, 'sine');
    }

    playSuccess() {
        this.init();
        if (!this.ctx) return;
        this.playOscillator(660, 0.2, 'sine');
        setTimeout(() => this.playOscillator(880, 0.2, 'sine'), 50);
    }

    playError() {
        this.init();
        if (!this.ctx) return;
        this.playOscillator(220, 0.3, 'sawtooth');
    }

    playMenuClick() {
        this.init();
        if (!this.ctx) return;
        this.playOscillator(550, 0.05, 'triangle');
    }

    private musicLayer1: OscillatorNode | null = null;
    private musicLayer2: OscillatorNode | null = null;
    private musicLayer3: OscillatorNode | null = null;
    private musicGains: GainNode[] = [];

    stopMusic() {
        this.musicLayer1?.stop();
        this.musicLayer2?.stop();
        this.musicLayer3?.stop();
        this.musicGains.forEach(g => g.disconnect());
        this.musicGains = [];
        this.musicLayer1 = null;
        this.musicLayer2 = null;
        this.musicLayer3 = null;
    }

    playMusic(mood: 'mystery' | 'action' | 'calm') {
        this.init();
        if (!this.ctx) return;
        this.stopMusic();

        const settings = localStorage.getItem('game_settings');
        if (settings) {
            try {
                const s = JSON.parse(settings);
                if (s.sound === false) return;
            } catch (e) { }
        }

        const now = this.ctx.currentTime;

        // Layer 1: The Bass/Drone
        this.musicLayer1 = this.ctx.createOscillator();
        const g1 = this.ctx.createGain();
        const baseFreq = mood === 'mystery' ? 55 : (mood === 'action' ? 70 : 110);
        this.musicLayer1.type = mood === 'action' ? 'sawtooth' : 'sine';
        this.musicLayer1.frequency.setValueAtTime(baseFreq, now);

        // Modal shimmer for mystery
        if (mood === 'mystery') {
            const lfo = this.ctx.createOscillator();
            const lfoG = this.ctx.createGain();
            lfo.frequency.value = 0.5;
            lfoG.gain.value = 2;
            lfo.connect(lfoG);
            lfoG.connect(this.musicLayer1.frequency);
            lfo.start();
        }

        g1.gain.setValueAtTime(0, now);
        g1.gain.linearRampToValueAtTime(0.04, now + 2);
        this.musicLayer1.connect(g1);
        g1.connect(this.ctx.destination);
        this.musicGains.push(g1);
        this.musicLayer1.start();

        // Layer 2: Harmony/Pulse
        this.musicLayer2 = this.ctx.createOscillator();
        const g2 = this.ctx.createGain();
        this.musicLayer2.type = 'triangle';
        const harmFreq = baseFreq * (mood === 'mystery' ? 1.5 : 2); // Perfect fifth or octave
        this.musicLayer2.frequency.setValueAtTime(harmFreq, now);

        // Rhythm pulse
        const pulseRate = mood === 'action' ? 0.2 : 4;
        for (let i = 0; i < 100; i++) {
            g2.gain.setValueAtTime(0.01, now + (i * pulseRate));
            g2.gain.exponentialRampToValueAtTime(0.03, now + (i * pulseRate) + 0.1);
            g2.gain.exponentialRampToValueAtTime(0.01, now + (i * pulseRate) + pulseRate);
        }

        this.musicLayer2.connect(g2);
        g2.connect(this.ctx.destination);
        this.musicGains.push(g2);
        this.musicLayer2.start();

        // Layer 3: Atmospheric Noise/Highs
        this.musicLayer3 = this.ctx.createOscillator();
        const g3 = this.ctx.createGain();
        this.musicLayer3.type = 'sine';
        this.musicLayer3.frequency.setValueAtTime(baseFreq * 4, now);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;

        g3.gain.setValueAtTime(0, now);
        g3.gain.linearRampToValueAtTime(0.01, now + 5);

        this.musicLayer3.connect(filter);
        filter.connect(g3);
        g3.connect(this.ctx.destination);
        this.musicGains.push(g3);
        this.musicLayer3.start();
    }

    private playOscillator(freq: number, duration: number, type: OscillatorType) {
        if (!this.ctx) return;

        const settings = localStorage.getItem('game_settings');
        if (settings) {
            try {
                const s = JSON.parse(settings);
                if (s.sound === false) return;
            } catch (e) { }
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
}

export const sounds = new SoundManager();
