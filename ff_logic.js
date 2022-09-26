
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
        Fish: ["Tuna", "Marlin", "Sturgeon", "Guppy", "Mackerel", "Piranha", "Shark"]
    }
]



var ballotCand = []
var ballotParty = []
ballotStack = {}



function createBallot(candidates)
{
    let avail_candidates = candidates
    //console.log(avail_candidates)
    ballot = []
    for (i = 0; i < 5; i++)
    {
        party = Object.keys(avail_candidates[i])[0];

        candidate = (Object.values(avail_candidates[i])[0][(Math.floor(Math.random() * (avail_candidates.length)))]);

        
        //delete chosen candidate from avail_candidates once we have multiple candidates same party

        console.log(candidate + " - " + party);

        ballot.push({candidate : candidate, party : party, first: 0, second: 0, third: 0, fourth: 0, fifth: 0})
    }
    console.log(ballot)
    return ballot
}



function createBallotStack(ballot) {
    console.log("This function doesn't do anything yet. . . . . .or does it?")
    
    ballotStack = []
    noBallots = 3

    for (i = 0; i < noBallots; i++) 
    {
        possibilities = 
    [
        [1,0,0,0,0],
        [0,1,0,0,0],
        [0,0,1,0,0],
        [0,0,0,1,0],
        [0,0,0,0,1]
    ];
        ballotVotes = shuffle(possibilities)
        console.log(ballotVotes)
        //console.log(ballot)
        for (j = 0; j < 5; j++) {
            ballot[j].first = possibilities[j][0];
            ballot[j].second = possibilities[j][1];
            ballot[j].third = possibilities[j][2];
            ballot[j].fourth = possibilities[j][3];
            ballot[j].fifth = possibilities[j][4];
        }
        console.log(ballot);
    }
    //console.log(ballotStack)
    return ballotStack
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
    var tbody = d3.select("tbody");
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

createBallot(candidates)
createBallotStack(ballot)
createTable(ballot)

// [
//     {first: 1, second: 0, third: 0, fourth: 0, fifth: 0},
//     {first: 0, second: 1, third: 0, fourth: 0, fifth: 0},
//     {first: 0, second: 0, third: 1, fourth: 0, fifth: 0},
//     {first: 0, second: 0, third: 0, fourth: 1, fifth: 0},
//     {first: 0, second: 0, third: 0, fourth: 0, fifth: 1}
// ];