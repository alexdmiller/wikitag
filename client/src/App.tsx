import React, { ChangeEvent } from "react";
import "./App.css";
// import WikipediaPageView from "./WikipediaPageView";
import { Event, Game, Command, JoinGameCommand } from "wikitag-shared";
import { ClientState } from "./clientState";
import NameInput from "./NameInput";
import WikipediaPageView from "./WikipediaPageView";
import { GoToPageCommand, WikiPage } from "wikitag-shared/lib/types";

interface Props {
  socket: SocketIOClient.Socket;
}

interface State {
  game?: Game;
  clientState: ClientState;
  wikiHtml: string;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      clientState: ClientState.NotConnected,
      wikiHtml: "",
    };
  }

  componentDidMount = () => {
    console.log(this.props.socket.connected);
    this.props.socket.on("connect", this._onConnected);
    this.props.socket.on(Event.GameJoined, this._onGameJoined);
    this.props.socket.on(Event.GameState, this._onGameState);
    this.props.socket.on(Event.WikiPageReceived, this._onPageReceived);
  };

  componentWillUnmount = () => {
    this.props.socket.off("connect", this._onConnected);
    this.props.socket.off(Event.GameJoined, this._onGameJoined);
    this.props.socket.off(Event.GameState, this._onGameState);
    this.props.socket.off(Event.WikiPageReceived, this._onPageReceived);
  };

  private _onConnected = () => {
    this.setState({
      clientState: ClientState.Connected,
    });
  };

  private _onGameJoined = (game: Game) => {
    console.log("Game joined!");
    this.setState({
      clientState: ClientState.InGame,
    });
  };

  private _onGameState = (game: Game) => {
    this.setState({
      game,
    });
  };

  private _joinGame = (name: string) => {
    this.props.socket.emit(Command.JoinGame, name);
  };

  // TODO: what would ever call this? can you disconnect from the current rooom?
  private _disconnect = () => {};

  private _goToPage = async (page: string) => {
    const command: GoToPageCommand = {
      page: page,
    };
    this.props.socket.emit(Command.GoToPage, command);
  };

  private _onPageReceived = async (wikiPage: string) => {
    this.setState({ wikiHtml: wikiPage });
  };

  /*
      const response = await socket
    const wikiHtml = await response.text();
    this.setState({
      wikiHtml,
    });
*/

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

  private _onWikiClick = (page: string) => {
    this.setState({ wikiHtml: "" });
    this._goToPage(page);
  };

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
          <div>
            <pre>{JSON.stringify(this.state.game, null, 2)}</pre>
          </div>
        )}

        <WikipediaPageView
          wikiHtml={this.state.wikiHtml}
          onWikiClick={this._onWikiClick}
        />
      </div>
    );
  }
}

export default App;
