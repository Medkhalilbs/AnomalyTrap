import { defineStore } from 'pinia';
import { GameEngine } from '../game/engine/GameEngine';
import type { RuleResult, LogicItemData } from '../game/rules/Rule';
import { getThemeForScore, themes, type Theme } from '../utils/themes';
import { sounds } from '../utils/sounds';
import { GameMode, type GameModeValue } from '../types/modes';

export const GameState = {
    MENU: 'MENU',
    MODE_SELECT: 'MODE_SELECT',
    PLAYING: 'PLAYING',
    GAMEOVER: 'GAMEOVER'
} as const;

export type GameStateValue = typeof GameState[keyof typeof GameState];

export interface Achievement {
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
    icon: string;
}

export const useGameStore = defineStore('game', {
    state: () => ({
        gameState: GameState.MENU as GameStateValue,
        currentMode: GameMode.ANOMALY_HUNT as GameModeValue,
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
        currentTheme: themes[0] as Theme,
        combo: 0,
        isShaking: false,
        achievements: [
            { id: 'first_win', name: 'Fresh Start', description: 'Complete level 1', unlocked: false, icon: '🌱' },
            { id: 'boss_slayer', name: 'Boss Buster', description: 'Beat your first Boss Level', unlocked: false, icon: '⚔️' },
            { id: 'logic_master', name: 'Logic Master', description: 'Reach 130 IQ', unlocked: false, icon: '🧠' },
            { id: 'perfect_run', name: 'Perfect Run', description: 'Reach Level 20 without losing a life', unlocked: false, icon: '💎' },
        ] as Achievement[],
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
                    this.checkAchievements();
                },
                (newScore: number) => {
                    this.score = newScore;
                    this.highscore = Math.max(this.highscore, this.engine?.getHighscore() || 0);
                    this.estimatedIQ = this.engine?.getEstimatedIQ() || 100;
                    this.currentTheme = getThemeForScore(this.score);
                    this.checkAchievements();
                },
                (lives: number) => {
                    this.lives = lives;
                },
                (hints: number) => {
                    this.hints = hints;
                }
            );
            this.highscore = this.engine.getHighscore();
            this.loadAchievements();
        },

        startGame() {
            sounds.playMenuClick();
            this.gameState = GameState.PLAYING;
            this.isGameOver = false;
            this.engine?.start();
        },

        tapItem(index: number) {
            if (this.gameState !== GameState.PLAYING) return;

            const success = this.engine?.handleTap(index);
            if (success) {
                sounds.playSuccess();
                this.lastCorrect = true;
                this.combo++;

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

        checkAchievements() {
            if (!this.achievements || this.achievements.length < 4) return;

            let changed = false;
            if (this.score >= 1 && this.achievements[0] && !this.achievements[0].unlocked) {
                this.achievements[0].unlocked = true;
                changed = true;
            }
            if (this.score >= 5 && this.achievements[1] && !this.achievements[1].unlocked) {
                this.achievements[1].unlocked = true;
                changed = true;
            }
            if (this.estimatedIQ >= 130 && this.achievements[2] && !this.achievements[2].unlocked) {
                this.achievements[2].unlocked = true;
                changed = true;
            }
            if (this.score >= 20 && this.lives === 3 && this.achievements[3] && !this.achievements[3].unlocked) {
                this.achievements[3].unlocked = true;
                changed = true;
            }

            if (changed) {
                this.saveAchievements();
            }
        },

        saveAchievements() {
            localStorage.setItem('outlier_achievements', JSON.stringify(this.achievements));
        },

        loadAchievements() {
            const saved = localStorage.getItem('outlier_achievements');
            if (saved) {
                try {
                    const loaded = JSON.parse(saved);
                    if (Array.isArray(loaded)) {
                        // Merge loaded status with base list to avoid breaking if schema changes
                        loaded.forEach((savedAch: Achievement) => {
                            const index = this.achievements.findIndex(a => a.id === savedAch.id);
                            if (index !== -1 && this.achievements[index]) {
                                (this.achievements[index] as Achievement).unlocked = savedAch.unlocked;
                            }
                        });
                    }
                } catch (e) {
                    console.error('Failed to load achievements', e);
                }
            }
        }
    },
});
