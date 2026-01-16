import type { GameRule, RuleResult, LogicItemData } from './Rule';
import { getRandomInt, getRandomElement } from '../../utils/random';

export class PathRule implements GameRule {
    name = 'Path Logic';
    description = 'Maze-like directional anomalies.';

    generate(_difficulty: number, count?: number): RuleResult {
        const itemCount = count || getRandomInt(5, 7);
        const items: LogicItemData[] = [];
        const outlierIndex = getRandomInt(0, itemCount - 1);

        // Logic: All shapes point towards the "center" or "clockwise"
        // The outlier points outwards or anti-clockwise.
        const ruleType = getRandomElement(['flow', 'connection']);
        const baseShape = 'triangle'; // Triangle is the best "arrow"

        for (let i = 0; i < itemCount; i++) {
            let rotation = 0; // Default: points Up

            if (ruleType === 'flow') {
                // All items point to the NEXT item index (imaginary circle)
                // Angle = (i / itemCount) * 360
                const targetRotation = (i / itemCount) * 360;
                if (i === outlierIndex) {
                    rotation = (targetRotation + 180) % 360; // Points opposite
                } else {
                    rotation = targetRotation;
                }
            } else {
                // All items point to Center
                // Actually rotation logic in CSS vs SVG can be tricky
                // Let's use "Parallel" vs "Intersecting"
                if (i === outlierIndex) {
                    rotation = 45;
                } else {
                    rotation = 0;
                }
            }

            items.push({
                id: i.toString(),
                shape: baseShape,
                color: '#3498db',
                rotation,
                scale: 1,
                opacity: 1,
                strokeWidth: 4,
                hasInnerDot: false,
                isHollow: true, // Show the arrow clearly
                strokeColor: '#3498db',
                animationType: 'none',
                animationSpeed: 0
            } as any);
        }

        return {
            items,
            outlierIndex,
            ruleDescription: `Rule: ${ruleType} path`,
        };
    }
}
