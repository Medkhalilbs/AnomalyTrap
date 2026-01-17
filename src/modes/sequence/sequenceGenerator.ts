import { getRandomInt, getRandomElement } from '../../utils/random';

export interface SequenceChallenge {
    sequence: (string | number)[];
    options: (string | number)[];
    correctAnswer: string | number;
    type: 'numeric' | 'visual' | 'symbolic';
}

export class SequenceGenerator {
    generateChallenge(_difficulty: number): SequenceChallenge {
        const type = getRandomElement(['numeric', 'visual', 'symbolic'] as const) ?? 'numeric';

        switch (type) {
            case 'numeric':
                return this.generateNumericSequence();
            case 'visual':
                return this.generateVisualSequence();
            case 'symbolic':
                return this.generateSymbolicSequence();
            default:
                return this.generateNumericSequence();
        }
    }

    private generateNumericSequence(): SequenceChallenge {
        const patterns = [
            // Simple addition
            () => {
                const start = getRandomInt(1, 10);
                const step = getRandomInt(1, 5);
                const sequence = [start, start + step, start + step * 2, start + step * 3];
                const next = start + step * 4;
                return { sequence, next };
            },
            // Multiplication
            () => {
                const start = getRandomInt(2, 5);
                const mult = 2;
                const sequence = [start, start * mult, start * mult * mult, start * mult * mult * mult];
                const next = start * mult * mult * mult * mult;
                return { sequence, next };
            },
            // Fibonacci-like
            () => {
                const a = getRandomInt(1, 3);
                const b = getRandomInt(2, 4);
                const sequence = [a, b, a + b, a + 2 * b];
                const next = 2 * a + 3 * b;
                return { sequence, next };
            },
            // Subtraction
            () => {
                const start = getRandomInt(20, 50);
                const step = getRandomInt(2, 5);
                const sequence = [start, start - step, start - step * 2, start - step * 3];
                const next = start - step * 4;
                return { sequence, next };
            },
            // Squares
            () => {
                const start = getRandomInt(1, 5);
                const sequence = [start ** 2, (start + 1) ** 2, (start + 2) ** 2, (start + 3) ** 2];
                const next = (start + 4) ** 2;
                return { sequence, next };
            },
            // Primes (approximate for simplicity in generation, fixed small set)
            () => {
                const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
                const startIdx = getRandomInt(0, primes.length - 5);
                const sequence = primes.slice(startIdx, startIdx + 4);
                const next = primes[startIdx + 4] ?? 41;
                return { sequence, next };
            },
            // Binary Powers
            () => {
                const start = getRandomInt(1, 4);
                const sequence = [Math.pow(2, start), Math.pow(2, start + 1), Math.pow(2, start + 2), Math.pow(2, start + 3)];
                const next = Math.pow(2, start + 4);
                return { sequence, next };
            }
        ];

        const pattern = getRandomElement(patterns) ?? patterns[0];
        const { sequence, next } = pattern();

        // Generate wrong options
        const options = [
            next,
            next + getRandomInt(1, 4),
            next - getRandomInt(1, 4),
            next * 2 + 1 // Ensure some variance
        ].sort(() => Math.random() - 0.5);

        // Deduplicate options
        const uniqueOptions = [...new Set(options)];
        while (uniqueOptions.length < 4) {
            uniqueOptions.push(next + getRandomInt(10, 20));
        }

        return {
            sequence,
            options: uniqueOptions.sort(() => Math.random() - 0.5),
            correctAnswer: next,
            type: 'numeric'
        };
    }

    private generateVisualSequence(): SequenceChallenge {
        const shapes = ['🔴', '🔵', '🟢', '🟡', '🟣'];
        const types = ['repeat', 'rotate'];
        const type = getRandomElement(types) ?? 'repeat';

        if (type === 'rotate') {
            const arrows = ['⬆️', '➡️', '⬇️', '⬅️'];
            // Rotation pattern: Up, Right, Down, Left...
            const startIdx = getRandomInt(0, 3);
            const sequence = [
                arrows[startIdx % 4],
                arrows[(startIdx + 1) % 4],
                arrows[(startIdx + 2) % 4],
                arrows[(startIdx + 3) % 4]
            ];
            const next = arrows[(startIdx + 4) % 4] ?? '⬆️';
            const options = [...arrows].sort(() => Math.random() - 0.5);

            return {
                sequence: sequence as string[],
                options,
                correctAnswer: next,
                type: 'visual'
            };
        }

        const patternLength = 3;

        // Create repeating pattern
        const pattern: string[] = [];
        for (let i = 0; i < patternLength; i++) {
            pattern.push(shapes[i] ?? '🔴');
        }

        const sequence: string[] = [...pattern, ...pattern];
        const next: string = pattern[0] ?? '🔴';

        const options: string[] = [next, shapes[3] ?? '🟡', shapes[4] ?? '🟣', '⚫'].sort(() => Math.random() - 0.5);

        return {
            sequence,
            options,
            correctAnswer: next,
            type: 'visual'
        };
    }

    private generateSymbolicSequence(): SequenceChallenge {
        const symbols = ['⭐', '❤️', '⚡', '🔥', '💎'];
        const sequence: string[] = [symbols[0] ?? '⭐', symbols[1] ?? '❤️', symbols[0] ?? '⭐', symbols[1] ?? '❤️'];
        const next: string = symbols[0] ?? '⭐';

        const options: string[] = [next, symbols[2] ?? '⚡', symbols[3] ?? '🔥', symbols[4] ?? '💎'].sort(() => Math.random() - 0.5);

        return {
            sequence,
            options,
            correctAnswer: next,
            type: 'symbolic'
        };
    }
}
