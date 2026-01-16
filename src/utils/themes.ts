export interface Theme {
    name: string;
    primary: string;
    secondary: string;
    background: string;
    accent: string;
    itemColors: string[];
}

export const themes: Theme[] = [
    {
        name: 'Midnight',
        primary: '#3498db', // Blue
        secondary: '#2c3e50', // Dark Blue
        background: '#1a1a1a',
        accent: '#e74c3c',
        itemColors: ['#3498db', '#9b59b6', '#34495e', '#ecf0f1']
    },
    {
        name: 'Solar',
        primary: '#f39c12', // Orange
        secondary: '#e67e22',
        background: '#fdf6e3',
        accent: '#d33682',
        itemColors: ['#f39c12', '#e74c3c', '#27ae60', '#2c3e50']
    },
    {
        name: 'Neon',
        primary: '#00ff41', // Matrix Green
        secondary: '#003b00',
        background: '#000000',
        accent: '#ff00ff',
        itemColors: ['#00ff41', '#008f11', '#003b00', '#ffffff']
    },
    {
        name: 'Amethyst',
        primary: '#9b59b6', // Purple
        secondary: '#8e44ad',
        background: '#2c3e50',
        accent: '#f1c40f',
        itemColors: ['#9b59b6', '#3498db', '#1abc9c', '#ecf0f1']
    }
];

export const getThemeForScore = (score: number): Theme => {
    const index = Math.floor(score / 15) % themes.length;
    return (themes[index] || themes[0]) as Theme;
};
