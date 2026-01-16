import { LevelGenerator } from '../generators/LevelGenerator';
import type { RuleResult } from '../rules/Rule';

export class LevelManager {
    private generator: LevelGenerator;
    private currentLevel: number = 1;
    private lastResult: RuleResult | null = null;

    constructor() {
        this.generator = new LevelGenerator();
    }

    nextLevel(): RuleResult {
        this.currentLevel++;
        this.lastResult = this.generator.generate(this.currentLevel, this.currentLevel - 1);
        return this.lastResult as RuleResult;
    }

    getCurrentLevel(): number {
        return this.currentLevel;
    }

    checkAnswer(index: number): boolean {
        if (!this.lastResult) return false;
        return index === this.lastResult.outlierIndex;
    }

    reset(): RuleResult {
        this.currentLevel = 1;
        this.lastResult = this.generator.generate(this.currentLevel, this.currentLevel - 1);
        return this.lastResult as RuleResult;
    }
}
