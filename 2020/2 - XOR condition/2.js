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

    let valid = 0;
    for await (const line of rl) {
        let x = line.split(' ');
        let rules = x[0].split('-');
        let min = rules[0];
        let max = rules[1];
        let char = x[1].charAt(0);
        let pw = x[2];
        //console.log(pw.length);
        //console.log(' Min: ' + min + ' max ' + max + ' Letter: ' + char + ' Pw: ' + pw);

        let count = 0;
        for( let i=0; i<pw.length; i++){
            if(pw[i] === char){
                //console.log(pw[i] + ' ' + char);
                count += 1;
            }
        }

        //let isValid = min <= count && count <= max; //part 1 - nested loop optimize
        let isValid = validation(min, max, char, pw); //part 2 - XOR condition

        if(isValid){
            //console.log('Valid pw, count is: ' + count + 'Min and max: ' + min + ' ' + max);
            valid += 1;
        }
    }
    console.log('Number of valid passwords: ' + valid);


}

function validation(a, b, char, pw)
{
    let cond1 = pw[a-1] === char;
    let cond2 = pw[b-1] === char;
    return cond1 ? !cond2 : cond2;
}


processLineByLine();