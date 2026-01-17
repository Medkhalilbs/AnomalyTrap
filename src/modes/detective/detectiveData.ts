import { getRandomElement, shuffleArray } from '../../utils/random';

export interface DetectiveScenario {
    id: string;
    title: string;
    story: string;
    suspects: Suspect[];
    culpritId: string;
    difficulty: number;
}

export interface Suspect {
    id: string;
    name: string;
    alibi: string;
    statement: string;
    isCulprit: boolean;
}

const TEMPLATES = {
    en: [
        {
            title: "The Missing Diamond",
            story: "Lord Blackwood's rare blue diamond was stolen from his study between 8:00 PM and 9:00 PM. The only people in the mansion were the Butler, the Maid, and the Chef.",
            culpritId: "chef",
            suspects: [
                {
                    id: "butler",
                    name: "Alfred the Butler",
                    alibi: "I was polishing the silverware in the dining room from 7:30 PM until 9:00 PM.",
                    statement: "I heard the maid in the hallway around 8:30 PM.",
                    isCulprit: false
                },
                {
                    id: "maid",
                    name: "Sarah the Maid",
                    alibi: "I was cleaning the guest bedrooms upstairs all evening.",
                    statement: "I never went downstairs after 8:00 PM.",
                    isCulprit: false
                },
                {
                    id: "chef",
                    name: "Gordon the Chef",
                    alibi: "I was preparing the soufflé. It requires constant attention!",
                    statement: "I saw Alfred heading towards the study at 8:15 PM.",
                    isCulprit: true
                }
            ],
            clue: "The thief left a trace of flour on the rug."
        }
        // ... add more if needed, keeping it simple for now to save space
    ],
    fr: [
        {
            title: "Le Diamant Disparu",
            story: "Le diamant bleu de Lord Blackwood a été volé entre 20h00 et 21h00. Les seules personnes présentes étaient le Majordome, la Femme de chambre et le Chef.",
            culpritId: "chef",
            suspects: [
                {
                    id: "butler",
                    name: "Alfred le Majordome",
                    alibi: "Je polissais l'argenterie dans la salle à manger de 19h30 à 21h00.",
                    statement: "J'ai entendu la femme de chambre dans le couloir vers 20h30.",
                    isCulprit: false
                },
                {
                    id: "maid",
                    name: "Sarah la Femme de chambre",
                    alibi: "Je nettoyais les chambres d'amis à l'étage toute la soirée.",
                    statement: "Je ne suis jamais descendue après 20h00.",
                    isCulprit: false
                },
                {
                    id: "chef",
                    name: "Gordon le Chef",
                    alibi: "Je préparais le soufflé. Ça demande une attention constante !",
                    statement: "J'ai vu Alfred se diriger vers le bureau à 20h15.",
                    isCulprit: true
                }
            ],
            clue: "Le voleur a laissé une trace de farine sur le tapis."
        }
    ],
    ar: [
        {
            title: "الماسة المفقودة",
            story: "سُرقت ماسة اللورد بلاكوود الزرقاء النادرة من مكتبه بين الساعة 8:00 مساءً و 9:00 مساءً. الأشخاص الوحيدون في القصر كانوا الخادم الشخصي، والخادمة، والطاهي.",
            culpritId: "chef",
            suspects: [
                {
                    id: "butler",
                    name: "ألفريد الخادم",
                    alibi: "كنت ألمع الفضيات في غرفة الطعام من 7:30 مساءً حتى 9:00 مساءً.",
                    statement: "سمعت الخادمة في الرواق حوالي الساعة 8:30 مساءً.",
                    isCulprit: false
                },
                {
                    id: "maid",
                    name: "سارة الخادمة",
                    alibi: "كنت أنظف غرف الضيوف في الطابق العلوي طوال المساء.",
                    statement: "لم أنزل إلى الطابق السفلي بعد الساعة 8:00 مساءً.",
                    isCulprit: false
                },
                {
                    id: "chef",
                    name: "جوردون الطاهي",
                    alibi: "كنت أحضر السوفليه. إنه يتطلب اهتمامًا مستمرًا!",
                    statement: "رأيت ألفريد يتجه نحو المكتب في الساعة 8:15 مساءً.",
                    isCulprit: true
                }
            ],
            clue: "ترك اللص أثرًا من الدقيق على السجادة."
        }
    ]
};

export class DetectiveGenerator {
    generateChallenge(difficulty: number, lang: 'en' | 'fr' | 'ar' = 'en'): DetectiveScenario {
        const templates = TEMPLATES[lang] || TEMPLATES['en'];
        const scenario = getRandomElement(templates);
        if (!scenario) throw new Error("No scenario found");

        // Clone and shuffle suspects
        const shuffledSuspects = shuffleArray([...scenario.suspects]);

        // Append clue to the story for easier logic (or keep separate if UI handles it)
        const fullStory = `${scenario.story}\n\n${lang === 'ar' ? 'الدليل' : (lang === 'fr' ? 'INDICE' : 'CLUE')}: ${scenario.clue}`;

        return {
            id: Math.random().toString(36).substr(2, 9),
            title: scenario.title,
            story: fullStory,
            suspects: shuffledSuspects,
            culpritId: scenario.culpritId,
            difficulty: difficulty
        };
    }
}
