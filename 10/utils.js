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

export const filterUniqueFn = (cmp) => (v, i, arr) =>
  arr.findIndex((v2) => cmp(v, v2)) === i;
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

/// Union Find / Disjoint Set
/// Great for finding a number of disjoint sets or components in a graph or similar
/// https://en.wikipedia.org/wiki/Disjoint-set_data_structure

/**
 * @template T
 * @typedef {{id: symbol, parent?: symbol, rank: number, value: T}} UnionFindSet
 */

/**
 * @template T
 * @typedef {{sets: Record<symbol, UnionFindSet<T>, roots: symbol[], valueToSet: Record<T, symbol>, valueHasher: (t: T) => string}} UnionFindForest
 */

const unionFindMakeForest = (valueHasher) => ({
  sets: {},
  roots: [],
  valueToSet: {},
  valueHasher,
});

/**
 *
 * @template T
 * @param {UnionFindForest<T>} forest
 * @param {T} value
 * @returns {UnionFindForest<T>}
 */
const unionFindMakeSet = (forest, value) => {
  const set = { id: Symbol(), rank: 0, value };
  return {
    ...forest,
    sets: { ...forest.sets, [set.id]: set },
    roots: [...forest.roots, set.id],
    valueToSet: { ...forest.valueToSet, [forest.valueHasher(value)]: set.id },
  };
};

/**
 *
 * @template T
 * @param {UnionFindForest<T>} forest
 * @param {UnionFindSet<T>} set
 * @returns {[UnionFindForest<T>, UnionFindSet<T>]}
 */
const unionFindFind = (forest, set) => {
  if (set.parent == null) {
    return [forest, set];
  }

  const [f2, p] = unionFindFind(forest, forest.sets[set.parent]);
  const newSet = { ...set, parent: p.id };
  // console.dir({ forest, set, p }, { depth: null });
  return [{ ...f2, sets: { ...f2.sets, [set.id]: newSet } }, p];
};

/**
 *
 * @template T
 * @param {UnionFindForest<T>} forest
 * @param {UnionFindSet<T>} s1
 * @param {UnionFindSet<T>} s2
 * @returns {UnionFindForest<T>}
 */
const unionFindUnion = (forest, s1, s2) => {
  const [f2, root1] = unionFindFind(forest, s1);
  const [f3, root2] = unionFindFind(f2, s2);
  // console.dir({ s1, s2 });

  if (root1 === root2) {
    return f3;
  }

  const [r1, r2] = root1.rank < root2.rank ? [root2, root1] : [root1, root2];

  const r12 = r1.rank === r2.rank ? { ...r1, rank: r1.rank + 1 } : r1;
  const r22 = { ...r2, parent: r12.id };

  return {
    ...f3,
    sets: { ...f3.sets, [r12.id]: r12, [r22.id]: r22 },
    roots: f3.roots.filter((r) => r !== r22.id),
  };
};

/**
 *
 * @param {UnionFindForest<any>} forest
 * @returns {number}
 */
const unionFindCountRoots = (forest) => forest.roots.length;

const unionFindValueToSet = (forest, value) =>
  forest.sets[forest.valueToSet[forest.valueHasher(value)]];

export const unionFind = {
  makeForest: unionFindMakeForest,
  makeSet: unionFindMakeSet,
  find: unionFindFind,
  union: unionFindUnion,
  countRoots: unionFindCountRoots,
  valueToSet: unionFindValueToSet,
};

export const makeEdge = (x0, y0, x1, y1) => [
  [x0, y0],
  [x1, y1],
];

export const isPointWithinLineBounds = ([x, y], [[x1, y1], [x2, y2]]) =>
  x <= Math.max(x1, x2) &&
  x >= Math.min(x1, x2) &&
  y <= Math.max(y1, y2) &&
  y >= Math.min(y1, y2);

/**
 * https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
 *
 * But I needed to also check whether the point was within the line bounds,
 * as the lines are not infinite.
 *
 * @param {[[number, number], [number, number]]} l1
 * @param {[[number, number], [number, number]]} l2
 * @returns {boolean}
 */
export const linesIntersect = (l1, l2) => {
  const point = getIntersection(l1, l2);
  if (point == null) {
    return false;
  }

  const result =
    isPointWithinLineBounds(point, l1) && isPointWithinLineBounds(point, l2);

  return result;
};

export const getIntersection = (l1, l2) => {
  const [[x1, y1], [x2, y2]] = l1;
  const [[x3, y3], [x4, y4]] = l2;
  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (denominator === 0) {
    return null;
  }

  return [
    ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
      denominator,
    ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
      denominator,
  ];
};

/**
 * https://en.wikipedia.org/wiki/Point_in_polygon
 *
 * @param {[[number, number], [number, number]][]} edges
 * @param {[number, number]} point
 * @returns {boolean}
 */
