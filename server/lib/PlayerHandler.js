"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            this.socket.emit(wikitag_shared_1.Event.GameJoined);
            this.server.addPlayer(this);
            // TODO: just always get a random page?
            //   const randomPages = await wiki().random(count);
        };
        this.onLeaveGame = () => {
            this.socket.off(wikitag_shared_1.Command.JoinGame, this.onJoinGame);
            this.socket.off(wikitag_shared_1.Command.LeaveGame, this.onLeaveGame);
            this.socket.off("disconnected", this.onLeaveGame);
            this.socket.off(wikitag_shared_1.Command.GoToPage, this.onGoToPage);
            this.server.removePlayer(this);
        };
        this.onGoToPage = async (pageName) => {
            var _a;
            console.log("player " + ((_a = this.player) === null || _a === void 0 ? void 0 : _a.uid) + " going to page " + pageName);
            // TODO: if player is runner, then start countdown timer
            // const page = await (wiki() as any).api({
            //   action: "parse",
            //   page: pageName,
            // });
            // const pageContent = page.parse.text["*"];
            this.socket.send(wikitag_shared_1.Event.WikiPageReceived, "Hello");
            this.server.movePlayerToPage(this.player, pageName);
        };
        this.server = server;
        this.socket = socket;
        this.socket.on(wikitag_shared_1.Command.JoinGame, this.onJoinGame);
        this.socket.on(wikitag_shared_1.Command.LeaveGame, this.onLeaveGame);
        this.socket.on("disconnect", this.onLeaveGame);
        this.socket.on(wikitag_shared_1.Command.GoToPage, this.onGoToPage);
    }
    getPlayer() {
        return this.player;
    }
}
exports.default = PlayerHandler;
//# sourceMappingURL=PlayerHandler.js.map