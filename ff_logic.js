
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

var ballotCand = []
var ballotParty = []
var ballotStack = {}
var noBallots = 25
var ballotCounter = 0

function createBallot(candidates)
{
    let avail_candidates = candidates
    //console.log(avail_candidates)
    ballot = []
    for (i = 0; i < 5; i++)
    {
        party = Object.keys(avail_candidates[i])[0];

        candidate = (Object.values(avail_candidates[i])[0][(Math.floor(Math.random() * (avail_candidates[i][party].length)))]);

        
        //delete chosen candidate from avail_candidates once we have multiple candidates same party

        //console.log(candidate + " - " + party);

        ballot.push({candidate : candidate, party : party, first: 0, second: 0, third: 0, fourth: 0, fifth: 0})
    }
    //console.log(ballot)
    return ballot
}

function createBallotVotes(ballot) {

    possibilities = 
    [
        ["x",0,0,0,0],
        [0,"x",0,0,0],
        [0,0,"x",0,0],
        [0,0,0,"x",0],
        [0,0,0,0,"x"]
    ];
   
    ballotVotes = possibilities.sort(() => Math.random() - 0.5)
        //console.log(ballotVotes)
        //console.log(ballot)
    for (j = 0; j < 5; j++) {
        ballot[j].first = ballotVotes[j][0];
        ballot[j].second = ballotVotes[j][1];
        ballot[j].third = ballotVotes[j][2];
        ballot[j].fourth = ballotVotes[j][3];
        ballot[j].fifth = ballotVotes[j][4];
        }
    
    //console.log(ballotStack)
    return ballot
};

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
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
        cell.text("Votes:")
    }
    
    let row4 = scoreBody.append("tr");
    //create votes needed to win
    for (i = 0; i < remain_cand; i++) {
        let cell = row4.append("td")
        cell.text("Needed to win")
    }
    
};

function scoreBallot() {
    let changedElement = d3.select(this);
    let elementValue = changedElement.property("value");
    console.log(ballot[elementValue]['candidate']);

    ballotCounter++
    createBallotVotes(ballot)
    createTable(ballot)
    createScorecard(ballot)
    d3.selectAll("input").on("click", scoreBallot);
}

createBallot(candidates)
createBallotVotes(ballot)
createTable(ballot)
createScorecard(ballot)

d3.selectAll("input").on("click", scoreBallot);


// function createBallotStack(ballot) {
    
//     ballotStack = []
//     possibilities = 
//     [
//         ["x",0,0,0,0],
//         [0,"x",0,0,0],
//         [0,0,"x",0,0],
//         [0,0,0,"x",0],
//         [0,0,0,0,"x"]
//     ];
//     for (i = 0; i < noBallots; i++) 
//     {
//         ballotVotes = possibilities.sort(() => Math.random() - 0.5)
//         //console.log(ballotVotes)
//         //console.log(ballot)
//         for (j = 0; j < 5; j++) {
//             ballot[j].first = ballotVotes[j][0];
//             ballot[j].second = ballotVotes[j][1];
//             ballot[j].third = ballotVotes[j][2];
//             ballot[j].fourth = ballotVotes[j][3];
//             ballot[j].fifth = ballotVotes[j][4];
//         }
//         ballotStack.push(ballot)
//     }
//     //console.log(ballotStack)
//     return ballotStack
// };

// function runElection(ballotStack)
// {
//     for (i = 0; i < noBallots; i++) 
//     {
//         createTable(ballotStack[i])
//         createScorecard(ballotStack[i])
//     }
// }