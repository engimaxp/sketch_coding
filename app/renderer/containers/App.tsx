import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouterState } from '../types';
import Routes from '../routes';
import {Helmet} from 'react-helmet';

class App extends Component {
  render() {
    return (
        <div>
            <Helmet>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"/>
            </Helmet>
          <Routes></Routes>
        </div>
    );
  }
}

function mapStateToProps(state: RouterState) {
  return {
    location: state.router.location.pathname
  };
}

export default connect(mapStateToProps)(App);
