import { Game, Player, GameState } from "wikitag-shared";

class BaseTransition {
  public init(game: Game) {}

  public addPlayer(game: Game, player: Player): GameState {
    game.players.push(player);
    return game.state;
  }

  public removePlayer(game: Game, player: Player): GameState {
    const index = game.players.indexOf(player);
    game.players.splice(index, 1);
    return game.state;
  }

  public startGame(game: Game): GameState {
    return game.state;
  }

  public movePlayerToPage(game: Game, player: Player, page: string): GameState {
    return game.state;
  }
}

export class WaitingToStartRound extends BaseTransition {
  public addPlayer(game: Game, player: Player): GameState {
    super.addPlayer(game, player);

    if (game.players.length > game.minPlayers) {
      return GameState.PlayingRound;
    }

    return game.state;
  }
}

export class PlayingRound extends BaseTransition {}
export class RoundComplete extends BaseTransition {}

export default {
  [GameState.WaitingToStartRound]: new WaitingToStartRound(),
  [GameState.PlayingRound]: new PlayingRound(),
  [GameState.RoundComplete]: new RoundComplete(),
};
