import type {answersPerRound, gameRoom, resultPerGame, SocketPlayer} from "../models/models";

export const StopGame: gameRoom[] = [];

export const resultPerRound : answersPerRound[] = []
export const socketList : Map<string,SocketPlayer[]> = new Map()
export const  resultPerGameList : resultPerGame[] = []