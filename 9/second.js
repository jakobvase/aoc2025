import { readFileSync } from "fs";
import {
  isPointWithinPolygon,
  linesIntersect,
  lineToInnerRectangleSides,
  nonEmpty,
  rectArea,
} from "./utils.js";

const exampleInput = `1,2
2,2
2,1
9,1
9,2
10,2
10,6
9,6
9,7
2,7
2,6
1,6
1,5
8,5
8,3
1,3
`;
const expected = 21;

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
  console.log("Compiling polygon");
  const allEdges = [];
  const polygon = coords.reduce(
    (acc, cur, i) => [...acc, [cur, coords[(i + 1) % coords.length]]],
    []
  );

  console.log("Done. Computing possible squares.");

  for (let i = 0; i < coords.length - 1; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      allEdges.push([coords[i], coords[j]]);
    }
  }
  console.log("Done. Ordering by biggest.");

  const byBiggest = allEdges
    .map((e) => ({
      e,
      rank: rectArea(e[0], e[1]),
    }))
    .toSorted((e1, e2) => e2.rank - e1.rank);

  console.log(
    "Done. Filtering ones where the inner rectangle has intersections with the polygon."
  );

  const nonIntersectingEdges = byBiggest.filter(
    (e) =>
      !polygon.some((l) =>
        lineToInnerRectangleSides(e.e).some((rs) => linesIntersect(rs, l))
      )
  );

  console.log("Done. Checking corners and just inside corners.");

  const withAllCornersInside = nonIntersectingEdges.find((r) =>
    // Check the 'other' corners of the rectangle, they might be outside.
    [
      [
        [r.e[0][0], r.e[1][1]],
        [r.e[1][0], r.e[0][1]],
      ],
    ]
      // Then check all the inner corners of the rectangle. When the edges have area,
      // the math gets weird.
      .concat(lineToInnerRectangleSides(r.e))
      .every((s) => isPointWithinPolygon(polygon, s[0]))
  );

  return withAllCornersInside.rank;
}
