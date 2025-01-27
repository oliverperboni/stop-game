export type joinRoom = {
  roomId: string;
  playerName: string;
};

export type submitForm = {
  gameId: string;
  player: string;
  answers: string[];
};

export type gameRoom = {
  id: string;
  letter: string;
  columns: string[];
  playersWithAnswers: Map<string, string[]>;
  isStop: boolean;
  round: number
};

export type answersPerRound = {
  gameId : string;
  round: number;
  letter: string
  playersWithAnswers: Map<string, string[]>;
  
}

export interface JoinRoom {
  playerName: string;
  roomId: string;
}

export interface SubmitForm {
  player: string;
  gameId: string;
  answers: string[];
}

export type SocketPlayer = {
  playerName: string,
  socketId: string
}
