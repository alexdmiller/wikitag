import React, { ChangeEvent } from "react";
import "./App.css";
// import WikipediaPageView from "./WikipediaPageView";
import { Event, Game, Command, JoinGameCommand } from "wikitag-shared";
import { ClientState } from "./clientState";
import NameInput from "./NameInput";

interface Props {
  socket: SocketIOClient.Socket;
}

interface State {
  game?: Game;
  clientState: ClientState;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      clientState: ClientState.NotConnected,
    };
  }

  componentDidMount = () => {
    this.props.socket.on(Event.Connected, this._onConnected);
    this.props.socket.on(Event.GameState, this._onGameState);
  };

  componentWillUnmount = () => {
    this.props.socket.off(Event.Connected, this._onConnected);
    this.props.socket.off(Event.GameState, this._onGameState);
  };

  private _onConnected = () => {
    this.setState({
      clientState: ClientState.Connected,
    });
  };

  private _onGameState = (game: Game) => {
    this.setState({
      clientState: ClientState.InGame,
      game,
    });
  };

  _joinGame = (name: string) => {
    const command: JoinGameCommand = {
      name: name,
    };
    this.props.socket.emit(Command.JoinGame, command);
  };

  _disconnect = () => {};

  // fetchPage = async (page: string) => {
  //   const response = await fetch(
  //     `http://localhost:5000/${this.state.searchTerm}`
  //   );
  //   const wikiHtml = await response.text();
  //   this.setState({
  //     wikiHtml,
  //   });
  // };

  // onKeyPress = async (event: { key: string }) => {
  //   if (event.key === "Enter") {
  //     await this.fetchPage(this.state.searchTerm);
  //   }
  // };

  // onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   this.setState({
  //     searchTerm: event.target.value,
  //   });
  // };

  // onWikiClick = (page: string) => {
  //   this.setState({ searchTerm: page, wikiHtml: "" });
  //   this.fetchPage(page);
  // };

  render() {
    return (
      <div className="App">
        {this.state.clientState === ClientState.NotConnected && (
          <div>Connecting...</div>
        )}

        {this.state.clientState === ClientState.Connected && (
          <NameInput onAccept={this._joinGame} />
        )}

        {this.state.clientState === ClientState.InGame && (
          <div>{JSON.stringify(this.state.game)}</div>
        )}

        {/* <input
          type="text"
          onChange={this.onChange}
          value={this.state.searchTerm}
          onKeyPress={this.onKeyPress}
        />
        <WikipediaPageView
          wikiHtml={this.state.wikiHtml}
          onWikiClick={this.onWikiClick}
        /> */}
      </div>
    );
  }
}

export default App;
