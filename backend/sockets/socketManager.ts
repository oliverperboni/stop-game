import { Server, Socket } from "socket.io";
import type { joinRoom, submitForm } from "../models/models";
import { StopGame, socketList } from "../db/db";
import { calcResult, generateGameLetter } from "../util/util";

export const registerSocketEvents = (io: Server): void => {
  io.on("connection", (socket) => {
    console.log("New socket connection:", socket.id);

    socket.on("join-room", (req: joinRoom) => {
      console.log(
        `Player ${req.playerName} attempting to join room ${req.roomId}`
      );
      const wsPlayerList= socketList.get(req.roomId)
      if(wsPlayerList){
        wsPlayerList.push({
          playerName: req.playerName,
          socketId: socket.id,
        });
      }else{
        socketList.set(req.roomId,[{
          playerName: req.playerName,
          socketId: socket.id,
        }])
      }

      console.log(
        "updated the following socket and player list",
        socketList.get(req.roomId)
      );

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
      console.log(StopGame);

      if (!roomFound) {
        console.log(`Room ${req.roomId} not found`);
      }

      socket.join(req.roomId);
    });

    socket.on("submit-awnser", (answers: submitForm) => {
      console.log(
        `Player ${answers.player} submitted answers for game ${answers.gameId}:`,
        answers.answers
      );

      let roomFound = false;

      StopGame.map((room) => {
        if (room.id === answers.gameId) {
          roomFound = true;
          room.playersWithAnswers.set(answers.player, answers.answers);
          console.log(
            `Answers updated for player ${answers.player} in room ${answers.gameId}`
          );
        }
      });

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
          room.isStop = !room.isStop;
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
      io.to(gameId).emit("game-finish", calcResult(gameId));
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
