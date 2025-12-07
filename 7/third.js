const utils = require("./utils.js");

const exampleInput = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............
`;
const expected = 40;

var parseRes = parse(exampleInput);
var testResult = run(parseRes);
if (expected !== testResult) {
  console.log(`test failed. expected ${expected}. actual ${testResult}`);
  return;
} else {
  console.log("test succeeded");
  console.log(
    "final result " +
      run(parse(require("fs").readFileSync("./input").toString()))
  );
}

/**
 *
 * @param {string} input
 * @returns {string[][]}
 */
function parse(input) {
  return input.split("\n").filter(utils.nonEmpty);
}

/**
 *
 * @param {string[]} rows
 * @return {number}
 */
function run(rows) {
  let ts = utils.stringToArray(rows[0]).map((s) => (s === "S" ? 1 : 0));
  for (let i = 0; i < rows.length; i++) {
    const newTs = ts.slice();
    const row = rows[i];
    const splitters = getSplitters(row);
    for (let s of splitters) {
      const tachs = ts[s];
      if (ts[s] > 0) {
        newTs[s] = 0;
        newTs[s - 1] += tachs;
        newTs[s + 1] += tachs;
      }
    }
    console.dir({ ts, newTs, splitters });
    ts = newTs;
  }
  return ts.reduce(utils.add, 0);
}

/**
 *
 * @param {string} row
 * @returns {number[]}
 */
function getSplitters(row) {
  return row
    .split("^")
    .reduce(
      (acc, cur, i) => [
        ...acc,
        (utils.opt(acc.at(i - 1), (v) => v + 1) ?? 0) + cur.length,
      ],
      []
    )
    .slice(undefined, -1)
    .map((s) => Number.parseInt(s));
}
