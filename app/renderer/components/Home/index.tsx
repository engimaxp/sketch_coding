import React, { Component } from 'react';
import logo from './logo.svg';
import './home.css';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
interface OptionSelect {
    value: string;
    label: string;
}

const options: OptionSelect[] = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
];

export default class Home extends Component {

    state = {
        selectedOption: null,
    };

    async componentDidMount() {

    }

    handleChange = (selectedOption: OptionSelect) => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
    };

  render() {
      const { selectedOption } = this.state;
      return (
          <div className="App">
              <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <h1 className="App-title">Welcome to React</h1>
              </header>
              <p className="App-intro">
                  To get started, edit <code>renderer/containers/App.tsx</code> and save to reload.
              </p>
              <Button variant="contained" color="primary">
                  Hello , World Again
              </Button>
              <Select
                  value={selectedOption}
                  onChange={this.handleChange}
                  options={options}
              />
          </div>
    );
  }
}
