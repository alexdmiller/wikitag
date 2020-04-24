import wiki from "wikijs";
// import express from "express";
import socketio from "socket.io";
import { Event, Game, Player, Command, JoinGameCommand } from "wikitag-shared";
import { GoToPageCommand, WikiPage, GameState } from "wikitag-shared/lib/types";

// const app = express();
// const port = 5000;

const game: Game = {
  state: GameState.Waiting,
  players: [],
};

const io = socketio(9999);

/*
TODO:
- GameState.Waiting:
  - when threshold has been reached, choose random pages and choose runner
- GameState.PreRound:
  - short count down before game begins
- GameState.RunnerFree:
  - if runner sends in page, transition to RunnerBlocked and start timer
  - if chaser lands on runner page, enter GameState.PreRound and start timer
- GameState.RunnerBlocked:
  - if timer goes off, transition to RunnerFree state

- when player joins game, they are put on a random wikipedia page
- when win condition is reached
  - point is awarded
  - new runner is selected
  - count down timer for next game
  - game start

- game:
  - states: runner_blocked, runner_free
  */

io.on("connection", (socket) => {
  socket.emit(Event.Connected);

  socket.on(Command.JoinGame, (command: JoinGameCommand) => {
    const player: Player = {
      name: command.name,
      uid: game.players.length + "",
    };
    game.players.push(player);

    if (game.state === GameState.Waiting) {
      if (game.players.length >= 2) {
        startNewRound();
      }
    } else {
      // TODO
    }

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
      const response = await getWikiPage(command.page);
      socket.emit(Event.WikiPageReceived, response);

      player.currentPage = command.page;
      io.emit(Event.GameState, game);
    });
  });
});

async function startNewRound() {
  const randomPages = await getRandomWikiPages(game.players.length);
  console.log(randomPages);
}

async function getWikiPage(pageName: string) {
  const page = await (wiki() as any).api({
    action: "parse",
    page: pageName,
  });
  const response: WikiPage = {
    content: page.parse.text["*"],
  };
  return response;
}

async function getRandomWikiPages(count: number) {
  const randomPages = await wiki().random(count);
  return randomPages;
}

// app.get("/:search", async (req, res) => {
//   const search = req.params.search;

// });

// io.app.listen(port, () =>
//   console.log(`Example app listening at http://localhost:${port}`)
// );
