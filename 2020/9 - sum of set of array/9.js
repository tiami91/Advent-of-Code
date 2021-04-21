const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
    const fileStream = fs.createReadStream('input.txt');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    let arr = [];
    //let preambleLength = 5;
    let preambleLength = 25;
    for await (const line of rl) {
        arr.push(line);
    }

    let preamble = [];
    for(let i=0; i<preambleLength; i++){
        preamble.push(arr[i]);
    }

    let firstOccurrence = true;
    let falseNumber;
    for (let i = preambleLength; i < arr.length; i++) {
        let result = testNumber(arr[i], preamble);
        if (!result && firstOccurrence) {
            falseNumber = arr[i];
            console.log('First false number: ' + falseNumber);
            firstOccurrence = false;
        }
        //console.log(result);
        preamble = changePreamble(preamble, arr[i]);
    }

    let result = findSet(falseNumber, arr);
    console.log('The result is: ' + result);
}

function findSet(num, arr){
    for(let i=0; i<arr.length-1; i++){
        let a = parseInt(arr[i]);
        let current = a;
        for(let j=i+1; j<arr.length; j++){
            let b = parseInt(arr[j]);
            if(current + b == num){
                console.log(current + ' ' + b + ' gives ' + num);
                return (findMinMax(i,j,arr));
            } else if (current + b < num) {
                current += b;
                //console.log('current is now: ' + current);
            } else {
                break;
            }
        }
    }
}

function findMinMax(a, b, arr){
    a = parseInt(a);
    b = parseInt(b);
    let min=9999999999999999999999999999999999999999;
    let max=0;
    for(let i=a; i<=b; i++){
        let num = arr[i];
        if(num<min){
            min=num;
        }
        if(num>max){
            max=num;
        }
    }
    result = parseInt(min)+parseInt(max);
    return result;
}

function testNumber (num, preamble){
    //console.log('Preamble right now: ' + preamble.toString());
    for(let i=0; i<preamble.length; i++){
        for(let j=0; j<preamble.length; j++) {
            let a = parseInt(preamble[i]);
            let b = parseInt(preamble[j]);
            let sum = a + b;
            if (sum === parseInt(num)) {
                //console.log('Number confirmed: ' + preamble[i] + ', ' + preamble[j]);
                return true;
            }
            //console.log(num + ': ' + sum)
        }
    }
    return false;
}

function changePreamble(preamble, num){
    preamble.shift();
    preamble.push(num);
    return preamble;
}

processLineByLine();