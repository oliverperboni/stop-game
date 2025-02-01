import {resultPerGameList, resultPerRound, StopGame} from "../db/db";

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

const processedRounds = new Map<string, Set<number>>();
const resultPerGameMap = new Map<string, { playersResults: Map<string, number> }>();

export const calcResult = (gameId: string): Map<string, number> => {
    console.log(`Calculating results for game ${gameId}`);

    const theGame = StopGame.find((room) => room.id === gameId);
    if (!theGame) {
        console.log(`Game ${gameId} not found`);
        return new Map();
    }

    const currentRound = theGame.round;

    // Inicializa estruturas de controle
    let gameProcessedRounds = processedRounds.get(gameId) || new Set<number>();
    processedRounds.set(gameId, gameProcessedRounds);

    // Verifica se o round já foi processado
    if (gameProcessedRounds.has(currentRound)) {
        console.log(`Results for round ${currentRound} of game ${gameId} already calculated.`);
        return resultPerGameMap.get(gameId)?.playersResults || new Map();
    }

    // Atualiza estado do processamento
    gameProcessedRounds.add(currentRound);

    // Inicializa ou obtém resultados existentes
    let gameResults = resultPerGameMap.get(gameId);
    if (!gameResults) {
        gameResults = {
            playersResults: new Map(Array.from(theGame.playersWithAnswers.keys()).map(player => [player, 0]))
        };
        resultPerGameMap.set(gameId, gameResults);
    }

    const gameLetter = theGame.letter.toLowerCase();

    for (const [columnIndex] of theGame.columns.entries()) {
        const columnAnswers = new Map<string, string>();

        // Coleta respostas válidas
        for (const [playerName, answers] of theGame.playersWithAnswers) {
            const answer = answers[columnIndex]?.toLowerCase();
            if (answer?.startsWith(gameLetter)) {
                columnAnswers.set(playerName, answer);
            }
        }

        // Conta ocorrências das respostas
        const answerCount = new Map<string, number>();
        for (const answer of columnAnswers.values()) {
            answerCount.set(answer, (answerCount.get(answer) || 0) + 1);
        }

        // Atualiza pontuação
        for (const [playerName, answer] of columnAnswers) {
            const occurrences = answerCount.get(answer) || 0;
            const points = occurrences === 1 ? 10 : 5;

            // Mantém a pontuação acumulada
            const currentScore = gameResults.playersResults.get(playerName) || 0;
            gameResults.playersResults.set(playerName, currentScore + points);
        }
    }

    console.log('Resultado acumulado:', gameResults.playersResults);
    return new Map(gameResults.playersResults);
};

export const generateShortId = () => {
    return Math.random().toString(36).substring(2, 10);
};