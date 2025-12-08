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
 * @template T extends {rank: number}
 * @param {T[]} arr
 * @param {T} x
 * @returns {T[]}
 */
export function addSorted(arr, x) {
  let ind = arr.findIndex((a) => a.rank > x.rank);
  return arrayInsert(arr, x, ind === -1 ? arr.length : ind);
}

/// Numbers

/**
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export const add = (a, b) => a + b;
/**
 *
 * @param {number} a
 * @returns {(n : number) => number}
 */
export const addFn = (a) => (b) => a + b;

/**
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export const mult = (a, b) => a * b;

/// Undefined

/**
 *
 * @template T
 * @template U
 * @param {T | null | undefined} x
 * @param {(t:T) => U} fun
 * @returns {U | undefined}
 */
export const opt = (x, fun) => (x != null ? fun(x) : undefined);

/// Coordinate systems

export function getDistance3D(p1, p2) {
  return Math.sqrt(
    Math.pow(p2[0] - p1[0], 2) +
      Math.pow(p2[1] - p1[1], 2) +
      Math.pow(p2[2] - p1[2], 2)
  );
}

/// Graphs

export const toGraph = (nodes, edges) => ({ nodes, edges });

export const addEdge = (graph, edge) => ({
  ...graph,
  edges: [...graph.edges, edge],
});

export const addNode = (graph, node) => ({
  ...graph,
  nodes: [...graph.nodes, node],
});

export const graphContains = (graph, node) => graph.nodes.includes(node);

export const graphConnections = (graph, node) =>
  graph.edges.filter((e) => e.includes(node));

export function graphComponent(graph, node) {
  let comp = toGraph([node], []);
  let visited = [];
  let met = [node];

  while (met.length > 0) {
    const n1 = met.pop();
    visited.push(n1);
    for (let e of graphConnections(graph, n1)) {
      const n2 = otherNode(e, n1);
      if (visited.includes(n2) || met.includes(n2)) {
        continue;
      }
      met.push(n2);
      comp = addNode(addEdge(comp, e), n2);
    }
  }

  return comp;
}

export const otherNode = (e, node) => (e[0] === node ? e[1] : e[0]);

/**
 *
 * @param {{nodes: any[], edges: any[]}[]} components
 * @param {any} edge
 */
export function addEdgeComponents(components, edge) {
  let [comp1, comp2] = [edge[0], edge[1]].map((n) =>
    components.find((c) => graphContains(c, n))
  );
  return comp1 === comp2
    ? components
    : components
        .filter((c) => ![comp1, comp2].includes(c))
        .concat({
          nodes: [...comp1.nodes, ...comp2.nodes],
          edges: [...comp1.edges, ...comp2.edges, edge],
        });
}
