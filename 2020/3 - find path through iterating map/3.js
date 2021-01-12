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
    for await (const line of rl) {
        map.push(line);
    }

    let trees11 = findTrees(1, 1, map);
    let trees31 = findTrees(3, 1, map);
    let trees51 = findTrees(5, 1, map);
    let trees71 = findTrees(7, 1, map);
    let trees12 = findTrees(1, 2, map);

    console.log('Trees for all routes: ' + trees11 + ' ' + trees31 + ' ' + trees51 + ' ' + trees71 + ' ' + trees12);
    console.log('Result of their product: ' + trees11*trees31*trees51*trees71*trees12);


}

function findTrees(right, down, map)
{
    let rightCount = right;
    let trees = 0;
    for (let i=down; i<map.length; i++){
        let terrain = map[i][rightCount];
        //console.log('rightcount: ' + rightCount + ' terrain: ' + terrain);
        if(terrain==='#'){
            trees += 1;
        }
        rightCount += right;
        if(rightCount>=map[i].length){
            rightCount = rightCount-map[i].length;
        }
        i+=down-1;
    }
    return trees;
}


processLineByLine();