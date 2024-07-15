/**
 * Calculates the sum of all numbers in an array
 *
 * @param {number[]} numbers - An array containing numbers
 * @returns {number} The sum of all numbers in the array
 */
export const arraySum = (numbers: number[]): number => {
  return numbers.reduce((acc, current) => acc + current, 0);
};
