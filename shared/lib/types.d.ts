export declare type Player = {
    uid: string;
    name: string;
};
export declare enum Command {
    JoinGame = "JoinGame",
    LeaveGame = "LeaveGame"
}
export declare enum Event {
    Connected = "Connected",
    GameState = "GameState",
    GameJoined = "GameJoined"
}
export declare type Game = {
    players: Player[];
};
export declare type JoinGameCommand = {
    name: string;
};
