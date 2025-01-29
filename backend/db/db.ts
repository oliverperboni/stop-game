import type { answersPerRound, gameRoom, SocketPlayer } from "../models/models";

export const StopGame: gameRoom[] = [];

export const resultPerRound : answersPerRound[] = []
export const socketList : Map<string,SocketPlayer[]> = new Map()