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
    this.player = {
      uid: this.socket.id,
      name: name,
      points: 0,
      isRunner: false,
    };
    this.socket.emit(Event.GameJoined);
    this.server.addPlayer(this);
    // TODO: just always get a random page?
    //   const randomPages = await wiki().random(count);
  };

  private onLeaveGame = () => {
    this.socket.off(Command.JoinGame, this.onJoinGame);
    this.socket.off(Command.LeaveGame, this.onLeaveGame);
    this.socket.off("disconnected", this.onLeaveGame);
    this.socket.off(Command.GoToPage, this.onGoToPage);

    this.server.removePlayer(this);
  };

  public onGoToPage = async (pageName: string) => {
    console.log("player " + this.player?.uid + " going to page " + pageName);

    // TODO: if player is runner, then start countdown timer
    // const page = await (wiki() as any).api({
    //   action: "parse",
    //   page: pageName,
    // });
    // const pageContent = page.parse.text["*"];

    this.socket.send(Event.WikiPageReceived, "Hello");
    this.server.movePlayerToPage(this.player!, pageName);
  };
}
