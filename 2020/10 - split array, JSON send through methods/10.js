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

    for await (const line of rl) {
        arr.push(line);
    }
    arr.sort(function (first, second){
        return first - second;
    });
    let arr1 = arr.slice(0,44);
    let arr2 = arr.slice(44,88);
    let arr3 = arr.slice(88,arr.length);
    console.log(arr1.toString());
    console.log(arr2.toString());
    console.log(arr3.toString());
    let jolt1=0;
    let jolt2=0;
    let jolt3=1;
    let result = [];
    result.push(0);
    let result2=[];
    result2.push(parseInt(arr2[0]))
    let result3=[];
    result3.push(parseInt(arr3[0]));
    result = allOptions(arr1,JSON.stringify(result),0);
    result2 = allOptions(arr2,JSON.stringify(result2),1);
    result3 = allOptions(arr3, JSON.stringify(result3),1);

    result = JSON.stringify(result);
    result2=JSON.stringify(result2);
    result3=JSON.stringify(result3);
    //console.log(result);
    //let hej = JSON.stringify(result)
    let arrSplit = result.split('][');
    let arrSplit2 = result2.split('][');
    let arrSplit3 = result3.split('][');
    //console.log(arrSplit);
    console.log("all possible combinations: " + arrSplit.length + ' ' + arrSplit2.length + ' ' + arrSplit3.length);
    let sum = arrSplit.length*arrSplit2.length*arrSplit3.length;
    console.log('So the final result is: ' + sum);

}

function allOptions(arr, result, i){

    if(i>=arr.length){
        return result;
    }
    result = JSON.parse(result);
    let index = result.length-1;
    //console.log('Result: ' + result.toString() + ' Last index: ' + index);
    let lastInResult = result[index];
    //console.log('Last in result arr: ' + lastInResult);
    let diff = parseInt(arr[i])-lastInResult;
    //console.log('Result array: ' + result.toString() + ' arr[i]: ' + arr[i] + ' Diff: ' + diff);

    if(diff === 3){
        //call recursive with this number in result
        result.push(parseInt(arr[i]));
        //console.log(result);
        return allOptions(arr,JSON.stringify(result),i+1);

    } else if (diff === 2){
        //check if it can be skipped, if yes call recursive on both. Else call recursive on this only
        if(parseInt(arr[i+1])===parseInt(arr[i])+1){
            result.push(parseInt(arr[i]));
            let res1 = allOptions(arr,JSON.stringify(result), i+1);
            result.pop()
            if(i+2>arr.length){
                return res1;
            }
            result.push(parseInt(arr[i+1]));
            let res2 = allOptions(arr,JSON.stringify(result), i+2);
            console.log(res1 + ' ' + res2);
            return res1.concat(res2);
        } else {
            result.push(parseInt(arr[i]));
            return allOptions(arr,JSON.stringify(result), i+1);
        }
    } else {
        // 1 diff: check if can be skipped (i+1 or i+2 med). Call recursive on all options.
        let nextOneHigher = parseInt(arr[i+1])===parseInt(arr[i])+1;
        let nextTwoHigher = parseInt(arr[i+1])===parseInt(arr[i])+2;
        let nextNextOneHigher = parseInt(arr[i+2])===parseInt(arr[i])+2;
        if(nextOneHigher||nextTwoHigher){
            //console.log("nextOneHigher||nextTwoHigher true. " + arr[i] + ' ' + arr[i+1]);
            result.push(parseInt(arr[i]));
            let res1 = allOptions(arr, JSON.stringify(result), i + 1);
            result.pop()
            if(nextNextOneHigher){
                //console.log('nextNextOneHigher true.');
                result.push(parseInt(arr[i+2]));
                let res3 = allOptions(arr, JSON.stringify(result), i+3);
                //console.log('Concat res1 og res3.');
                res1 = res1.concat(res3);
                result.pop();
            }
            result.push(parseInt(arr[i + 1]));
            let res2 = allOptions(arr, JSON.stringify(result), i + 2);
            //console.log('Concat res1 og res2.');
            return res1.concat(res2);
        } else {
            result.push(parseInt(arr[i]));
            return allOptions(arr,JSON.stringify(result), i+1);
        }
    }

}

processLineByLine();