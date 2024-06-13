/**
 * Picks specific keys from an object and returns a new object with only those keys.
 *
 * @template T - The type of the source object.
 * @template K - The keys of the source object to pick.
 * @param {T} obj - The source object to pick keys from.
 * @param {...K[]} keys - The keys to pick from the source object.
 * @returns {Pick<T, K>} A new object with only the specified keys.
 *
 * @example
 * const obj = { a: 1, b: 2, c: 3 };
 * const picked = pick(obj, 'a', 'c');
 * // picked is { a: 1, c: 3 }
 */
export const pick = <T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> => {
  const result: any = {};
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
};
