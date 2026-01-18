import type { GameRule, RuleResult, LogicItemData } from './Rule';
import { getRandomInt, getRandomElement } from '../../utils/random';

export class PatternRule implements GameRule {
    name = 'Pattern Logic';
    description = 'Logic based on internal details or stroke style.';

    generate(_difficulty: number, count?: number): RuleResult {
        const itemCount = count || getRandomInt(5, 7);
        const items: LogicItemData[] = [];
        const outlierIndex = getRandomInt(0, itemCount - 1);

        const ruleType = getRandomElement(['innerDot', 'hollow', 'stroke']);

        const baseShape = getRandomElement(['circle', 'square', 'triangle', 'pentagon'] as const);
        const baseColor = '#e67e22';

        for (let i = 0; i < itemCount; i++) {
            let hasInnerDot = false;
            let isHollow = false;
            let strokeWidth = 4;

            if (ruleType === 'innerDot') {
                hasInnerDot = i !== outlierIndex; // All have dot except outlier
            } else if (ruleType === 'hollow') {
                isHollow = i !== outlierIndex; // All hollow except outlier
            } else if (ruleType === 'stroke') {
                strokeWidth = i === outlierIndex ? 10 : 2; // Different thickness
                isHollow = true;
            }

            items.push({
                id: i.toString(),
                shape: baseShape,
                color: baseColor,
                rotation: 0,
                scale: 1,
                opacity: 1,
                strokeWidth,
                hasInnerDot,
                isHollow,
                animationType: 'none',
                animationSpeed: 0
            });
        }

        return {
            items,
            outlierIndex,
            ruleDescription: `Rule: ${ruleType}`,
        };
    }
}
