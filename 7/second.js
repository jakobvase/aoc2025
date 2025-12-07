const utils = require("./utils.js");

// This one was still running while third.js finished. I didn't let it finish.

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
  const tStart = rows[0].indexOf("S");
  let ts = [tStart];
  for (let i = 0; i < rows.length; i++) {
    let newTs = ts.slice();
    const row = rows[i];
    const splitters = getSplitters(row);
    for (let ti = 0; ti < ts.length; ti++) {
      const t = ts[ti];
      if (splitters.includes(t)) {
        newTs = utils.arrayRemove(newTs, newTs.indexOf(t)).concat(t + 1, t - 1);
      }
    }
    // console.dir({ ts, newTs, splitters });
    ts = newTs;
  }
  return ts.length;
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
