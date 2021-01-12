const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
    const fileStream = fs.createReadStream('input.txt');

    const rl = readline.createInterface({

        // Note: we use the crlfDelay option to recognize all instances of CR LF
        // ('\r\n') in input.txt as a single line break.
        input: fileStream,
        crlfDelay: Infinity
    });


    let groups = [];
    let answers = new Map();
    answers.set('size', 0);

    for await (const line of rl) {

        //push answers for group, when line is empty
        if(line.length === 0){
            groups.push(answers);
            answers = new Map();
            answers.set('size', 0);
            continue;
        }

        //update group size
        answers.set('size', answers.get('size')+1);

        //update value for each answer in the group
        for(let i=0; i<line.length; i++){
            let ans = line[i];

            //If nonexistent, make it 1
            if(answers.get(ans)==null){
                answers.set(ans, 1);

            //If exists, increase by 1
            } else {
                answers.set(ans, answers.get(ans) + 1);
            }

        }

    }
    //push answers for last group
    groups.push(answers);

    //Loop through all groups
    let allAnswers = 0;
    for(let i=0; i<groups.length; i++){
        //let groupnr = i+1;
        //console.log('\nGroup ' + groupnr);
        //console.log(groups[i]);

        //Check which answers of the group are answered by all. Skip size attribute.
        for(let [key, value] of groups[i]){
            if(key === 'size'){
                continue;
            }
            if(value===groups[i].get('size')){
                allAnswers += 1;
                //console.log('Everyone answered: ' + key);
            }
        }
    }

    //All answers that are answered by everyone inside their respective groups
    console.log('\nAll answers added up: ' + allAnswers);

}

processLineByLine();