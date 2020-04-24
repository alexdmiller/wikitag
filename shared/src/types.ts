export type Player = {
  uid: string;
  name: string;
  currentPage?: string;
};

// Events

export enum Event {
  Connected = "Connected",
  GameState = "GameState",
  GameJoined = "GameJoined",
  WikiPageReceived = "WikiPageReceived",
}

export enum GameState {
  Waiting = "Waiting",
  RunnerFree = "RunnerFree",
  RunnerBlocked = "RunnerBlocked",
}
export type Game = {
  state: GameState;
  players: Player[];
};

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
