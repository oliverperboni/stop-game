import { StopGame } from "../db/db";
import { gameRoom } from "../models/models";
import { calcResult, generateShortId } from "../util/util";

export const gameController = {
  createRoom: (req: any, res: any) => {
    console.log("Received request to create room with data:", req.body);

    const { categories } = req.body;

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      console.log("Invalid categories provided:", categories);
      return res.status(400).json({
        error: "Categories are required and must be a non-empty array",
      });
    }

    const newRoom: gameRoom = {
      id: generateShortId(),
      letter: "",
      columns: categories,
      playersWithAnswers: new Map(),
      isStop: false,
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
      res.status(200).json(calcResult(gameId));
    } else {
      res.status(404).json("Not found");
    }
  },
};
