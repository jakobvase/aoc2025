import { readFileSync } from "fs";
import {
  add,
  Fraction,
  gaussianElimination,
  getFreeVarColumns,
  nonEmpty,
  opt,
  solveMatrix,
  stringToArray,
} from "./utils.js";

const exampleInput = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}
`;
const expected = 33;

/**
 * @typedef {{lights: number, junctions: number[], buttons: number[][]}} Machine
 */

var parseRes = parse(exampleInput);
var testResult = run(parseRes);
if (expected !== testResult) {
  console.log(`test failed. expected ${expected}. actual ${testResult}`);
} else {
  console.log("test succeeded");
  console.log("final result " + run(parse(readFileSync("./input").toString())));
}

/**
 *
 * @param {string} input
 * @returns {[string, string][]}
 */
function parse(input) {
  let lines = input.split("\n").filter(nonEmpty);

  // console.log("123".slice(1, -1));

  let machines = [];
  for (let line of lines) {
    let items = line.split(" ");
    let lights = Number.parseInt(
      stringToArray(items.shift().slice(1, -1)).reduceRight(
        (acc, s) => acc + (s === "#" ? "1" : "0"),
        ""
      ),
      2
    );
    let machine = {
      lights,
      junctions: items
        .pop()
        .slice(1, -1)
        .split(",")
        .map((n) => Number.parseInt(n)),
      buttons: items.map(parseButton),
    };
    machines.push(machine);
  }
  return machines;
}

function parseButton(b) {
  let trimmed = b
    .slice(1, -1)
    .split(",")
    .map((n) => Number.parseInt(n));
  let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let n of trimmed) {
    arr[n] = 1;
  }
  return arr;
}

/**
 *
 * @param {Machine[]} machines
 * @return {number}
 */
function run(machines) {
  // console.dir(machines, { depth: null });

  // let atts = machines
  //   .map((m) => [m, ...applySingleButtons(m)])
  //   .map(([m, j, p]) => pressButtons(m, p, [j]));

  let atts = machines.map(solveMachine);

  // console.dir(atts);

  // return 0;
  return atts.reduce(add);
}

function machineToMatrix(machine) {
  return machine.junctions.map((v, i) =>
    machine.buttons
      .map((b) => Fraction.fromInt(b[i]))
      .concat([Fraction.fromInt(v)])
  );
}

/**
 *
 * @param {Machine} machine
 */
function solveMachine(machine, i) {
  const matrix = machineToMatrix(machine);
  // console.log(`Machine ${i} {${machine.junctions.join(",")}}`);
  // printMatrix(matrix);
  gaussianElimination(matrix);
  // printMatrix(matrix);
  const mutables = { best: Number.POSITIVE_INFINITY };
  findBestSolution(
    matrix,
    mutables,
    machine.junctions.reduce((x, y) => Math.max(x, y)),
    {}
  );
  // console.log(`Result: ${mutables.best}`);
  return mutables.best;
}

/**
 *
 * @param {Fraction[][]} matrix
 * @param {{best: number }} mutables
 * @param {number} searchBound
 * @param {Record<number, number>} freeVariables
 */
function findBestSolution(matrix, mutables, searchBound, freeVariables) {
  // check recursive guards
  // - if this path has all the free variables assigned:
  const freeVars = getFreeVarColumns(matrix);
  if (Object.values(freeVariables).length === freeVars.length) {
    const { best } = mutables;
    // console.dir(freeVariables);
    // solve the equation using the current variables and back-substitution:
    const solution = solveMatrix(matrix, freeVariables);
    // is the solution shorter than current best?
    const total = opt(solution, (s) => Object.values(s).reduce(add));
    if (total != null && total < best) {
      // current best = this
      mutables.best = total;
    }
    return;
  }
  // console.dir({ searchBound, freeVariables, mutables }, { depth: null });
  let val = 0;
  while (
    val < searchBound &&
    // optimization: total cost < current best. Approx. halves the time.
    val + Object.values(freeVariables).reduce(add, 0) < mutables.best
  ) {
    // recurse with next free variable and the current free variable values
    findBestSolution(matrix, mutables, searchBound, {
      ...freeVariables,
      [freeVars[Object.values(freeVariables).length]]: val,
    });
    val++;
  }
}
