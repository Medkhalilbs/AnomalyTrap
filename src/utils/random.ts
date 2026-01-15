/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 */
export const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Returns a random element from an array.
 */
export const getRandomElement = <T>(array: T[]): T => {
    return array[getRandomInt(0, array.length - 1)];
};

/**
 * Shuffles an array in place.
 */
export const shuffleArray = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i] as T;
        array[i] = array[j] as T;
        array[j] = temp;
    }
    return array;
};

/**
 * Generates a random hex color.
 */
export const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
