/**
 * **WARNING** Sorting objects'keys or values is not guaranteed to be stable.
 *
 * Sorts the values of a given object in ascending or descending order.
 * Defaults to ascending order.
 *
 * @template Obj - An object type where all values are numbers.
 *
 * @param {Obj} obj - The object whose values are to be sorted.
 * @param {boolean} [ascending=true] - A boolean indicating whether the sorting should be in ascending order. If false, the sorting will be in descending order.
 *
 * @returns {Obj} - The sorted object.
 *
 * @example
 * const obj = { a: 2, b: 1, c: 3 }
 * sortNumericalValues(obj)
 * // returns { b: 1, a: 2, c: 3 }
 */
export function sortNumericalValues<Obj extends Record<string, number>>(
  obj: Obj,
  options?: { ascending: boolean },
): Obj {
  const { ascending = true } = options ?? {}
  return Object.fromEntries(
    Object.entries(obj).sort(
      ([, leftValue], [, rightValue]) =>
        (leftValue - rightValue) * (ascending ? 1 : -1),
    ),
  ) as Obj
}
