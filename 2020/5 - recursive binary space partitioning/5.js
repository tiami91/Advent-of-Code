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

        //2D array: The first string of each array is the input line, the rest are predefined strings.
        map.push([line, 'row', 'column', 'seatID']);
    }

    //Initializing max and an empty 2d array of the size of the plane.
    let max = 0;
    let seatMap = new Array(128);
    for(let i=0; i<128; i++) {
        seatMap[i] = new Array(8);
    }


    //Finding row and column number, and calculating seatID
    for(let i=0; i<map.length; i++){
        let seat = findSeat(map[i][0]);
        let row = seat[0];
        let column = seat[1];
        let seatID = (row*8)+parseInt(column);
        map[i][1] = row;         //set row
        map[i][2] = column;      //set column
        map[i][3] = seatID;      //set seatID

        seatMap[row][column] = 'X';
        //console.log('SeatID is: ' + seatID);
        if (seatID> max) {
            max = seatID;
        }
    }
    console.log('Max seatID is: ' + max);


    //Removing empty rows from front and back
    let newMap = seatMap.slice(6,seatMap.length-26);
    //console.log(newMap.toString());
    for(let i=0; i<newMap.length; i++){
        for(let j=0; j<newMap[i].length; j++){
            if(newMap[i][j] !== 'X'){
                let myRow = i+6;
                console.log('My seat is: Row: ' + myRow + ' Column: ' + j)
                let mySeat = myRow*8+j;
                console.log('My seat ID: ' + mySeat);
            }
        }
    }


}

function findSeat(seat){

    let arrRow = Array.from(Array(128).keys());
    let arrColumn = Array.from(Array(8).keys());
    //console.log(seat.substring(7 - self-recursive,10));
    let row = findRow(seat.substring(0,7), arrRow);
    let column = findColumn(seat.substring(7,10), arrColumn);

    //console.log('Row: ' + row + ' and Column: ' + column);
    return [row,column];
}

function findRow(letters, rows){

    //If rows array size is 1, return the row number contained inside.
    if (rows.length===1){
        return rows[0];
    }

    //If F found, iterate on lower half
    if(letters[0]==='F'){
        //console.log('Letter found: F');
        letters = letters.substring(1,letters.length);
        return findRow(letters,rows.slice(0,rows.length/2));

    //If B found, iterate on upper half
    } else {
        //console.log('Letter found: ' + letters[0]);
        letters = letters.substring(1,letters.length);
        return findRow(letters,rows.slice(rows.length/2, rows.length));
    }
}

function findColumn(letters, columns){

    //if columns array size is 1, return the column number contained inside
    if (columns.length===1){
        return columns;
    }

    //If L found, iterate on lower half
    if(letters[0]==='L'){
        letters = letters.substring(1,letters.length);
        return findColumn(letters, columns.slice(0,columns.length/2));

    //If R found iterate on upper half
    } else {
        letters = letters.substring(1,letters.length);
        return findColumn(letters, columns.slice(columns.length/2, columns.length));
    }
}


processLineByLine();