import { getRandomElement, shuffleArray } from '../../utils/random';

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

const TEMPLATES = [
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
    }
];

export class ContradictionGenerator {
    generateChallenge(difficulty: number): ContradictionChallenge {
        const scenario = getRandomElement(TEMPLATES);
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
