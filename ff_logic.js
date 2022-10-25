
const candidates = 
[
    {
        Mammal : ["Badger", "Ocelot", "Arctic Fox", "Beluga", "Capybara", "Gibbon", "Elk"]
    },
    {
        Bird : ["Chickadee", "Crow", "Osprey", "Emu", "Canada Goose", "Albatross", "Condor"]
    },
    {
        Reptile: ["Crocodile", "Iguana", "Sea Turtle", "Boa Constrictor", "Gila Monster", "Blue Tounged Skink", "Tuatara"],
    },
    {
        Amphibian: ["Tree Frog", "Cane Toad", "Salamander", "Axolotl", "Newt", "Caecilian", "Bullfrog"]
    },
    {
        Cryptid: ["Sasquatch", "Chupacabra", "Loch Ness Monster", "Yeti", "Jackalope", "Hodag", "Mothman"]
    }
]

var correctCounter = 0
var errorCounter = 0
var randNumb = []
var randCounter
var ballotCand = []
var ballotParty = []
var ballotStack = []
var scoreSheet = []
var noBallots = 25
var ballotCounter = 0
var ballot = []

function createBallots(candidates)
{
    let avail_candidates = candidates
    ballot_candidates = []
    for (i = 0; i < 5; i++) {
        party = Object.keys(avail_candidates[i])[0];

        candidate = (Object.values(avail_candidates[i])[0][(Math.floor(Math.random() * (avail_candidates[i][party].length)))]);

        ballot_candidates.push({candidate : candidate, party : party})
    }
    //console.log(avail_candidates)
    for (iterator = 0; iterator<noBallots; iterator++) {
        possibilities = 
        [
            ["x",0,0,0,0],
            [0,"x",0,0,0],
            [0,0,"x",0,0],
            [0,0,0,"x",0],
            [0,0,0,0,"x"]
        ];

        ballotVotes = possibilities.sort(() => Math.random() - 0.5)

        for (i = 0; i < 5; i++)
        {
            // party = Object.keys(avail_candidates[i])[0];

            // candidate = (Object.values(avail_candidates[i])[0][(Math.floor(Math.random() * (avail_candidates[i][party].length)))]);
        
            //delete chosen candidate from avail_candidates once we have multiple candidates same party

            ballot.push({candidate : ballot_candidates[i]['candidate'], party : ballot_candidates[i]['party'], first: ballotVotes[i][0], second: ballotVotes[i][1], third: ballotVotes[i][2], fourth: ballotVotes[i][3], fifth: ballotVotes[i][4]})
        }
        ballotStack.push(ballot)
        ballot = []
    }
    
    //console.log(ballot)
    return ballotStack
}


function createTable(ballot) {
    var tbody = d3.select("#ballot");
    tbody.html("");
    ballot.forEach((cand) => 
    {
        let row = tbody.append("tr")
        Object.values(cand).forEach((val) => 
        {
            let cell = row.append("td");
            cell.text(val);
        });
    });
}


function createScorecard(ballot)
{
    var scoreBody = d3.select("#scorecard");
    scoreBody.html("");
    remain_cand = 5
    let row = scoreBody.append("tr");

    //create radio buttons
    for (i = 0; i < remain_cand; i++) 
    {
        let cell = row.append("td");
        cell.html("<input type="+"radio"+" name="+"vote-getter"+" value="+i+">")
        //console.log(candidate_data['candidate'])
    }

    let row2 = scoreBody.append("tr");

    //create choice labels
    for (i = 0; i < remain_cand; i++) 
    {
        let cell = row2.append("td");
        candidate_data=ballot[i]
        cellText = (candidate_data['candidate']);
        cell.text(cellText);
    }

    let row3 = scoreBody.append("tr");

    //create candidate votes
    for (i = 0; i < remain_cand; i++) {
        let cell = row3.append("td")
        cell.text("Votes: " + scoreSheet[i]['total'])
    }
    
    let row4 = scoreBody.append("tr");
    //create votes needed to win
    for (i = 0; i < remain_cand; i++) {
        let cell = row4.append("td")
        cell.text("Needed to win: " + scoreSheet[i]['neededToWin'])
    }
    
};

function scoreBallot() {
    let changedElement = d3.select(this);
    let elementValue = changedElement.property("value");
    // console.log(ballot[elementValue]['candidate']);
    // console.log(ballot[elementValue]['first'])
    if (ballotStack[ballotCounter][elementValue]['first']==='x') {
        console.log("You chose wisely.")
        correctCounter++
    }
    else {
        console.log("You chose poorly.")
        errorCounter++
    }
    //console.log(ballotStack[ballotCounter])

    for (i=0; i<ballotStack[ballotCounter].length; i++) {
        if (ballotStack[ballotCounter][i]['first'] === 'x') {
            scoreSheet[i]['first'] = scoreSheet[i]['first'] + 1
        }
        scoreSheet[i]['total'] = scoreSheet[i]['first'] + scoreSheet[i]['second'] + scoreSheet[i]['third'] + scoreSheet[i]['fourth']
        scoreSheet[i]['neededToWin'] = Math.ceil(noBallots/2) - scoreSheet[i]['total']
    }
    console.log(scoreSheet)
    ballotCounter++

    //createBallotVotes(ballot)
    createTable(ballotStack[ballotCounter])
    createScorecard(ballotStack[ballotCounter])
    d3.selectAll("input").on("click", scoreBallot);
}

