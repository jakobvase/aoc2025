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
const expected = 43;

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
  const allRemovedRolls = [];
  let updatedGrid = grid;
  let rollsToRemove = getRollsToRemove(updatedGrid);
  while (rollsToRemove.length > 0) {
    rollsToRemove.forEach((r) => allRemovedRolls.push(r));
    updatedGrid = rollsToRemove.reduce(
      (grid, [_, x, y]) => utils.gridUpdate(grid, x, y, "x"),
      updatedGrid
    );
    rollsToRemove = getRollsToRemove(updatedGrid);
  }
  return allRemovedRolls.length;
}

/**
 * @param {string[][]} grid
 * @returns {[string, number, number][]}
 */
function getRollsToRemove(grid) {
  return utils
    .gridToArray(grid)
    .filter(([v]) => v === "@")
    .filter(
      ([_, x, y]) =>
        utils.gridNeighbours(grid, x, y).filter(([v]) => v === "@").length < 4
    );
}
