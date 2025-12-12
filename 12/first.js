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

const exampleInput = `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2
`;
const expected = 2;

var parseRes = parse(exampleInput);
var testResult = run(parseRes);
if (expected !== testResult) {
  console.log(`test failed. expected ${expected}. actual ${testResult}`);
} else {
  console.log("test succeeded");
}
console.log(
  "final result " + run(parse(readFileSync("./input").toString()), "dac")
);

// 4444809639276

/**
 * @typedef {number[][]} Shape
 * @typedef {{size: [number, number], toFit: number[]}} Area
 *
 * @param {string} input
 * @returns {{shapes: Shape[], areas: Area[]}}
 */
function parse(input) {
  let lines = input.split("\n").slice(0, -1);

  // console.log("123".slice(1, -1));
  const shapes = [];
  const areas = [];
  let shapeNumber = -1;
  let shape = null;

  for (let line of lines) {
    if (line.length === 2) {
      shapeNumber = Number.parseInt(line.charAt(0));
      shape = [];
    } else if (line == "") {
      shapeNumber = -1;
      shapes.push(shape);
      shape = null;
    } else if (shapeNumber >= 0) {
      shape.push(stringToArray(line).map((s) => (s === "#" ? 1 : 0)));
    } else {
      let [area, toFit] = line.split(":").map((s) => s.trim());
      areas.push({
        size: area.split("x").map((d) => Number.parseInt(d)),
        toFit: toFit.split(" ").map((n) => Number.parseInt(n)),
      });
    }
  }
  return { shapes, areas };
}

/**
 *
 * @param {{areas: Area[], shapes: Shape[]}} args
 * @return {number}
 */
function run({ areas, shapes }) {
  // console.dir({ areas, shapes }, { depth: null });

  return areas.map(shapesFitInArea).reduce(add);
}

/**
 *
 * @param {Area} area
 * @param {Shape[]} shapes
 */
function shapesFitInArea(area, shapes) {
  const totalShapes = area.toFit.reduce(add);
  const shapesThatCanFit = area.size
    .map((d) => Math.floor(d / 3))
    .reduce(mult, 1);
  if (totalShapes <= shapesThatCanFit) {
    return true;
  }
  console.log("Simple failed");
  return false;
}

/**
 * @typedef {{x: number, y: number, s: Shape}} Placed
 * @typedef {number[][]} Grid
 *
 * @param {Area} area
 * @param {Placed[]} placed
 */
function isValidArea(area, placed) {
  const grid = areaToGrid(area.size);
  for (let { x, y, s } of placed) {
    for (let r = 0; r < s.length; r++) {
      for (let c = 0; c < s[r].length; c++) {
        if (y + r >= grid.length || x + c >= grid[r].length) {
          return false;
        }
        grid[y + r][x + c] += s[r][c];
        if (grid[y + r][x + c] > 1) {
          return false;
        }
      }
    }
  }
  return true;
}

function areaToGrid([x, y]) {
  return Array.from({ length: y }, () => Array.from({ length: x }, () => 0));
}

/**
 *
 * @param {Shape} shape
 * @returns {number}
 */
function getShapeSize(shape) {
  return shape.reduce((a, c) => a + c.reduce(add));
}

/**
 *
 * @param {[number, number]} grid
 * @param {{x: number, y: number, s: Shape}[]} placed
 */
function getFreeSpace(grid, placed) {
  return grid[0] * grid[1] - placed.reduce((a, c) => a + getShapeSize(c));
}
