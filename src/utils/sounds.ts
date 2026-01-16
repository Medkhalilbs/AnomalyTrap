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

    private playOscillator(freq: number, duration: number, type: OscillatorType) {
        if (!this.ctx) return;

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
