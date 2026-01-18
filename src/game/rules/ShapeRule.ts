import type { GameRule, RuleResult, LogicItemData, ShapeType } from './Rule';
import { getRandomInt, getRandomElement } from '../../utils/random';

export class ShapeRule implements GameRule {
    name = 'Shape Logic';
    description = 'Logic based on geometry, sides, or rotation.';

    generate(_difficulty: number, count?: number): RuleResult {
        const itemCount = count || getRandomInt(5, 7);
        const items: LogicItemData[] = [];
        const outlierIndex = getRandomInt(0, itemCount - 1);

        const ruleType = getRandomElement(['sides', 'rotation', 'shape']);
        const baseShape = getRandomElement(['circle', 'square', 'triangle', 'pentagon', 'hexagon', 'star'] as ShapeType[]);
        const baseRotation = getRandomInt(0, 3) * 90;

        for (let i = 0; i < itemCount; i++) {
            let shape = baseShape;
            let rotation = baseRotation;

            if (ruleType === 'sides' || ruleType === 'shape') {
                if (i === outlierIndex) {
                    shape = getRandomElement((['circle', 'square', 'triangle', 'pentagon', 'hexagon', 'star'] as ShapeType[]).filter(s => s !== baseShape));
                } else {
                    shape = baseShape;
                }
            } else if (ruleType === 'rotation') {
                if (i === outlierIndex) {
                    rotation = (baseRotation + 90) % 360;
                } else {
                    rotation = baseRotation;
                }
            }

            const item = this.createDefaultItem(i.toString(), shape);
            item.rotation = rotation;
            items.push(item);
        }

        return {
            items,
            outlierIndex,
            ruleDescription: `Rule: ${ruleType}`,
        };
    }

    private createDefaultItem(id: string, shape: ShapeType): LogicItemData {
        return {
            id,
            shape,
            color: '#3498db',
            rotation: 0,
            scale: 1,
            opacity: 1,
            strokeWidth: 4,
            hasInnerDot: false,
            isHollow: false,
            animationType: 'none',
            animationSpeed: 0
        };
    }
}
