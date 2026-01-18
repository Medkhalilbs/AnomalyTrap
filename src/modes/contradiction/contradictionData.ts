import { shuffleArray } from '../../utils/random';

export interface ContradictionChallenge {
    id: string;
    description: string;
    statements: Statement[];
}

export interface Statement {
    id: string;
    text: string;
    isContradiction: boolean;
}

const TEMPLATES = {
    en: [
        {
            description: "Analyze the witness reports about the vehicle speed.",
            statements: [
                { text: "The car was moving very slowly, maybe 10 mph.", isContradiction: false },
                { text: "The car zoomed past us in a blur!", isContradiction: true },
                { text: "It barely created a breeze as it passed.", isContradiction: false },
                { text: "I could easily walk faster than that car.", isContradiction: false }
            ]
        },
        {
            description: "Review the timeline of events.",
            statements: [
                { text: "The suspect entered the bank at 10:00 AM.", isContradiction: false },
                { text: "The robbery alarm was triggered at 10:05 AM.", isContradiction: false },
                { text: "The suspect was seen buying coffee at 10:02 AM across town.", isContradiction: true },
                { text: "Police arrived at the bank at 10:10 AM.", isContradiction: false }
            ]
        },
        {
            description: "Logistical check for the shipment.",
            statements: [
                { text: "The package weighs 50kg.", isContradiction: false },
                { text: "The courier carried it with one hand effortlessly.", isContradiction: true },
                { text: "It requires two people to lift safely.", isContradiction: false },
                { text: "It contains heavy machinery parts.", isContradiction: false }
            ]
        },
        {
            description: "Weather report consistency check.",
            statements: [
                { text: "It was a bright, sunny day with no clouds.", isContradiction: false },
                { text: "Shadows were sharp and distinct.", isContradiction: false },
                { text: "I needed my umbrella because of the pouring rain.", isContradiction: true },
                { text: "Everyone was wearing sunglasses.", isContradiction: false }
            ]
        },
        {
            description: "Biology exam answers.",
            statements: [
                { text: "Penguins are birds found in the Southern Hemisphere.", isContradiction: false },
                { text: "They are excellent swimmers.", isContradiction: false },
                { text: "They use their wings to fly high in the sky.", isContradiction: true },
                { text: "They have a thick layer of blubber for warmth.", isContradiction: false }
            ]
        },
        {
            description: "Space mission log.",
            statements: [
                { text: "The astronaut stepped outside into the vacuum of space.", isContradiction: false },
                { text: "He took a deep breath of the fresh lunar air.", isContradiction: true },
                { text: "His suit provided a constant supply of oxygen.", isContradiction: false },
                { text: "The silence was absolute.", isContradiction: false }
            ]
        },
        {
            description: "Castle guard shift report.",
            statements: [
                { text: "I stood guard at the main gate from midnight to dawn.", isContradiction: false },
                { text: "The sun was burning hot at 2:00 AM.", isContradiction: true },
                { text: "It was a cold and moonless night.", isContradiction: false },
                { text: "The owls were the only thing I heard.", isContradiction: false }
            ]
        }
    ],
    fr: [
        {
            description: "Analysez les rapports des témoins sur la vitesse du véhicule.",
            statements: [
                { text: "La voiture roulait très lentement, peut-être à 15 km/h.", isContradiction: false },
                { text: "La voiture nous a dépassés en un éclair !", isContradiction: true },
                { text: "Elle a peine soulevé une brise en passant.", isContradiction: false },
                { text: "Je pourrais facilement marcher plus vite que cette voiture.", isContradiction: false }
            ]
        },
        {
            description: "Examinez la chronologie des événements.",
            statements: [
                { text: "Le suspect est entré dans la banque à 10h00.", isContradiction: false },
                { text: "L'alarme du braquage s'est déclenchée à 10h05.", isContradiction: false },
                { text: "Le suspect a été vu achetant un café à 10h02 à l'autre bout de la ville.", isContradiction: true },
                { text: "La police est arrivée à la banque à 10h10.", isContradiction: false }
            ]
        },
        {
            description: "Vérification logistique de l'expédition.",
            statements: [
                { text: "Le colis pèse 50 kg.", isContradiction: false },
                { text: "Le coursier l'a porté d'une seule main sans effort.", isContradiction: true },
                { text: "Il faut deux personnes pour le soulever en toute sécurité.", isContradiction: false },
                { text: "Il contient des pièces de machines lourdes.", isContradiction: false }
            ]
        },
        {
            description: "Rapport de mission spatiale.",
            statements: [
                { text: "L'astronaute est sorti dans le vide spatial.", isContradiction: false },
                { text: "Il a pris une grande inspiration d'air frais lunaire.", isContradiction: true },
                { text: "Sa combinaison fournissait un apport constant d'oxygène.", isContradiction: false },
                { text: "Le silence était absolu.", isContradiction: false }
            ]
        },
        {
            description: "Rapport de garde du château.",
            statements: [
                { text: "J'ai monté la garde à la porte principale de minuit à l'aube.", isContradiction: false },
                { text: "Le soleil brûlait fort à 2h00 du matin.", isContradiction: true },
                { text: "C'était une nuit froide et sans lune.", isContradiction: false },
                { text: "Les chouettes étaient les seules choses que j'entendais.", isContradiction: false }
            ]
        }
    ],
    ar: [
        {
            description: "حلل تقارير الشهود حول سرعة المركبة.",
            statements: [
                { text: "كانت السيارة تتحرك ببطء شديد، ربما ١٠ أميال في الساعة.", isContradiction: false },
                { text: "مرت السيارة من أمامنا بسرعة البرق!", isContradiction: true },
                { text: "بالكاد أحدثت نسيماً عند مرورها.", isContradiction: false },
                { text: "يمكنني المشي أسرع من تلك السيارة بسهولة.", isContradiction: false }
            ]
        },
        {
            description: "راجع الجدول الزمني للأحداث.",
            statements: [
                { text: "دخل المشتبه به البنك في الساعة ١٠:٠٠ صباحاً.", isContradiction: false },
                { text: "انطلق إنذار السرقة في الساعة ١٠:٠٥ صباحاً.", isContradiction: false },
                { text: "شوهد المشتبه به يشتري القهوة في الساعة ١٠:٠٢ صباحاً في الجانب الآخر من المدينة.", isContradiction: true },
                { text: "وصلت الشرطة إلى البنك في الساعة ١٠:١٠ صباحاً.", isContradiction: false }
            ]
        },
        {
            description: "فحص لوجستي للشحنة.",
            statements: [
                { text: "الطرد يزن ٥٠ كجم.", isContradiction: false },
                { text: "حمله الساعي بيد واحدة دون عناء.", isContradiction: true },
                { text: "يتطلب الأمر شخصين لرفعه بأمان.", isContradiction: false },
                { text: "يحتوي على قطع غيار آلات ثقيلة.", isContradiction: false }
            ]
        },
        {
            description: "سجل المهمة الفضائية.",
            statements: [
                { text: "خرج رائد الفضاء إلى فراغ الفضاء.", isContradiction: false },
                { text: "أخذ نفساً عميقاً من الهواء القمري المنعش.", isContradiction: true },
                { text: "بدلته توفر إمداداً مستمراً من الأكسجين.", isContradiction: false },
                { text: "كان الصمت مطلقاً.", isContradiction: false }
            ]
        },
        {
            description: "تقرير نوبة حارس القلعة.",
            statements: [
                { text: "وقفت حارساً عند البوابة الرئيسية من منتصف الليل حتى الفجر.", isContradiction: false },
                { text: "كانت الشمس حارقة في الساعة ٢:٠٠ صباحاً.", isContradiction: true },
                { text: "كانت ليلة باردة وبدون قمر.", isContradiction: false },
                { text: "البوم كان الشيء الوحيد الذي سمعته.", isContradiction: false }
            ]
        }
    ]
};

export class ContradictionGenerator {
    private pool: Record<string, number[]> = { en: [], fr: [], ar: [] };

    generateChallenge(_difficulty: number, lang: 'en' | 'fr' | 'ar' = 'en'): ContradictionChallenge {
        const templates = TEMPLATES[lang] || TEMPLATES['en'];

        // Shuffling logic: replenish pool if empty
        if (!this.pool[lang] || this.pool[lang].length === 0) {
            this.pool[lang] = templates.map((_, i) => i);
            shuffleArray(this.pool[lang]);
        }

        const index = this.pool[lang].pop()!;
        const scenario = templates[index];
        if (!scenario) throw new Error("No scenario found");

        const statements = shuffleArray(scenario.statements.map((s, i) => ({
            id: `stmt_${i}`,
            text: s.text,
            isContradiction: s.isContradiction
        })));

        return {
            id: Math.random().toString(36).substr(2, 9),
            description: scenario.description,
            statements: statements
        };
    }
}
