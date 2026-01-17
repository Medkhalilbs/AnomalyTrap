import { getRandomInt, getRandomElement, shuffleArray } from '../../utils/random';

export interface WordChallenge {
    type: 'anagram' | 'oddOneOut' | 'category';
    question: string;
    options: string[];
    correctAnswer: string;
}

const WORD_CATEGORIES = {
    en: {
        fruits: ['Apple', 'Banana', 'Orange', 'Grape', 'Mango', 'Peach', 'Lemon', 'Cherry', 'Kiwi'],
        animals: ['Dog', 'Cat', 'Lion', 'Tiger', 'Bear', 'Wolf', 'Fox', 'Elephant', 'Giraffe'],
        colors: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown', 'Black'],
        countries: ['France', 'Spain', 'Italy', 'Japan', 'Brazil', 'Canada', 'Mexico', 'Germany'],
        sports: ['Soccer', 'Tennis', 'Basketball', 'Baseball', 'Hockey', 'Golf', 'Swimming'],
        vehicles: ['Car', 'Bus', 'Train', 'Plane', 'Boat', 'Bike', 'Truck'],
    },
    fr: {
        fruits: ['Pomme', 'Banane', 'Orange', 'Raisin', 'Mangue', 'Pêche', 'Citron', 'Cerise', 'Kiwi'],
        animals: ['Chien', 'Chat', 'Lion', 'Tigre', 'Ours', 'Loup', 'Renard', 'Éléphant', 'Girafe'],
        colors: ['Rouge', 'Bleu', 'Vert', 'Jaune', 'Violet', 'Orange', 'Rose', 'Marron', 'Noir'],
        countries: ['France', 'Espagne', 'Italie', 'Japon', 'Brésil', 'Canada', 'Mexique', 'Allemagne'],
        sports: ['Football', 'Tennis', 'Basket', 'Baseball', 'Hockey', 'Golf', 'Natation'],
        vehicles: ['Voiture', 'Bus', 'Train', 'Avion', 'Bateau', 'Vélo', 'Camion'],
    },
    ar: {
        fruits: ['تفاحة', 'موز', 'برتقال', 'عنب', 'مانجو', 'خوخ', 'ليمون', 'كرز', 'كيوي'],
        animals: ['كلب', 'قطة', 'أسد', 'نمر', 'دب', 'ذئب', 'ثعلب', 'فيل', 'زرافة'],
        colors: ['أحمر', 'أزرق', 'أخضر', 'أصفر', 'أرجواني', 'برتقالي', 'وردي', 'بني', 'أسود'],
        countries: ['فرنسا', 'إسبانيا', 'إيطاليا', 'اليابان', 'البرازيل', 'كندا', 'المكسيك', 'ألمانيا'],
        sports: ['كرة القدم', 'تنس', 'كرة السلة', 'بيسبول', 'هوكي', 'جولف', 'سباحة'],
        vehicles: ['سيارة', 'حافلة', 'قطار', 'طائرة', 'قارب', 'دراجة', 'شاحنة'],
    }
};

const ANAGRAM_WORDS = {
    en: ['LISTEN', 'SILENT', 'EARTH', 'HEART', 'TRIANGLE', 'NIGHT', 'SMILE', 'BREAD', 'CLOUD'],
    fr: ['ECOLE', 'LIVRE', 'TABLE', 'NOIRE', 'ROUGE', 'PORTE', 'CHIEN', 'FLEUR', 'ARBRE'],
    ar: ['كتاب', 'مدرسة', 'شجرة', 'قمر', 'شمس', 'بحر', 'نهر', 'جبل', 'زهرة']
};

export class WordTrapGenerator {
    generateChallenge(difficulty: number, lang: 'en' | 'fr' | 'ar' = 'en'): WordChallenge {
        const type = getRandomElement(['anagram', 'oddOneOut', 'category'] as const) ?? 'anagram';

        switch (type) {
            case 'anagram':
                return this.generateAnagram(lang);
            case 'oddOneOut':
                return this.generateOddOneOut(lang);
            case 'category':
                return this.generateCategory(lang);
            default:
                return this.generateAnagram(lang);
        }
    }

