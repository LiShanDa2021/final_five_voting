
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
var choices = ['first', 'second', 'third', 'fourth', 'fifth']
var choiceCounter = 0
var randNumb = []
var randCounter
var ballotCand = []
var ballotParty = []
var ballotStack = []
var scoreSheet = []
var noBallots = 15
var ballotCounter = 0
var ballot = []
var cheatSheet = []
var remain_cand = 5
var endofRound = false
var exhaustedBallots = 0
var eliminatedCandidates = []
var eliminatedCandidate

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

        cheatSheet.push({firstChoice : "", secondChoice : "", thirdChoice : "", fourthChoice : "", fifthChoice : ""})

        for (i = 0; i < 5; i++)
        {
            
            //delete chosen candidate from avail_candidates once we have multiple candidates same party

            ballot.push({candidate : ballot_candidates[i]['candidate'], party : ballot_candidates[i]['party'], first: ballotVotes[i][0], second: ballotVotes[i][1], third: ballotVotes[i][2], fourth: ballotVotes[i][3], fifth: ballotVotes[i][4]})
            
            if (ballot[i]['first'] === 'x') {
                cheatSheet[iterator]['firstChoice'] = ballot_candidates[i]['candidate']
            }
            if (ballot[i]['second'] === 'x') {
                cheatSheet[iterator]['secondChoice'] = ballot_candidates[i]['candidate']
            }
            if (ballot[i]['third'] === 'x') {
                cheatSheet[iterator]['thirdChoice'] = ballot_candidates[i]['candidate']
            }
            if (ballot[i]['fourth'] === 'x') {
                cheatSheet[iterator]['fourthChoice'] = ballot_candidates[i]['candidate']
            }
            if (ballot[i]['fifth'] === 'x') {
                cheatSheet[iterator]['fifthChoice'] = ballot_candidates[i]['candidate']
            }
        }
        ballotStack.push(ballot)
        ballot = []
    }
    
    originalBallotStack = ballotStack
    return ballotStack
    console.log(ballotStack)
    return originalBallotStack
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

    for (i = 0; i < remain_cand; i++) 
    {
        let cell = row.append("td");
        cell.html("<input type="+"radio"+" name="+"vote-getter"+" value="+i+">")
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
    
    return eliminateButton, winnerButton
};

function errorProcedure(errorCode) {
    var errorMessage = d3.select("#errorMessage");
    console.log(errorCode)
    errorCounter++
    if (errorCode == "wrongVote") {
        errorMessage.html("Error! Rescore Ballot!")
        d3.selectAll("input").on("click", scoreBallot)
    }
    if (errorCode == "alreadyEliminated") {
        errorMessage.html("Error! Candidate Already Eliminated! Select another!")
        d3.selectAll("input").on("click", eliminateWhom)
    }
    if (errorCode == "wrongElimination") {
        errorMessage.html("Error! Incorrect Candidate Eliminated! Select another!")
        d3.selectAll("input").on("click", eliminateWhom)
    }
    if (errorCode == "notEndofRound") {
        errorMessage.html("Error! Action not allowed at this time!")
        d3.selectAll("input").on("click", doSomething)
    }
    if (errorCode == "choseEliminated") {
        errorMessage.html("Error! Candidate has been eliminated! Choose another action!")
        d3.selectAll("input").on("click", doSomething)
    }
    if (errorCode == "noWinner") {
        errorMessage.html("Error! There is no winner at this time!")
        d3.selectAll("input").on("click", doSomething)
    }
    if (errorCode == "wrongWinner") {
        errorMessage.html("Error! Wrong winner selected! Choose again!")
        d3.selectAll("input").on("click", selectWinner)
    }
}

function selectWinner() {

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
    var errorMessage = d3.select("#errorMessage");
    errorMessage.html("")
    errorMessage.html("Choose a candidate to eliminate.")
    d3.selectAll("input").on("click", eliminateWhom);
}

function eliminateWhom() {
    let changedElement = d3.select(this);
    let elementValue = changedElement.property("value");

    avail_votes = []
    scoreSheet.forEach((cand) => {
        if (cand['eliminated'] == false) {
            avail_votes.push(cand['total'])
        }
    });
    
    least_votes = Math.min(...avail_votes)
    
    if (scoreSheet[elementValue]['eliminated'] == true) {
        errorProcedure('alreadyEliminated')
    }
    else if (scoreSheet[elementValue]['total'] != least_votes) {
        errorProcedure('wrongElimination')
    }
    else {
        console.log(elementValue)

        var errorMessage = d3.select("#errorMessage");
        errorMessage.html((ballotStack[ballotCounter][elementValue]['candidate']) + " has been eliminated. Redistributing votes. Begin next round!")
    
        scoreSheet[elementValue]['eliminated'] = true
        scoreSheet[elementValue]
        eliminatedCandidate = ballotStack[ballotCounter][elementValue]['candidate']
        eliminatedCandidates.push(ballotStack[ballotCounter][elementValue]['candidate'])
        redistributeVotes()
        
        // createTable(ballotStack[ballotCounter])
        // createScorecard(ballotStack[ballotCounter])
        // createPlayerScore()
        // d3.selectAll("input").on("click", doSomething);
    };
}

function redistributeVotes() {
    console.log('redistributing')
    ballotStack = []
    for (i = 0; i < originalBallotStack.length; i++) {
        originalBallotStack[i].forEach((candidate) => {
            if (candidate['candidate'] == eliminatedCandidate && candidate['first']==='x') {
                ballotStack.push(originalBallotStack[i])
            }
            });
        };
    createTable(ballotStack[ballotCounter])
    createScorecard(ballotStack[ballotCounter])
    createPlayerScore()
    console.log(ballotStack)
    d3.selectAll("input").on("click", doSomething);
    }


