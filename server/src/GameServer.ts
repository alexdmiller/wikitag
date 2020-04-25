import socketio from "socket.io";
import { Player, Game, GameState, Event } from "wikitag-shared";
import PlayerHandler from "./PlayerHandler";

export default class GameServer {
  private game: Game;
  private playerHandlers: PlayerHandler[];
  private io: socketio.Server;

  constructor(serverPort: number) {
    this.game = {
      state: GameState.WaitingToStartRound,
      players: [],
      minPlayers: 2,
    };
    this.playerHandlers = [];
    this.io = socketio(serverPort);
    this.io.on("connection", this.onConnection);
  }

  private onConnection = (socket: socketio.Socket) => {
    const handler = new PlayerHandler(this, socket);
    this.playerHandlers.push(handler);
  };

  public addPlayer = (player: Player) => {
    // TODO: if we're currently playing, then give player a random wiki page
    this.game.players.push(player);
    this.io.emit(Event.GameState, this.game);
  };

  public removePlayer = (player: Player) => {
    const index = this.game.players.indexOf(player);
    this.game.players.splice(index, 1);
    this.io.emit(Event.GameState, this.game);
  };

  public movePlayerToPage = (player: Player, page: string) => {
    // TODO: only move player if we're in a play state
    player.currentPage = page;
    this.io.emit(Event.GameState, this.game);
  };
}
