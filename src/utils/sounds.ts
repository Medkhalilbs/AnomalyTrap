import suspenseMusic from '../assets/suspense.mp3';

class SoundManager {
    private ctx: AudioContext | null = null;
    private music: HTMLAudioElement | null = null;

    private init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (!this.music) {
            this.music = new Audio(suspenseMusic);
            this.music.loop = true;
            this.music.volume = 0.4;
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

    stopMusic() {
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
        }
    }

    playMusic() {
        // We ignore the mood and play the fixed suspense track
        this.init();
        if (!this.music) return;

        const settings = localStorage.getItem('game_settings');
        if (settings) {
            try {
                const s = JSON.parse(settings);
                if (s.sound === false) {
                    this.stopMusic();
                    return;
                }
            } catch { }
        }

        // Only play if not already playing
        if (this.music.paused) {
            this.music.play().catch(() => console.warn("Audio playback blocked by browser policy. Interaction required."));
        }
    }

    private playOscillator(freq: number, duration: number, type: OscillatorType) {
        if (!this.ctx) return;

        const settings = localStorage.getItem('game_settings');
        if (settings) {
            try {
                const s = JSON.parse(settings);
                if (s.sound === false) return;
            } catch { }
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
