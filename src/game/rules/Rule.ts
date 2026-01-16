export type ShapeType = 'circle' | 'square' | 'triangle' | 'pentagon' | 'hexagon' | 'star';

export interface LogicItemData {
    id: string;
    shape: ShapeType;
    color: string;
    rotation: number;
    scale: number;
    opacity: number;
    strokeWidth: number;
    hasInnerDot: boolean;
    isHollow: boolean;
    animationType: 'none' | 'pulse' | 'float' | 'shake' | 'glitch' | 'rotate';
    animationSpeed: number;
    innerShape?: ShapeType | 'none';
    innerColor?: string;
    secondaryColor?: string; // For "Bicolor" logic
}

export interface RuleResult {
    items: LogicItemData[];
    outlierIndex: number;
    ruleDescription: string;
}

export interface GameRule {
    name: string;
    description: string;
    generate(difficulty: number, count?: number): RuleResult;
}
