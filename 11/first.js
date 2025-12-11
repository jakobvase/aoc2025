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

const exampleInput = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out
`;
const expected = 5;

var parseRes = parse(exampleInput);
var testResult = run(parseRes, "you");
if (expected !== testResult) {
  console.log(`test failed. expected ${expected}. actual ${testResult}`);
} else {
  console.log("test succeeded");
  console.log(
    "final result " + run(parse(readFileSync("./input").toString()), "dac")
  );
}

// 4444809639276

/**
 *
 * @param {string} input
 * @returns {[string, string][]}
 */
function parse(input) {
  let lines = input.split("\n").filter(nonEmpty);

  // console.log("123".slice(1, -1));

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
function run(nodes, key) {
  console.dir(nodes, { depth: null });

  return visit(nodes, key, { out: 1 });
}

function visit(nodes, key, visited) {
  if (visited[key] != null) {
    return visited[key];
  }

  const node = nodes[key];
  console.dir(node);
  let paths = 0;
  for (let n of node) {
    paths += visit(nodes, n, visited);
  }
  visited[key] = paths;
  return paths;
}
