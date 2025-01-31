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

export const calcResult = (gameId: string): Map<string, number> => {
    console.log(`Calculating results for game ${gameId}`);

    const theGame = StopGame.find((room) => room.id === gameId);
    if (!theGame) {
        console.log(`Game ${gameId} not found`);
        return new Map();
    }

    const currentRound = theGame.round;

    if (!processedRounds.has(gameId)) {
        processedRounds.set(gameId, new Set());
    }
    if (processedRounds.get(gameId)?.has(currentRound)) {
        console.log(`Results for round ${currentRound} of game ${gameId} already calculated.`);
        let plau = resultPerGameList.find((curr) => curr.gameId === gameId)?.playersResults || new Map()
        console.log('SEGUNDA VEZ A CALCULAR AS CEN AS',plau)
        return plau;
    }

    processedRounds.get(gameId)?.add(currentRound); // Marca o round como processado

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

            if (answer.toLowerCase().startsWith(theGame.letter.toLowerCase()) && answer.length > 1) {
                const occurrences = answerCount.get(answer) || 0;
                points = occurrences === 1 ? 10 : 5;
            }

            const resultToUpdate = resultPerGameList.find((curr) => curr.gameId === gameId);
            let currentScore = 0;

            if (resultToUpdate) {
                const nextScore = resultToUpdate.playersResults.get(playerName);
                currentScore = nextScore || 0;
            }

            resultPerGameList.forEach((curr) => {
                if (curr.gameId === gameId) {
                    curr.playersResults.set(playerName, currentScore + points);
                }
            });

            result.set(playerName, points);
        }
    });
    const realResults = resultPerGameList.find((curr) => curr.gameId === gameId);
    console.log('THE REAL RESULT IS',realResults);
    console.log(`Results calculated for round ${currentRound} in game ${gameId}:`, result);
    return realResults!.playersResults;
};



export const generateShortId = () => {
    return Math.random().toString(36).substring(2, 10);
};