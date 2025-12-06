const utils = require("./utils.js");

const exampleInput = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  
`;
const expected = 3263827;

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
 * @returns {string[][][]}
 */
function parse(input) {
  const blocks = [];
  const lines = input.split("\n").filter(utils.filterNoEmpty);
  let currentBlock = [];
  for (let i = 0; i < lines[0].length; i++) {
    const col = lines.map((l) => l.at(i));
    if (col.every((c) => c === " ")) {
      blocks.push(currentBlock);
      currentBlock = [];
    } else {
      currentBlock.push(col);
    }
  }
  blocks.push(currentBlock);

  return blocks;
}

function symToFun(sym) {
  return sym === "*" ? (x, y) => x * y : (x, y) => x + y;
}

/**
 *
 * @param {string[][][]} blocks
 * @return {number}
 */
function run(blocks) {
  return blocks.map(calculateBlock).reduce((a, b) => a + b, 0);
}

/**
 *
 * @param {string[][]} block
 */
function calculateBlock(block) {
  let fun;
  let numbers = [];
  let basenum;
  for (let col of block) {
    let num = "";
    for (let c of col) {
      if (c === "*") {
        fun = utils.mult;
        basenum = 1;
      } else if (c === "+") {
        fun = utils.add;
        basenum = 0;
      } else if (c !== " ") {
        num = num.concat(c);
      }
    }
    numbers.push(Number.parseInt(num));
  }
  // console.dir({ block, numbers, basenum }, { depth: null });
  return numbers.reduce(fun, basenum);

  // let symbols = rows.toReversed().slice(0, 1);
  // let numbers = rows.slice(1, -1);
  // // console.dir({ids, ranges})
  // let partialResults = [];
  // for (let i = 0; i < rows[0].length; i++) {
  //   let symFun = symToFun(symbols[i]);
  //   partialResults[i] = numbers.reduce(
  //     (acc, row) => symFun(acc, Number.parseInt(row[i])),
  //     sym === "+" ? 0 : 1
  //   );
  // }
}
