import { shuffleArray, getRandomInt, getRandomElement } from '../../utils/random';

export interface CipherChallenge {
    description: string;
    encrypted: string;
    options: string[];
    correctAnswer: string;
    type: 'caesar' | 'reverse' | 'atbash' | 'substitution' | 'railfence';
}

const WORDS_DATA = {
    en: [
        'SECRET', 'CODE', 'CIPHER', 'DETECT', 'HIDDEN', 'MESSAGE', 'PUZZLE', 'SOLVE', 'MYSTERY', 'ESCAPE',
        'AGENT', 'BRAIN', 'SMART', 'LOGIC', 'FOCUS', 'HUNT', 'TRAP', 'FIND', 'GAME', 'PLAY',
        'ENIGMA', 'CRYPTIC', 'LOCKED', 'UNLOCK', 'KEYWORD', 'PATTERN', 'SEQUENCE', 'SYMBOL', 'ANOMALY', 'SHADOW'
    ],
    fr: [
        'SECRET', 'CODE', 'CHIFFRE', 'DETECTE', 'CACHE', 'MESSAGE', 'PUZZLE', 'RESOUDRE', 'MYSTERE', 'FUITE',
        'AGENT', 'CERVEAU', 'SMART', 'LOGIQUE', 'FOCUS', 'CHASSE', 'PIEGE', 'TROUVE', 'JEU', 'JOUER',
        'ENIGME', 'CRYPTE', 'VERROU', 'OUVRIR', 'MOTCLE', 'MOTIF', 'SEQUENCE', 'SYMBOLE', 'ANOMALIE', 'OMBRE'
    ],
    ar: [
        // Using transliterated or simple arabic words that work with ciphers might be tricky for 'caesar' if we stick to A-Z.
        // BUT, keeping it English A-Z for ciphers is safer for the game mechanics unless I rewrite the cipher logic for Arabic chars.
        // Given complexity, for Cipher Mode, we might want to keep the PUZZLES in English alphabet (standard for cryptography games), 
        // OR support Arabic alphabet shifting. Arabic logic is complex (connected letters).
        // DECISION: KEEP CIPHER GAME CONTENT IN ENGLISH ALPHABET EVEN FOR ARABIC/FRENCH UI?
        // Or at least French is easy. Arabic is hard.
        // Let's stick to English alphabet for the cipher mechanics, but translate the UI descriptions.
        'SECRET', 'CODE', 'CIPHER', 'DETECT', 'HIDDEN', 'MESSAGE', 'PUZZLE', 'SOLVE', 'MYSTERY', 'ESCAPE'
    ]
};

export class CipherGenerator {
    private pool: Record<string, number[]> = { en: [], fr: [] };

    generateChallenge(_difficulty: number, lang: 'en' | 'fr' | 'ar' = 'en'): CipherChallenge {
        const types = ['caesar', 'reverse', 'atbash', 'substitution', 'railfence'] as string[];
        const type = getRandomElement(types) as 'caesar' | 'reverse' | 'atbash' | 'substitution' | 'railfence' || 'caesar';

        const effectiveLang = lang === 'ar' ? 'en' : lang;
        const wordList = WORDS_DATA[effectiveLang as 'en' | 'fr'] || WORDS_DATA['en'];

        if (!this.pool[effectiveLang] || this.pool[effectiveLang].length === 0) {
            this.pool[effectiveLang] = wordList.map((_, i) => i);
            shuffleArray(this.pool[effectiveLang]);
        }

        const index = this.pool[effectiveLang].pop()!;
        const word = wordList[index] || 'SECRET';

        switch (type) {
            case 'caesar':
                return this.generateCaesar(word, lang);
            case 'reverse':
                return this.generateReverse(word, lang);
            case 'atbash':
                return this.generateAtbash(word, lang);
            case 'substitution':
                return this.generateSubstitution(word, lang);
            case 'railfence':
                return this.generateRailFence(word, lang);
            default:
                return this.generateCaesar(word, lang);
        }
    }

