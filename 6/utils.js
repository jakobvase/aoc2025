/// Strings

/**
 *
 * @param {string} line
 * @returns {string[]}
 */
export const stringToArray = (line) => {
  const res = [];
  for (let c of line) {
    res.push(c);
  }
  return res;
};

/**
 *
 * @param {string} input
 * @returns {boolean}
 */
export const nonEmpty = (input) =>
  typeof input === "string" && input.length > 0;

/// Grids

/**
 *
 * @template T
 * @param {T[][]} grid
 * @returns {T[]}
 */
export const gridToArray = (grid) =>
  grid.flatMap((line, y) => line.map((v, x) => [v, x, y]));

/**
 *
 * @template T
 * @param {T[][]} grid
 * @param {number} x
 * @param {number} y
 * @returns {[T, number, number][]}
 */
export const gridNeighbours = (grid, nodeX, nodeY) => {
  const neighbours = [];
  for (let y = nodeY - 1; y <= nodeY + 1 && y < grid.length; y++) {
    if (y < 0) continue;
    const line = grid[y];
    for (let x = nodeX - 1; x <= nodeX + 1 && x < line.length; x++) {
      if (x < 0 || (x === nodeX && y === nodeY)) continue;
      neighbours.push([line[x], x, y]);
    }
  }
  // console.dir({ neighbours, nodeX, nodeY });
  return neighbours;
};

/**
 *
 * @template T
 * @param {T[][]} grid
 * @param {number} x
 * @param {number} y
 * @param {T} newValue
 * @returns {T[][]}
 */
export const gridUpdate = (grid, x, y, newValue) => {
  const copy = grid.map((l) => l.filter(() => true));
  // console.dir(copy, x, y);
  copy[y][x] = newValue;
  return copy;
};

export const gridToString = (grid) =>
  grid
    .map((l) => l.reduce((acc, cur) => acc + cur))
    .reduce((acc, cur) => acc + "\n" + cur);

/// Ranges

/**
 *
 * @param {[number, number]} range
 * @param {number} value
 * @returns {boolean}
 */
export const rangeIncludes = ([from, to], value) =>
  value <= to && value >= from;

/**
 *
 * @param {[number, number]} range
 * @returns {number[]}
 */
export const rangeToArrayInclusive = ([from, to]) => {
  try {
    return Array.from({ length: to - from + 1 }, (_, i) => i + from);
  } catch (e) {
    console.dir({ from, to });
    throw e;
  }
};

/**
 *
 * @param {[number, number][]} flattenedRanges
 * @param {[number, number]} range
 * @return {[number, number][]}
 */
export const flattenRanges = (flattenedRanges, range) => {
  // console.dir(flattenedRanges, range);
  const [from, to] = range;
  // assume the flattened ranges are already sorted, not overlapping, and has distance between each range
  for (let i = 0; i < flattenedRanges.length; i++) {
    const fRange = flattenedRanges[i];
    const [fFrom, fTo] = fRange;
    if (to < fFrom - 1) {
      // the range fits in between two ranges separately
      return arrayInsert(flattenedRanges, range, i);
    }

    if (fTo >= from - 1) {
      // there's an overlap.
      // combine the ranges and call recursively so we make sure we get all the ranges that are in range.
      return flattenRanges(arrayRemove(flattenedRanges, i), [
        Math.min(from, fFrom),
        Math.max(to, fTo),
      ]);
    }

    // this range ended before the new range began. Check the next one.
  }

  // flattened ranges is empty, or the new range is the largest one.
  return [...flattenedRanges, range];
};

/// Arrays

export const filterUnique = (v, i, arr) => arr.indexOf(v) === i;
export const filterNoEmpty = (v) => v !== "";

export const arrayInsert = (arr, v, i) => [
  ...arr.slice(0, i),
  v,
  ...arr.slice(i),
];

/**
 *
 * @template T
 * @param {T[]} arr
 * @param {T} v
 * @param {number} i
 * @returns {T[]}
 */
export const arrayReplace = (arr, v, i) => arr.toSpliced(i, 1, v);

/**
 *
 * @template T
 * @param {T[]} arr
 * @param {number} i
 * @returns {T[]}
 */
export const arrayRemove = (arr, i) => arr.toSpliced(i, 1);

/**
 *
 * @template T
 * @param {{v: T, left: object, right: object}} tree
 * @param {T} v
 */
export const treeAdd = (tree, v) => {};

export const add = (a, b) => a + b;

export const mult = (a, b) => a * b;
