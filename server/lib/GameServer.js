"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const wikitag_shared_1 = require("wikitag-shared");
const PlayerHandler_1 = __importDefault(require("./PlayerHandler"));
class GameServer {
    constructor(serverPort) {
        this.onConnection = (socket) => {
            const handler = new PlayerHandler_1.default(this, socket);
            this.playerHandlers.push(handler);
        };
        this.addPlayer = (player) => {
            // TODO: if we're currently playing, then give player a random wiki page
            this.game.players.push(player);
            this.io.emit(wikitag_shared_1.Event.GameState, this.game);
        };
        this.removePlayer = (player) => {
            const index = this.game.players.indexOf(player);
            this.game.players.splice(index, 1);
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