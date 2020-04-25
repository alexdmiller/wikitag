"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wikijs_1 = __importDefault(require("wikijs"));
const wikitag_shared_1 = require("wikitag-shared");
class PlayerHandler {
    constructor(server, socket) {
        this.onJoinGame = (name) => {
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
        this.onLeaveGame = () => {
            this.server.removePlayer(this.player);
        };
        this.onGoToPage = async (pageName) => {
            // TODO: if player is runner, then start countdown timer
            const page = await wikijs_1.default().api({
                action: "parse",
                page: pageName,
            });
            const pageContent = page.parse.text["*"];
            this.socket.send(wikitag_shared_1.Event.WikiPageReceived, pageContent);
            this.server.movePlayerToPage(this.player, page);
        };
        this.server = server;
        this.socket = socket;
        this.socket.on(wikitag_shared_1.Command.JoinGame, this.onJoinGame);
        this.socket.on(wikitag_shared_1.Command.LeaveGame, this.onLeaveGame);
        this.socket.on("disconnected", this.onLeaveGame);
        this.socket.on(wikitag_shared_1.Command.GoToPage, this.onGoToPage);
    }
}
exports.default = PlayerHandler;
//# sourceMappingURL=PlayerHandler.js.map