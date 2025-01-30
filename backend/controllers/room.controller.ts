import {log} from "console";
import {resultPerGameList, resultPerRound, StopGame} from "../db/db";
import {gameRoom, resultPerGame} from "../models/models";
import {calcResult, generateShortId} from "../util/util";

export const gameController = {
    createRoom: (req: any, res: any) => {
        console.log("Received request to create room with data:", req.body);

        const {categories} = req.body;

        if (!categories || !Array.isArray(categories) || categories.length === 0) {
            console.log("Invalid categories provided:", categories);
            return res.status(400).json({
                error: "Categories are required and must be a non-empty array",
            });
        }
        const ID = generateShortId()
        const newResult: resultPerGame = {
            gameId:ID,
            playersResults: new Map()
        }
        resultPerGameList.push(newResult)

        const newRoom: gameRoom = {
            id: ID,
            letter: "",
            columns: categories,
            playersWithAnswers: new Map(),
            isStop: false,
            round: 0,
        };

        StopGame.push(newRoom);
        console.log("New room created:", newRoom);

        res.status(201).json({
            roomId: newRoom.id,
            categories: newRoom.columns,
        });
    },
    getGameResult: (req: any, res: any) => {
        const gameId = req.params.gameId;
        const room = StopGame.find((room) => room.id === gameId);

        if (room) {
            const result = Array.from(room.playersWithAnswers).map(([playerId, answers]) => {
                const score = calcResult(gameId).get(playerId);
                return [playerId, ...answers, score];
            });

            res.status(200).json({
                status: 'success',
                data: result
            });
        } else {
            res.status(404).json({status: 'error', message: 'Game not found'});
        }
    },
    getFinalResult: (req: any, res: any) => {
        const gameId = req.params.gameId;
        const room = resultPerRound.find((room) => room.gameId === gameId);

        if (room) {
            const result = Array.from(room.playersWithAnswers).map(([playerId, answers]) => {
                const score = calcResult(gameId).get(playerId);
                return [playerId, ...answers, score];
            });

            res.status(200).json({
                status: 'success',
                data: result
            });
        } else {
            res.status(404).json({status: 'error', message: 'Game not found'});
        }
    }

};
