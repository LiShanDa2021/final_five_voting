
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
var rounds = ['first', 'second', 'third', 'fourth']
var roundCounter = 0
var randNumb = []
var randCounter
var ballotCand = []
var ballotParty = []
var ballotStack = []
var scoreSheet = []
var noBallots = 25
var ballotCounter = 0
var ballot = []
var remain_cand = 5

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
            
            //delete chosen candidate from avail_candidates once we have multiple candidates same party

            ballot.push({candidate : ballot_candidates[i]['candidate'], party : ballot_candidates[i]['party'], first: ballotVotes[i][0], second: ballotVotes[i][1], third: ballotVotes[i][2], fourth: ballotVotes[i][3], fifth: ballotVotes[i][4]})
        }
        ballotStack.push(ballot)
        ballot = []
    }
    
    return ballotStack
}


function createTable(ballot) {
    var tbody = d3.select("#ballot");
    tbody.html("");
    i = 0
    ballot.forEach((cand) => 
    {
        let row = tbody.append("tr")
        j = 0
        Object.values(cand).forEach((val) => 
        {
            let cell = row.append("td");
            if ((scoreSheet[i]['eliminated'] == true) && (j < 2)) {
                cell.text('Eliminated');
                j++
            }
            else {
                cell.text(val);
            }
        });
        i++
    });
}

function createPlayerScore() {
    var playerScore = d3.select("#playerScore");
    playerScore.html("");

    let row = playerScore.append("tr");
    cell = row.append("td")
    cell.html("Score this Ballot!")
    cell = row.append("td")
    cell.html("Ballots Scored Correctly: " + correctCounter)
    cell = row.append("td")
    cell.html("Errors: " + errorCounter)
    cell = row.append("td")
    cell.html("Round: " + (roundCounter + 1))
    cell = row.append("td")
    cell.html("Ballots Remaining in Round: " + ((ballotStack.length)-ballotCounter))
}

function createScorecard(ballot)
{
    var scoreBody = d3.select("#scorecard");
    scoreBody.html("");

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

    let row5 = scoreBody.append("tr");
    //create additional action buttons
    cell = row5.append("td")
    cell.html("<input type="+"button"+" id="+"eliminate_button"+" value="+"Eliminate Candidate"+">")
    eliminateButton = document.getElementById("eliminate_button")
    //console.log(eliminateButton)
    cell = row5.append("td")
    cell.html("<input type="+"button"+" id="+"winner_button"+" value="+"Declare Winner"+">")
    winnerButton = document.querySelector(".winner_button")
    cell = row5.append("td")
    cell.html("<input type="+"button"+" id="+"overvote_button"+" value="+"Overvote"+">")
    overVoteButton = document.querySelector(".overvote_button")
    cell = row5.append("td")
    cell.html("<input type="+"button"+" id="+"exhausted_button"+" value="+"Exhuasted Ballot"+">")
    exhuastedButton = document.querySelector(".exhuasted_button")
    return eliminateButton, winnerButton, overVoteButton, exhuastedButton
};

function errorProcedure() {
    var errorMessage = d3.select("#errorMessage");
    errorMessage.html("Error! Rescore Ballot!")
    d3.selectAll("input").on("click", scoreBallot)
}

function createBallotScoreSheet(ballot)
{
    for (i = 0; i < 5; i++)
    {
        candidate = (ballot[i]['candidate']);
        scoreSheet.push({candidate : candidate, first: 0, second: 0, third: 0, fourth: 0, fifth: 0, total: 0, neededToWin : Math.ceil(noBallots/2), eliminated: false})
    }
    return scoreSheet
}


function eliminateProcedure() {
    console.log("eliminate someone")
    console.log("who do we eliminate?")
    d3.selectAll("input").on("click", eliminateWhom);
}

