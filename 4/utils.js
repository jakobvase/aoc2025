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
