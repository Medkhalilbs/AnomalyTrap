import type { GameRule, RuleResult, LogicItemData } from './Rule';
import { getRandomInt, getRandomElement } from '../../utils/random';

export class GlitchRule implements GameRule {
    name = 'Glitch Logic';
    description = 'High-stakes mode where one item flickers/distorts.';

    generate(_difficulty: number, count?: number): RuleResult {
        const itemCount = count || getRandomInt(5, 7);
        const items: LogicItemData[] = [];
        const outlierIndex = getRandomInt(0, itemCount - 1);

        const baseShape = getRandomElement(['star', 'hexagon', 'pentagon'] as const) || 'star';
        const baseColor = '#e74c3c';

        for (let i = 0; i < itemCount; i++) {
            items.push({
                id: i.toString(),
                shape: baseShape,
                color: baseColor,
                rotation: 0,
                scale: 1,
                opacity: 1,
                strokeWidth: 4,
                hasInnerDot: false,
                isHollow: false,
                animationType: i === outlierIndex ? 'glitch' : 'none',
                animationSpeed: i === outlierIndex ? 0.5 : 0
            });
        }

        return {
            items,
            outlierIndex,
            ruleDescription: 'Find the Glitch',
        };
    }
}
