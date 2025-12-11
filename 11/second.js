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

const exampleInput = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out
`;
const expected = 2;

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

  let map = {};
  for (let line of lines) {
    let items = line.split(" ");
    let key = items.shift().slice(0, -1);
    map[key] = items;
  }
  return map;
}

/**
 *
 * @param {Record<string, string[]>} nodes
 * @return {number}
 */
function run(nodes, start, goal) {
  return visit(nodes, "svr", {
    out: 0,
    fft: visit(nodes, "fft", { out: 0, dac: visit(nodes, "dac", { out: 1 }) }),
  });
}

function visit(nodes, key, visited) {
  if (visited[key] != null) {
    return visited[key];
  }

  const node = nodes[key];
  let paths = 0;
  for (let n of node) {
    paths += visit(nodes, n, visited);
  }
  visited[key] = paths;
  return paths;
}
