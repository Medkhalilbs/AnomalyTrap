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
