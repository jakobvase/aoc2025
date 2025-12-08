import { readFileSync } from "fs";
import {
  addEdgeComponents,
  getDistance3D,
  graphComponent,
  graphContains,
  nonEmpty,
  toGraph,
} from "./utils.js";

const exampleInput = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689
`;
const expected = 25272;

var parseRes = parse(exampleInput);
var testResult = run(parseRes, 0);
if (expected !== testResult) {
  console.log(`test failed. expected ${expected}. actual ${testResult}`);
} else {
  console.log("test succeeded");
  console.log(
    "final result " + run(parse(readFileSync("./input").toString()), 1000)
  );
}

/**
 *
 * @param {string} input
 * @returns {[string, string, string][]}
 */
function parse(input) {
  return input
    .split("\n")
    .filter(nonEmpty)
    .map((l) => l.split(",").map((n) => Number.parseInt(n)));
}

/**
 *
 * @param {[string, string, string][]} coords
 * @param {number} iterations
 * @return {number}
 */
function run(coords, startAt) {
  let shortestCircuits = [];
  console.log("Calculating shortest paths.");
  let allEdges = [];

  for (let i = 0; i < coords.length - 1; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      allEdges.push([coords[i], coords[j]]);
      // shortestCircuits = addSorted(shortestCircuits, {
      //   p1,
      //   p2,
      //   rank: getDistance3D(p1, p2),
      // }).slice(0, iterations);
    }
  }
  // console.dir(allEdges);
  console.log("Edges created");
  shortestCircuits = allEdges
    .map((e) => ({ e, rank: getDistance3D(e[0], e[1]) }))
    .toSorted((e1, e2) => e1.rank - e2.rank)
    .map((e) => e.e);
  // console.dir(shortestCircuits, { depth: null });

  console.log("Done. Creating components.");

  const graph = toGraph(coords, []);

  let comps = [];
  for (let n of graph.nodes) {
    if (!comps.some((c) => graphContains(c, n))) {
      comps.push(graphComponent(graph, n));
    }
  }
  // console.dir(comps, { depth: null });

  let i = 0;
  let lastEdge;
  while (comps.length > 1) {
    lastEdge = shortestCircuits[i++];
    comps = addEdgeComponents(comps, lastEdge);
    // console.dir({ l: comps.length, lastEdge });
    // console.dir(comps, { depth: null });
  }
  console.dir(lastEdge);

  // console.dir(comps.slice(0, 3), { depth: null });

  return lastEdge[0][0] * lastEdge[1][0];
}
