const fs = require('fs');

var loc = 50;
var zeroes = 0;
var printed = false;

const inputs = fs.readFileSync("./input.txt").toString();
for(var line of inputs.split("\n")) {
// for(var line of inputs.split("\n").splice(100, 50)) {
// for (var line of ["R50", "L100", "L1", "R1", "R1", "L1", "L1", "R2"]){
  applyLine(line);
}

console.log(`Result: ${zeroes}`)


/**
 * 
 * @param {string} line 
 */
function applyLine(line) {
    if(line === "") return;
    // console.log(`Applying ${line}`);
    var direction = line.substring(0, 1);
    var count = Number.parseInt(line.substring(1));

    var zeroesPassed = Math.floor(count / 100);
    var remaining = count % 100 * (direction === "R" ? 1 : -1);
    var finalPos = loc + remaining;
    if(finalPos > 99 || (finalPos < 0 && loc != 0) || (finalPos === 0 && Math.abs(remaining) > 0)) {
      zeroesPassed++;
    }
    zeroes += zeroesPassed;

    loc = finalPos > 99 ? finalPos - 100 : finalPos < 0 ? finalPos + 100 : finalPos
    // console.log(`Location: ${loc}`)
    // if(loc === 0) zeroes ++;
      // console.dir({line, direction, count, zeroesPassed, remaining, finalPos, zeroes, loc}, {depth: null}); 
}
