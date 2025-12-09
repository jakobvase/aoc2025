import { readFileSync } from "fs";
import {
  getDistance3D,
  graphComponent,
  graphContains,
  mult,
  nonEmpty,
  toGraph,
} from "./utils.js";

const exampleInput = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3
`;
const expected = 50;

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
  return input
    .split("\n")
    .filter(nonEmpty)
    .map((l) => l.split(",").map((n) => Number.parseInt(n)));
}

/**
 *
 * @param {[string, string][]} coords
 * @return {number}
 */
function run(coords) {
  console.log("Calculating shortest paths.");
  let allEdges = [];

  for (let i = 0; i < coords.length - 1; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      allEdges.push([coords[i], coords[j]]);
    }
  }
  console.log("Edges created");
  const biggestSquares = allEdges
    .map((e) => ({
      e,
      rank: Math.abs(e[0][0] - e[1][0] + 1) * Math.abs(e[0][1] - e[1][1] + 1),
    }))
    .toSorted((e1, e2) => e2.rank - e1.rank);

  return biggestSquares[0].rank;
}
