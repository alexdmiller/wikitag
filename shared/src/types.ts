// Shared Game Model

export type Game = {
  state: GameState;
  players: Player[];
  minPlayers: number;
};

export enum GameState {
  WaitingToStartRound = "WaitingToStartRound",
  PlayingRound = "PlayingRound",
  RoundComplete = "RoundComplete",
}

export type Player = {
  uid: string;
  name: string;
  currentPage?: string;
  points: number;
  isRunner: boolean;
};

// Events

export enum Event {
  Connected = "Connected",
  GameState = "GameState",
  GameJoined = "GameJoined",
  WikiPageReceived = "WikiPageReceived",
}

export type WikiPage = {
  content: string;
};

// Commands

export enum Command {
  JoinGame = "JoinGame",
  LeaveGame = "LeaveGame",
  GoToPage = "GoToPage",
}

export type JoinGameCommand = {
  name: string;
};

export type GoToPageCommand = {
  page: string;
};