function eliminateWhom() {
    let changedElement = d3.select(this);
    let elementValue = changedElement.property("value");
    console.log(elementValue)
    console.log((ballotStack[ballotCounter][elementValue]['candidate']) + " has been eliminated.")
    scoreSheet[elementValue]['eliminated'] = true
    scoreSheet[elementValue]
    
    createTable(ballotStack[ballotCounter])
    createScorecard(ballotStack[ballotCounter])
    createPlayerScore()
    d3.selectAll("input").on("click", doSomething);
}


function scoreBallot(elementValue) {
    
    if (ballotStack[ballotCounter][elementValue][rounds[roundCounter]]==='x') {
        //console.log(ballotStack[ballotCounter][elementValue][rounds[roundCounter]])
        console.log("You chose wisely.")
        error = 0
        correctCounter++
    }
    else {
        console.log("You chose poorly.")
        errorCounter++
        error = 1
        errorProcedure()
    }

    console.log(ballotCounter)

    
    for (i=0; i<ballotStack[ballotCounter].length; i++) {
        if (ballotStack[ballotCounter][i][rounds[roundCounter]] === 'x') {
            scoreSheet[i][rounds[roundCounter]] = scoreSheet[i][rounds[roundCounter]] + 1
        }
        scoreSheet[i]['total'] = scoreSheet[i]['first'] + scoreSheet[i]['second'] + scoreSheet[i]['third'] + scoreSheet[i]['fourth']
        scoreSheet[i]['neededToWin'] = Math.ceil((noBallots*(roundCounter+1))/2) - scoreSheet[i]['total']
    }
    
    ballotCounter++
    
    if (error == 1) {
        ballotCounter--
    };

    if (ballotCounter == ballotStack.length) {
        var errorMessage = d3.select("#errorMessage");
        errorMessage.html("")
        errorMessage.html("End of Round! Take appropriate action.")
        roundCounter++
        ballotCounter = 0
        endofRound = true
    }
    
    createTable(ballotStack[ballotCounter])
    createScorecard(ballotStack[ballotCounter])
    createPlayerScore()
  
    d3.selectAll("input").on("click", doSomething);
}

function doSomething() {
    console.log("Doin Somethin")
    var errorMessage = d3.select("#errorMessage");
    errorMessage.html("")
    var error = 0

    let changedElement = d3.select(this);
    let elementValue = changedElement.property("value");
    // console.log("here comes the changed element")
    // console.log(elementValue)

    if (elementValue === "Eliminate") {
        eliminateProcedure()
    }

    else {
        scoreBallot(elementValue)
    }
}

createBallots(candidates)
createBallotScoreSheet(ballotStack[ballotCounter])
createPlayerScore()
createTable(ballotStack[ballotCounter])
createScorecard(ballotStack[ballotCounter])

d3.selectAll("input").on("click", doSomething);



// make sure eliminated candidate has least votes
// display vote for eliminated candidate
// ballot exhausted function


















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

    // let changedElement = d3.select(this);
    // let elementValue = changedElement.property("value");
    // console.log(elementValue)
    // if (elementValue != "Eliminate Candidate") {
    //     var errorMessage = d3.select("#errorMessage");
    //     errorMessage.html("")
    //     errorCounter++
    //     console.log("wrong action")
    //     errorMessage.html("Wrong action! Choose again.")
    //     endofRoundProcedure
    // }


        // originally at the top of scoreBallot
    // var errorMessage = d3.select("#errorMessage");
    // errorMessage.html("")
    // var error = 0

    // let changedElement = d3.select(this);
    // console.log(changedElement)
    // let elementValue = changedElement.property("value");
    // console.log(elementValue)

    // function endofRoundProcedure() {
//     let changedElement = d3.select(this);
//     let elementValue = changedElement.property("value");
//     var errorMessage = d3.select("#errorMessage");

//     errorMessage.html("")
//     error = 0

//     roundCounter++
//     ballotCounter = 0

//     errorMessage.html("End of Round! Take appropriate action.")
//     console.log("end of round")



//     //d3.selectAll("input").on("click", eliminateProcedure)
// }