export function isPointWithinPolygon(edges, point) {
  // First, if the point is on the edge, it's within the polygon,
  // as the edge has area.
  if (
    edges.some(
      ([[x1, y1], [x2, y2]]) =>
        (x1 === x2 &&
          point[0] === x1 &&
          point[1] <= Math.max(y1, y2) &&
          point[1] >= Math.min(y1, y2)) ||
        (y1 === y2 &&
          point[1] === y1 &&
          point[0] <= Math.max(x1, x2) &&
          point[0] >= Math.min(x1, x2))
    )
  ) {
    return true;
  }
  // Otherwise, count the times it intersects and see if it's uneven.
  // Make a vertical line from [0,y] to the point.
  const ray = [[point[0], 0], point];
  const intersections = edges.reduce(
    (acc, cur) =>
      // Handle corners and parallel lines
      (point[0] <= cur[0][0] && point[0] <= cur[1][0]) ||
      (point[1] <= cur[0][1] && point[1] <= cur[1][1])
        ? acc
        : linesIntersect(ray, cur)
        ? acc + 1
        : acc,
    0
  );
  return intersections % 2 === 1;
}

export function lineToInnerRectangleSides([[x1, y1], [x2, y2]]) {
  // Need to reduce the size by 1 in all directions, as we're only
  // interested in whether any lines intersect with the inner square.
  const topLeft = [Math.min(x1, x2) + 1, Math.min(y1, y2) + 1];
  const bottomRight = [Math.max(x1, x2) - 1, Math.max(y1, y2) - 1];
  x1 = topLeft[0];
  y1 = topLeft[1];
  x2 = bottomRight[0];
  y2 = bottomRight[1];

  if (x1 > x2 || y1 > y2) {
    return [];
  }

  if (x1 === x2 || y1 === y2) {
    return [[topLeft, bottomRight]];
  }

  return [
    makeEdge(x1, y1, x2, y1),
    makeEdge(x2, y1, x2, y2),
    makeEdge(x2, y2, x1, y2),
    makeEdge(x1, y2, x1, y1),
  ];
}

export const rectArea = ([x1, y1], [x2, y2]) =>
  (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);

export const arrayEquals = (a1, a2) =>
  a1.length === a2.length && a1.every((v, i) => v === a2[i]);

/**
 * https://en.wikipedia.org/wiki/A*_search_algorithm
 */
export const whenYouWishUponAStar = (start, goal, h, getNeighbors, d) => {
  // The set of discovered nodes that may need to be (re-)expanded.
  // Initially, only the start node is known.
  // This is usually implemented as a min-heap or priority queue rather than a hash-set.
  const openSet = [start];

  // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from the start
  // to n currently known.
  // const cameFrom = [];

  // For node n, gScore[n] is the currently known cost of the cheapest path from start to n.
  const gScore = {};
  gScore[start] = 0;

  // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
  // how cheap a path could be from start to finish if it goes through n.
  const fScore = {};
  fScore[start] = h(start);

  let iterations = 0;

  console.log(`Running ${goal}.`);

  while (openSet.length > 0) {
    iterations++;
    const current = openSet.shift();
    console.dir(
      { openSet: openSet.map((n) => [n, fScore[n]]), current },
      { depth: null }
    );

    // console.dir({ l: Object.values(gScore).length }, { depth: null });
    if (current === goal) {
      console.dir({ iterations });
      return gScore[current];
    }

    // console.dir(openSet.length);

    for (let neighbor of getNeighbors(current)) {
      // d(current,neighbor) is the weight of the edge from current to neighbor
      const tentativeGScore = gScore[current] + d(current, neighbor);
      if (tentativeGScore < (gScore[neighbor] ?? Number.POSITIVE_INFINITY)) {
        // cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] = tentativeGScore + h(neighbor);
        if (Number.isFinite(fScore[neighbor]) && !openSet.includes(neighbor)) {
          const largerIndex = openSet.findIndex(
            (n) => fScore[n] > fScore[neighbor]
          );
          if (largerIndex >= 0) {
            insertInPlace(openSet, neighbor, largerIndex);
          } else {
            openSet.push(neighbor);
          }
        }
      }
    }
  }

  return false;
};

/**
 *
 * @template T
 * @param {T[]} arr
 * @param {T} item
 * @param {number} i
 */
const insertInPlace = (arr, item, i) => {
  arr.splice(i, 0, item);
};

export const use = (i, fn) => fn(i);

/**
 * For linear algebra with several solutions, reduce to the minimum number of
 * free variables.
 *
 * See https://en.wikipedia.org/wiki/Gaussian_elimination
 * and https://en.wikipedia.org/wiki/System_of_linear_equations.
 *
 * I was inspired by this gentleman's implementation:
 * https://github.com/gabrielmougard/AoC-2025/blob/main/10-factory/main.zig
 *
 * After this, the matrix is in reduced row echelon form
 * https://en.wikipedia.org/wiki/Row_echelon_form#Reduced_row_echelon_form
 * which means the number of free variables has been minimized, and a solution
 * may have been found (if there was any.)
 *
 * I haven't tested for input where there are no solutions.
 *
 * @param {Fraction[][]} matrix
 */
