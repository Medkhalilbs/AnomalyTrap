export type ShapeType = 'circle' | 'square' | 'triangle' | 'pentagon' | 'hexagon' | 'star';

export interface LogicItemData {
    id: string;
    value: number;
    color: string;
    shape: ShapeType;
    rotation: number; // in degrees
    sides: number;
    opacity: number;
    scale: number;
}

export interface RuleResult {
    items: LogicItemData[];
    outlierIndex: number;
    ruleDescription: string;
}

export interface GameRule {
    name: string;
    description: string;
    generate(difficulty: number): RuleResult;
}
