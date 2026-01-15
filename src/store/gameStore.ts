import { defineStore } from 'pinia';
import { GameEngine } from '../game/engine/GameEngine';
import type { RuleResult, LogicItemData } from '../game/rules/Rule';

export const useGameStore = defineStore('game', {
    state: () => ({
        score: 0,
        highscore: 0,
        estimatedIQ: 100,
        lives: 3,
        hints: 1,
        isHintActive: false,
        outlierIndex: -1,
        currentItems: [] as LogicItemData[],
        isGameOver: false,
        lastCorrect: false,
        engine: null as GameEngine | null,
        levelText: 'Level 1',
    }),

    actions: {
        initGame() {
            this.engine = new GameEngine(
                (result: RuleResult) => {
                    this.currentItems = result.items;
                    this.outlierIndex = result.outlierIndex;
                },
                (finalScore: number) => {
                    this.score = finalScore;
                    this.isGameOver = true;
                },
                (newScore: number) => {
                    this.score = newScore;
                    this.highscore = Math.max(this.highscore, this.engine?.getHighscore() || 0);
                    this.estimatedIQ = this.engine?.getEstimatedIQ() || 100;
                },
                (lives: number) => {
                    this.lives = lives;
                },
                (hints: number) => {
                    this.hints = hints;
                }
            );
            this.highscore = this.engine.getHighscore();
            this.engine.start();
            this.isGameOver = false;
        },

        tapItem(index: number) {
            if (this.isGameOver) return;

            const success = this.engine?.handleTap(index);
            if (success) {
                this.lastCorrect = true;
                setTimeout(() => {
                    this.lastCorrect = false;
                }, 500);
            }
        },

        restart() {
            this.isGameOver = false;
            this.engine?.start();
        },

        useHint() {
            if (this.isGameOver || this.hints <= 0 || this.isHintActive) return;

            this.hints--;
            this.isHintActive = true;
            setTimeout(() => {
                this.isHintActive = false;
            }, 1000);
        }
    },
});
