import { readFileSync } from "fs";
import {
  add,
  addFn,
  arrayEquals,
  arrayReplace,
  filterUnique,
  filterUniqueFn,
  getDistance3D,
  graphComponent,
  graphContains,
  mult,
  nonEmpty,
  stringToArray,
  toGraph,
  whenYouWishUponAStar,
} from "./utils.js";

const exampleInput = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}`;
// [...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
// [.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}
// `;
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

  let atts = machines.map(runAStar);

  // console.dir(atts);

  // return 0;
  return atts.reduce(add);
}

function applySingleButtons(machine) {
  const j = machine.junctions;
  let presses = 0;
  let newJ = j.map((n) => 0);
  for (let i = 0; i < j.length; i++) {
    const buttonsThatApply = machine.buttons.filter((b) => b[i] === 1);
    if (buttonsThatApply.length === 1) {
      while (newJ[i] < j[i]) {
        newJ = applyButton(newJ, buttonsThatApply[0]);
        presses++;
      }
    }
  }

  console.log(`Single buttons applied. Junction: ${JSON.stringify(newJ)}`);

  return [newJ, presses];
}

function pressButtons(machine, attempts, acc) {
  let newAcc = [];

  console.log(`Pressing. Number of combinations: ${acc.length}`);

  for (let curJ of acc) {
    if (arrayEquals(machine.junctions, curJ)) {
      return attempts;
    }

    for (let b of machine.buttons) {
      let newB = curJ.map((v, i) => v + b[i]);
      if (newB.every((jn, i) => jn <= machine.junctions[i])) {
        newAcc.push(newB);
      }
    }
  }

  return pressButtons(
    machine,
    attempts + 1,
    newAcc.filter(filterUniqueFn(arrayEquals))
  );
}

/**
 *
 * @param {number[]} j
 * @param {number[]} b
 * @param {number} times
 * @returns
 */
function applyButton(j, b, times = 1) {
  return j.map((v, i) => v + b[i] * times);
}

/**
 *
 * @param {Machine} machine
 */
function runAStar(machine) {
  // const spread = machine.buttons.reduce(
  //   (acc, cur) => acc.map((v, i) => v + cur[i]),
  //   machine.junctions.map(() => 0)
  // );
  // const spreadMax = spread.reduce(Math.max);
  // console.dir({ spread });
  return whenYouWishUponAStar(
    machine.junctions.map(() => 0).join(","),
    machine.junctions.join(","),
    // It's possible I could make a better heuristic by looking at the buttons,
    // but it's not easy.
    (node) =>
      node
        .split(",")
        .map(
          (n, i) => machine.junctions[i] - Number.parseInt(n)
          // *   (1 - spread[i] / spreadMax)
        )
        .reduce((acc, cur, i) =>
          !Number.isFinite(acc) || cur < 0
            ? Number.POSITIVE_INFINITY
            : Math.max(acc, cur)
        ),
    (node) =>
      machine.buttons.map((b) =>
        node
          .split(",")
          .map((n, i) => Number.parseInt(n) + b[i])
          .join(",")
      ),
    () => 1
  );
}

/**
 *
 * @param {Machine} machine
 */
function solveMachine(machine) {
  const goal = machine.junctions;
  let currentBest = goal.map(() => 0);
  let bestPresses = 0;
  const buttons = machine.buttons;
  let remainingButtons = buttons;
  const spread = buttons.reduce(
    (acc, cur) => acc.map((v, i) => v + cur[i]),
    goal.map(() => 0)
  );
  if (spread.includes(1)) {
    // We know we need to press that button the amount of times needed to hit the goal.
    const knownNeededPresses = spread
      .map((v, i) => [v, i])
      .filter(([v]) => v === 1)
      .map(([_, i]) => i);
    knownNeededPresses.forEach((p) => {
      const count = goal[p];
      const button = buttons.find((b) => b[p] === 1);
      currentBest = applyButton(currentBest, button, count);
      bestPresses += count;
      remainingButtons = remainingButtons.filter((b) => b !== button);
    });
  }
}
