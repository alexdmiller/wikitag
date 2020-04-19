export type Player = {
  uid: string;
  name: string;
};

export enum GameState {}

export type Room = {
  players: Player[];
};
