import { io, Socket } from "socket.io-client";
import type { JoinRoom, SubmitForm } from "../types"


class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io("http://localhost:3000"); // Substitua pelo URL do seu backend

    this.socket.on("connect", () => {
      console.log("Conectado ao servidor", this.socket.id);
    });

    this.socket.on("disconnect", () => {
      console.log("Desconectado do servidor");
    });
  }

  // Emit event to join a room
  joinRoom(data: JoinRoom, callback: (columns: any) => void) {
    this.socket.emit("join-room", data);

    this.socket.on("joined-game", (columns) => {
      console.log(`Entrou na sala ${data.roomId} com colunas:`, columns);
      callback(columns);
    });
  }

  // Emit answers to the server
  submitAnswer(data: SubmitForm) {
    this.socket.emit("submit-answer", data);
    console.log(`Respostas enviadas para o jogo ${data.gameId}:`, data.answers);
  }

  // Start game
  play(gameId: string) {
    this.socket.emit("play", gameId);
    console.log(`Jogo iniciado na sala ${gameId}`);
  }

  // Stop the game
  stop(gameId: string, callback: (gameId: string, result: Map<string,number>) => void) {
    this.socket.emit("on-stop", gameId);

    this.socket.on("stoped", (id, result) => {
      console.log(`Jogo ${id} foi parado, resultados:`, result);
      callback(id, result);
    });
  }

  // Finish the game
  finishGame(gameId: string, callback: (result: any) => void) {
    this.socket.emit("game-finish", gameId);

    this.socket.on("game-finish", (result) => {
      console.log(`Jogo ${gameId} foi finalizado, resultados:`, result);
      callback(result);
    });
  }

  // Listen to events
  on(event: string, callback: (...args: any[]) => void) {
    this.socket.on(event, callback);
  }

  // Disconnect from the server
  disconnect() {
    this.socket.disconnect();
  }
}

const socketService = new SocketService();
export default socketService;
