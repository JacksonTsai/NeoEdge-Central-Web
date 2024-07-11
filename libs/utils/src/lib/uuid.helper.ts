/**
 * Generates a UUID string of specified length consisting of alphanumeric characters.
 *
 * @param {number} [length=3] - The length of the UUID to be generated. Defaults to 3.
 * @returns {string} A randomly generated UUID of the specified length.
 *
 * @example
 * // Generates a UUID of length 3
 * const uuid = generateThreeCharUUID();
 * // Generates a UUID of length 5
 * const uuid = generateThreeCharUUID(5);
 */
export const generateThreeCharUUID = (length = 3) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let uuid = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uuid += characters[randomIndex];
  }

  return uuid;
};
