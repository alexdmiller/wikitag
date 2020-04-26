import wiki from "wikijs";
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

  public addPlayer = async (playerHandler: PlayerHandler) => {
    this.game.players.push(playerHandler.getPlayer()!);

    switch (this.game.state) {
      case GameState.PlayingRound:
        const randomPage = await wiki().random(this.game.players.length);
        playerHandler.onGoToPage(randomPage[0]);

        this.io.emit(Event.GameState, this.game);
        break;
      case GameState.WaitingToStartRound:
        if (this.game.players.length >= this.game.minPlayers) {
          this.startRound();
        } else {
          this.io.emit(Event.GameState, this.game);
        }
        break;
      case GameState.RoundComplete:
        this.io.emit(Event.GameState, this.game);
        break;
    }
  };

  public startRound = async () => {
    // change state
    this.game.state = GameState.PlayingRound;

    // choose runner
    const currentRunner = this.game.players.findIndex(
      (player) => player.isRunner
    );
    if (currentRunner == -1) {
      this.game.players[0].isRunner = true;
    } else {
      this.game.players[currentRunner].isRunner = false;
      this.game.players[
        currentRunner + (1 % this.game.players.length)
      ].isRunner = true;
    }

    this.io.emit(Event.GameState, this.game);

    // select articles
    const randomPages = await wiki().random(this.game.players.length);
    randomPages.forEach((page, idx) => {
      this.playerHandlers[idx].onGoToPage(page);
    });
  };

  public removePlayer = (playerHandler: PlayerHandler) => {
    const playerIndex = this.game.players.indexOf(playerHandler.getPlayer()!);
    this.game.players = this.game.players.splice(playerIndex, 1);

    const handlerIndex = this.playerHandlers.indexOf(playerHandler);
    this.playerHandlers = this.playerHandlers.splice(handlerIndex);

    this.io.emit(Event.GameState, this.game);
  };

  public movePlayerToPage = (player: Player, page: string) => {
    // TODO: TypeError: Cannot set property 'currentPage' of undefined
    player.currentPage = page;
    this.io.emit(Event.GameState, this.game);
  };
}
