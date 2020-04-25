"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wikitag_shared_1 = require("wikitag-shared");
class BaseTransition {
    init(game) { }
    addPlayer(game, player) {
        game.players.push(player);
        return game.state;
    }
    removePlayer(game, player) {
        const index = game.players.indexOf(player);
        game.players.splice(index, 1);
        return game.state;
    }
    startGame(game) {
        return game.state;
    }
    movePlayerToPage(game, player, page) {
        return game.state;
    }
}
class WaitingToStartRound extends BaseTransition {
    addPlayer(game, player) {
        super.addPlayer(game, player);
        if (game.players.length > game.minPlayers) {
            return wikitag_shared_1.GameState.PlayingRound;
        }
        return game.state;
    }
}
exports.WaitingToStartRound = WaitingToStartRound;
class PlayingRound extends BaseTransition {
}
exports.PlayingRound = PlayingRound;
class RoundComplete extends BaseTransition {
}
exports.RoundComplete = RoundComplete;
exports.default = {
    [wikitag_shared_1.GameState.WaitingToStartRound]: new WaitingToStartRound(),
    [wikitag_shared_1.GameState.PlayingRound]: new PlayingRound(),
    [wikitag_shared_1.GameState.RoundComplete]: new RoundComplete(),
};
//# sourceMappingURL=StateTransitions.js.map