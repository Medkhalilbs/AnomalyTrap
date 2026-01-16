import type { GameRule, RuleResult, LogicItemData } from './Rule';
import { getRandomInt } from '../../utils/random';

export class PathRule implements GameRule {
    name = 'Path Logic';
    description = 'Maze-like directional anomalies.';

    generate(_difficulty: number, count?: number): RuleResult {
        const itemCount = count || getRandomInt(5, 7);
        const items: LogicItemData[] = [];
        const outlierIndex = getRandomInt(0, itemCount - 1);

        const baseShape = 'triangle'; // Triangle is the best "arrow"
        const baseColor = '#3498db';

        for (let i = 0; i < itemCount; i++) {
            let rotation = 0;

            // All items point UP except the outlier points DOWN
            if (i === outlierIndex) {
                rotation = 180; // Points opposite direction
            } else {
                rotation = 0; // Points up
            }

            items.push({
                id: i.toString(),
                shape: baseShape,
                color: baseColor,
                rotation,
                scale: 1,
                opacity: 1,
                strokeWidth: 4,
                hasInnerDot: false,
                isHollow: true,
                animationType: 'none',
                animationSpeed: 0
            });
        }

        return {
            items,
            outlierIndex,
            ruleDescription: 'Find the opposite direction',
        };
    }
}
