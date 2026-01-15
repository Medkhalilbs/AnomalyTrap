import type { GameRule, RuleResult } from '../rules/Rule';
import { NumberRule } from '../rules/NumberRule';
import { ShapeRule } from '../rules/ShapeRule';
import { ColorRule } from '../rules/ColorRule';
import { CompositeRule } from '../rules/CompositeRule';
import { getRandomElement } from '../../utils/random';

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
        // Increase difficulty based on level
        const difficulty = Math.floor(level / 5);

        // Choose available rules based on difficulty
        // (Early levels might only use Number or Color)
        let availableRules = this.rules;
        if (level < 5) {
            availableRules = this.rules.filter(r => r instanceof NumberRule || r instanceof ColorRule);
        } else if (level < 10) {
            availableRules = this.rules.filter(r => !(r instanceof CompositeRule));
        }

        const rule = getRandomElement(availableRules);
        return rule.generate(difficulty);
    }
}
