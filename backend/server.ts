import { createServer } from 'http'
import app from './app';
import { registerSocketEvents } from "./sockets/socketManager";
import type { gameRoom } from "./models/models";
import { StopGame } from "./db/db";
import { Server } from 'socket.io';
import { generateShortId } from './util/util';


const PORT = 3000;

// Create HTTP server
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    
  }
});

registerSocketEvents(io);

// Rota para criar uma nova sala
app.post("/room", (req: any, res: any) => {
  console.log("Received request to create room with data:", req.body);

  const { categories } = req.body;

  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    console.log("Invalid categories provided:", categories);
    return res
      .status(400)
      .json({ error: "Categories are required and must be a non-empty array" });
  }

  const newRoom: gameRoom = {
    id: generateShortId(),
    letter: "",
    columns: categories,
    playersWithAnswers: new Map(),
    isStop: false,
    round:0
  };

  StopGame.push(newRoom);
  console.log("New room created:", newRoom);

  res.status(201).json({
    roomId: newRoom.id,
    categories: newRoom.columns,
  });
});


httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
