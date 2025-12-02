var doPrint = false;
var testInput = ["11-22", "95-115", "998-1012", "1188511880-1188511890", '222220-222224', '1698522-1698528', '446443-446449', '38593856-38593862', '565653-565659', '824824821-824824827', '2121212118-2121212124'];
var expectedResult = 4174379265;



if(run(testInput) !== expectedResult) {
    doPrint = true;
    console.log("Testinput failed, actual result " + run(["95-115"]));
} else {
    console.log("test succeeded");
    var input = require("fs").readFileSync("./input").toString().split(",");
    console.log("result: " + run(input))
}


/**
 * 
 * @param {string[]} input 
 */
function run(input) {
    var res = 0
    for(var range of input) {
        if(range === "") continue;
        var [low, high] = range.split("-");
        res += getInvalidIds(low, high).reduce((acc, cur) => acc + cur, 0);
    }

    return res;
}

/**
 * 
 * @param {string} lowid 
 * @param {string} highid
 * @return {number[]}
 */
function getInvalidIds(lowid, highid) {
    var invalidIds = []
    var low = Number.parseInt(lowid);
    var high = Number.parseInt(highid);
    for(var i = low; i <= high; i++) {
        if(isInvalid(i.toString())) {
            invalidIds.push(i);
        }
    }
    doPrint && console.dir({lowid, highid, invalidIds});
    return invalidIds;
}

/**
 * 
 * @param {string} id
 * @return {boolean}
 */
function isInvalid(id) {
        for(var l = 1; l <= id.length / 2; l++) {
            var firstBit = id.substring(0, l);
            var constructed = "".padEnd(id.length, firstBit);
            // console.dir({id, firstBit, constructed})
            if(Number.isInteger(constructed.length / firstBit.length) && constructed === id) {
                return true;
            }
        }
        return false;
}