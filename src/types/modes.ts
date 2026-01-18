export const GameMode = {
    ANOMALY_HUNT: 'anomaly',
    DETECTIVE: 'detective',
    SEQUENCE: 'sequence',
    WORD_TRAP: 'word',
    MEMORY: 'memory',
    RIDDLE: 'riddle',
    CIPHER: 'cipher',
    CONTRADICTION: 'contradiction'
} as const;

export type GameModeValue = typeof GameMode[keyof typeof GameMode];

export interface ModeConfig {
    id: GameModeValue;
    name: string;
    description: string;
    icon: string;
    color: string;
}

export const MODE_CONFIGS: ModeConfig[] = [
    {
        id: GameMode.ANOMALY_HUNT,
        name: 'Anomaly Hunt',
        description: 'Find the visual outlier',
        icon: '🎯',
        color: '#3498db'
    },
    {
        id: GameMode.DETECTIVE,
        name: 'Detective Mode',
        description: 'Solve mystery stories',
        icon: '🔍',
        color: '#e74c3c'
    },
    {
        id: GameMode.SEQUENCE,
        name: 'Sequence Breaker',
        description: 'Predict the pattern',
        icon: '🔢',
        color: '#2ecc71'
    },
    {
        id: GameMode.WORD_TRAP,
        name: 'Word Trap',
        description: 'Language puzzles',
        icon: '📝',
        color: '#f1c40f'
    },
    {
        id: GameMode.MEMORY,
        name: 'Memory Matrix',
        description: 'Test your recall',
        icon: '🧩',
        color: '#9b59b6'
    },
    {
        id: GameMode.RIDDLE,
        name: 'Riddle Rush',
        description: 'Classic brain teasers',
        icon: '💡',
        color: '#e67e22'
    },
    {
        id: GameMode.CIPHER,
        name: 'Cipher Crack',
        description: 'Decode the message',
        icon: '🔐',
        color: '#1abc9c'
    },
    {
        id: GameMode.CONTRADICTION,
        name: 'Contradiction Finder',
        description: 'Spot the logical flaw',
        icon: '⚠️',
        color: '#34495e'
    }
];
