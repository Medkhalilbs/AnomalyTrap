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

const TEMPLATES = [
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
        title: "The Broken Vase",
        story: "A priceless Ming vase was shattered in the gallery. Three visitors were near the scene.",
        culpritId: "student",
        suspects: [
            {
                id: "lady",
                name: "Mrs. Peacock",
                alibi: "I was admiring the paintings on the other side of the room.",
                statement: "The noise startled me!",
                isCulprit: false
            },
            {
                id: "student",
                name: "Timmy the Student",
                alibi: "I was just taking notes for my art class.",
                statement: "My backpack feels lighter now.",
                isCulprit: true
            },
            {
                id: "guard",
                name: "Officer Barbrady",
                alibi: "I was monitoring the entrance.",
                statement: "Nobody left the room.",
                isCulprit: false
            }
        ],
        clue: "A shard of pottery was found inside a backpack."
    },
    {
        title: "The Poisoned Tea",
        story: "The Duchess fell ill after drinking her tea. Who added the mysterious substance?",
        culpritId: "gardener",
        suspects: [
            {
                id: "doctor",
                name: "Dr. Orchid",
                alibi: "I was reading in the library.",
                statement: "I only treat patients, I don't harm them.",
                isCulprit: false
            },
            {
                id: "gardener",
                name: "Green the Gardener",
                alibi: "I was pruning the roses outside.",
                statement: "I picked some fresh herbs for the tea... maybe I mistook one.",
                isCulprit: true
            },
            {
                id: "niece",
                name: "Clara the Niece",
                alibi: "I was playing the piano.",
                statement: "The music drowned out everything.",
                isCulprit: false
            }
        ],
        clue: "The substance was identified as Oleander, a toxic garden plant."
    }
];

export class DetectiveGenerator {
    generateChallenge(difficulty: number): DetectiveScenario {
        const scenario = getRandomElement(TEMPLATES);
        if (!scenario) throw new Error("No scenario found");

        // Clone and shuffle suspects
        const shuffledSuspects = shuffleArray([...scenario.suspects]);

        // Append clue to the story for easier logic (or keep separate if UI handles it)
        const fullStory = `${scenario.story}\n\nCLUE: ${scenario.clue}`;

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
