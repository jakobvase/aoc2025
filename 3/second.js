const exampleInput =
`987654321111111
811111111111119
234234234234278
818181911112111
`
const expected =3121910778619;

var testResult = run(exampleInput.split("\n"));
if(expected !== testResult) {
    console.log(`test failed. expected ${expected}. actual ${testResult}`)
    return;
} else {
    console.log("result " + run(require('fs').readFileSync("./input").toString().split("\n")))
}


/**
 * 
 * @param {string[]} lines 
 * @return {number}
 */
function run(lines) {
    // console.log(lines);
    return lines.filter(l => l.length > 0).map(calculateHighest).reduce((acc, cur) => acc+cur, 0);
}

/**
 * 
 * @param {string} line 
 * @return {number}
 */
function calculateHighest(line) {
    let chars = [];
    let lastIndex = -1;
  for(var i = 11; i >=0; i--){
    const [highest, index] = getHighest(line, lastIndex + 1, i);
    chars.push(highest);
    lastIndex = index;
  }
  return Number.parseInt(chars.reduce((acc, cur) => acc + "" + cur, ""));
}

/**
 * 
 * @param {string} line 
 * @param {number} afterIndex 
 * @param {number} endBuffer 
 * @return {number}
 */
function getHighest(line, afterIndex, endBuffer) {
    var highest = -1;
    var highestIndex = -1;
    for(let i = afterIndex; i < line.length - endBuffer; i++) {
        var char = line.charAt(i);
        // console.dir({line, char, highest, highestIndex})
        if(char > highest) {
            highest = char;
            highestIndex = i;
        } 
    }
    // console.dir({line, afterIndex, endBuffer, highest})
    return [highest, highestIndex];
}
