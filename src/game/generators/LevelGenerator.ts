import type { GameRule, RuleResult } from '../rules/Rule';
import { NumberRule } from '../rules/NumberRule';
import { ShapeRule } from '../rules/ShapeRule';
import { ColorRule } from '../rules/ColorRule';
import { CompositeRule } from '../rules/CompositeRule';
import { getRandomElement, getRandomInt } from '../../utils/random';

export class LevelGenerator {
    private rules: GameRule[] = [];

    constructor() {
        this.rules = [
            new NumberRule(),
            new ShapeRule(),
            new ColorRule(),
            new CompositeRule(),
        ];
    }

    generate(level: number): RuleResult {
        const isBoss = level % 5 === 0;
        const difficulty = Math.floor(level / 5);

        // Grid size scaling
        let itemCount = getRandomInt(5, 7);
        if (isBoss) {
            itemCount = 9 + (difficulty * 3); // 9, 12, 15...
            if (itemCount > 20) itemCount = 20; // Cap grid size
        } else if (level > 5) {
            itemCount = getRandomInt(6, 8);
        }

        // Rule selection
        let availableRules = this.rules;
        if (isBoss) {
            // Boss levels are always Composite
            availableRules = this.rules.filter(r => r instanceof CompositeRule);
        } else if (level < 5) {
            availableRules = this.rules.filter(r => r instanceof NumberRule || r instanceof ColorRule);
        } else if (level < 10) {
            availableRules = this.rules.filter(r => !(r instanceof CompositeRule));
        }

        const rule = getRandomElement(availableRules);
        const result = rule.generate(difficulty, itemCount);

        if (isBoss) {
            result.ruleDescription = `BOSS: ${result.ruleDescription}`;
        }

        return result;
    }
}
