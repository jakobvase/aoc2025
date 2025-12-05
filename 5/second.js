const utils = require("./utils.js");

const exampleInput = `3-5
10-14
16-20
12-18

1
5
8
11
17
32
`;
const expected = 14;

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
 * @returns {[string[], [string, string][]]}
 */
function parse(input){
  const ranges = [];
  const ids = [];
  let idsReached = false;
  for(let line of input.split("\n")){
    if(line === "") {
      idsReached = true;
    } else if(idsReached) {
      ids.push(line);
    } else {
      ranges.push(line.split("-"));
    }
  }
  return [ids, ranges];
}

/**
 *
 * @param {[string[], [string, string][]]} parseResult
 * @return {number}
 */
function run([ids, ranges]) {
  // console.dir({ids, ranges})
  const rangesAsInts = ranges.map(([from, to])=> [Number.parseInt(from), Number.parseInt(to)]);
  const flattened = rangesAsInts.reduce(utils.flattenRanges, []);

return flattened.reduce((acc, [from, to]) => acc + to - from + 1, 0);
}
