// import wiki from "wikijs";
import GameServer from "./GameServer";
import socketio from "socket.io";
import { Player, Command, Event } from "wikitag-shared";

export default class PlayerHandler {
  private server: GameServer;
  private socket: socketio.Socket;
  private player?: Player;

  constructor(server: GameServer, socket: socketio.Socket) {
    this.server = server;
    this.socket = socket;
    this.socket.on(Command.JoinGame, this.onJoinGame);
    this.socket.on(Command.LeaveGame, this.onLeaveGame);
    this.socket.on("disconnect", this.onLeaveGame);
    this.socket.on(Command.GoToPage, this.onGoToPage);
  }

  public getPlayer() {
    return this.player;
  }

  private onJoinGame = (name: string) => {
    console.log("playerHandler: " + name + " is joining game");
    this.player = {
      uid: this.socket.id,
      name: name,
      points: 0,
      isRunner: false,
    };
    this.socket.emit(Event.GameJoined);
    this.server.addPlayer(this);

    // TODO: if game is currently running, go to a random page
  };

  private onLeaveGame = () => {
    this.socket.off(Command.JoinGame, this.onJoinGame);
    this.socket.off(Command.LeaveGame, this.onLeaveGame);
    this.socket.off("disconnected", this.onLeaveGame);
    this.socket.off(Command.GoToPage, this.onGoToPage);

    this.server.removePlayer(this);
  };

  public onGoToPage = async (pageName: string) => {
    console.log(
      "playerHandler: " + this.player!.name + " is going to page " + pageName
    );

    // TODO: if player is runner, then start countdown timer

    // TODO: turn this back on
    // const page = await (wiki() as any).api({
    //   action: "parse",
    //   page: pageName,
    // });
    // const pageContent = page.parse.text["*"];

    this.socket.emit(Event.WikiPageReceived, "Hello");
    this.server.movePlayerToPage(this.player!, pageName);
  };
}
