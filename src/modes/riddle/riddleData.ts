import { getRandomElement, shuffleArray } from '../../utils/random';

export interface RiddleChallenge {
    question: string;
    options: string[];
    correctAnswer: string;
}

const RIDDLES = [
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
    },
    {
        q: "What runs all around a backyard, yet never moves?",
        a: "Fence",
        wrong: ["Dog", "Grass", "Tree"]
    },
    {
        q: "What can travel all around the world without leaving its corner?",
        a: "Stamp",
        wrong: ["Plane", "Bird", "Cloud"]
    },
    {
        q: "What has hands, but can't clap?",
        a: "Clock",
        wrong: ["Statue", "Tree", "Doll"]
    },
    {
        q: "What is so fragile that saying its name breaks it?",
        a: "Silence",
        wrong: ["Glass", "Bubble", "Ice"]
    },
    {
        q: "The more you take, the more you leave behind. What am I?",
        a: "Footsteps",
        wrong: ["Time", "Money", "Memories"]
    },
    {
        q: "What has many keys but can't open a single lock?",
        a: "Piano",
        wrong: ["Map", "Computer", "Jail"]
    },
    {
        q: "What has one eye, but can't see?",
        a: "Needle",
        wrong: ["Cyclops", "Storm", "Potato"]
    },
    {
        q: "What can be broken, but is never held?",
        a: "Promise",
        wrong: ["Glass", "Silence", "Record"]
    },
    {
        q: "What goes up but never comes down?",
        a: "Age",
        wrong: ["Balloon", "Smoke", "Bird"]
    },
    {
        q: "What gets wet while drying?",
        a: "Towel",
        wrong: ["Sponge", "Rain", "Fish"]
    },
    {
        q: "I have branches, but no fruit, trunk or leaves. What am I?",
        a: "Bank",
        wrong: ["River", "Library", "Family"]
    },
    {
        q: "What begins with T, ends with T, and has T in it?",
        a: "Teapot",
        wrong: ["Tent", "Target", "Tomato"]
    },
    {
        q: "What belongs to you, but other people use it more than you?",
        a: "Name",
        wrong: ["Money", "Car", "House"]
    },
    {
        q: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
        a: "Map",
        wrong: ["Globe", "Dream", "Picture"]
    },
    {
        q: "I am always hungry, I must always be fed. The finger I lick will soon turn red. What am I?",
        a: "Fire",
        wrong: ["Baby", "Oven", "Rust"]
    },
    {
        q: "The person who makes it has no need of it; the person who buys it has no use for it. The person who uses it can neither see nor feel it. What is it?",
        a: "Coffin",
        wrong: ["Cradle", "Gift", "Trap"]
    },
    {
        q: "I have a neck but no head. I have two arms but no hands. What am I?",
        a: "Shirt",
        wrong: ["Bottle", "Ghost", "Clock"]
    },
    {
        q: "If you drop me I'm sure to crack, but give me a smile and I'll always smile back. What am I?",
        a: "Mirror",
        wrong: ["Egg", "Glass", "Friend"]
    },
    {
        q: "I can fly but have no wings. I can cry but I have no eyes. Wherever I go, darkness follows me. What am I?",
        a: "Cloud",
        wrong: ["Bat", "Wind", "Ghost"]
    },
    {
        q: "What has 13 hearts, but no other organs?",
        a: "Deck of Cards",
        wrong: ["Octopus", "Hospital", "Monster"]
    },
    {
        q: "It stalks the countryside with ears that can't hear. What is it?",
        a: "Corn",
        wrong: ["Rabbit", "Wolf", "Silo"]
    },
    {
        q: "I am an odd number. Take away a letter and I become even. What number am I?",
        a: "Seven",
        wrong: ["One", "Nine", "Five"]
    },
    {
        q: "The more you dry, the wetter I get. What am I?",
        a: "Towel",
        wrong: ["Sponge", "Water", "Soap"]
    },
    {
        q: "I have no life, but I can die. What am I?",
        a: "Battery",
        wrong: ["Ghost", "Idea", "Silence"]
    },
    {
        q: "People make me, save me, change me, raise me. What am I?",
        a: "Money",
        wrong: ["Child", "House", "Mind"]
    },
    {
        q: "What breaks yet never falls, and what falls yet never breaks?",
        a: "Day and Night",
        wrong: ["Glass and Rain", "Heart and Star", "Stick and Stone"]
    },
    {
        q: "I turn polar bears white and I will make you cry. I make guys have to pee and girls comb their hair. I make celebrities look prefer stupid and normal people look like celebrities. I turn pancakes brown and make your champane bubble. If you sqeeze me, I'll pop. If you look at me, you'll pop. Can you answer this riddle?",
        a: "No",
        wrong: ["Yes", "Time", "Life"]
    },
    {
        q: "What moves faster: Heat or Cold?",
        a: "Heat",
        wrong: ["Cold", "Neither", "Light"]
    }
];

export class RiddleGenerator {
    generateChallenge(_difficulty: number): RiddleChallenge {
        const riddle = getRandomElement(RIDDLES) ?? RIDDLES[0];

        const options = shuffleArray([riddle.a, ...riddle.wrong]);

        return {
            question: riddle.q,
            options,
            correctAnswer: riddle.a
        };
    }
}
