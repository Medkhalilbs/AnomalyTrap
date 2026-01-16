import type { GameRule, RuleResult, LogicItemData } from './Rule';
import { ColorRule } from './ColorRule';
import { ShapeRule } from './ShapeRule';
import { PatternRule } from './PatternRule';
import { OrientationRule } from './OrientationRule';
import { MotionRule } from './MotionRule';
import { GlitchRule } from './GlitchRule';
import { RecursiveRule } from './RecursiveRule';
import { StroopRule } from './StroopRule';
import { PathRule } from './PathRule';
import { getRandomInt, getRandomElement } from '../../utils/random';

export class CompositeRule implements GameRule {
    name = 'Composite Logic';
    description = 'Combination of multiple cognitive and visual anomalies.';

    private rules: GameRule[] = [
        new ColorRule(),
        new ShapeRule(),
        new PatternRule(),
        new OrientationRule(),
        new MotionRule(),
        new GlitchRule(),
        new RecursiveRule(),
        new StroopRule(),
        new PathRule()
    ];

    generate(difficulty: number, count?: number): RuleResult {
        const itemCount = count || getRandomInt(5, 7);

        // Pick two rules to combine
        const rule1 = getRandomElement(this.rules) || this.rules[0];
        const rule2 = getRandomElement(this.rules) || this.rules[1];

        const res1 = rule1.generate(difficulty, itemCount);
        const res2 = rule2.generate(difficulty, itemCount);

        const finalOutlierIndex = res1.outlierIndex;
        const items: LogicItemData[] = [];

        for (let i = 0; i < itemCount; i++) {
            const baseItem = res1.items[i];
            const secondaryItem = res2.items[i === finalOutlierIndex ? res2.outlierIndex : (res2.outlierIndex + 1) % itemCount];

            if (!baseItem || !secondaryItem) {
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

            // Merge properties aggressively for "Brain Fuck" effect
            items.push({
                ...baseItem,
                innerShape: secondaryItem.innerShape,
                innerColor: secondaryItem.innerColor,
                secondaryColor: i === finalOutlierIndex ? baseItem.secondaryColor : secondaryItem.secondaryColor,
                rotation: i === finalOutlierIndex ? baseItem.rotation : secondaryItem.rotation,
                animationType: i === finalOutlierIndex ? baseItem.animationType : secondaryItem.animationType,
                animationSpeed: i === finalOutlierIndex ? baseItem.animationSpeed : secondaryItem.animationSpeed
            });
        }

        return {
            items,
            outlierIndex: finalOutlierIndex,
            ruleDescription: 'Extreme Cognitive Anomaly',
        };
    }
}
