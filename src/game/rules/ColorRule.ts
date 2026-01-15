import type { GameRule, RuleResult, LogicItemData } from './Rule';
import { getRandomInt, getRandomElement } from '../../utils/random';

export class ColorRule implements GameRule {
    name = 'Color Logic';
    description = 'Logic based on color grouping and contrast.';

    private colors = [
        '#e74c3c', '#f1c40f', '#9b59b6', '#34495e',
        '#1abc9c', '#e67e22', '#7f8c8d'
    ];

    generate(_difficulty: number): RuleResult {
        const itemCount = getRandomInt(5, 7);
        const items: LogicItemData[] = [];
        const outlierIndex = getRandomInt(0, itemCount - 1);

        const ruleType = getRandomElement(['contrast', 'monochrome', 'parity-color']);
        const baseColor = getRandomElement(this.colors);

        for (let i = 0; i < itemCount; i++) {
            let color = baseColor;

            if (ruleType === 'contrast') {
                if (i === outlierIndex) {
                    color = getRandomElement(this.colors.filter(c => c !== baseColor));
                }
            } else if (ruleType === 'monochrome') {
                // All same hue, one different intensity (opacity)
                if (i === outlierIndex) {
                    color = baseColor;
                    // Outlier is slightly faded
                }
            } else if (ruleType === 'parity-color') {
                // Red for Even, Blue for Odd (wait, that's composite)
                // Let's stick to simple grouping: group of 4 same, 1 different
                if (i === outlierIndex) {
                    color = getRandomElement(this.colors.filter(c => c !== baseColor));
                }
            }

            items.push({
                id: i.toString(),
                value: 0,
                color,
                shape: 'square',
                rotation: 0,
                sides: 4,
                opacity: (ruleType === 'monochrome' && i === outlierIndex) ? 0.5 : 1,
                scale: 1,
            });
        }

        return {
            items,
            outlierIndex,
            ruleDescription: `Rule: ${ruleType}`,
        };
    }
}
