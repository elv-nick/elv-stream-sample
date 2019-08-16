import "./static/stylesheets/app.scss";
import "./static/stylesheets/dev.scss";

import React from "react";
import {render} from "react-dom";
import {IconLink, ImageIcon, LoadingElement} from "elv-components-js";
import Controls from "./components/Controls";
import Configuration from "./components/Developer.js";
import {InitializeClient} from "./Utils";

import Logo from "./static/images/Logo.png";
import GithubIcon from "./static/icons/github.svg";
import Tabs from "elv-components-js/src/components/Tabs";

class App extends React.Component {
  constructor(props) {
    super(props);

    /* change this later */
    this.state = {
      client: undefined,
      version: 0,
      showConfiguration: false,
    };
  }

  async componentDidMount() {
    if(this.state.client) { return; }

    this.setState({
      client: await InitializeClient()
    });
  }

  FabricUrlSelection() {
    if(!this.state.client) { return; }

    const options = this.state.client.HttpClient.uris.map((uri, i) => [uri, i]);

    return (
      <Tabs
        className="vertical-tabs secondary"
        selected={this.state.client.HttpClient.uriIndex}
        options={options}
        onChange={i => {
          this.state.client.HttpClient.uriIndex = i;
          this.setState({version: this.state.version + 1});
        }}
      />
    );
  }

  ConfigurationSection() {
    // if(this.state.error) { return null; }

    const toggleButton = (
      <div
        onClick={() => this.setState({showConfiguration: !this.state.showConfiguration})}
        className="toggle-controls"
      >
        {this.state.showConfiguration ? "▼ Hide Dev Tools" : "▲ Show Dev Tools"}
      </div>
    );

    return (
      <React.Fragment>
        { toggleButton }
        <div className={`configuration ${this.state.showConfiguration ? "" : "hidden"}`}>
          <Configuration />
        </div>
      </React.Fragment>
    );
  }

  SourceLink() {
    const sourceUrl = "https://github.com/eluv-io/stream-sample";
    return (
      <a className="source-link" href={sourceUrl} target="_blank">
        <ImageIcon className="github-icon" icon={GithubIcon} />
        Source available on GitHub
      </a>
    );
  }

  App() {
    if(!this.state.client) {
      return <LoadingElement loading={true} fullPage={true}/>;
    }

    return (
      <Controls key={this.state.version} client={this.state.client}/>
    );
  }

  render() {
    return (
      <div className="app-container">
        <header>
          <IconLink href="https://eluv.io" className="logo" icon={Logo} label="Eluvio"/>
          <h1>
            Video Test
          </h1>
        </header>
        <main>
          <div className="controls-container">
            { this.ConfigurationSection() }
          </div>
          { this.App() }
          <div className="advanced-options">
            { this.FabricUrlSelection() }
          </div>
        </main>
        <footer>
          { this.SourceLink() }
        </footer>
      </div>
    );
  }
}

render(
  <App />,
  document.getElementById("app")
);
