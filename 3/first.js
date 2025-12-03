const exampleInput =
`987654321111111
811111111111119
234234234234278
818181911112111
`
const expected =357;

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
    return lines.filter(l => l.length > 0).map(getHighest).reduce((acc, cur) => acc+cur, 0);
}

/**
 * 
 * @param {string} line 
 * @return {number}
 */
function getHighest(line) {
    var highest = -1;
    var highestIndex = -1;
    var second = -1;
    var secondIndex = -1;
    var highestAfter = -1;
    var highestAfterIndex = -1;
    for(let i = 0; i < line.length; i++) {
        var char = line.charAt(i);
        // console.dir({line, char, highest, second})
        if(char > highest) {
            second = highest;
            secondIndex = highestIndex;
            highest = char;
            highestIndex = i;
            highestAfter = -1;
            highestAfterIndex = -1;
        } 

        if(i !== highestIndex) {
            if(char > second) {
                second = char;
                secondIndex = i;
            }

            if(char > highestAfter) {
                highestAfter = char;
                highestAfterIndex = i;
            }
        }
    }
    var numberToReturn = 
      highest === second
      ? highest + "" + second 
      : highestAfter >= 0
      ? highest + "" + highestAfter
      : second + "" + highest;
    // console.dir({line, numberToReturn});
    return Number.parseInt(numberToReturn);
}
