import { resultPerRound, StopGame } from "../db/db";

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
    console.log(`Calculando resultados para o jogo ${gameId}`);
  
    const theGame = StopGame.find((room) => room.id === gameId);
    if (!theGame) {
      console.log(`Jogo ${gameId} não encontrado`);
      return new Map();
    }
  
    const rounds = resultPerRound.filter((r) => r.gameId === gameId);
    if (!rounds.length) {
      console.log(`Nenhuma rodada registrada para o jogo ${gameId}`);
      return new Map();
    }
  
    const players = new Set<string>();
    rounds.forEach((round) => {
      Array.from(round.playersWithAnswers.keys()).forEach((player) =>
        players.add(player)
      );
    });
  
    const results = new Map<string, number>();
    players.forEach((player) => results.set(player, 0));
  
    for (const round of rounds) {
      const currentLetter = round.letter.toLowerCase();
      const columnCount = theGame.columns.length;
  
      for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
        const answersMap = new Map<string, string>();
        const countMap = new Map<string, number>();
  
        round.playersWithAnswers.forEach((answers, player) => {
          const answer = answers[columnIndex]?.trim().toLowerCase();
          if (answer && answer.startsWith(currentLetter)) {
            answersMap.set(player, answer);
            countMap.set(answer, (countMap.get(answer) || 0) + 1);
          }
        });
  
        answersMap.forEach((answer, player) => {
          const count = countMap.get(answer) || 0;
          results.set(player, results.get(player)! + (count === 1 ? 10 : 5));
        });
      }
    }
  
    console.log(`Resultados calculados para o jogo ${gameId}:`, results);
    return results;
  };

  export const generateShortId =() => {
    return Math.random().toString(36).substring(2, 10);
  };