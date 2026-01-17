import { getRandomElement, getRandomInt } from '../../utils/random';

export interface CipherChallenge {
    description: string;
    encrypted: string;
    options: string[];
    correctAnswer: string;
    type: 'caesar' | 'reverse' | 'atbash';
}

const WORDS = [
    'SECRET', 'CODE', 'CIPHER', 'DETECT', 'HIDDEN', 'MESSAGE', 'PUZZLE', 'SOLVE', 'MYSTERY', 'ESCAPE',
    'AGENT', 'BRAIN', 'SMART', 'LOGIC', 'FOCUS', 'HUNT', 'TRAP', 'FIND', 'GAME', 'PLAY'
];

export class CipherGenerator {
    generateChallenge(_difficulty: number): CipherChallenge {
        const type = getRandomElement(['caesar', 'reverse', 'atbash'] as const) ?? 'caesar';
        const word = getRandomElement(WORDS) ?? 'SECRET';

        switch (type) {
            case 'caesar':
                return this.generateCaesar(word);
            case 'reverse':
                return this.generateReverse(word);
            case 'atbash':
                return this.generateAtbash(word);
            default:
                return this.generateCaesar(word);
        }
    }

    private generateCaesar(word: string): CipherChallenge {
        const shift = getRandomInt(1, 13);
        const encrypted = this.caesarCipher(word, shift);

        // Generate options (different shifts)
        const options = [word];
        while (options.length < 4) {
            const wrongWord = getRandomElement(WORDS) ?? 'CODE';
            if (!options.includes(wrongWord)) {
                options.push(wrongWord);
            }
        }

        return {
            description: `Shift each letter by ${shift}`,
            encrypted,
            options: options.sort(() => Math.random() - 0.5),
            correctAnswer: word,
            type: 'caesar'
        };
    }

    private generateReverse(word: string): CipherChallenge {
        const encrypted = word.split('').reverse().join('');

        const options = [word];
        while (options.length < 4) {
            const wrongWord = getRandomElement(WORDS) ?? 'CODE';
            if (!options.includes(wrongWord)) {
                options.push(wrongWord);
            }
        }

        return {
            description: "Read it backwards",
            encrypted,
            options: options.sort(() => Math.random() - 0.5),
            correctAnswer: word,
            type: 'reverse'
        };
    }

    private generateAtbash(word: string): CipherChallenge {
        const encrypted = this.atbashCipher(word);

        const options = [word];
        while (options.length < 4) {
            const wrongWord = getRandomElement(WORDS) ?? 'CODE';
            if (!options.includes(wrongWord)) {
                options.push(wrongWord);
            }
        }

        return {
            description: "A becomes Z, B becomes Y...",
            encrypted,
            options: options.sort(() => Math.random() - 0.5),
            correctAnswer: word,
            type: 'atbash'
        };
    }

    private caesarCipher(str: string, shift: number): string {
        return str.replace(/[A-Z]/g, char => {
            const code = char.charCodeAt(0);
            return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        });
    }

    private atbashCipher(str: string): string {
        return str.replace(/[A-Z]/g, char => {
            const code = char.charCodeAt(0);
            return String.fromCharCode(90 - (code - 65));
        });
    }
}
