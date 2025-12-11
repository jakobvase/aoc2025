import { readFileSync } from "fs";
import {
  add,
  addFn,
  arrayReplace,
  filterUnique,
  getDistance3D,
  graphComponent,
  graphContains,
  mult,
  nonEmpty,
  stringToArray,
  toGraph,
} from "./utils.js";

const exampleInput = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}
`;
const expected = 7;

/**
 * @typedef {{lights: number, junctions: string, buttons: number[]}} Machine
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
      junctions: items.pop(),
      buttons: items.map(buttonToBinary),
    };
    machines.push(machine);
  }
  return machines;
}

function buttonToBinary(b) {
  let trimmed = b
    .slice(1, -1)
    .split(",")
    .map((n) => Number.parseInt(n));
  let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let n of trimmed) {
    arr[n] = 1;
  }
  return Number.parseInt(arr.reverse().join(""), 2);
}

/**
 *
 * @param {Machine[]} machines
 * @return {number}
 */
function run(machines) {
  // console.dir(machines, { depth: null });

  let atts = machines.map((m) => pressButtons(m, 0, [0]));

  // console.dir(atts);

  return atts.reduce(add);
}

function pressButtons(machine, attempts, acc) {
  let newAcc = [];

  for (let l of acc) {
    if (machine.lights === l) {
      return attempts;
    }

    for (let b of machine.buttons) {
      newAcc.push(l ^ b);
    }
  }

  return pressButtons(machine, attempts + 1, newAcc.filter(filterUnique));
}