createBallots(candidates)
createBallotScoreSheet(ballotStack[ballotCounter])
createTable(ballotStack[ballotCounter])
createScorecard(ballotStack[ballotCounter])


d3.selectAll("input").on("click", scoreBallot);


function createBallotScoreSheet(ballot) 
{
    for (i = 0; i < 5; i++)
    {
        candidate = (ballot[i]['candidate']);
        scoreSheet.push({candidate : candidate, first: 0, second: 0, third: 0, fourth: 0, fifth: 0, total: 0, neededToWin : Math.ceil(noBallots/2)})
    }
    return scoreSheet
}









// function shuffle(array) {
//     let currentIndex = array.length,  randomIndex;
  
//     // While there remain elements to shuffle.
//     while (currentIndex != 0) {
  
//       // Pick a remaining element.
//       randomIndex = Math.floor(Math.random() * currentIndex);
//       currentIndex--;
  
//       // And swap it with the current element.
//       [array[currentIndex], array[randomIndex]] = [
//         array[randomIndex], array[currentIndex]];
//     }
  
//     return array;
//   }

// function createPossibilities()
// {
//     possibilities = 
//     [
//         ["x",0,0,0,0],
//         [0,"x",0,0,0],
//         [0,0,"x",0,0],
//         [0,0,0,"x",0],
//         [0,0,0,0,"x"]
//     ];

//     return possibilities
// };

// function shufflePossibilities(possibilities) {
//     ballotVotes = possibilities.sort(() => Math.random() - 0.5)
//     return ballotVotes
// }


// function runElection(ballotStack)
// {
//     for (i = 0; i < noBallots; i++) 
//     {
//         createTable(ballotStack[i])
//         createScorecard(ballotStack[i])
//     }
// }


//console.log(ballotVotes)
        //console.log(ballot)
        // for (j = 0; j < 5; j++) {
        //     ballot[j].first = ballotVotes[j][0];
        //     ballot[j].second = ballotVotes[j][1];
        //     ballot[j].third = ballotVotes[j][2];
        //     ballot[j].fourth = ballotVotes[j][3];
        //     ballot[j].fifth = ballotVotes[j][4];
        // }


        // function createBallotStack(ballot) {

//     for (i = 0; i < noBallots; i++) 
//     {
//         let possibilities = 
//     [
//         ["x",0,0,0,0],
//         [0,"x",0,0,0],
//         [0,0,"x",0,0],
//         [0,0,0,"x",0],
//         [0,0,0,0,"x"]
//     ];

//         ballotVotes = []

//         for (k = 0; k < possibilities.length; k++) {
//             //maxRand = Math.max(reduce(randNumb[i]))
//             anIndex = randNumb[i].indexOf(Math.max(randNumb[i][0],randNumb[i][1],randNumb[i][2],randNumb[i][3],randNumb[i][4]));
//             ballotVotes.push(possibilities[anIndex])
//             randNumb[i][anIndex]=0;
//         }

//         //console.log(ballotVotes)

//         for (j = 0; j < 5; j++) {
//             ballot[j].first = ballotVotes[j][0];
//             ballot[j].second = ballotVotes[j][1];
//             ballot[j].third = ballotVotes[j][2];;
//             ballot[j].fourth = ballotVotes[j][3];;
//             ballot[j].fifth = ballotVotes[j][4];;
//             }

//         console.log(i)
//         console.log(ballotVotes)
//         console.log(ballot)

//         //maybe make a completely new object here and push that to the ballot stack

//         ballotStack[i] = ballot;
//     }
//     //console.log(ballotStack)
//     //return ballotStack
// };


// function createBallotVotes(ballot) {

//     for (i=0; i<noBallots; i++) {
//         possibilities = 
//         [
//             ["x",0,0,0,0],
//             [0,"x",0,0,0],
//             [0,0,"x",0,0],
//             [0,0,0,"x",0],
//             [0,0,0,0,"x"]
//         ];
       
//         ballotVotes = possibilities.sort(() => Math.random() - 0.5)


//         for (j = 0; j < 5; j++) {
//             ballot[j].first = ballotVotes[j][0];
//             ballot[j].second = ballotVotes[j][1];
//             ballot[j].third = ballotVotes[j][2];
//             ballot[j].fourth = ballotVotes[j][3];
//             ballot[j].fifth = ballotVotes[j][4];
//             }
        
//         // do this like you did the candidates -- from available possibilities

//         ballotStack[i]={}
//     }
// };

// function genRandNumb(noBallots) {
//     for (i=0; i < (noBallots); i++)
//     {
//         randVotes = []
//         for (j=0; j < (5); j++) {
//             randVotes[j] = Math.random()
//         }
//         randNumb[i] = randVotes
//     }
//     return randNumb
// }