import { getRandomInt, getRandomElement } from '../../utils/random';

export interface MemoryChallenge {
    type: 'grid' | 'sequence';
    grid: string[][];
    // Grid Memory specific
    questionPosition?: { row: number; col: number };
    options?: string[];
    correctAnswer?: string;
    // Sequence Memory specific
    sequence?: { row: number; col: number }[];
}

const SHAPES = ['🔴', '🔵', '🟢', '🟡', '🟣', '⭐', '❤️', '⚡'];

export class MemoryGenerator {
    generateChallenge(difficulty: number): MemoryChallenge {
        // 40% chance for Sequence Memory if difficulty > 2
        if (difficulty > 2 && Math.random() < 0.4) {
            return this.generateSequenceMemory(difficulty);
        }

        return this.generateGridMemory(difficulty);
    }

    private generateGridMemory(difficulty: number): MemoryChallenge {
        // Scale grid size with difficulty
        let gridSize = 3;
        if (difficulty > 5) gridSize = 4;
        if (difficulty > 10) gridSize = 5;

        const grid: string[][] = [];

        // Fill grid with random shapes
        for (let i = 0; i < gridSize; i++) {
            const row: string[] = [];
            for (let j = 0; j < gridSize; j++) {
                row.push(getRandomElement(SHAPES) ?? '🔴');
            }
            grid.push(row);
        }

        // Pick a random position to ask about
        const questionRow = getRandomInt(0, gridSize - 1);
        const questionCol = getRandomInt(0, gridSize - 1);
        const correctAnswer = grid[questionRow]?.[questionCol] ?? '🔴';

        // Generate wrong options
        const wrongOptions = SHAPES.filter(s => s !== correctAnswer).slice(0, 3);
        const options = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);

        return {
            type: 'grid',
            grid,
            questionPosition: { row: questionRow, col: questionCol },
            options,
            correctAnswer
        };
    }

    private generateSequenceMemory(difficulty: number): MemoryChallenge {
        // Grid size can follow standard scaling
        let gridSize = 3;
        if (difficulty > 5) gridSize = 4;
        if (difficulty > 10) gridSize = 5;

        // Sequence length increases with difficulty
        const baseLength = 3;
        const length = Math.min(baseLength + Math.floor(difficulty / 2), 10);

        const sequence: { row: number; col: number }[] = [];

        for (let i = 0; i < length; i++) {
            sequence.push({
                row: getRandomInt(0, gridSize - 1),
                col: getRandomInt(0, gridSize - 1)
            });
        }

        // Create an empty grid (or simple background grid)
        const grid: string[][] = Array(gridSize).fill(Array(gridSize).fill('⬜'));

        return {
            type: 'sequence',
            grid,
            sequence
        };
    }
}
