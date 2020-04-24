export declare type Player = {
    uid: string;
    name: string;
    currentPage?: string;
};
export declare enum Event {
    Connected = "Connected",
    GameState = "GameState",
    GameJoined = "GameJoined",
    WikiPageReceived = "WikiPageReceived"
}
export declare type Game = {
    players: Player[];
};
export declare type WikiPage = {
    content: string;
};
export declare enum Command {
    JoinGame = "JoinGame",
    LeaveGame = "LeaveGame",
    GoToPage = "GoToPage"
}
export declare type JoinGameCommand = {
    name: string;
};
export declare type GoToPageCommand = {
    page: string;
};
