import type { GameRule, RuleResult, LogicItemData } from './Rule';
import { getRandomInt, getRandomElement } from '../../utils/random';

export class NumberRule implements GameRule {
    name = 'Number Logic';
    description = 'Logic based on numerical values or parity.';

    generate(difficulty: number): RuleResult {
        const itemCount = getRandomInt(5, 7);
        const items: LogicItemData[] = [];
        const outlierIndex = getRandomInt(0, itemCount - 1);

        const ruleType = getRandomElement(['parity', 'sequence', 'range']);

        let baseValue = getRandomInt(1, 10 + difficulty);
        let step = getRandomInt(1, 5);

        for (let i = 0; i < itemCount; i++) {
            let value = 0;
            if (ruleType === 'parity') {
                // Even or Odd rule
                const isEvenTarget = baseValue % 2 === 0;
                if (i === outlierIndex) {
                    value = isEvenTarget ? (getRandomInt(1, 10) * 2 - 1) : (getRandomInt(1, 10) * 2);
                } else {
                    value = isEvenTarget ? (getRandomInt(1, 10) * 2) : (getRandomInt(1, 10) * 2 - 1);
                }
            } else if (ruleType === 'sequence') {
                // Arithmetic progression
                if (i === outlierIndex) {
                    value = baseValue + (i * step) + getRandomInt(1, 10);
                } else {
                    value = baseValue + (i * step);
                }
            } else {
                // Range rule (e.g., all > 10, one < 10)
                const threshold = 10 + difficulty;
                if (i === outlierIndex) {
                    value = getRandomInt(1, threshold - 1);
                } else {
                    value = getRandomInt(threshold, threshold + 20);
                }
            }

            items.push(this.createDefaultItem(i.toString(), value));
        }

        return {
            items,
            outlierIndex,
            ruleDescription: `Rule: ${ruleType}`,
        };
    }

    private createDefaultItem(id: string, value: number): LogicItemData {
        return {
            id,
            value,
            color: '#3498db',
            shape: 'circle',
            rotation: 0,
            sides: 0,
            opacity: 1,
            scale: 1,
        };
    }
}
