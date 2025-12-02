const fs = require('fs');

var loc = 50;
var zeroes = 0;

const inputs = fs.readFileSync("./input.txt").toString();
for(var line of inputs.split("\n")) {
  applyLine(line);
}

console.log(`Result: ${zeroes}`)


/**
 * 
 * @param {string} line 
 */
function applyLine(line) {
    // console.log(`Applying ${line}`);
    var direction = line.substring(0, 1);
    var count = Number.parseInt(line.substring(1));
    loc = (direction === "R" ? loc+count : loc -count) % 100;
    // console.log(`Location: ${loc}`)
    if(loc === 0) zeroes ++;
}
