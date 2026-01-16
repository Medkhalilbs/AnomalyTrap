import type { GameRule, RuleResult, LogicItemData, ShapeType } from './Rule';
import { getRandomInt, getRandomElement } from '../../utils/random';

export class RecursiveRule implements GameRule {
    name = 'Recursive Logic';
    description = 'Nested shape anomalies.';

    generate(_difficulty: number, count?: number): RuleResult {
        const itemCount = count || getRandomInt(5, 7);
        const items: LogicItemData[] = [];
        const outlierIndex = getRandomInt(0, itemCount - 1);

        const ruleType = getRandomElement(['innerShape', 'outerShape', 'swap']);
        const baseOuter = getRandomElement(['circle', 'square', 'triangle', 'pentagon'] as ShapeType[]);
        const baseInner = getRandomElement((['circle', 'square', 'triangle', 'pentagon'] as ShapeType[]).filter(s => s !== baseOuter));

        const baseColor = '#e67e22';
        const innerColor = '#ffffff';

        for (let i = 0; i < itemCount; i++) {
            let outerShape = baseOuter;
            let innerShape = baseInner;

            if (ruleType === 'innerShape') {
                if (i === outlierIndex) {
                    innerShape = getRandomElement((['circle', 'square', 'triangle'] as ShapeType[]).filter(s => s !== baseInner));
                }
            } else if (ruleType === 'outerShape') {
                if (i === outlierIndex) {
                    outerShape = getRandomElement((['circle', 'square', 'triangle'] as ShapeType[]).filter(s => s !== baseOuter));
                }
            } else if (ruleType === 'swap') {
                if (i === outlierIndex) {
                    outerShape = baseInner;
                    innerShape = baseOuter;
                }
            }

            items.push({
                id: i.toString(),
                shape: outerShape,
                color: baseColor,
                rotation: 0,
                scale: 1,
                opacity: 1,
                strokeWidth: 4,
                hasInnerDot: false,
                isHollow: false,
                animationType: 'none',
                animationSpeed: 0,
                innerShape,
                innerColor
            });
        }

        return {
            items,
            outlierIndex,
            ruleDescription: `Rule: ${ruleType} recursion`,
        };
    }
}
