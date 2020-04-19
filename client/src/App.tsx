import React, { ChangeEvent } from "react";
import "./App.css";
import WikipediaPageView from "./WikipediaPageView";

interface State {
  searchTerm: string;
  wikiHtml: string;
}

class App extends React.Component<{}, State> {
  state: State = {
    searchTerm: "math",
    wikiHtml: "",
  };

  componentDidMount = () => {
    this.fetchPage(this.state.searchTerm);
  };

  fetchPage = async (page: string) => {
    const response = await fetch(
      `http://localhost:5000/${this.state.searchTerm}`
    );
    const wikiHtml = await response.text();
    this.setState({
      wikiHtml,
    });
  };

  onKeyPress = async (event: { key: string }) => {
    if (event.key === "Enter") {
      await this.fetchPage(this.state.searchTerm);
    }
  };

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      searchTerm: event.target.value,
    });
  };

  onWikiClick = (page: string) => {
    this.setState({ searchTerm: page, wikiHtml: "" });
    this.fetchPage(page);
  };

  render() {
    return (
      <div className="App">
        <input
          type="text"
          onChange={this.onChange}
          value={this.state.searchTerm}
          onKeyPress={this.onKeyPress}
        />
        <WikipediaPageView
          wikiHtml={this.state.wikiHtml}
          onWikiClick={this.onWikiClick}
        />
      </div>
    );
  }
}

export default App;
