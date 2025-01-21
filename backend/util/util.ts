import { StopGame } from "../db/db";

export const generateGameLetter = (): string => {
    const letters = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "L",
      "M",
      "N",
      "O",
      "P",
      "R",
      "S",
      "T",
      "U",
      "V",
    ];
  
    const randomIndex = Math.floor(Math.random() * letters.length);
    const letter = letters[randomIndex];
    console.log("Generated game letter:", letter);
    return letter;
  };
  
  // Calcular resultado
 export const calcResult = (gameId: string): Map<string, number> => {
    console.log(`Calculating results for game ${gameId}`);
  
    const theGame = StopGame.find((room) => room.id === gameId);
    if (!theGame) {
      console.log(`Game ${gameId} not found`);
      return new Map();
    }
  
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
  
    console.log(`Results calculated for game ${gameId}:`, result);
    return result;
  };
  

  export const generateShortId =() => {
    return Math.random().toString(36).substring(2, 10);
  };