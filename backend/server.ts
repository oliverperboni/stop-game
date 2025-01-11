import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

type joinRoom = {
  roomId: string;
  playerName: string;
};

type submitForm = {
  gameId: string;
  player: string;
  awnsers: string[];
};

type gameRoom = {
  id: string;
  letter: string;
  columns: string[];
  playersWithAnswers: Map<string, string[]>;
  isStop: boolean;
};

type CreateRoomRequest = {
  categories: string[];
};

const StopGame: gameRoom[] = [];

app.post("/create-room", (req: any, res: any) => {
  console.log("Received request to create room with data:", req.body);

  const { categories } = req.body;

  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    console.log("Invalid categories provided:", categories);
    return res
      .status(400)
      .json({ error: "Categories are required and must be a non-empty array" });
  }

  const newRoom: gameRoom = {
    id: uuidv4(),
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
});

io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);

  socket.on("join-room", (req: joinRoom) => {
    console.log(`Player ${req.playerName} attempting to join room ${req.roomId}`);

    let roomFound = false;

    StopGame.map((room) => {
      if (room.id === req.roomId) {
        roomFound = true;
        room.playersWithAnswers.set(req.playerName, []);
        console.log(`Player ${req.playerName} joined room ${req.roomId}`);
      }
    });

    if (!roomFound) {
      console.log(`Room ${req.roomId} not found`);
    }

    socket.join(req.roomId);
  });

  socket.on("submit-awnser", (answers: submitForm) => {
    console.log(`Player ${answers.player} submitted answers for game ${answers.gameId}:`, answers.awnsers);

    let roomFound = false;

    StopGame.map((room) => {
      if (room.id === answers.gameId) {
        roomFound = true;
        room.playersWithAnswers.set(answers.player, answers.awnsers);
        console.log(`Answers updated for player ${answers.player} in room ${answers.gameId}`);
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
        console.log(`Room ${gameId} updated:`, room);
      }
    });

    if (!roomFound) {
      console.log(`Room ${gameId} not found`);
    }
    io.to(gameId).on()
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
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const generateGameLetter = (): string => {
  const letters = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "L",
    "M", "N", "O", "P", "R", "S", "T", "U", "V",
  ];

  const randomIndex = Math.floor(Math.random() * letters.length);
  const letter = letters[randomIndex];
  console.log("Generated game letter:", letter);
  return letter;
};

const calcResult = (gameId: string): Map<string, number> => {
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

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