function exhaustedProcedure() {

    // this will need to be completely reworked

    console.log("You have successfully clicked the skip button.")
    
    i = 0
    ballotStack[ballotCounter].forEach((cand) => {
        if (cand[rounds[roundCounter]]==='x') {
            cand_index = i
            console.log(cand_index)
        }
        i++
    });
    if (scoreSheet[cand_index]['eliminated'] == true) {
        console.log("Ballot is indeed exhausted")
        var errorMessage = d3.select("#errorMessage");
        errorMessage.html("")
        errorMessage.html("Skipping Ballot!")

        ballotCounter++
        correctCounter++

        if (ballotCounter == ballotStack.length) {
            var errorMessage = d3.select("#errorMessage");
            errorMessage.html("")
            errorMessage.html("Ballot skipped. End of Round! Take appropriate action.")
            roundCounter++
            ballotCounter = 0
            endofRound = true
        }

        createTable(ballotStack[ballotCounter])
        createScorecard(ballotStack[ballotCounter])
        createPlayerScore()
    }
    else {
        errorProcedure("ballotNotExhausted")
    };
    d3.selectAll("input").on("click", doSomething);
}

function winnerProcedure() {
    console.log("You have successfully pressed the declare winner button.")

    d3.selectAll("input").on("click", doSomething);
}

function scoreBallot(elementValue) {

    choiceCounter = 0

    for (choice = 0; choice < choiceCounter + 1; choice++) {
        for (cand = 0; cand < ballotStack[ballotCounter].length; cand++) {
            if (ballotStack[ballotCounter][cand][choices[choice]] === 'x') {
                voteGettingCand = ballotStack[ballotCounter][cand]['candidate']
                console.log(voteGettingCand)
            }
        }
        if (eliminatedCandidates.includes(voteGettingCand) == true) {
            choiceCounter++
        }
    }
    
    // for (choice = 0; choice < choices.length; choice++) {
    //     console.log("we are on choice " + [choices[choice]])
    //     //console.log(ballotStack[ballotCounter])
    //     // could test for no candidate eliminated to stop loop and save resources
    //     // but let's get this working first
    //     for (cand = 0; cand < ballotStack[ballotCounter].length; cand++) {


    //         console.log("candidate is eliminated")
    //         console.log(scoreSheet[cand]['eliminated'])
    //         console.log("candidate is chosen")
    //         console.log(ballotStack[ballotCounter][cand][choices[choice]])

    //         if ((ballotStack[ballotCounter][cand][choices[choice]]==='x') && (scoreSheet[cand]['eliminated'])) {
    //             choiceCounter++
    //             console.log(choiceCounter)
    //         }
    //     }
    // }

    console.log([choices[choiceCounter]])

    if (ballotStack[ballotCounter][elementValue][choices[choiceCounter]]==='x') {
        console.log("You chose wisely.")
        error = false
        correctCounter++
        for (i=0; i<ballotStack[ballotCounter].length; i++) {
            if (ballotStack[ballotCounter][i][choices[choiceCounter]] === 'x') {
                scoreSheet[i][choices[choiceCounter]] = scoreSheet[i][choices[choiceCounter]] + 1
            }
            scoreSheet[i]['total'] = scoreSheet[i]['first'] + scoreSheet[i]['second'] + scoreSheet[i]['third'] + scoreSheet[i]['fourth']
            scoreSheet[i]['neededToWin'] = Math.ceil((noBallots/2) + 1) - scoreSheet[i]['total'] 
        }
        ballotCounter++
    }
    else {
        console.log("You chose poorly.")
        error = true
        errorProcedure("wrongVote")
    }

    if (ballotCounter == ballotStack.length) {
        var errorMessage = d3.select("#errorMessage");
        errorMessage.html("")
        errorMessage.html("End of Round! Take appropriate action.")
        endofRound = true
        roundCounter++
        ballotCounter = 0
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

    if (elementValue === "Eliminate") {
        if (endofRound == true) {
            endofRound = false
            eliminateProcedure()
        }
        else {
            errorProcedure("notEndofRound")
        }
    }
    else if (elementValue === "Exhuasted") {
        exhuastedProcedure()
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


// create original cheatsheet from cheatsheet
//ok need to rework things so votes from eliminated candidate are redistributed
    // eliminate candidate
        // create a new ballot stack from eliminated candidates ballots -- check
    // score votes from 

// if no votes for eliminated candidate
// if statement ballotstack.len = 0
    // if zero, choose another candidate to eliminate





// make sure eliminated candidate has least votes OK
    // make error message disappear after selecting correct candidate
// ballot exhausted function
// error if vote for eliminated candiate !!!
// error if vote for eliminated candidate

// find out what is going on with truncating the values for the buttons and why they only display part of the name

// recalculate total votes to exclude eliminated candidates
// error if voting for eliminated candidate -- see exhausted function

// declare winner function
// make sure winner is actual winner

// error counter score should change immediately for all actions that lead to errors

// fix the error where errors get counted as votes toward the correct candidate

// create messages in message box where absent

//find number of exhausted ballots so they don't count toward total

// fix problem where you can click eliminate button at any time

// make it so you can't click exhausted during elimination

// rewrite eliminate procedure so next only count eliminated candidate's ballots
