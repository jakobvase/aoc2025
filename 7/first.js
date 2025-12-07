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
const expected = 21;

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
  const tStart = rows[0].indexOf("S");
  let ts = [tStart];
  let splits = 0;
  for (let i = 0; i < rows.length; i++) {
    let newTs = ts.slice();
    const row = rows[i];
    const splitters = getSplitters(row);
    for (s of splitters) {
      if (ts.includes(s)) {
        splits++;
        newTs = newTs.filter((t) => t !== s).concat(s + 1, s - 1);
      }
    }
    console.dir({ ts, newTs, splitters });
    ts = newTs.filter(utils.filterUnique);
  }
  return splits;
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
