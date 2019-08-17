import React from "react";
import PropTypes from "prop-types";
import {Action, LoadingElement, Tabs, onEnterPressed, } from "elv-components-js";
import {InitializeClient, InitializePkClient} from "../Utils";

// const el = (
// <h1>
//   <Link to={this.props.myroute} onClick={this.route()}>
//   Developer Sample
//   </Link>
// </h1>
// );

class Configuration extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      error: false,
      client: undefined,
      showPrivateKey: true,
      showBootstrap: true,
      success: false,
      /* configuration settings */
      versionHash: "",
      privateKey: "",
      bootstrapUrl: EluvioConfiguration["config-url"],
      fabricUrl: "",
      ethereumUrl: "",
      space: "",
    };
  }

  async componentDidMount(){

  }

  async Load(){
    const options = {
      fabric: this.state.fabricUrl,
      ethereum: this.state.ethereumUrl,
      space: this.state.space
    };
    /* perform the proper check for private key/bootstrap
      private key could be set,
    */
    //mnemonic and bootstrap
    if(this.state.showPrivateKey===false && this.state.showBootstrap===true){
      InitializeClient(this.state.bootstrapUrl).then(client =>
      {this.setState({client: client});
      });
      this.props.callback(client);
    }
    //menomic and custom config
    else if(this.state.showPrivateKey===false && this.state.showBootstrap===false){
      InitializeClient(this.state.bootstrapUrl).then(client =>
      {this.setState({client: client});
      });
      this.props.callback(client);
    }
    else if(this.state.privateKey !="" && this.state.showBootstrap===true){
      InitializePkClient(this.state.bootstrapUrl, this.state.privateKey, options).then(client =>
      {this.setState({client: client});
      });
      this.props.callback(client);
    }
    //private key and custom config
    else if(this.state.privateKey !="" && this.state.showBootstrap===false){
      InitializePkClient(this.state.bootstrapUrl, this.state.privateKey, options).then(client =>
      {this.setState({client: client});
      });
      this.props.callback(client);
    }
    else{
      // console.log("something not set right");
    }

    /* create callback to pass client back up to parent element */

  }

  CreateAccount(){
    const options = [
      ["private key", true],
      ["mnemonic", false],
    ];

    const input = (
      <input
        className={`configuration ${this.state.showPrivateKey ? "hidden" : ""}`}
        type="text"
        placeholder="Private Key"
        value={this.state.privateKey}
        onChange={(event) => this.setState({privateKey: event.target.value})}
        onKeyPress={onEnterPressed(() => this.Load())}
      />
    );

    return (
      <div>
        <Tabs
          options={options}
          selected={this.state.showPrivateKey}
          onChange={(value) => this.setState({showPrivateKey: value})}
          className="secondary"
        />

        <input
          className={`configuration ${this.state.showPrivateKey ? "" : "hidden"}`}
          type="text"
          placeholder="Private Key"
          value={this.state.privateKey}
          onChange={(event) => this.setState({privateKey: event.target.value})}
          onKeyPress={onEnterPressed(() => this.Load())}
        />
      </div>
    );
  }

  BuildClient(){

    const configurableOptions = [
      ["Bootstrap URL", true],
      ["Custom Config", false]
    ];

    const bootstrap = (
      <div
        className={`configuration ${this.state.showBootstrap ? "" : "hidden"}`}>
        <label>
        Bootstrap URL:
        </label>
        <input
          type="text"
          placeholder=""
          value={this.state.bootstrapUrl}
          onChange={(event) => this.setState({bootstrapUrl: event.target.value})}
          onKeyPress={onEnterPressed(() => this.Load())}
        />
      </div>
    );

    const customConfig = (
      <div className = {`configuration ${this.state.showBootstrap ? "hidden" : ""}`}>
        <label>
          Fabric URL:
        </label>
        <input
          className=""
          name='fabricUrl'
          type="text"
          value={this.state.fabricUrl}
          onChange={(event) => this.setState({fabricUrl: event.target.value})}
        />

        <label>
          Ethereum URL:
        </label>
        <input
          name='ethereumUrl'
          type="text"
          value={this.state.ethereumUrl}
          onChange={(event) => this.setState({ethereumUrl: event.target.value})}
        />

        <label>
          Space:
        </label>
        <input
          name='space'
          type="text"
          value={this.state.space}
          onChange={(event) => this.setState({space: event.target.value})}
        />
      </div>
    );

    return(
      <div className ="selection-container">
        <Tabs
          options={configurableOptions}
          selected = {this.state.showBootstrap}
          onChange={(value) => this.setState({showBootstrap: value})}
          className="secondary"
        />

        <React.Fragment>
          {customConfig}
          {bootstrap}
        </React.Fragment>

      </div>
    );
  }

  ConfigurationSelection(){
    return (
      <div className="control-block">
        <h2>
          Client Configuration
        </h2>
        <div className ="selection-container">
          {this.CreateAccount()}
          {this.BuildClient()}
        </div>

        <Action onClick={() => this.Load()}>
          Load Configuration
        </Action>
      </div>
    );
  }

  ErrorMessage() {
    if(!this.state.error) { return null; }

    return (
      <div className="error-message">
        {this.state.error.message}
      </div>
    );
  }

  render(){

    return(
      <div className = "configuration-container">
        <LoadingElement loading={this.state.loading && !this.state.error} fullPage={true}>
          {this.ConfigurationSelection()}
          { this.ErrorMessage() }
        </LoadingElement>
      </div>
    );
  }
}

Configuration.propTypes = {
  callback: PropTypes.func.isRequired,
};


export default Configuration;
