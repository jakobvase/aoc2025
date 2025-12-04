const utils = require("./utils.js");

const exampleInput = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.
`;
const expected = 13;

var testResult = run(exampleInput.split("\n"));
if (expected !== testResult) {
  console.log(`test failed. expected ${expected}. actual ${testResult}`);
  return;
} else {
  console.log(
    "test succeded. final result " +
      run(require("fs").readFileSync("./input").toString().split("\n"))
  );
}

/**
 *
 * @param {string[]} lines
 * @return {number}
 */
function run(lines) {
  const grid = lines.filter(utils.nonEmpty).map(utils.stringToArray);
  return utils
    .gridToArray(grid)
    .filter(([v]) => v === "@")
    .filter(
      ([_, x, y]) =>
        utils.gridNeighbours(grid, x, y).filter(([v]) => v === "@").length < 4
    ).length;
}
