export type GoalType = 'score' | 'combo' | 'gameplay' | 'mode' | 'survival';
export type GoalFrequency = 'daily' | 'weekly' | 'lifetime';

export interface Goal {
    id: string;
    description: string;
    type: GoalType;
    frequency: GoalFrequency;
    target: number;
    current: number;
    completed: boolean;
    reward: string;
    icon: string;
}

export const GENERATE_DAILY_GOALS = (): Goal[] => [
    {
        id: `daily_score_${Date.now()}`,
        description: 'Score 100 points in any mode',
        type: 'score',
        frequency: 'daily',
        target: 100,
        current: 0,
        completed: false,
        reward: '🏆',
        icon: '🎯'
    },
    {
        id: `daily_games_${Date.now()}`,
        description: 'Play 3 games',
        type: 'gameplay',
        frequency: 'daily',
        target: 3,
        current: 0,
        completed: false,
        reward: '⭐',
        icon: '🎮'
    },
    {
        id: `daily_combo_${Date.now()}`,
        description: 'Reach a 15x Combo',
        type: 'combo',
        frequency: 'daily',
        target: 15,
        current: 0,
        completed: false,
        reward: '🔥',
        icon: '⚡'
    }
];

export const LIFETIME_MILESTONES: Goal[] = [
    {
        id: 'life_score_1000',
        description: 'Total Score: 1000',
        type: 'score',
        frequency: 'lifetime',
        target: 1000,
        current: 0,
        completed: false,
        reward: '🏅',
        icon: '👑'
    },
    {
        id: 'life_games_50',
        description: 'Play 50 games',
        type: 'gameplay',
        frequency: 'lifetime',
        target: 50,
        current: 0,
        completed: false,
        reward: '🎖️',
        icon: '🕹️'
    }
];
