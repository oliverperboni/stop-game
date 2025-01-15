export type joinRoom = {
  roomId: string;
  playerName: string;
};

export type submitForm = {
  gameId: string;
  player: string;
  awnsers: string[];
};

export type gameRoom = {
  id: string;
  letter: string;
  columns: string[];
  playersWithAnswers: Map<string, string[]>;
  isStop: boolean;
};
