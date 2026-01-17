import { defineStore } from 'pinia';
import { GameEngine } from '../game/engine/GameEngine';
import type { RuleResult, LogicItemData } from '../game/rules/Rule';
import { getThemeForScore, themes, type Theme } from '../utils/themes';
import { sounds } from '../utils/sounds';
import { GameMode, type GameModeValue } from '../types/modes';
import { type Goal, GENERATE_DAILY_GOALS, LIFETIME_MILESTONES } from '../types/objectives';

export const GameState = {
    MENU: 'MENU',
    MODE_SELECT: 'MODE_SELECT',
    PLAYING: 'PLAYING',
    GAMEOVER: 'GAMEOVER'
} as const;

export type GameStateValue = typeof GameState[keyof typeof GameState];

export const useGameStore = defineStore('game', {
    state: () => ({
        gameState: GameState.MENU as GameStateValue,
        currentMode: GameMode.ANOMALY_HUNT as GameModeValue,
        score: 0,
        highscore: 0,
        lives: 3,
        hints: 1,
        isHintActive: false,
        outlierIndex: -1,
        currentItems: [] as LogicItemData[],
        isGameOver: false,
        lastCorrect: false,
        engine: null as GameEngine | null,
        levelText: 'Level 1',
        currentTheme: themes[0] as Theme,
        combo: 0,
        isShaking: false,
        activeGoals: [] as Goal[],
    }),

    actions: {
        initGame() {
            this.engine = new GameEngine(
                (result: RuleResult) => {
                    this.currentItems = result.items;
                    this.outlierIndex = result.outlierIndex;

                    const level = this.engine?.getScore() ? (this.engine.getScore() + 1) : 1;
                    const isBoss = level % 5 === 0;
                    this.levelText = isBoss ? `BOSS LEVEL ${Math.floor(level / 5)}` : `Level ${level}`;
                    this.currentTheme = getThemeForScore(this.score);
                },
                (finalScore: number) => {
                    this.score = finalScore;
                    this.isGameOver = true;
                    this.gameState = GameState.GAMEOVER;
                    this.checkGoals('gameplay', 1);
                    this.saveGoals();
                },
                (newScore: number) => {
                    this.score = newScore;
                    this.highscore = Math.max(this.highscore, this.engine?.getHighscore() || 0);
                    this.currentTheme = getThemeForScore(this.score);
                    this.checkGoals('score', this.score);
                },
                (lives: number) => {
                    this.lives = lives;
                },
                (hints: number) => {
                    this.hints = hints;
                }
            );
            this.highscore = this.engine.getHighscore();
            this.loadGoals();
        },

        startGame() {
            sounds.playMenuClick();
            this.gameState = GameState.PLAYING;
            this.isGameOver = false;
            this.engine?.start();
            this.checkGoals('gameplay', 1); // Increment games played
        },

        tapItem(index: number) {
            if (this.gameState !== GameState.PLAYING) return;

            const success = this.engine?.handleTap(index);
            if (success) {
                sounds.playSuccess();
                this.lastCorrect = true;
                this.combo++;
                this.checkGoals('combo', this.combo);

                // Extra score based on combo
                if (this.combo > 1) {
                    this.score += (this.combo - 1) * 2;
                }

                setTimeout(() => {
                    this.lastCorrect = false;
                }, 500);
            } else {
                sounds.playError();
                this.combo = 0;
                this.isShaking = true;
                if (window.navigator.vibrate) window.navigator.vibrate(100);
                setTimeout(() => {
                    this.isShaking = false;
                }, 400);
            }
        },

        restart() {
            this.startGame();
        },

        goToMenu() {
            sounds.playMenuClick();
            this.gameState = GameState.MENU;
            this.isGameOver = false;
            this.saveGoals();
        },

        useHint() {
            if (this.gameState !== GameState.PLAYING || this.hints <= 0 || this.isHintActive) return;

            sounds.playMenuClick();
            this.hints--;
            this.isHintActive = true;
            setTimeout(() => {
                this.isHintActive = false;
            }, 1000);
        },

        addScore(amount: number) {
            this.score += amount;
            this.highscore = Math.max(this.highscore, this.score);
            this.checkGoals('score', this.score);
        },

        endGame() {
            this.isGameOver = true;
            this.gameState = GameState.GAMEOVER;
            this.checkGoals('gameplay', 1);
            this.saveGoals();
            sounds.playError(); // Or game over sound
        },

        checkGoals(type: string, value: number) {
            this.activeGoals.forEach(goal => {
                if (goal.completed) return;

                if (goal.type === type) {
                    if (type === 'gameplay' || (goal.frequency === 'lifetime' && type === 'score')) {
                        // Cumulative types
                        goal.current += value; // Note: for score updates on every change, this logic needs care. 
                        // Actually, score comes in absolute values from engine callback.
                        // Lifetime score should aggregate the *difference* or be handled at gameover.
                        // For simplicity in this step, let's assume value passed for score is the current absolute score.
                        // But for lifetime, we need to add the session score at end.
                        // Let's adjust: checkGoals is called safely.

                        if (goal.frequency === 'lifetime' && type === 'score') {
                            // Lifetime score is updated only at GameOver or we track session accumulator.
                            // To avoid double counting, let's handle lifetime score at game over specifically?
                            // Or better: pass the *increment*?
                            // For now, let's handle gameplay increments correctly (startGame passes 1).
                        }
                        else if (type === 'gameplay') {
                            // Already += value
                        }
                    } else {
                        // High-water mark types (combo, single game score)
                        goal.current = Math.max(goal.current, value);
                    }

                    if (goal.current >= goal.target) {
                        goal.completed = true;
                        goal.current = goal.target;
                        // Notification logic could go here
                        this.saveGoals();
                    }
                }
            });
            // Special handling for lifetime accumulated score, could be done at Game Over to be safe
            if (type === 'score_accumulate') {
                this.activeGoals.forEach(g => {
                    if (g.frequency === 'lifetime' && g.type === 'score') {
                        g.current += value;
                        if (g.current >= g.target && !g.completed) {
                            g.completed = true;
                            g.current = g.target;
                            this.saveGoals();
                        }
                    }
                });
            }
        },

        // New helper to handle end-of-game accumulation
        finalizeGameStats(sessionScore: number) {
            this.checkGoals('score_accumulate', sessionScore);
            this.saveGoals();
        },

        saveGoals() {
            localStorage.setItem('outlier_goals', JSON.stringify(this.activeGoals));
        },

        loadGoals() {
            const saved = localStorage.getItem('outlier_goals');
            if (saved) {
                try {
                    const loaded = JSON.parse(saved);
                    // Merge with new structure if needed, or simple replace
                    // Basic validation
                    if (Array.isArray(loaded) && loaded.length > 0) {
                        this.activeGoals = loaded;
                    } else {
                        this.activeGoals = [...GENERATE_DAILY_GOALS(), ...LIFETIME_MILESTONES];
                    }
                } catch (e) {
                    console.error('Failed to load goals', e);
                    this.activeGoals = [...GENERATE_DAILY_GOALS(), ...LIFETIME_MILESTONES];
                }
            } else {
                this.activeGoals = [...GENERATE_DAILY_GOALS(), ...LIFETIME_MILESTONES];
            }
        }
    },
});
