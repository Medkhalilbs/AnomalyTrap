import { getRandomInt, getRandomElement } from '../../utils/random';

export interface SequenceChallenge {
    sequence: (string | number)[];
    options: (string | number)[];
    correctAnswer: string | number;
    type: 'numeric' | 'visual' | 'symbolic';
}

export class SequenceGenerator {
    generateChallenge(difficulty: number): SequenceChallenge {
        // Higher difficulty -> higher chance of complex math or visuals
        const roll = Math.random();

        if (roll < 0.6) return this.generateMathSequence(difficulty);
        if (roll < 0.8) return this.generateVisualSequence(difficulty);
        return this.generateSymbolicSequence(difficulty);
    }

    private generateMathSequence(difficulty: number): SequenceChallenge {
        // Types: 0=Linear (ax+b), 1=Quadratic (n^2), 2=Exponential (n^x), 3=Fibonacci
        const type = difficulty < 3 ? 0 : getRandomInt(0, Math.min(difficulty, 3));
        let sequence: number[] = [];
        let next = 0;

        if (type === 0) { // Linear: ax + b
            const a = getRandomInt(1, 3 + difficulty);
            const b = getRandomInt(0, 10 + difficulty * 2);
            for (let n = 1; n < 5; n++) sequence.push(a * n + b);
            next = a * 5 + b;
        } else if (type === 1) { // Quadratic: n^2 + b or an^2
            const b = getRandomInt(0, 5);
            for (let n = 1; n < 5; n++) sequence.push(n * n + b);
            next = 5 * 5 + b;
        } else if (type === 2) { // Exponential: a * r^n
            const a = getRandomInt(1, 2);
            const r = 2; // Keep simple for now
            for (let n = 0; n < 4; n++) sequence.push(a * Math.pow(r, n));
            next = a * Math.pow(r, 4);
        } else { // Fibonacci-ish
            const a = getRandomInt(1, 5);
            const b = getRandomInt(a, a + 5);
            sequence = [a, b];
            for (let i = 2; i < 4; i++) sequence.push(sequence[i - 1]! + sequence[i - 2]!);
            next = sequence[3]! + sequence[2]!;
        }

        // Generate distinct options
        const correctAnswer = next;
        const optionsSet = new Set<number>();
        optionsSet.add(correctAnswer);

        while (optionsSet.size < 4) {
            const offset = getRandomInt(-5, 5);
            if (offset !== 0) {
                optionsSet.add(correctAnswer + offset);
            } else {
                optionsSet.add(correctAnswer + 10);
            }
        }

        return {
            sequence,
            options: Array.from(optionsSet).sort(() => Math.random() - 0.5),
            correctAnswer,
            type: 'numeric'
        };
    }

    private generateVisualSequence(difficulty: number): SequenceChallenge {
        // TODO: Expand this with canvas generation if possible, but for now robust strings
        const shapes = ['🔴', '🔵', '🟢', '🟡', '🟣', '⬛', '⬜'];
        const subShapes = shapes.slice(0, 3 + Math.min(difficulty, 4));

        // Pattern: ABAB, AABB, ABC...
        const pType = getRandomInt(0, 2);
        let seq: string[] = [];
        let next = '';

        if (pType === 0) { // Repeat 1-2
            const s1 = getRandomElement(subShapes)!;
            const s2 = getRandomElement(subShapes)!;
            seq = [s1, s2, s1, s2];
            next = s1;
        } else if (pType === 1) { // Cycle
            // A B C D ...
            // start random
            const start = getRandomInt(0, subShapes.length - 1);
            for (let i = 0; i < 4; i++) seq.push(subShapes[(start + i) % subShapes.length]!);
            next = subShapes[(start + 4) % subShapes.length]!;
        } else {
            // AABB
            const s1 = getRandomElement(subShapes)!;
            const s2 = getRandomElement(subShapes)!;
            seq = [s1, s1, s2, s2];
            next = s1; // Starting new cycle? Or maybe A? Let's say it loops
            // Actually AABB pattern implies next is A (new pair) or C (if expanding).
            // Let's stick to simple Cycle for clarity on mobile
            const start = getRandomInt(0, subShapes.length - 1);
            for (let i = 0; i < 4; i++) seq.push(subShapes[(start + i) % subShapes.length]!);
            next = subShapes[(start + 4) % subShapes.length]!;
        }

        const optionsSet = new Set<string>();
        optionsSet.add(next);
        while (optionsSet.size < 4) {
            optionsSet.add(getRandomElement(shapes)!);
        }

        return {
            sequence: seq,
            options: Array.from(optionsSet).sort(() => Math.random() - 0.5),
            correctAnswer: next,
            type: 'visual'
        };
    }

    private generateSymbolicSequence(difficulty: number): SequenceChallenge {
        // Logic operations: AND, OR concepts depicted by combined symbols?
        // Or simple rotation
        const base = ['⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️'];
        const step = getRandomElement([1, 2, -1, 4])!; // Rotation amount (45deg steps)

        const startIdx = getRandomInt(0, base.length - 1);
        const seq: string[] = [];

        for (let i = 0; i < 4; i++) {
            // Handle negative modulo correctly
            let idx = (startIdx + (i * step)) % base.length;
            if (idx < 0) idx += base.length;
            seq.push(base[idx]!);
        }

        let nextIdx = (startIdx + (4 * step)) % base.length;
        if (nextIdx < 0) nextIdx += base.length;
        const next = base[nextIdx]!;

        const optionsSet = new Set<string>();
        optionsSet.add(next);
        while (optionsSet.size < 4) {
            optionsSet.add(getRandomElement(base)!);
        }

        return {
            sequence: seq,
            options: Array.from(optionsSet).sort(() => Math.random() - 0.5),
            correctAnswer: next,
            type: 'symbolic'
        };
    }
}
