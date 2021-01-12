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
    let map = [];
    let passport = new Map();
    for await (const line of rl) {
        if(line.length === 0){
            map.push(passport);
            passport = new Map();
            continue;
        }

        let stats = line.split(' ');
        for(let i=0; i<stats.length; i++){
            let both = stats[i].split(':');
            let key = both[0];
            let value = both[1];

            passport.set(key, value);
        }
    }
    map.push(passport);

    let count = 0;
    for (let pass of map) {
        let valid = false;
        /*console.log('\nNEW PASSPORT: ')
        for (let [key, value] of pass) {
            console.log(key + ' = ' + value)
        }*/

        if(pass.has('byr') && pass.has('iyr') && pass.has('eyr') && pass.has('hgt') && pass.has('hcl') && pass.has('ecl') && pass.has('pid')) {

            valid = validate(pass);
            if(valid) {
                count += 1;
                /*console.log('\nVALID PASSPORT: ')
                for (let [key, value] of pass) {
                    console.log(key + ' = ' + value)
                }*/
            }
        }

        //console.log('Passport is valid: ' + valid);

    }
    console.log('Number of valid passes: ' + count);
}

function validate(pass){

    for (let [key, value] of pass) {
        pass[key]=value;
    }

    let byrvalid = pass['byr']>=1920 && pass['byr']<=2002;
    let iyrvalid = pass['iyr']>=2010 && pass['iyr']<=2020;
    let eyrvalid = pass['eyr']>=2020 && pass['eyr']<=2030;

    let hgtvalid = false;
    let unit = pass['hgt'].slice(-2);
    let hgt = pass['hgt'].substring(0,pass['hgt'].length-2);

    if(unit === 'cm'){
        hgtvalid = hgt>=150 && hgt<=193;
    } else if(unit === 'in') {
        hgtvalid = hgt>=59 && hgt<=76;
    }

    let hclpattern = /^#+([a-fA-F0-9]){6}$/;
    let hclvalid = hclpattern.test(pass['hcl']);

    let eclvalues = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
    let eclvalid = eclvalues.includes(pass['ecl']);

    let pidpattern = /^[0-9]{9}$/;
    let pidvalid = pidpattern.test(pass['pid']);
    //console.log(pass['pid'] + ' ' + pidvalid);


    return byrvalid && iyrvalid && eyrvalid && hgtvalid && hclvalid && eclvalid && pidvalid;
}

processLineByLine();