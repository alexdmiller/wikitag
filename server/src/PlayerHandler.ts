import wiki from "wikijs";
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
    this.socket.on("disconnected", this.onLeaveGame);
    this.socket.on(Command.GoToPage, this.onGoToPage);
  }

  private onJoinGame = (name: string) => {
    this.player = {
      uid: this.socket.id,
      name: name,
      points: 0,
      isRunner: false,
    };
    this.server.addPlayer(this.player);
    // TODO: just always get a random page?
    //   const randomPages = await wiki().random(count);
  };

  private onLeaveGame = () => {
    this.server.removePlayer(this.player!);
  };

  private onGoToPage = async (pageName: string) => {
    // TODO: if player is runner, then start countdown timer
    const page = await (wiki() as any).api({
      action: "parse",
      page: pageName,
    });
    const pageContent = page.parse.text["*"];
    this.socket.send(Event.WikiPageReceived, pageContent);
    this.server.movePlayerToPage(this.player!, page);
  };
}
