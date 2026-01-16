import type { GameRule, RuleResult, LogicItemData } from './Rule';
import { getRandomInt, getRandomElement } from '../../utils/random';

const COLORS = [
    '#3498db', // Blue
    '#e74c3c', // Red
    '#2ecc71', // Green
    '#f1c40f', // Yellow
    '#9b59b6', // Purple
];

export class StroopRule implements GameRule {
    name = 'Visual Stroop';
    description = 'Color contradiction/swap anomalies.';

    generate(_difficulty: number, count?: number): RuleResult {
        const itemCount = count || getRandomInt(5, 7);
        const items: LogicItemData[] = [];
        const outlierIndex = getRandomInt(0, itemCount - 1);

        const colorA = getRandomElement(COLORS);
        const colorB = getRandomElement(COLORS.filter(c => c !== colorA));

        const baseShape = getRandomElement(['square', 'hexagon', 'pentagon'] as const);

        for (let i = 0; i < itemCount; i++) {
            let outerColor = colorA;
            let secondaryColor = colorB;

            if (i === outlierIndex) {
                // The "Brain Fuck" swap
                outerColor = colorB;
                secondaryColor = colorA;
            }

            items.push({
                id: i.toString(),
                shape: baseShape,
                color: outerColor,
                secondaryColor,
                rotation: 0,
                scale: 1,
                opacity: 1,
                strokeWidth: 4,
                hasInnerDot: false,
                isHollow: false,
                animationType: 'none',
                animationSpeed: 0
            });
        }

        return {
            items,
            outlierIndex,
            ruleDescription: 'Find the Inversion',
        };
    }
}