export function gaussianElimination(matrix) {
  let currentRow = 0;
  for (
    let col = 0;
    col < matrix[0].length - 1 && currentRow < matrix.length;
    col++
  ) {
    // console.log(`Column ${col}`);
    const pivotRow = matrix.findIndex(
      (r, i) => i >= currentRow && !Fraction.is0(r[col])
    );
    if (pivotRow >= 0) {
      if (pivotRow !== currentRow) {
        const tmp = matrix[pivotRow];
        matrix[pivotRow] = matrix[currentRow];
        matrix[currentRow] = tmp;
      }

      // console.log(`row ${currentRow} swap`);
      // printMatrix(matrix);

      const denominator = matrix[currentRow][col];
      for (let c = col; c < matrix[0].length; c++) {
        matrix[currentRow][c] = Fraction.div(
          matrix[currentRow][c],
          denominator
        );
      }

      // console.log(`row ${currentRow} divide`);
      // printMatrix(matrix);

      // for all other rows, subtract by factor
      for (let row = 0; row < matrix.length; row++) {
        if (row !== currentRow && !Fraction.is0(matrix[row][col])) {
          const factor = matrix[row][col];
          for (let c = 0; c < matrix[0].length; c++) {
            matrix[row][c] = Fraction.sub(
              matrix[row][c],
              Fraction.mult(factor, matrix[currentRow][c])
            );
          }
        }
      }

      // console.log(`row ${currentRow} unify other`);
      // printMatrix(matrix);

      currentRow++;
    }
  }
}

export function printMatrix(matrix) {
  try {
    for (let row of matrix) {
      console.log(
        row
          .map((c) =>
            ("" + (Fraction.toInt(c) ?? c[0] + "/" + c[1])).padStart(4)
          )
          .join(" ")
      );
    }
    console.log();
  } catch (e) {
    console.log("failed to print matrix. console.dir representation");
    console.dir(matrix, { depth: null });
  }
}

/**
 * @typedef {[number, number]} Fraction
 */
export const Fraction = {
  normalise: ([num, den]) => {
    // console.dir({ num, den });
    if (den === 0) {
      return [num, den];
    }
    if (den < 0) {
      num *= -1;
      den *= -1;
    }
    let d = Fraction.commonDen([Math.abs(num), den]);
    return [num / d, den / d];
  },
  commonDen: ([num, den]) => {
    while (den != 0 && !Number.isNaN(den)) {
      let x = den;
      den = num % den;
      num = x;
    }
    return Math.max(1, num);
  },
  make: (num, den) => Fraction.normalise([num, den]),
  fromInt: (i) => [i, 1],
  toInt: ([n, d]) => (d === 0 || n % d !== 0 ? null : n / d),
  add: ([n1, d1], [n2, d2]) => Fraction.normalise([n1 * d2 + d1 * n2, d1 * d2]),
  sub: ([n1, d1], [n2, d2]) => Fraction.normalise([n1 * d2 - n2 * d1, d1 * d2]),
  mult: ([n1, d1], [n2, d2]) => Fraction.normalise([n1 * n2, d1 * d2]),
  div: ([n1, d1], [n2, d2]) => Fraction.normalise([n1 * d2, n2 * d1]),
  is0: ([n]) => n === 0,
};

/**
 *
 * @param {number[][]} matrix
 * @returns {number[]}
 */
export function getFreeVarColumns(matrix) {
  const freeVars = [];
  let curRow = 0;
  let c = 0;
  while (c < matrix[0].length - 1) {
    if (curRow >= matrix.length || Fraction.is0(matrix[curRow][c])) {
      freeVars.push(c);
    } else {
      curRow++;
    }
    c++;
  }

  return freeVars;
}

/**
 * I used this for AoC 2025-10, where we had to find the least amount of button presses,
 * but it should be useful for any augmented matrix.
 *
 * @param {Fraction[][]} matrix
 * @param {Record<number, number>} freeVariables
 */
export function solveMatrix(matrix, freeVariables) {
  // solve the equation using the current variables and back-substitution
  const solution = { ...freeVariables };
  // for each row in reverse
  for (let row = matrix.length - 1; row >= 0; row--) {
    // take the pivot column for that row
    let pivotCol = matrix[row].findIndex((c) => !Fraction.is0(c));
    // take the junction value
    let rhs = matrix[row][matrix[row].length - 1];
    // for each column from the pivot column, except the result column:
    for (let col = pivotCol + 1; col < matrix[row].length - 1; col++) {
      // subtract from the junction value for the row the current column times the free variable for that column
      rhs = Fraction.sub(
        rhs,
        Fraction.mult(matrix[row][col], Fraction.fromInt(solution[col] ?? 0))
      );
    }
    // if the junction value is not an integer, or is below zero, the solution is not valid (at least not in this case. Might be valid in other cases.)
    let asInt = Fraction.toInt(rhs);
    if (asInt == null || asInt < 0) {
      return null;
    }
    // store the value in the solution table for this column
    solution[pivotCol] = asInt;
  }

  return solution;
}
