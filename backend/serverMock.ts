type joinRoom = {
    roomId: string,
    playerName: string
  }
  type submitForm = {
    gameId: string,
    player: string
    awnsers: string[]
  }
  
  type gameRoom = {
    id: string,
    letter: string
    columns:string[]
    playersWithAnswers: Map<string, string[]>
  }
  
  const gameResult = Map<string, number>
  const StopGame: gameRoom[] = []
// Mock data setup
const mockGame: gameRoom = {
  id: "game123",
  letter: "P",
  columns: ["Nome", "Cidade", "Comida", "Objeto"], // categories
  playersWithAnswers: new Map([
    ["Player1", ["Paulo", "Paris", "Pizza", "Porta"]],           // all valid, some unique
    ["Player2", ["Pedro", "Paris", "Pipoca", "Panela"]],        // all valid, some repeated
    ["Player3", ["Maria", "Porto", "Macarrão", "Pilha"]]        // some invalid (don't start with P)
  ])
};

// Add mock game to the games array
StopGame.push(mockGame);
const calcResult = (gameId: string): Map<string, number> => {
    const theGame = StopGame.find((room) => room.id === gameId);
    if (!theGame) return new Map();
  
    const result = new Map<string, number>();
    
    for (const [playerName] of theGame.playersWithAnswers) {
      result.set(playerName, 0);
    }
    const columnAnswers = new Map<string, string>();
    theGame.columns.forEach((_, columnIndex) => {
      for (const [playerName, answers] of theGame.playersWithAnswers) {
        const answer = answers[columnIndex];
        if (answer) {
          columnAnswers.set(playerName, answer.toLowerCase());
        }
      }
  
      const answerCount = new Map<string, number>();
      for (const answer of columnAnswers.values()) {
        answerCount.set(answer, (answerCount.get(answer) || 0) + 1);
      }
  
      for (const [playerName, answer] of columnAnswers) {
        let points = 0;
        
        if (answer.toLowerCase().startsWith(theGame.letter.toLowerCase())) {
          const occurrences = answerCount.get(answer) || 0;
          points = occurrences === 1 ? 10 : 5;
        }
       
  
  
        const currentScore = result.get(playerName) || 0;
        result.set(playerName, currentScore + points);
      }
    });
  
    return result;
  }

  
// Test the calculation
const testScoring = () => {
  console.log("Starting Stop Game scoring test...\n");
  
  const results = calcResult("game123");
  
  console.log("Game Details:");
  console.log(`Letter: ${mockGame.letter}`);
  console.log("Categories:", mockGame.columns);
  console.log("\nPlayer Answers:");
  
  mockGame.playersWithAnswers.forEach((answers, player) => {
    console.log(`${player}:`, answers.join(", "));
  });
  
  console.log("\nFinal Scores:");
  results.forEach((score, player) => {
    console.log(`${player}: ${score} points`);
  });
  
  console.log("\nDetailed Scoring Explanation:");
  mockGame.columns.forEach((category, index) => {
    console.log(`\nCategory: ${category}`);
    mockGame.playersWithAnswers.forEach((answers, player) => {
      const answer = answers[index];
      let explanation = `${player} wrote "${answer}" - `;
      
      if (!answer.toLowerCase().startsWith(mockGame.letter.toLowerCase())) {
        explanation += "0 points (doesn't start with P)";
      } else {
        // Count how many players gave the same answer
        const sameAnswerCount = Array.from(mockGame.playersWithAnswers.values())
          .filter(playerAnswers => 
            playerAnswers[index].toLowerCase() === answer.toLowerCase()
          ).length;
        
        if (sameAnswerCount === 1) {
          explanation += "10 points (unique answer)";
        } else {
          explanation += "5 points (repeated answer)";
        }
      }
      
      console.log(explanation);
    });
  });
};

// Run the test
testScoring();