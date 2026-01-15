import { LevelManager } from './LevelManager';
import type { RuleResult } from '../rules/Rule';

export class GameEngine {
    private levelManager: LevelManager;
    private onLevelUpdate: (result: RuleResult) => void;
    private onGameOver: (score: number) => void;
    private onScoreUpdate: (score: number) => void;

    private score: number = 0;
    private highscore: number = 0;

    constructor(
        onLevelUpdate: (result: RuleResult) => void,
        onGameOver: (score: number) => void,
        onScoreUpdate: (score: number) => void
    ) {
        this.levelManager = new LevelManager();
        this.onLevelUpdate = onLevelUpdate;
        this.onGameOver = onGameOver;
        this.onScoreUpdate = onScoreUpdate;

        this.loadHighscore();
    }

    start() {
        this.score = 0;
        this.onScoreUpdate(this.score);
        const result = this.levelManager.reset();
        this.onLevelUpdate(result);
    }

    handleTap(index: number) {
        if (this.levelManager.checkAnswer(index)) {
            this.score++;
            this.onScoreUpdate(this.score);
            const result = this.levelManager.nextLevel();
            this.onLevelUpdate(result);
            return true;
        } else {
            if (this.score > this.highscore) {
                this.highscore = this.score;
                this.saveHighscore();
            }
            this.onGameOver(this.score);
            return false;
        }
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
