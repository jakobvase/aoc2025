const utils = require("./utils.js");

const exampleInput = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  
`;
const expected = 4277556;

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
  const rows = [];
  for (let line of input.split("\n")) {
    if (line === "") {
      continue;
    }

    const row = [];
    for (let cell of line.split(" ")) {
      if (cell !== "") {
        row.push(cell);
      }
    }
    rows.push(row);
  }
  return rows;
}

function symToFun(sym) {
  return sym === "*" ? (x, y) => x * y : (x, y) => x + y;
}

/**
 *
 * @param {string[][]} rows
 * @return {number}
 */
function run(rows) {
  rows.reverse();
  // console.dir({ids, ranges})
  let partialResults = [];
  for (let i = 0; i < rows[0].length; i++) {
    let sym = rows[0][i];
    let symFun = symToFun(sym);
    partialResults[i] = rows
      .slice(1)
      .reduce(
        (acc, row) => symFun(acc, Number.parseInt(row[i])),
        sym === "+" ? 0 : 1
      );
  }
  return partialResults.reduce((a, b) => a + b, 0);
}
