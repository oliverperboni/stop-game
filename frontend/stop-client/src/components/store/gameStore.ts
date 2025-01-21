import { writable } from 'svelte/store';

export interface Player {
    name: string;
    score: number;
  }
  
  export interface GameState {
    roomId: string;
    letter: string;
    players: Player[];
    currentRound: number;
    categories: string[];
    gameStatus: 'waiting' | 'in-progress' | 'finished';
    isStop: boolean
  }

  const initialState : GameState ={
    roomId:'',
    letter: '',
    players: [],
    currentRound: 0,
    categories: [],
    gameStatus: 'waiting',
    isStop: true,
  }
  
export const gameState = writable(initialState)