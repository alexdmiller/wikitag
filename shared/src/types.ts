export type Player = {
  uid: string;
  name: string;
};

export enum Command {
  JoinGame = "JoinGame",
  LeaveGame = "LeaveGame",
}

export enum Event {
  Connected = "Connected",
  GameState = "GameState",
  GameJoined = "GameJoined",
}

export type Game = {
  players: Player[];
};

export type JoinGameCommand = {
  name: string;
};
