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
    this.props.socket.on(Event.GameState, this._onGameState);
    this.props.socket.on(Event.WikiPageReceived, this._onPageReceived);
  };

  componentWillUnmount = () => {
    this.props.socket.off("connect", this._onConnected);
    this.props.socket.off(Event.GameState, this._onGameState);
    this.props.socket.off(Event.WikiPageReceived, this._onPageReceived);
  };

  private _onConnected = () => {
    this.setState({
      clientState: ClientState.Connected,
    });
  };

  // private _onGameJoined = (game: Game) => {
  //   this.setState({
  //     clientState: ClientState.InGame,
  //     game,
  //   });

  //   // TODO: when is this initial page chosen? at the start of a new game?
  //   this._goToPage("math");
  // };

  private _onGameState = (game: Game) => {
    this.setState({
      clientState: ClientState.InGame,
      game,
    });
  };

  private _joinGame = (name: string) => {
    const command: JoinGameCommand = {
      name: name,
    };
    this.props.socket.emit(Command.JoinGame, command);
  };

  // TODO: what would ever call this? can you disconnect from the current rooom?
  private _disconnect = () => {};

  private _goToPage = async (page: string) => {
    const command: GoToPageCommand = {
      page: page,
    };
    this.props.socket.emit(Command.GoToPage, command);
  };

  private _onPageReceived = async (wikiPage: WikiPage) => {
    this.setState({ wikiHtml: wikiPage.content });
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
          <div>{JSON.stringify(this.state.game)}</div>
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
