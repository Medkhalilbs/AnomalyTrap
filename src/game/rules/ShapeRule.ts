import type { GameRule, RuleResult, LogicItemData, ShapeType } from './Rule';
import { getRandomInt, getRandomElement } from '../../utils/random';

export class ShapeRule implements GameRule {
    name = 'Shape Logic';
    description = 'Logic based on geometry, sides, or rotation.';

    generate(_difficulty: number, count?: number): RuleResult {
        const itemCount = count || getRandomInt(5, 7);
        const items: LogicItemData[] = [];
        const outlierIndex = getRandomInt(0, itemCount - 1);

        const shapes: ShapeType[] = ['circle', 'square', 'triangle', 'pentagon', 'hexagon', 'star'];
        const ruleType = getRandomElement(['sides', 'shape-type', 'rotation']);

        const baseShape = getRandomElement(shapes);
        const baseRotation = getRandomElement([0, 45, 90, 180]);
        const baseSides = this.getSidesFromShape(baseShape);

        for (let i = 0; i < itemCount; i++) {
            let shape = baseShape;
            let rotation = baseRotation;
            let sides = baseSides;

            if (ruleType === 'sides') {
                if (i === outlierIndex) {
                    sides = baseSides + 1;
                    shape = this.getShapeFromSides(sides);
                }
            } else if (ruleType === 'shape-type') {
                if (i === outlierIndex) {
                    shape = getRandomElement(shapes.filter(s => s !== baseShape));
                    sides = this.getSidesFromShape(shape);
                }
            } else if (ruleType === 'rotation') {
                if (i === outlierIndex) {
                    rotation = (baseRotation + 45) % 360;
                }
            }

            items.push({
                id: i.toString(),
                value: 0,
                color: '#2ecc71',
                shape,
                rotation,
                sides,
                opacity: 1,
                scale: 1,
            });
        }

        return {
            items,
            outlierIndex,
            ruleDescription: `Rule: ${ruleType}`,
        };
    }

    private getSidesFromShape(shape: ShapeType): number {
        switch (shape) {
            case 'circle': return 0;
            case 'triangle': return 3;
            case 'square': return 4;
            case 'pentagon': return 5;
            case 'hexagon': return 6;
            case 'star': return 10;
            default: return 0;
        }
    }

    private getShapeFromSides(sides: number): ShapeType {
        if (sides === 3) return 'triangle';
        if (sides === 4) return 'square';
        if (sides === 5) return 'pentagon';
        if (sides === 6) return 'hexagon';
        return 'circle';
    }
}
