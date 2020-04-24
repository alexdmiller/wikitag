"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wikijs_1 = __importDefault(require("wikijs"));
// import express from "express";
const socket_io_1 = __importDefault(require("socket.io"));
const wikitag_shared_1 = require("wikitag-shared");
const types_1 = require("wikitag-shared/lib/types");
// const app = express();
// const port = 5000;
const game = {
    state: types_1.GameState.Waiting,
    players: [],
};
const io = socket_io_1.default(9999);
/*
TODO:

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
    socket.emit(wikitag_shared_1.Event.Connected);
    socket.on(wikitag_shared_1.Command.JoinGame, (command) => {
        const player = {
            name: command.name,
            uid: game.players.length + "",
        };
        game.players.push(player);
        if (game.state === types_1.GameState.Waiting) {
            if (game.players.length >= 2) {
                startNewRound();
            }
        }
        else {
            // TODO
        }
        const onLeaveGame = () => {
            // TODO: is there a native socket io way to listen for disconnection? do that.
            const index = game.players.indexOf(player);
            game.players.splice(index, 1);
            socket.disconnect();
            io.emit(wikitag_shared_1.Event.GameState, game);
        };
        socket.on(wikitag_shared_1.Command.LeaveGame, onLeaveGame);
        socket.on("disconnect", onLeaveGame);
        socket.on(wikitag_shared_1.Command.GoToPage, async (command) => {
            const response = await getWikiPage(command.page);
            socket.emit(wikitag_shared_1.Event.WikiPageReceived, response);
            player.currentPage = command.page;
            io.emit(wikitag_shared_1.Event.GameState, game);
        });
    });
});
async function startNewRound() {
    const randomPages = await getRandomWikiPages(game.players.length);
    console.log(randomPages);
}
async function getWikiPage(pageName) {
    const page = await wikijs_1.default().api({
        action: "parse",
        page: pageName,
    });
    const response = {
        content: page.parse.text["*"],
    };
    return response;
}
async function getRandomWikiPages(count) {
    const randomPages = await wikijs_1.default().random(count);
    return randomPages;
}
// app.get("/:search", async (req, res) => {
//   const search = req.params.search;
// });
// io.app.listen(port, () =>
//   console.log(`Example app listening at http://localhost:${port}`)
// );
//# sourceMappingURL=server.js.map