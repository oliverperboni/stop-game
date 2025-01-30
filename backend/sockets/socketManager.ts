import {Server, Socket} from "socket.io";
import type {answersPerRound, joinRoom, submitForm} from "../models/models";
import {StopGame, resultPerRound, socketList, resultPerGameList} from "../db/db";
import {calcResult, generateGameLetter} from "../util/util";

export const registerSocketEvents = (io: Server): void => {
    io.on("connection", (socket) => {
        console.log("New socket connection:", socket.id);

        socket.on("join-room", (req: joinRoom) => {
            console.log(
                `Player ${req.playerName} attempting to join room ${req.roomId}`
            );
            const wsPlayerList = socketList.get(req.roomId)
            if (wsPlayerList) {
                wsPlayerList.push({
                    playerName: req.playerName,
                    socketId: socket.id,
                });
            } else {
                socketList.set(req.roomId, [{
                    playerName: req.playerName,
                    socketId: socket.id,
                }])
            }

            let roomFound = false;

            StopGame.map((room) => {
                if (room.id === req.roomId) {
                    roomFound = true;
                    room.playersWithAnswers.set(req.playerName, []);
                    socket.emit("joined-game", room.columns);
                    console.log(`Player ${req.playerName} joined room ${req.roomId}`);
                    console.log(room);
                }
            });
            if (!roomFound) {
                console.log(`Room ${req.roomId} not found`);
            }

            socket.join(req.roomId);
        });

        socket.on("submit-answer", (answers: submitForm) => {
            console.log(
                `Player ${answers.player} submitted answers for game ${answers.gameId}:`,
                answers.answers
            );
            let roomFound = false;
            let currentRound = -1;
            let currentLetter = ""

            StopGame.map((room) => {
                if (room.id === answers.gameId) {
                    currentRound = room.round;
                    currentLetter = room.letter
                    roomFound = true;
                    room.round = currentRound + 1;
                    room.playersWithAnswers.set(answers.player, answers.answers);
                    console.log(
                        `Answers updated for player ${answers.player} in room ${answers.gameId}`
                    );
                }
            });
            resultPerGameList.map((curr) => {
                if(curr.gameId === answers.gameId){
                    curr.playersResults.set(answers.player,curr.playersResults.get(answers.player) || 0 );
                }
            })

            // Verifica se já existe um resultado para a rodada atual
            const result = resultPerRound.find((current) => current.gameId === answers.gameId);


            // Se não existir, cria um novo registro para o jogo
            const newResult: answersPerRound = {
                gameId: answers.gameId,
                round: currentRound,
                letter: currentLetter,
                playersWithAnswers: new Map([[answers.player, answers.answers]]),
            };
            resultPerRound.push(newResult);
            console.log(`---------------------Results calculated for game ${answers.gameId}:`, resultPerRound,"---------------------");


            // Notifica os outros jogadores na sala
            socketList.get(answers.gameId)?.forEach((socketPlayer) => {
                if (socketPlayer.playerName !== answers.player) {
                    io.to(socketPlayer.socketId).emit("end-round", answers.gameId);
                }
            });

            if (!roomFound) {
                console.log(`Room ${answers.gameId} not found`);
            }
        });


        socket.on("play", (gameId: string) => {
            console.log(`Game play triggered for room ${gameId}`);

            let roomFound = false;

            StopGame.map((room) => {
                if (room.id === gameId) {
                    roomFound = true;
                    room.letter = generateGameLetter();
                    // room.isStop = !room.isStop;
                    room.round = room.round++
                    io.to(gameId).emit("started", room.letter, gameId);
                    console.log(`Room ${gameId} updated:`, room);
                }
            });

            if (!roomFound) {
                console.log(`Room ${gameId} not found`);
            }
        });

        socket.on("on-stop", (gameId: string) => {
            console.log(`Stop triggered for room ${gameId}`);

            let roomFound = false;

            StopGame.map((room) => {
                if (room.id === gameId) {
                    roomFound = true;
                    room.isStop = true;
                    console.log(`Room ${gameId} stopped`);
                }
            });

            if (!roomFound) {
                console.log(`Room ${gameId} not found`);
            }

            console.log(`Room ${gameId} stopped and emit the stop`);
            io.to(gameId).emit("stoped", gameId, calcResult(gameId));
        });

        socket.on("game-finish", (gameId) => {
            console.log(`Room ${gameId} ended the game`);
            io.to(gameId).emit("game-finish", Object.entries(calcResult(gameId)));
        });

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
