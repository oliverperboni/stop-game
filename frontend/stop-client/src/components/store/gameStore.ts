import { writable } from 'svelte/store';

export interface Player {
    name: string;
    score: number;
  }
  
  export interface GameState {
    players: Player[];
    currentRound: number;
    categories: string[];
    answers: Record<string, string>; // Map of player names to their answers
    gameStatus: 'waiting' | 'in-progress' | 'finished';
  }

  const initialState : GameState ={
    players: [],
    currentRound: 0,
    categories: [],
    answers: {},
    gameStatus: 'waiting'
  }
  
export const gameState = writable(initialState)