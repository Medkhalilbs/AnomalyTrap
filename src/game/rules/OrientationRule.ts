import type { GameRule, RuleResult, LogicItemData } from './Rule';
import { getRandomInt, getRandomElement } from '../../utils/random';

export class OrientationRule implements GameRule {
    name = 'Orientation Logic';
    description = 'Logic based on rotation or scale.';

    generate(_difficulty: number, count?: number): RuleResult {
        const itemCount = count || getRandomInt(5, 7);
        const items: LogicItemData[] = [];
        const outlierIndex = getRandomInt(0, itemCount - 1);

        const ruleType = getRandomElement(['rotation', 'scale', 'opacity']);
        const baseShape = getRandomElement(['square', 'triangle', 'pentagon', 'star'] as const);

        const baseRotation = getRandomInt(0, 3) * 90;
        const baseScale = 1;
        const baseOpacity = 1;

        for (let i = 0; i < itemCount; i++) {
            let rotation = baseRotation;
            let scale = baseScale;
            let opacity = baseOpacity;

            if (ruleType === 'rotation') {
                if (i === outlierIndex) {
                    rotation = (baseRotation + 45) % 360;
                }
            } else if (ruleType === 'scale') {
                if (i === outlierIndex) {
                    scale = 0.7;
                }
            } else if (ruleType === 'opacity') {
                if (i === outlierIndex) {
                    opacity = 0.5;
                }
            }

            items.push({
                id: i.toString(),
                shape: baseShape,
                color: '#9b59b6',
                rotation,
                scale,
                opacity,
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
            ruleDescription: `Rule: ${ruleType}`,
        };
    }
}