    private generateAnagram(lang: 'en' | 'fr' | 'ar'): WordChallenge {
        const anagrams = ANAGRAM_WORDS[lang] || ANAGRAM_WORDS['en'];
        const word = getRandomElement(anagrams) ?? anagrams[0];
        const scrambled = shuffleArray(word.split('')).join('');

        // Generate wrong options
        const wrongOptions = [
            this.scrambleWord(word),
            this.scrambleWord(word),
            this.scrambleWord(word)
        ];

        const options = shuffleArray([word, ...wrongOptions]);
        const questionPrefix = lang === 'ar' ? 'رتب الحروف:' : (lang === 'fr' ? 'Remettez en ordre:' : 'Unscramble:');

        return {
            type: 'anagram',
            question: `${questionPrefix} ${scrambled}`,
            options,
            correctAnswer: word
        };
    }

    private generateOddOneOut(lang: 'en' | 'fr' | 'ar'): WordChallenge {
        const categoriesData = (WORD_CATEGORIES[lang] || WORD_CATEGORIES['en']) as Record<string, string[]>;
        const categories = Object.keys(categoriesData);

        const category1 = getRandomElement(categories) ?? 'fruits';
        const category2 = getRandomElement(categories.filter(c => c !== category1)) ?? 'animals';

        const words1 = categoriesData[category1] ?? [];
        const words2 = categoriesData[category2] ?? [];

        const correctWords = [
            getRandomElement(words1) ?? words1[0] ?? 'Apple',
            getRandomElement(words1) ?? words1[1] ?? 'Banana',
            getRandomElement(words1) ?? words1[2] ?? 'Orange'
        ];

        const oddWord = getRandomElement(words2) ?? words2[0] ?? 'Dog';

        const options = shuffleArray([...correctWords, oddWord]);
        const questionText = lang === 'ar' ? 'ما هي الكلمة الدخيلة؟' : (lang === 'fr' ? 'Quelle est l\'intruse ?' : 'Which word doesn\'t belong?');

        return {
            type: 'oddOneOut',
            question: questionText,
            options,
            correctAnswer: oddWord
        };
    }

    private generateCategory(lang: 'en' | 'fr' | 'ar'): WordChallenge {
        const categoriesData = (WORD_CATEGORIES[lang] || WORD_CATEGORIES['en']) as Record<string, string[]>;
        const categories = Object.keys(categoriesData);

        const category = getRandomElement(categories) ?? 'fruits';
        const words = categoriesData[category] ?? [];

        const word = getRandomElement(words) ?? words[0] ?? 'Apple';

        // Generate wrong categories
        const wrongCategories = categories.filter(c => c !== category).slice(0, 3);
        const options = shuffleArray([category, ...wrongCategories]);

        // Translate category names for display (capitalize)
        const displayOptions = options.map(c => this.translateCategory(c, lang));
        const correctDisplay = this.translateCategory(category, lang);

        const questionText = lang === 'ar' ? `ما هو تصنيف "${word}"؟` : (lang === 'fr' ? `Quelle est la catégorie de "${word}" ?` : `What category is "${word}"?`);

        return {
            type: 'category',
            question: questionText,
            options: displayOptions,
            correctAnswer: correctDisplay
        };
    }

    private translateCategory(cat: string, lang: 'en' | 'fr' | 'ar'): string {
        // Simple mapping if keys are English, but for display we want localized category names.
        // Currently keys are 'fruits', 'animals' etc.
        // We can add a simple map here or just capitalize for EN/FR. 
        // For AR we need a map.

        const catMap: Record<string, Record<string, string>> = {
            fruits: { en: 'Fruits', fr: 'Fruits', ar: 'فاكهة' },
            animals: { en: 'Animals', fr: 'Animaux', ar: 'حيوانات' },
            colors: { en: 'Colors', fr: 'Couleurs', ar: 'ألوان' },
            countries: { en: 'Countries', fr: 'Pays', ar: 'بلدان' },
            sports: { en: 'Sports', fr: 'Sports', ar: 'رياضة' },
            vehicles: { en: 'Vehicles', fr: 'Véhicules', ar: 'مركبات' },
            planets: { en: 'Planets', fr: 'Planètes', ar: 'كواكب' },
            elements: { en: 'Elements', fr: 'Éléments', ar: 'عناصر' },
            capitals: { en: 'Capitals', fr: 'Capitales', ar: 'عواصم' }
        };

        return catMap[cat]?.[lang] ?? cat.charAt(0).toUpperCase() + cat.slice(1);
    }

    private scrambleWord(word: string): string {
        const chars = word.split('');
        // Create a different scramble
        for (let i = 0; i < 3; i++) {
            const idx1 = getRandomInt(0, chars.length - 1);
            const idx2 = getRandomInt(0, chars.length - 1);
            [chars[idx1], chars[idx2]] = [chars[idx2] ?? '', chars[idx1] ?? ''];
        }
        return chars.join('');
    }
}
