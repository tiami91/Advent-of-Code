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

    let map = new Map();
    for await (const line of rl) {

        let rules = line.split(' contain ');
        let bag = rules[0];
        let contents = rules[1];
        let temp_bags = bag.split(' ');

        //firstColor is the color of the bag, while bagsContained is the bags it can contain.
        let firstColor = temp_bags[0] + ' ' + temp_bags[1];
        let bagsContained = contents.split(', ');
        map.set(firstColor, bagsContained);
    }

    //number of colors that can contain shiny gold bags
    //let shinyGolds = findOuterBags('shiny gold', map);
    //console.log(shinyGolds.length);

    //number of bags a shiny gold bag should contain
    //let bags = findInnerBags('shiny gold', map);
    let bags2 = findOuterBags('shiny gold', map);

    //Vi tæller ikke starter shineygold bag, derfor skal vi minusse 1
    let bags3 = bags2[1]-1;
    //console.log(bags.length);
    console.log(bags2[0] + ' er mappet, og nummeret er: ' + bags3);
}

function findInnerBags(color,map){

    let newKeys = [];
    for([key, value] of map){
        if(key === color){
            for(let i=0; i<value.length; i++) {
                let temp_colors = value[i].split(' ');
                let thisColor = temp_colors[1] + ' ' + temp_colors[2];
                if(thisColor !== 'other bags.') {
                    newKeys.push(thisColor);
                }
            }
        }
    }

    console.log(newKeys);
    let results = newKeys;
    for(let i=0; i<newKeys.length; i++){
        let colors = findInnerBags(newKeys[i], map);
        let myArray = results.concat(colors);
        results = myArray.filter((v, i, a) => a.indexOf(v) === i);
    }
    return results;

}

function findOuterBags(color, map){

    let amounts = [];
    let newKeys = [];
    for([key, value] of map){
        if(key === color){
            //console.log('color found: ' + color + ' -------------');
            for(let i=0; i<value.length; i++) {
                let temp_colors = value[i].split(' ');
                let thisColor = temp_colors[1] + ' ' + temp_colors[2];
                if(thisColor !== 'other bags.') {
                    newKeys.push(thisColor);
                    amounts.push(temp_colors[0]);
                }
            }
        }
    }

    //newKeys is all the newfound colors that need to be checked if they contain shiny gold bags
    let results = newKeys;
    let number = 0;
    //console.log(newKeys);
    //console.log(amounts);
    if(newKeys.length === 0){
        //console.log('no new keys');
    } else {
        for (let i = 0; i < newKeys.length; i++) {
            let temp = findOuterBags(newKeys[i], map);
            let colors = temp[0];
            //console.log(amounts[i], +' ' + temp[1]);
            number += temp[1] * amounts[i];
            let myArray = results.concat(colors);
            results = myArray.filter((v, i, a) => a.indexOf(v) === i);
        }
    }
    number +=1;
    //console.log('Det samlede antal tasker i ' + color + ' er (inkl. sig selv):' + number);
    return [results, number];
}

processLineByLine();