import { getRandomInt, getRandomElement } from '../../utils/random';

export interface MemoryChallenge {
    grid: string[][];
    questionPosition: { row: number; col: number };
    options: string[];
    correctAnswer: string;
}

const SHAPES = ['🔴', '🔵', '🟢', '🟡', '🟣', '⭐', '❤️', '⚡'];

export class MemoryGenerator {
    generateChallenge(_difficulty: number): MemoryChallenge {
        const gridSize = 3; // 3x3 grid
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
            grid,
            questionPosition: { row: questionRow, col: questionCol },
            options,
            correctAnswer
        };
    }
}
