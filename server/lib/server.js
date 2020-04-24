"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import wiki from "wikijs";
// import express from "express";
const socket_io_1 = __importDefault(require("socket.io"));
const wikitag_shared_1 = require("wikitag-shared");
// const app = express();
// const port = 5000;
const game = {
    players: [],
};
const io = socket_io_1.default(9999);
io.on("connection", (socket) => {
    console.log("new connection");
    socket.emit(wikitag_shared_1.Event.Connected);
    socket.on(wikitag_shared_1.Command.JoinGame, (command) => {
        const player = {
            name: command.name,
            uid: game.players.length + "",
        };
        game.players.push(player);
        io.emit(wikitag_shared_1.Event.GameState, game);
        const onLeaveGame = () => {
            // TODO: is there a native socket io way to listen for disconnection? do that.
            const index = game.players.indexOf(player);
            game.players.splice(index, 1);
            socket.disconnect();
            io.emit(wikitag_shared_1.Event.GameState, game);
        };
        socket.on(wikitag_shared_1.Command.LeaveGame, onLeaveGame);
        socket.on("disconnect", onLeaveGame);
    });
});
// app.get("/:search", async (req, res) => {
//   const search = req.params.search;
//   const page = await (wiki() as any).api({
//     action: "parse",
//     page: search,
//   });
//   res.set({
//     "Access-Control-Allow-Origin": "*",
//   });
//   res.send(page.parse.text["*"]);
// });
// io.app.listen(port, () =>
//   console.log(`Example app listening at http://localhost:${port}`)
// );
//# sourceMappingURL=server.js.map