    private getDesc(key: string, lang: string, param?: any): string {
        const descs: Record<string, Record<string, string>> = {
            caesar: {
                en: `Shift each letter by ${param}`,
                fr: `Décalage de ${param} lettres`,
                ar: `إزاحة كل حرف بـ ${param}`
            },
            reverse: {
                en: "Read it backwards",
                fr: "Lire à l'envers",
                ar: "اقرأها بالمقلوب"
            },
            atbash: {
                en: "A becomes Z, B becomes Y...",
                fr: "A devient Z, B devient Y...",
                ar: "A يصبح Z، B يصبح Y..."
            },
            railfence: {
                en: "Zig-Zag Cipher (Read alternating letters)",
                fr: "Chiffre Zig-Zag (Lire une lettre sur deux)",
                ar: "شفرة متعرجة (اقرأ الحروف بالتناوب)"
            },
            substitution: {
                en: `Substitution: ${param}...`,
                fr: `Substitution : ${param}...`,
                ar: `استبدال: ${param}...`
            }
        };
        return descs[key]?.[lang] ?? descs[key]?.['en'] ?? '';
    }

    private generateCaesar(word: string, lang: string): CipherChallenge {
        const shift = getRandomInt(1, 13);
        const encrypted = this.caesarCipher(word, shift);

        const options = this.generateOptions(word, lang);

        return {
            description: this.getDesc('caesar', lang, shift),
            encrypted,
            options: options.sort(() => Math.random() - 0.5),
            correctAnswer: word,
            type: 'caesar'
        };
    }

    private generateReverse(word: string, lang: string): CipherChallenge {
        const encrypted = word.split('').reverse().join('');
        const options = this.generateOptions(word, lang);

        return {
            description: this.getDesc('reverse', lang),
            encrypted,
            options: options.sort(() => Math.random() - 0.5),
            correctAnswer: word,
            type: 'reverse'
        };
    }

    private generateAtbash(word: string, lang: string): CipherChallenge {
        const encrypted = this.atbashCipher(word);
        const options = this.generateOptions(word, lang);

        return {
            description: this.getDesc('atbash', lang),
            encrypted,
            options: options.sort(() => Math.random() - 0.5),
            correctAnswer: word,
            type: 'atbash'
        };
    }

    private generateRailFence(word: string, lang: string): CipherChallenge {
        let rail1 = "";
        let rail2 = "";
        for (let i = 0; i < word.length; i++) {
            if (i % 2 === 0) rail1 += word[i];
            else rail2 += word[i];
        }
        const encrypted = rail1 + rail2;
        const options = this.generateOptions(word, lang);

        return {
            description: this.getDesc('railfence', lang),
            encrypted,
            options: options.sort(() => Math.random() - 0.5),
            correctAnswer: word,
            type: 'railfence'
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

    private generateSubstitution(word: string, lang: string): CipherChallenge {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const shuffled = [...alphabet].sort(() => Math.random() - 0.5);
        const map = new Map<string, string>();

        alphabet.forEach((char, i) => map.set(char, shuffled[i] ?? char));

        const encrypted = word.split('').map(char => map.get(char) ?? char).join('');

        const hintCount = 3;
        const hints: string[] = [];
        for (let i = 0; i < hintCount; i++) {
            const char = getRandomElement(word.split('')) ?? 'A';
            hints.push(`${char}=${map.get(char)}`);
        }
        const options = this.generateOptions(word, lang);

        return {
            description: this.getDesc('substitution', lang, hints.join(', ')),
            encrypted,
            options: options.sort(() => Math.random() - 0.5),
            correctAnswer: word,
            type: 'substitution'
        };
    }

    private generateOptions(correctWord: string, lang: string): string[] {
        const effectiveLang = (lang === 'ar' ? 'en' : lang) as keyof typeof WORDS_DATA;
        const wordList = WORDS_DATA[effectiveLang] || WORDS_DATA['en'];

        const options = [correctWord];
        while (options.length < 4) {
            const wrongWord = getRandomElement(wordList) ?? 'CODE';
            if (!options.includes(wrongWord)) {
                options.push(wrongWord);
            }
        }
        return options;
    }
}
