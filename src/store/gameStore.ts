import { defineStore } from 'pinia';
import { GameEngine } from '../game/engine/GameEngine';
import type { RuleResult, LogicItemData } from '../game/rules/Rule';

export const useGameStore = defineStore('game', {
    state: () => ({
        score: 0,
        highscore: 0,
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
                },
                (finalScore: number) => {
                    this.score = finalScore;
                    this.isGameOver = true;
                },
                (newScore: number) => {
                    this.score = newScore;
                    this.highscore = Math.max(this.highscore, this.engine?.getHighscore() || 0);
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
            } else {
                this.isGameOver = true;
            }
        },

        restart() {
            this.isGameOver = false;
            this.engine?.start();
        }
    },
});
