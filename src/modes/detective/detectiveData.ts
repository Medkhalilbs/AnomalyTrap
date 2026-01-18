import { shuffleArray } from '../../utils/random';

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
        },
        {
            title: "The Poisoned Coffee",
            story: "A businessman collapsed after his morning coffee. The Suspects are his Assistant, the Barista, and his Business Partner.",
            culpritId: "partner",
            suspects: [
                {
                    id: "assistant",
                    name: "James the Assistant",
                    alibi: "I brought him the coffee, but I never touched it after it was made.",
                    statement: "I saw the partner talking to him earlier.",
                    isCulprit: false
                },
                {
                    id: "barista",
                    name: "Luna the Barista",
                    alibi: "I made ten coffees that minute. I don't know who got which.",
                    statement: "The assistant seemed very nervous.",
                    isCulprit: false
                },
                {
                    id: "partner",
                    name: "Robert the Partner",
                    alibi: "I was in my own office the whole time.",
                    statement: "He was healthy when I saw him 10 minutes ago.",
                    isCulprit: true
                }
            ],
            clue: "A blue ring was found at the bottom of the partner's trash can."
        },
        {
            title: "The Midnight Heist",
            story: "A valuable painting was stolen at midnight. The Night Guard, the Janitor, and the Curator are the main suspects.",
            culpritId: "guard",
            suspects: [
                { id: "guard", name: "Officer Mike", alibi: "I was making my rounds, but the cameras went dark.", statement: "I saw the janitor near the vault.", isCulprit: true },
                { id: "janitor", name: "Bob the Janitor", alibi: "I was cleaning the lobby far away from the gallery.", statement: "I heard the guard's radio playing music.", isCulprit: false },
                { id: "curator", name: "Ms. Elena", alibi: "I was at home sleeping. My alarm shows I left at 6 PM.", statement: "The guard has been acting strange lately.", isCulprit: false }
            ],
            clue: "The thief's fingerprint was found on the camera lens."
        },
        {
            title: "The Digital Thief",
            story: "A revolutionary AI algorithm was deleted from the main server. The System Admin, the Lead Developer, and the Intern are the suspects.",
            culpritId: "admin",
            suspects: [
                { id: "admin", name: "Kevin", alibi: "I was in the server room, but only checking for hardware failures.", statement: "I saw the developer leaving the building at 7 PM.", isCulprit: true },
                { id: "dev", name: "Sarah", alibi: "I was working from home. My Git commits show I was active until midnight.", statement: "Kevin has the master password.", isCulprit: false },
                { id: "intern", name: "Leo", alibi: "I was at the gym. Here is my activity tracker log.", statement: "I heard someone typing in the office late at night.", isCulprit: false }
            ],
            clue: "The deletion command was sent from an internal terminal with admin privileges."
        },
        {
            title: "The Art Forgery",
            story: "A fake masterpiece was swapped with a real one. The Restorer, the Dealer, and the Collector are under investigation.",
            culpritId: "restorer",
            suspects: [
                { id: "restorer", name: "Marco", alibi: "I was mixing paints in the back room all day.", statement: "The dealer was admiring the painting alone for an hour.", isCulprit: true },
                { id: "dealer", name: "Sofia", alibi: "I was on the phone with a client the entire afternoon.", statement: "Marco has the keys to the display case.", isCulprit: false },
                { id: "collector", name: "Viktor", alibi: "I was out for lunch when the swap happened.", statement: "The painting looked slightly different this morning.", isCulprit: false }
            ],
            clue: "The fake painting had traces of fresh oil paint that only the restorer uses."
        },
        {
            title: "The Missing Inheritance",
            story: "A hidden will was stolen from the safe. The Son, the Daughter, and the Lawyer are the primary suspects.",
            culpritId: "daughter",
            suspects: [
                { id: "son", name: "Arthur", alibi: "I was at the club. Many people saw me there.", statement: "My sister was always grandpa's favorite.", isCulprit: false },
                { id: "daughter", name: "Alice", alibi: "I was reading in the garden. It was very peaceful.", statement: "Arthur was arguing with grandpa about money.", isCulprit: true },
                { id: "lawyer", name: "Mr. Hayes", alibi: "I was preparing the legal documents in my office.", statement: "The safe code was only known by the family.", isCulprit: false }
            ],
            clue: "A dried petal from a specific garden flower was found near the safe."
        },
        {
            title: "The Lab Explosion",
            story: "A deliberate explosion destroyed the research data. The Chemist, the Security Chief, and the Rival Scientist are suspects.",
            culpritId: "chemist",
            suspects: [
                { id: "chemist", name: "Dr. Aris", alibi: "I was in the break room having tea.", statement: "I saw the security chief near the gas valves.", isCulprit: true },
                { id: "security", name: "Bull", alibi: "I was monitoring the perimeter cameras.", statement: "Dr. Aris was late for his morning session.", isCulprit: false },
                { id: "rival", name: "Dr. Zero", alibi: "I was at a conference across town. I have a badge to prove it.", statement: "Aris's research was failing anyway.", isCulprit: false }
            ],
            clue: "The explosion was caused by a chemical mixture only the lead chemist could prepare."
        }
    ],
    fr: [
        {
            title: "Le Diamant Disparu",
            story: "Le diamant bleu de Lord Blackwood a été volé entre 20h00 et 21h00. Les seules personnes présentes étaient le Majordome, la Femme de chambre et le Chef.",
            culpritId: "chef",
            suspects: [
                { id: "butler", name: "Alfred le Majordome", alibi: "Je polissais l'argenterie dans la salle à manger de 19h30 à 21h00.", statement: "J'ai entendu la femme de chambre dans le couloir vers 20h30.", isCulprit: false },
                { id: "maid", name: "Sarah la Femme de chambre", alibi: "Je nettoyais les chambres d'amis à l'étage toute la soirée.", statement: "Je ne suis jamais descendue après 20h00.", isCulprit: false },
                { id: "chef", name: "Gordon le Chef", alibi: "Je préparais le soufflé. Ça demande une attention constante !", statement: "J'ai vu Alfred se diriger vers le bureau à 20h15.", isCulprit: true }
            ],
            clue: "Le voleur a laissé une trace de farine sur le tapis."
        },
        {
            title: "Le Voleur Numérique",
            story: "Un algorithme d'IA révolutionnaire a été supprimé du serveur principal. L'administrateur système, le développeur principal et le stagiaire sont les suspects.",
            culpritId: "admin",
            suspects: [
                { id: "admin", name: "Kevin", alibi: "J'étais dans la salle des serveurs, mais je vérifiais seulement les pannes matérielles.", statement: "J'ai vu le développeur quitter le bâtiment à 19h.", isCulprit: true },
                { id: "dev", name: "Sarah", alibi: "Je travaillais à domicile. Mes commits Git montrent que j'étais active jusqu'à minuit.", statement: "Kevin a le mot de passe maître.", isCulprit: false },
                { id: "intern", name: "Leo", alibi: "J'étais à la salle de sport. Voici mon journal d'activité.", statement: "J'ai entendu quelqu'un taper au bureau tard dans la nuit.", isCulprit: false }
            ],
            clue: "La commande de suppression a été envoyée depuis un terminal interne avec des privilèges d'administrateur."
        },
        {
            title: "Le Faux Chef-d'œuvre",
            story: "Un faux chef-d'œuvre a été échangé contre un vrai. Le restaurateur, le marchand et le collectionneur font l'objet d'une enquête.",
            culpritId: "restorer",
            suspects: [
                { id: "restorer", name: "Marco", alibi: "Je mélangeais des peintures dans l'arrière-boutique toute la journée.", statement: "Le marchand admirait la peinture seul pendant une heure.", isCulprit: true },
                { id: "dealer", name: "Sofia", alibi: "J'étais au téléphone avec un client tout l'après-midi.", statement: "Marco a les clés de la vitrine.", isCulprit: false },
                { id: "collector", name: "Viktor", alibi: "J'étais sorti déjeuner quand l'échange a eu lieu.", statement: "Le tableau semblait légèrement différent ce matin.", isCulprit: false }
            ],
            clue: "Le faux tableau présentait des traces de peinture à l'huile fraîche que seul le restaurateur utilise."
        },
        { id: "dummy_fr", title: "L'Héritage Disparu", story: "Un testament caché a été volé dans le coffre-fort.", culpritId: "daughter", suspects: [{ id: "daughter", name: "Alice", alibi: "Je lisais dans le jardin.", statement: "C'était calme.", isCulprit: true }, { id: "son", name: "Arthur", alibi: "J'étais au club.", statement: "Je n'ai rien fait.", isCulprit: false }, { id: "lawyer", name: "Hayes", alibi: "Bureau.", statement: "Code famille.", isCulprit: false }], clue: "Petale de fleur." }
    ],
    ar: [
        {
            title: "الماسة المفقودة",
            story: "سُرقت ماسة اللورد بلاكوود الزرقاء النادرة من مكتبه بين الساعة 8:00 مساءً و 9:00 مساءً. الأشخاص الوحيدون في القصر كانوا الخادم الشخصي، والخادمة، والطاهي.",
            culpritId: "chef",
            suspects: [
                { id: "butler", name: "ألفريد الخادم", alibi: "كنت ألمع الفضيات في غرفة الطعام من 7:30 مساءً حتى 9:00 مساءً.", statement: "سمعت الخادمة في الرواق حوالي الساعة 8:30 مساءً.", isCulprit: false },
                { id: "maid", name: "سارة الخادمة", alibi: "كنت أنظف غرف الضيوف في الطابق العلوي طوال المساء.", statement: "لم أنزل إلى الطابق السفلي بعد الساعة 8:00 مساءً.", isCulprit: false },
                { id: "chef", name: "جوردون الطاهي", alibi: "كنت أحضر السوفليه. إنه يتطلب اهتمامًا مستمرًا!", statement: "رأيت ألفريد يتجه نحو المكتب في الساعة 8:15 مساءً.", isCulprit: true }
            ],
            clue: "ترك اللص أثرًا من الدقيق على السجادة."
        },
        {
            title: "لص البيانات",
            story: "تم حذف خوارزمية ذكاء اصطناعي ثورية من الخادم الرئيسي. مدير النظام والمطور الرئيسي والمتدرب هم المشتبه بهم.",
            culpritId: "admin",
            suspects: [
                { id: "admin", name: "كيفن", alibi: "كنت في غرفة الخادم، لكن فقط للتحقق من أعطال الأجهزة.", statement: "رأيت المطور يغادر المبنى في الساعة 7 مساءً.", isCulprit: true },
                { id: "dev", name: "سارة", alibi: "كنت أعمل من المنزل. تظهر التزامات Git الخاصة بي أنني كنت نشطة حتى منتصف الليل.", statement: "كيفن لديه كلمة المرور الرئيسية.", isCulprit: false },
                { id: "intern", name: "ليو", alibi: "كنت في النادي الرياضي. إليكم سجل تعقب نشاطي.", statement: "سمعت شخصًا يكتب في المكتب في وقت متأخر من الليل.", isCulprit: false }
            ],
            clue: "تم إرسال أمر الحذف من طرفية داخلية بامتيازات مسؤول."
        }
    ]
};

export class DetectiveGenerator {
    private pool: Record<string, number[]> = { en: [], fr: [], ar: [] };

    generateChallenge(difficulty: number, lang: 'en' | 'fr' | 'ar' = 'en'): DetectiveScenario {
        const templates = TEMPLATES[lang] || TEMPLATES['en'];

        if (!this.pool[lang] || this.pool[lang].length === 0) {
            this.pool[lang] = templates.map((_, i) => i);
            shuffleArray(this.pool[lang]);
        }

        const index = this.pool[lang].pop()!;
        const scenario = templates[index];

        if (!scenario) throw new Error("No scenario found");

        const shuffledSuspects = shuffleArray([...scenario.suspects]);

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
