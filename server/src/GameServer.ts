// import wiki from "wikijs";
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
    console.log("GameServer: onConnection");
    const handler = new PlayerHandler(this, socket);
    this.playerHandlers.push(handler);
  };

  public addPlayer = async (playerHandler: PlayerHandler) => {
    console.log("GameServer: adding player");
    this.game.players.push(playerHandler.getPlayer()!);

    switch (this.game.state) {
      case GameState.PlayingRound:
        // TODO: actually get pages
        const randomPage = "page " + Math.round(Math.random() * 100); // await wiki().random(this.game.players.length);
        playerHandler.onGoToPage(randomPage);

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
    console.log("GameServer: starting round");
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
    // TODO: actually get pages
    // const randomPages = await wiki().random(this.game.players.length);
    const randomPages = this.game.players.map((player, idx) => `page ${idx}`);
    randomPages.forEach((page, idx) => {
      this.playerHandlers[idx].onGoToPage(page);
    });
  };

  public removePlayer = (playerHandler: PlayerHandler) => {
    console.log(
      "GameServer: removing player " + playerHandler.getPlayer()!.name
    );
    const playerIndex = this.game.players.findIndex(
      (player) => playerHandler.getPlayer()!.uid === player.uid
    );

    this.game.players.splice(playerIndex, 1);

    const handlerIndex = this.playerHandlers.indexOf(playerHandler);
    this.playerHandlers.splice(handlerIndex);

    this.io.emit(Event.GameState, this.game);
  };

  public movePlayerToPage = (player: Player, page: string) => {
    console.log("GameServer: " + player.name + " moving to page " + page);
    player.currentPage = page;
    this.io.emit(Event.GameState, this.game);
  };
}
