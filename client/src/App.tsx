import React, { useState, ChangeEvent, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import WikipediaPageView from "./WikipediaPageView";

interface State {
  searchTerm: string;
  wikiHtml: string;
}

class App extends React.Component<{}, State> {
  state: State = {
    searchTerm: "",
    wikiHtml: "",
  };

  onKeyPress = async (event: { key: string }) => {
    if (event.key === "Enter") {
      const response = await fetch(
        `http://localhost:5000/${this.state.searchTerm}`
      );
      const wikiHtml = await response.text();
      this.setState({
        wikiHtml,
      });
    }
  };

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      searchTerm: event.target.value,
    });
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
        <WikipediaPageView wikiHtml={this.state.wikiHtml} />
      </div>
    );
  }
}

export default App;
