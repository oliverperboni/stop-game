import type { gameRoom, SocketPlayer } from "../models/models";

export const StopGame: gameRoom[] = [];

export const socketList : Map<string,SocketPlayer[]> = new Map()