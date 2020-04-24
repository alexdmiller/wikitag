import wiki from "wikijs";
// import express from "express";
import socketio from "socket.io";
import { Event, Game, Player, Command, JoinGameCommand } from "wikitag-shared";
import { GoToPageCommand, WikiPage } from "wikitag-shared/lib/types";

// const app = express();
// const port = 5000;

const game: Game = {
  players: [],
};

const io = socketio(9999);

io.on("connection", (socket) => {
  console.log("new connection");
  socket.emit(Event.Connected);

  socket.on(Command.JoinGame, (command: JoinGameCommand) => {
    const player: Player = {
      name: command.name,
      uid: game.players.length + "",
    };
    game.players.push(player);

    socket.emit(Event.GameJoined, game);
    io.emit(Event.GameState, game);

    const onLeaveGame = () => {
      // TODO: is there a native socket io way to listen for disconnection? do that.
      const index = game.players.indexOf(player);
      game.players.splice(index, 1);
      socket.disconnect();

      io.emit(Event.GameState, game);
    };

    socket.on(Command.LeaveGame, onLeaveGame);
    socket.on("disconnect", onLeaveGame);

    socket.on(Command.GoToPage, async (command: GoToPageCommand) => {
      const page = await (wiki() as any).api({
        action: "parse",
        page: command.page,
      });
      const response: WikiPage = {
        content: page.parse.text["*"],
      };
      socket.emit(Event.WikiPageReceived, response);

      player.currentPage = command.page;
      io.emit(Event.GameState, game);
    });
  });
});

// app.get("/:search", async (req, res) => {
//   const search = req.params.search;

// });

// io.app.listen(port, () =>
//   console.log(`Example app listening at http://localhost:${port}`)
// );
