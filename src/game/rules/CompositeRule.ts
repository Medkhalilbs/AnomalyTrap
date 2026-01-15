import type { GameRule, RuleResult, LogicItemData } from './Rule';
import { getRandomInt } from '../../utils/random';

export class CompositeRule implements GameRule {
    name = 'Composite Logic';
    description = 'Logic combining color and number or shape.';

    generate(_difficulty: number): RuleResult {
        // For simplicity, we'll combine Color + Number
        // Rule: All Even numbers are Blue, All Odd numbers are Red.
        // Outlier: An Even number that is Red, or an Odd number that is Blue.

        const itemCount = getRandomInt(5, 7);
        const items: LogicItemData[] = [];
        const outlierIndex = getRandomInt(0, itemCount - 1);

        const evenColor = '#3498db'; // Blue
        const oddColor = '#e74c3c'; // Red

        for (let i = 0; i < itemCount; i++) {
            let value = getRandomInt(1, 20);
            let color = value % 2 === 0 ? evenColor : oddColor;

            if (i === outlierIndex) {
                // Break the link between parity and color
                color = value % 2 === 0 ? oddColor : evenColor;
            }

            items.push({
                id: i.toString(),
                value,
                color,
                shape: 'circle',
                rotation: 0,
                sides: 0,
                opacity: 1,
                scale: 1,
            });
        }

        return {
            items,
            outlierIndex,
            ruleDescription: 'Rule: Color matches Parity',
        };
    }
}
