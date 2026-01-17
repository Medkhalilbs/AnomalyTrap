import { getRandomInt, getRandomElement, shuffleArray } from '../../utils/random';

export interface WordChallenge {
    type: 'anagram' | 'oddOneOut' | 'category';
    question: string;
    options: string[];
    correctAnswer: string;
}

const WORD_CATEGORIES = {
    fruits: ['Apple', 'Banana', 'Orange', 'Grape', 'Mango', 'Peach', 'Lemon', 'Cherry', 'Kiwi', 'Melon', 'Pear', 'Plum', 'Fig', 'Lime', 'Berry'],
    animals: ['Dog', 'Cat', 'Lion', 'Tiger', 'Bear', 'Wolf', 'Fox', 'Elephant', 'Giraffe', 'Zebra', 'Monkey', 'Rabbit', 'Deer', 'Panda', 'Koala', 'Rhino'],
    colors: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown', 'Black', 'White', 'Cyan', 'Magenta', 'Teal', 'Indigo', 'Violet'],
    countries: ['France', 'Spain', 'Italy', 'Japan', 'Brazil', 'Canada', 'Mexico', 'Germany', 'China', 'India', 'Australia', 'Egypt', 'USA', 'Russia', 'Peru'],
    sports: ['Soccer', 'Tennis', 'Basketball', 'Baseball', 'Hockey', 'Golf', 'Swimming', 'Volleyball', 'Rugby', 'Cricket'],
    vehicles: ['Car', 'Bus', 'Train', 'Plane', 'Boat', 'Bike', 'Truck', 'Submarine', 'Helicopter', 'Scooter'],
    planets: ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Earth'],
    elements: ['Hydrogen', 'Helium', 'Oxygen', 'Carbon', 'Gold', 'Silver', 'Iron', 'Copper', 'Neon', 'Zinc'],
    capitals: ['Paris', 'London', 'Tokyo', 'Rome', 'Berlin', 'Madrid', 'Ottawa', 'Cairo', 'Canberra', 'Brasilia']
};

const ANAGRAM_WORDS = [
    'LISTEN', 'SILENT', 'EARTH', 'HEART', 'TRIANGLE', 'INTEGRAL',
    'STUDY', 'DUSTY', 'NIGHT', 'THING', 'STOP', 'POTS',
    'GARDEN', 'DANGER', 'PLAYER', 'REPLAY', 'SMILE', 'SLIME',
    'BREAD', 'BEARD', 'CLOUD', 'COULD', 'LEMON', 'MELON',
    'FRIED', 'FIRED', 'HORSE', 'SHORE', 'TRACE', 'REACT'
];

export class WordTrapGenerator {
    generateChallenge(_difficulty: number): WordChallenge {
        const type = getRandomElement(['anagram', 'oddOneOut', 'category'] as const) ?? 'anagram';

        switch (type) {
            case 'anagram':
                return this.generateAnagram();
            case 'oddOneOut':
                return this.generateOddOneOut();
            case 'category':
                return this.generateCategory();
            default:
                return this.generateAnagram();
        }
    }

    private generateAnagram(): WordChallenge {
        const word = getRandomElement(ANAGRAM_WORDS) ?? 'LISTEN';
        const scrambled = shuffleArray(word.split('')).join('');

        // Generate wrong options
        const wrongOptions = [
            this.scrambleWord(word),
            this.scrambleWord(word),
            this.scrambleWord(word)
        ];

        const options = shuffleArray([word, ...wrongOptions]);

        return {
            type: 'anagram',
            question: `Unscramble: ${scrambled}`,
            options,
            correctAnswer: word
        };
    }

    private generateOddOneOut(): WordChallenge {
        const categories = Object.keys(WORD_CATEGORIES) as (keyof typeof WORD_CATEGORIES)[];
        const category1 = getRandomElement(categories) ?? 'fruits';
        const category2 = getRandomElement(categories.filter(c => c !== category1)) ?? 'animals';

        const words1 = WORD_CATEGORIES[category1];
        const words2 = WORD_CATEGORIES[category2];

        const correctWords = [
            getRandomElement(words1) ?? words1[0],
            getRandomElement(words1) ?? words1[1],
            getRandomElement(words1) ?? words1[2]
        ];

        const oddWord = getRandomElement(words2) ?? words2[0];

        const options = shuffleArray([...correctWords, oddWord]);

        return {
            type: 'oddOneOut',
            question: 'Which word doesn\'t belong?',
            options,
            correctAnswer: oddWord
        };
    }

    private generateCategory(): WordChallenge {
        const categories = Object.keys(WORD_CATEGORIES) as (keyof typeof WORD_CATEGORIES)[];
        const category = getRandomElement(categories) ?? 'fruits';
        const words = WORD_CATEGORIES[category];

        const word = getRandomElement(words) ?? words[0];

        // Generate wrong categories
        const wrongCategories = categories.filter(c => c !== category).slice(0, 3);
        const options = shuffleArray([category, ...wrongCategories]);

        return {
            type: 'category',
            question: `What category is "${word}"?`,
            options: options.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
            correctAnswer: category.charAt(0).toUpperCase() + category.slice(1)
        };
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
