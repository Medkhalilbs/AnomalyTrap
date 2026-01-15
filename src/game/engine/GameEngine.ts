import { LevelManager } from './LevelManager';
import type { RuleResult } from '../rules/Rule';

export class GameEngine {
    private levelManager: LevelManager;
    private onLevelUpdate: (result: RuleResult) => void;
    private onGameOver: (score: number) => void;
    private onScoreUpdate: (score: number) => void;
    private onLivesUpdate: (lives: number) => void;
    private onHintReward: (hints: number) => void;

    private score: number = 0;
    private highscore: number = 0;
    private lives: number = 3;
    private hints: number = 1;
    private isRunning: boolean = false;

    constructor(
        onLevelUpdate: (result: RuleResult) => void,
        onGameOver: (score: number) => void,
        onScoreUpdate: (score: number) => void,
        onLivesUpdate: (lives: number) => void,
        onHintReward: (hints: number) => void
    ) {
        this.levelManager = new LevelManager();
        this.onLevelUpdate = onLevelUpdate;
        this.onGameOver = onGameOver;
        this.onScoreUpdate = onScoreUpdate;
        this.onLivesUpdate = onLivesUpdate;
        this.onHintReward = onHintReward;

        this.loadHighscore();
    }

    start() {
        this.score = 0;
        this.lives = 3;
        this.hints = 1;
        this.isRunning = true;
        this.onScoreUpdate(this.score);
        this.onLivesUpdate(this.lives);
        this.onHintReward(this.hints);

        const result = this.levelManager.reset();
        this.onLevelUpdate(result);
    }

    handleTap(index: number) {
        if (!this.isRunning) return false;

        if (this.levelManager.checkAnswer(index)) {
            this.score++;
            this.onScoreUpdate(this.score);

            // Reward hint every 10 levels
            if (this.score > 0 && this.score % 10 === 0) {
                this.hints = Math.min(3, this.hints + 1);
                this.onHintReward(this.hints);
            }

            const result = this.levelManager.nextLevel();
            this.onLevelUpdate(result);
            return true;
        } else {
            this.lives--;
            this.onLivesUpdate(this.lives);

            if (this.lives <= 0) {
                this.gameOver();
            }
            return false;
        }
    }

    private gameOver() {
        this.isRunning = false;

        if (this.score > this.highscore) {
            this.highscore = this.score;
            this.saveHighscore();
        }
        this.onGameOver(this.score);
    }

    getEstimatedIQ(): number {
        return 100 + (this.score * 2.5);
    }

    private loadHighscore() {
        const saved = localStorage.getItem('outlier_highscore');
        if (saved) {
            this.highscore = parseInt(saved, 10);
        }
    }

    private saveHighscore() {
        localStorage.setItem('outlier_highscore', this.highscore.toString());
    }

    getHighscore(): number {
        return this.highscore;
    }
}
