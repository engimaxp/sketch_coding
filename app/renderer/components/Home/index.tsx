import React, { Component } from 'react';
import logo from './logo.svg';
import './home.css';
import Button from '@material-ui/core/Button';

export default class Home extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>renderer/containers/App.tsx</code> and save to reload.
        </p>
          <Button variant="contained" color="primary">
              Hello , World Again
          </Button>
      </div>
    );
  }
}
