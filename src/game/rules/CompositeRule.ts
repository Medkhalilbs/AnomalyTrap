import type { GameRule, RuleResult, LogicItemData } from './Rule';
import { ColorRule } from './ColorRule';
import { ShapeRule } from './ShapeRule';
import { PatternRule } from './PatternRule';
import { OrientationRule } from './OrientationRule';
import { getRandomInt, getRandomElement } from '../../utils/random';

export class CompositeRule implements GameRule {
    name = 'Composite Logic';
    description = 'Combination of multiple visual anomalies.';

    private rules: GameRule[] = [
        new ColorRule(),
        new ShapeRule(),
        new PatternRule(),
        new OrientationRule()
    ];

    generate(difficulty: number, count?: number): RuleResult {
        const itemCount = count || getRandomInt(5, 7);

        // Pick two DIFFERENT rules to combine
        const rule1 = getRandomElement(this.rules) ?? this.rules[0];
        let rule2 = getRandomElement(this.rules) ?? this.rules[1];

        // Ensure rule2 is different from rule1
        while (rule2 === rule1 && this.rules.length > 1) {
            rule2 = getRandomElement(this.rules) ?? this.rules[1];
        }

        const res1 = rule1.generate(difficulty, itemCount);
        const res2 = rule2.generate(difficulty, itemCount);

        // Use res1's outlier as the final outlier
        const finalOutlierIndex = res1.outlierIndex;
        const items: LogicItemData[] = [];

        for (let i = 0; i < itemCount; i++) {
            const baseItem = res1.items[i];

            if (!baseItem) {
                items.push({
                    id: i.toString(),
                    shape: 'circle',
                    color: '#3498db',
                    rotation: 0,
                    scale: 1,
                    opacity: 1,
                    strokeWidth: 4,
                    hasInnerDot: false,
                    isHollow: false,
                    animationType: 'none',
                    animationSpeed: 0
                });
                continue;
            }

            // For decoys: take properties from res2's decoys
            // For outlier: keep res1's outlier properties (don't override!)
            const secondaryIndex = i === finalOutlierIndex ? res2.outlierIndex : (res2.outlierIndex + 1) % itemCount;
            const secondaryItem = res2.items[secondaryIndex];

            if (!secondaryItem) {
                items.push(baseItem);
                continue;
            }

            // Merge: base properties from res1, add secondary visual details from res2
            items.push({
                ...baseItem,
                // Add secondary visual complexity without breaking the primary rule
                strokeWidth: secondaryItem.strokeWidth,
                hasInnerDot: secondaryItem.hasInnerDot,
                isHollow: secondaryItem.isHollow
            });
        }

        return {
            items,
            outlierIndex: finalOutlierIndex,
            ruleDescription: 'Multi-Logic Anomaly',
        };
    }
}
