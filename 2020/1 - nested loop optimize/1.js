const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
    const fileStream = fs.createReadStream('1 - nested loop optimize/input.txt');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    let numbers = [];
    for await (const line of rl) {
        numbers.push(line);
    }

    find2(numbers);
    find3(numbers);

}

function find3(numbers)
{
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < i; j++) {
            for(let k = 0; k < j; k++) {
                let a = parseInt(numbers[i]);
                let b = parseInt(numbers[j]);
                let c = parseInt(numbers[k]);
                if (i !== j && j !== k && i !== k && a + b + c === 2020) {
                    console.log('\nThe 3 numbers that sum to 2020 are: ' + a + ' and ' + b + ' and ' + c);
                    console.log('The product of those numbers is: ' + a * b * c);
                }
            }
        }
    }
}

function find2(numbers){
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < i; j++) {
            let a = parseInt(numbers[i]);
            let b = parseInt(numbers[j]);
            if (i !== j && a + b === 2020) {
                console.log('The two numbers that sum to 2020 are: ' + a + ' and ' + b);
                console.log('The product of those numbers is: ' + a * b);
            }
        }
    }
}

processLineByLine();