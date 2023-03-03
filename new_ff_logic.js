
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
var noBallots = 11
var ballotCounter = 0
var ballot = []
var cheatSheet = []
var remain_cand = 5
var candidates_list = []
var endofRound = false
var exhaustedBallots = 0
var eliminatedCandidates = []
var eliminatedCandidate
var winning_cand = 'nobody'
var hintCode = "ChooseCorrect"
var hints = 0

function createBallots(candidates)
{
    let avail_candidates = candidates
    ballot_candidates = []
    for (i = 0; i < 5; i++) {
        party = Object.keys(avail_candidates[i])[0];

        candidate = (Object.values(avail_candidates[i])[0][(Math.floor(Math.random() * (avail_candidates[i][party].length)))]);

        ballot_candidates.push({candidate : candidate, party : party})
        candidates_list.push(candidate)
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
    console.log(candidates_list)
    return ballotStack, ballot_candidates, originalBallotStack
}

function createTable(ballot) {
    var tbody = d3.select("#ballot");
    tbody.html("");
    i = 0
    ballot.forEach((cand) => 
    {
        let row = tbody.append("tr")
        
        j = 0
        
        delete(cand.party)
        
        Object.values(cand).forEach((val) => 
        {
            let cell = row.append("td")
            if (val == 'x' | val == "0") {
                cell.attr("class", "voteSquare");
                if (val == "x") {
                    cell.html("<img "+"class="+"Oval"+" src="+'"Oval.png"'+">")
                }
                else if (val == "0") {
                    cell.html("<img "+"class="+"Oval"+" src="+'"whiteOval-PNG.png"'+">")
                }

            }
            else {
                cell.attr("class", "notVoteSquare");
                if ((scoreSheet[i]['eliminated'] == true) && (j < 2)) {
                cell.text('Eliminated');
                j++
                }
                else {
                    cell.text(val);
                }
            }
        });
        let cell = row.append("td");
        cell.attr("class", "selectorButton");
        cell.html("<input type="+"radio"+" name="+"vote-getter"+" value="+i+">")
        let cell2 = row.append("td");
        cell2.attr("class", "voteTotalSquare");
        cell2.text(scoreSheet[i]['total'])
        console.log(scoreSheet[i]['total'])
        i++
    });
}


function createPlayerScore() {
    var playerScore = d3.select("#playerScore");
    playerScore.html("");

    let row = playerScore.append("tr");
    cell = row.append("td")
    cell.html("Total Ballots: " + (originalBallotStack.length))
    cell = row.append("td")
    cell.html("Ballots Scored Correctly: " + correctCounter)
    // cell = row.append("td")
    // cell.html("Hints used: " + hints)
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

    // let row = scoreBody.append("tr");

    // for (i = 0; i < remain_cand; i++) 
    // {
    //     let cell = row.append("td");
    //     cell.html("<input type="+"radio"+" name="+"vote-getter"+" value="+i+">")
    // }
    
    // let row2 = scoreBody.append("tr");

    //create choice labels
    // for (i = 0; i < remain_cand; i++) 
    // {
    //     let cell = row2.append("td");
    //     candidate_data=ballot[i]
    //     cellText = (candidate_data['candidate']);
    //     cell.text(cellText);
    // }

    // let row3 = scoreBody.append("tr");

    // //create candidate votes
    // for (i = 0; i < remain_cand; i++) {
    //     let cell = row3.append("td")
    //     cell.text("Votes: " + scoreSheet[i]['total'])
    // }
    
   

    let row5 = scoreBody.append("tr");
    //create additional action buttons
    cell = row5.append("td")
    cell.html("<input type="+"button"+" class="+"action_button"+" id="+"eliminate_button"+" value="+'"Eliminate Candidate"'+">")
    eliminateButton = document.getElementById("eliminate_button")
    //console.log(eliminateButton)
    cell = row5.append("td")
    cell.html("<input type="+"button"+" class="+"action_button"+" id="+"winner_button"+" value="+'"Declare Winner"'+">")
    winnerButton = document.querySelector(".winner_button")

    cell = row5.append("td")
    cell.html("<input type="+"button"+" class="+"action_button"+" id="+"hint_button"+" value="+'"Hint"'+">")
    hintButton = document.querySelector(".hint_button")
    
    return eliminateButton, winnerButton, hintButton
};

function errorProcedure(errorCode) {
    var errorMessage = d3.select("#errorMessage");
    console.log(errorCode)
    createPlayerScore()
    errorCounter++
    if (errorCode == "isEndOfRound") {
        errorMessage.html("Next Round Has Not Begun!")
        d3.selectAll("input").on("click", doSomething)
    }
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
    if (errorCode == "isWinner") {
        errorMessage.html("Error! Choose a different action!")
        d3.selectAll("input").on("click", doSomething)
    }
}

function hintProcedure(hintCode) {
    console.log("Hint!")
    console.log(hintCode)
    createPlayerScore()
    hints++
    if (hintCode == "ChooseCorrect") {
        var errorMessage = d3.select("#errorMessage");
        errorMessage.html("")
        errorMessage.html("Choose the appropriate candidate for this round.")
        d3.selectAll("input").on("click", doSomething)
    }
    else if (hintCode == "chooseFewest") {
        var errorMessage = d3.select("#errorMessage");
        errorMessage.html("")
        errorMessage.html("Choose the candidate with the fewest votes. If there is a tie for fewest, choose any candidate with the fewest votes.")
        d3.selectAll("input").on("click", eliminateWhom)
    }
    else if (hintCode == "endOfRound") {
        var errorMessage = d3.select("#errorMessage");
        errorMessage.html("")
        errorMessage.html("At the end of a round, you must eliminate a candiate -- unless there is a winner.")
        d3.selectAll("input").on("click", eliminateWhom)
    }
    else if (hintCode == "isWinner") {
        var errorMessage = d3.select("#errorMessage");
        errorMessage.html("")
        errorMessage.html("There is a winner.")
        d3.selectAll("input").on("click", eliminateWhom)
    }

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

    console.log("Whom do we eliminate?")
    let changedElement = d3.select(this);
    let elementValue = changedElement.property("value");

    if (elementValue == "Hint") {
        console.log(elementValue)
        console.log("the error procedure has been activated for some reason")
        hintCode = "chooseFewest"
        hintProcedure(hintCode)
    }

    
    avail_votes = []
    scoreSheet.forEach((cand) => {
        if (cand['eliminated'] == false) {
            avail_votes.push(cand['total'])
        }
    });
    
    least_votes = Math.min(...avail_votes)
    
    console.log(elementValue)
    console.log(scoreSheet[elementValue])

    if (scoreSheet[elementValue] !== undefined) {
        if (scoreSheet[elementValue]['eliminated'] == true) {
            errorProcedure('alreadyEliminated')
        }
        else if (scoreSheet[elementValue]['total'] != least_votes) {
            errorProcedure('wrongElimination')
        }
        else {
            console.log(elementValue)
    
            var errorMessage = d3.select("#errorMessage");
            errorMessage.html((candidates_list[elementValue]) + " has been eliminated. Redistributing votes. Begin next round!")
        
            scoreSheet[elementValue]['eliminated'] = true
            scoreSheet[elementValue]
            eliminatedCandidate = candidates_list[elementValue]
            eliminatedCandidates.push(eliminatedCandidate)
            endofRound = false
            redistributeVotes()
        };
    }
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
    if (ballotStack.length == 0) {
        noVotesProcedure()
    }
    else {
        createTable(ballotStack[ballotCounter])
        createScorecard(ballotStack[ballotCounter])
        createPlayerScore()
        d3.selectAll("input").on("click", doSomething);
    }
}

function noVotesProcedure() {
    console.log("no votes to redistribute")
    var errorMessage = d3.select("#errorMessage");
    errorMessage.html(eliminatedCandidate + " has been eliminated but has no votes to redistribute. Choose an additional candidate to eliminate!")
    d3.selectAll("input").on("click", eliminateWhom)
}


function winnerProcedure() {
    //console.log("You have successfully pressed the declare winner button.")
    winner = false
    for (i = 0; i < 5; i++) {
        if (scoreSheet[i]['neededToWin'] <= 0) {
            console.log("We have a winner")
            winner = true
            winning_cand = scoreSheet[i]['candidate']
            console.log(winning_cand)
        }
    };
    if (winner == true) {
        var errorMessage = d3.select("#errorMessage");
        errorMessage.html("")
        errorMessage.html("Select the winner!")
    }
    else {
        errorProcedure('noWinner')
    }
    d3.selectAll("input").on("click", selectWinner);;
}

function selectWinner() {
    let changedElement = d3.select(this);
    let elementValue = changedElement.property("value");
    console.log('here is the element value')
    console.log(elementValue)
    console.log(ballotStack[ballot])
    if (ballot_candidates[elementValue]['candidate'] == winning_cand) {
        var errorMessage = d3.select("#errorMessage");
        errorMessage.html("")
        //alert(winning_cand + " is the winner! Thank you for counting!");
        errorMessage.html(winning_cand + " is the winner! Thank you for counting! " + "<input type="+"button"+" class="+"action_button"+" id="+"play_again_button"+" value="+'"Play Again"'+">")
        d3.selectAll("input").on("click", doSomething);
    }
    else {
        errorProcedure('wrongWinner')
    }
}

function scoreBallot(elementValue) {

    // if (endofRound == true) {
    //     errorProcedure("isEndOfRound")
    // }
    
    hintCode = "ChooseCorrect"

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
            scoreSheet[i]['neededToWin'] = Math.floor((noBallots/2) + 1) - scoreSheet[i]['total'] 
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
        hintCode = "endOfRound"

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
    createPlayerScore()
    var errorMessage = d3.select("#errorMessage");
    errorMessage.html("")
    var error = 0

    let changedElement = d3.select(this);
    let elementValue = changedElement.property("value");

    winner = false

    for (i = 0; i < 5; i++) {
        if (scoreSheet[i]['neededToWin'] <= 0) {
            console.log("We have a winner")
            hintCode = "isWinner"
            winner = true
            winning_cand = scoreSheet[i]['candidate']
            console.log(winning_cand)
        }
    };

    if (elementValue === "Eliminate Candidate") {
        if (endofRound == true && winner == false) {
            eliminateProcedure()
        }
        else if (endofRound == true && winner == true) {
            errorProcedure("isWinner")
        }
        else {
            errorProcedure("notEndofRound")
        }
    }
    // else if (elementValue === "Exhuasted") {
    //     exhuastedProcedure()
    // }
    else if (elementValue === "Declare Winner") {
        winnerProcedure()
    }
    else if (elementValue === "Hint") {
        hintProcedure(hintCode)
    }
    else if (elementValue === "Play Again") {
        window.location.reload()
    }
    else {
        //if statement to control for end of round
        if (endofRound == true) {
            errorProcedure("isEndOfRound")
            
        }
        else {
            scoreBallot(elementValue)
        };
    }
}

createBallots(candidates)
createBallotScoreSheet(ballotStack[ballotCounter])
createPlayerScore()
createTable(ballotStack[ballotCounter])
createScorecard(ballotStack[ballotCounter])

d3.selectAll("input").on("click", doSomething);

// fix it so it doesn't allow you to keep selecting at end of round, it must force you to take another action
// work on hint system -- are we good
// eliminate party column
// eliminate "choice"
// give total ballots
    // take away needed to win
// create number of hints in score card
// score this ballot needs to go away
// fix error when you click select winner at inappropriate time, then select a winner, then it doesn't let you go back to counting
// fix eliminated undefined error -- mostly fixed -- still pops up in certain circumstances
    // line 315 therebouts
    // with and element value ==
// should receive error if you keep voting after end of round
// when error no winner selected, cannot go back to counting





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


// function exhaustedProcedure() {

//     // this will need to be completely reworked

//     console.log("You have successfully clicked the skip button.")
    
//     i = 0
//     ballotStack[ballotCounter].forEach((cand) => {
//         if (cand[rounds[roundCounter]]==='x') {
//             cand_index = i
//             console.log(cand_index)
//         }
//         i++
//     });
//     if (scoreSheet[cand_index]['eliminated'] == true) {
//         console.log("Ballot is indeed exhausted")
//         var errorMessage = d3.select("#errorMessage");
//         errorMessage.html("")
//         errorMessage.html("Skipping Ballot!")

//         ballotCounter++
//         correctCounter++

//         if (ballotCounter == ballotStack.length) {
//             var errorMessage = d3.select("#errorMessage");
//             errorMessage.html("")
//             errorMessage.html("Ballot skipped. End of Round! Take appropriate action.")
//             roundCounter++
//             ballotCounter = 0
//             endofRound = true
//         }

//         createTable(ballotStack[ballotCounter])
//         createScorecard(ballotStack[ballotCounter])
//         createPlayerScore()
//     }
//     else {
//         errorProcedure("ballotNotExhausted")
//     };
//     d3.selectAll("input").on("click", doSomething);
// }