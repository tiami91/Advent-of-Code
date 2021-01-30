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

    let program = [];
    for await (const line of rl) {

        let command = line.split(' ');
        program.push(command);
    }

    let result = runProgram(program)
    let count = 0;

    while (!result){
        let prog = JSON.parse(JSON.stringify(program));
        prog = changeProgram(prog, count);
        result = runProgram(prog);
        count++;
    }
        console.log(result);

}

function changeProgram(program, count){
    let a = 0;
    let prog = [];
    for(let i=0; i<program.length; i++){
        prog[i]=program[i];
    }

    for(let i=0; i<prog.length; i++){
        let p = prog[i];
        let command = p[0];
        //console.log('current command: ' + command);
        //console.log('a: ' + a);
        //console.log('count: ' + count);
        if (command === 'nop'){
            if(a<count){
                a+=1;
            } else {
                //change to jmp
                //console.log('Changing nop to jmp. ');
                prog[i][0]='jmp';
                return prog;
            }

        } else if (command === 'jmp'){
            if(a<count){
                a+=1;
            } else {
                //change to nop
                //console.log('Changing jmp to nop. ');
                prog[i][0]='nop';
                return prog;
            }
        }
    }
}

function runProgram(program){

    let i=0;
    let accumulator = 0;
    let map = new Map();

    while(i<program.length){

        let p = program[i];
        let command = p[0];
        let oper = p[1].charAt(0);
        let number = p[1].substring(1,p[1].length);
        //console.log(command + ' ' + oper + ' ' + number);

        let originalAcc = accumulator;
        let temp = 0;
        switch (command) {
            case 'nop':
                temp += 1;
                break;
            case 'acc':
                if (oper==='+'){
                    accumulator += parseInt(number);
                    //console.log('ACC oper: accumulator set to ' + accumulator);
                } else {
                    accumulator -= parseInt(number);
                    //console.log('ACC oper: accumulator set to ' + accumulator);
                }
                temp +=1;
                break;
            case 'jmp':
                if (oper==='+'){
                    temp += parseInt(number);
                    //console.log('JMP oper: temp is set to ' + temp);
                } else {
                    temp -= parseInt(number);
                    //console.log('JMP oper: temp is set to ' + temp);
                }
                break;
        }

        let newValue = i+temp;
        if(map.has(newValue)){
            let val = i+1;
            console.log('\n ---------  FALSE PROGRAM  -------- ')
            console.log('Accumulator was before infinite loop at: ' + originalAcc);
            console.log('Last inctruction number, before infinite loop: ' + val);
            return false;

            }
        map.set(newValue,true);
        i += temp;
        //console.log('i is now:' + newValue);
    }
    console.log('\n ---------  PROGRAM TERMINATED  -------- ');
    console.log('Accumulator is now at: ' + accumulator);
    return true;
}


processLineByLine();