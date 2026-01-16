import type { GameRule } from '../rules/Rule';
import { ShapeRule } from '../rules/ShapeRule';
import { ColorRule } from '../rules/ColorRule';
import { PatternRule } from '../rules/PatternRule';
import { OrientationRule } from '../rules/OrientationRule';
import { MotionRule } from '../rules/MotionRule';
import { GlitchRule } from '../rules/GlitchRule';
import { RecursiveRule } from '../rules/RecursiveRule';
import { StroopRule } from '../rules/StroopRule';
import { PathRule } from '../rules/PathRule';
import { CompositeRule } from '../rules/CompositeRule';
import { getRandomElement, getRandomInt } from '../../utils/random';

export class LevelGenerator {
    private rules: GameRule[];

    constructor() {
        this.rules = [
            new ShapeRule(),
            new ColorRule(),
            new PatternRule(),
            new OrientationRule(),
            new MotionRule(),
            new GlitchRule(),
            new RecursiveRule(),
            new StroopRule(),
            new PathRule(),
            new CompositeRule()
        ];
    }

    generate(difficulty: number, score: number): any {
        const level = score + 1;
        const isBoss = level % 5 === 0;

        // Determine item count
        let itemCount = getRandomInt(5, 7);
        if (isBoss) {
            itemCount = Math.min(20, 9 + (difficulty * 2));
        } else if (level > 5) {
            itemCount = getRandomInt(6, 8);
        }

        // Rule selection
        let selectedRule: GameRule;

        if (isBoss) {
            selectedRule = this.rules[this.rules.length - 1] as GameRule; // Composite
        } else if (level < 2) {
            // Level 1: Basics only
            selectedRule = (getRandomElement(this.rules.slice(0, 3)) || this.rules[0]) as GameRule;
        } else if (level < 5) {
            // Level 2-4: Add Motion & Glitch
            selectedRule = (getRandomElement(this.rules.slice(0, 6)) || this.rules[0]) as GameRule;
        } else {
            // Level 5+: UNLOCK EVERYTHING (Mind Traps included)
            selectedRule = (getRandomElement(this.rules) || this.rules[0]) as GameRule;
        }

        const result = selectedRule.generate(difficulty, itemCount);

        // --- LIAR MODE (Brain Fuck) ---
        // Activate earlier: Level 5+
        if (level > 5 && level % 3 === 0) {
            const isLiar = Math.random() > 0.6;
            if (isLiar) {
                const decoyRule = getRandomElement(this.rules.filter(r => r !== selectedRule));
                result.ruleDescription = `⚠️ TRUST NO ONE: ${decoyRule?.name}`;
            }
        }

        if (isBoss) {
            result.ruleDescription = `BOSS: ${result.ruleDescription}`;
        }

        return result;
    }
}
