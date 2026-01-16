import type { GameRule, RuleResult, LogicItemData } from './Rule';
import { getRandomInt, getRandomElement } from '../../utils/random';

export class MotionRule implements GameRule {
    name = 'Motion Logic';
    description = 'Logic based on movement patterns (Sync/Speed).';

    generate(_difficulty: number, count?: number): RuleResult {
        const itemCount = count || getRandomInt(5, 7);
        const items: LogicItemData[] = [];
        const outlierIndex = getRandomInt(0, itemCount - 1);

        const ruleType = getRandomElement(['speed', 'type', 'sync']);
        const baseShape = getRandomElement(['circle', 'square', 'star'] as const);
        const baseColor = '#2ecc71';

        const baseAnim = getRandomElement(['pulse', 'float', 'rotate'] as const) || 'pulse';
        const baseSpeed = 2.0;

        for (let i = 0; i < itemCount; i++) {
            let animationType: LogicItemData['animationType'] = baseAnim;
            let animationSpeed = baseSpeed;

            if (ruleType === 'speed') {
                if (i === outlierIndex) {
                    animationSpeed = baseSpeed * 0.4; // Much faster
                }
            } else if (ruleType === 'type') {
                if (i === outlierIndex) {
                    animationType = baseAnim === 'rotate' ? 'float' : 'rotate';
                }
            } else if (ruleType === 'sync') {
                if (i === outlierIndex) {
                    animationType = 'shake';
                }
            }

            items.push({
                id: i.toString(),
                shape: baseShape || 'circle',
                color: baseColor,
                rotation: 0,
                scale: 1,
                opacity: 1,
                strokeWidth: 4,
                hasInnerDot: false,
                isHollow: false,
                animationType,
                animationSpeed
            });
        }

        return {
            items,
            outlierIndex,
            ruleDescription: `Rule: ${ruleType} motion`,
        };
    }
}
