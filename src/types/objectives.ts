export interface Objective {
    id: string;
    description: string;
    type: 'score' | 'combo' | 'gameplay' | 'mode';
    target: number;
    current: number;
    completed: boolean;
    reward: string;
}

export const DAILY_OBJECTIVES: Objective[] = [
    {
        id: 'daily_score',
        description: 'Score 50 points in one run',
        type: 'score',
        target: 50,
        current: 0,
        completed: false,
        reward: '🏆'
    },
    {
        id: 'daily_combo',
        description: 'Reach a 10x Combo',
        type: 'combo',
        target: 10,
        current: 0,
        completed: false,
        reward: '🔥'
    },
    {
        id: 'daily_games',
        description: 'Play 5 games',
        type: 'gameplay',
        target: 5,
        current: 0,
        completed: false,
        reward: '🎮'
    }
];
