"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import wiki from "wikijs";
const socket_io_1 = __importDefault(require("socket.io"));
const wikitag_shared_1 = require("wikitag-shared");
const PlayerHandler_1 = __importDefault(require("./PlayerHandler"));
class GameServer {
    constructor(serverPort) {
        this.onConnection = (socket) => {
            console.log("GameServer: onConnection");
            const handler = new PlayerHandler_1.default(this, socket);
            this.playerHandlers.push(handler);
        };
        this.addPlayer = async (playerHandler) => {
            console.log("GameServer: adding player");
            this.game.players.push(playerHandler.getPlayer());
            switch (this.game.state) {
                case wikitag_shared_1.GameState.PlayingRound:
                    // TODO: actually get pages
                    const randomPage = "page " + Math.round(Math.random() * 100); // await wiki().random(this.game.players.length);
                    playerHandler.onGoToPage(randomPage);
                    this.io.emit(wikitag_shared_1.Event.GameState, this.game);
                    break;
                case wikitag_shared_1.GameState.WaitingToStartRound:
                    if (this.game.players.length >= this.game.minPlayers) {
                        this.startRound();
                    }
                    else {
                        this.io.emit(wikitag_shared_1.Event.GameState, this.game);
                    }
                    break;
                case wikitag_shared_1.GameState.RoundComplete:
                    this.io.emit(wikitag_shared_1.Event.GameState, this.game);
                    break;
            }
        };
        this.startRound = async () => {
            console.log("GameServer: starting round");
            // change state
            this.game.state = wikitag_shared_1.GameState.PlayingRound;
            // choose runner
            const currentRunner = this.game.players.findIndex((player) => player.isRunner);
            console.log("current = " + currentRunner);
            if (currentRunner == -1) {
                this.game.players[0].isRunner = true;
            }
            else {
                this.game.players[currentRunner].isRunner = false;
                this.game.players[currentRunner + (1 % this.game.players.length)].isRunner = true;
            }
            console.log(this.game);
            this.io.emit(wikitag_shared_1.Event.GameState, this.game);
            // select articles
            // TODO: actually get pages
            // const randomPages = await wiki().random(this.game.players.length);
            const randomPages = this.game.players.map((player, idx) => `page ${idx}`);
            randomPages.forEach((page, idx) => {
                this.playerHandlers[idx].onGoToPage(page);
            });
        };
        this.removePlayer = (playerHandler) => {
            console.log("GameServer: removing player " + playerHandler.getPlayer().name);
            const playerIndex = this.game.players.findIndex((player) => playerHandler.getPlayer().uid === player.uid);
            this.game.players.splice(playerIndex, 1);
            const handlerIndex = this.playerHandlers.indexOf(playerHandler);
            this.playerHandlers.splice(handlerIndex);
            this.io.emit(wikitag_shared_1.Event.GameState, this.game);
        };
        this.movePlayerToPage = (player, page) => {
            console.log("GameServer: " + player.name + " moving to page " + page);
            player.currentPage = page;
            this.io.emit(wikitag_shared_1.Event.GameState, this.game);
        };
        this.game = {
            state: wikitag_shared_1.GameState.WaitingToStartRound,
            players: [],
            minPlayers: 2,
        };
        this.playerHandlers = [];
        this.io = socket_io_1.default(serverPort);
        this.io.on("connection", this.onConnection);
    }
}
exports.default = GameServer;
//# sourceMappingURL=GameServer.js.map