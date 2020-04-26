"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wikijs_1 = __importDefault(require("wikijs"));
const socket_io_1 = __importDefault(require("socket.io"));
const wikitag_shared_1 = require("wikitag-shared");
const PlayerHandler_1 = __importDefault(require("./PlayerHandler"));
class GameServer {
    constructor(serverPort) {
        this.onConnection = (socket) => {
            const handler = new PlayerHandler_1.default(this, socket);
            this.playerHandlers.push(handler);
        };
        this.addPlayer = async (playerHandler) => {
            this.game.players.push(playerHandler.getPlayer());
            switch (this.game.state) {
                case wikitag_shared_1.GameState.PlayingRound:
                    const randomPage = await wikijs_1.default().random(this.game.players.length);
                    playerHandler.onGoToPage(randomPage[0]);
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
            // change state
            this.game.state = wikitag_shared_1.GameState.PlayingRound;
            // choose runner
            const currentRunner = this.game.players.findIndex((player) => player.isRunner);
            if (currentRunner == -1) {
                this.game.players[0].isRunner = true;
            }
            else {
                this.game.players[currentRunner].isRunner = false;
                this.game.players[currentRunner + (1 % this.game.players.length)].isRunner = true;
            }
            this.io.emit(wikitag_shared_1.Event.GameState, this.game);
            // select articles
            const randomPages = await wikijs_1.default().random(this.game.players.length);
            randomPages.forEach((page, idx) => {
                this.playerHandlers[idx].onGoToPage(page);
            });
        };
        this.removePlayer = (playerHandler) => {
            const playerIndex = this.game.players.indexOf(playerHandler.getPlayer());
            this.game.players = this.game.players.splice(playerIndex, 1);
            const handlerIndex = this.playerHandlers.indexOf(playerHandler);
            this.playerHandlers = this.playerHandlers.splice(handlerIndex);
            this.io.emit(wikitag_shared_1.Event.GameState, this.game);
        };
        this.movePlayerToPage = (player, page) => {
            // TODO: only move player if we're in a play state
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