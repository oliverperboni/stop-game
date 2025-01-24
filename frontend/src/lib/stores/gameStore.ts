// import { writable } from "svelte/store";

// export interface Player {
//   name: string;
//   score: number;
// }

// export interface GameStore {
//   roomId: string;
//   letter: string;
//   players: Player[];
//   currentRound: number;
//   categories: string[];
//   gameStatus: "waiting" | "in-progress" | "finished";
//   isStop: boolean;
// }

// const initialState: GameStore = {
//   roomId: "",
//   letter: "",
//   players: [],
//   currentRound: 0,
//   categories: [],
//   gameStatus: "waiting",
//   isStop: true,
// };

// export const gameStore = writable<GameStore>(initialState);
import { writable } from 'svelte/store';

type Player = {
  name: string;
  score: number;
};

type GameStore = {
  roomId: string;
  players: Player[];
  categories: string[];
  currentRound: number;
  letter: string;
  gameStatus: 'waiting' | 'in-progress' | 'finished';
  currentPlayer: string;
  alreadySubmit: boolean;

};

const initialState: GameStore = {
  roomId: '',
  players: [],
  categories: [],
  currentRound: 0,
  letter: '',
  gameStatus: 'waiting',
  currentPlayer: '',
  alreadySubmit: false,
};

export const gameStore = writable<GameStore>(initialState);