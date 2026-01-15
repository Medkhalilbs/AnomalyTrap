/**
 * Clamps a number between a minimum and maximum value.
 */
export const clamp = (num: number, min: number, max: number): number => {
    return Math.min(Math.max(num, min), max);
};

/**
 * Returns true if a number is even.
 */
export const isEven = (num: number): boolean => {
    return num % 2 === 0;
};

/**
 * Returns true if a number is prime.
 */
export const isPrime = (num: number): boolean => {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
        if (num % i === 0) return false;
    }
    return num > 1;
};
