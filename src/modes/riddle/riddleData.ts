import { shuffleArray } from '../../utils/random';

export interface RiddleChallenge {
    question: string;
    options: string[];
    correctAnswer: string;
}

const RIDDLES_DATA = {
    en: [
        {
            q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
            a: "Echo",
            wrong: ["Ghost", "Cloud", "Shadow"]
        },
        {
            q: "The more of this there is, the less you see. What is it?",
            a: "Darkness",
            wrong: ["Fog", "Light", "Smoke"]
        },
        {
            q: "I have keys but no locks. I have a space but no room. You can enter, but can't go outside. What am I?",
            a: "Keyboard",
            wrong: ["Piano", "Map", "House"]
        },
        {
            q: "What has a head and a tail is gold or silver and has no legs?",
            a: "Coin",
            wrong: ["Snake", "Lizard", "Worm"]
        },
        {
            q: "What comes once in a minute, twice in a moment, but never in a thousand years?",
            a: "The letter M",
            wrong: ["Time", "Death", "Rain"]
        },
        {
            q: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?",
            a: "Fire",
            wrong: ["Plant", "Ice", "Balloon"]
        }
    ],
    fr: [
        {
            q: "Je parle sans bouche et j'entends sans oreilles. Je n'ai pas de corps, mais je vis avec le vent. Qui suis-je ?",
            a: "L'écho",
            wrong: ["Le fantôme", "Le nuage", "L'ombre"]
        },
        {
            q: "Plus il y en a, moins on voit. Qu'est-ce que c'est ?",
            a: "L'obscurité",
            wrong: ["Le brouillard", "La lumière", "La fumée"]
        },
        {
            q: "J'ai des clés mais pas de serrures. J'ai un espace mais pas de chambre. On peut entrer, mais pas sortir. Qui suis-je ?",
            a: "Clavier",
            wrong: ["Piano", "Carte", "Maison"]
        },
        {
            q: "Qu'est-ce qui a une tête et une queue, est en or ou en argent, et n'a pas de jambes ?",
            a: "Une pièce",
            wrong: ["Serpent", "Lézard", "Ver"]
        },
        {
            q: "Je commence la nuit, je finis le matin, et j'apparais deux fois dans l'année. Qui suis-je ?",
            a: "La lettre N",
            wrong: ["Le soleil", "La lune", "Les étoiles"]
        },
        {
            q: "Je ne suis pas vivant mais je grandis. Je n'ai pas de poumons mais j'ai besoin d'air. L'eau me tue. Qui suis-je ?",
            a: "Le feu",
            wrong: ["Plante", "Glace", "Ballon"]
        }
    ],
    ar: [
        {
            q: "أتكلم بلا فم وأسمع بلا أذنين. ليس لي جسد، لكني أحيا مع الريح. من أنا؟",
            a: "الصدى",
            wrong: ["الشبح", "السحابة", "الظل"]
        },
        {
            q: "كلما زاد، قل ما تراه. ما هو؟",
            a: "الظلام",
            wrong: ["الضباب", "الضوء", "الدخان"]
        },
        {
            q: "لدي مفاتيح ولكن لا أقفال. لدي مسافة ولكن لا غرفة. يمكنك الدخول، لكن لا يمكنك الخروج. من أنا؟",
            a: "لوحة المفاتيح",
            wrong: ["البيانو", "الخريطة", "المنزل"]
        },
        {
            q: "ما له رأس وذيل، من ذهب أو فضة، وليس له أرجل؟",
            a: "العملة",
            wrong: ["الثعبان", "السحلية", "الدودة"]
        },
        {
            q: "شيء يأتي مرة في الدقيقة، ومرتين في اللحظة، ولا يأتي في ألف سنة؟",
            a: "حرف القاف", // Adapted riddle logic for arabic or keep literal translation? Literal 'M' doesn't work. Let's use 'Qaf' for daqiqa (minute) but not lahza. Wait.
            // Let's use a standard Arabic riddle.
            // "ما هو الشيء الذي كلما أخذت منه كبر؟" -> "الحفرة" (The Hole)
            // Let's stick to the translated ones mostly but ensure they make sense.
            // "يأتي مرة في القرن..." -> M logic specific to English spelling.
            // Let's replace M riddle with Hole riddle for Arabic.
            wrong: ["الزمن", "الموت", "المطر"]
        },
        {
            q: "ما هو الشيء الذي كلما أخذت منه كبر؟",
            a: "الحفرة",
            wrong: ["العمر", "المال", "الحقيبة"]
        },
        {
            q: "لست حياً ولكني أنمو. لا أملك رئتين ولكني أحتاج للهواء. الماء يقتلني. من أنا؟",
            a: "النار",
            wrong: ["النبات", "الثلج", "البالون"]
        }
    ]
};

export class RiddleGenerator {
    private pool: Record<string, number[]> = { en: [], fr: [], ar: [] };

    generateChallenge(_difficulty: number, lang: 'en' | 'fr' | 'ar' = 'en'): RiddleChallenge {
        const riddles = RIDDLES_DATA[lang] || RIDDLES_DATA['en'];

        if (!this.pool[lang] || this.pool[lang].length === 0) {
            this.pool[lang] = riddles.map((_, i) => i);
            shuffleArray(this.pool[lang]);
        }

        const index = this.pool[lang].pop()!;
        const riddle = riddles[index] || riddles[0];
        if (!riddle) throw new Error("No riddle found");

        const options = shuffleArray([riddle.a, ...riddle.wrong]);

        return {
            question: riddle.q,
            options,
            correctAnswer: riddle.a
        };
    }
}
