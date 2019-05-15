import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouterState } from '../types';
import Routes from '../routes';
import {Helmet} from 'react-helmet';

interface LocationProps {
    location: string;
}

class App extends Component<LocationProps, any> {

    render() {
        const {location} = this.props;
        return (
            <div>
                <Helmet>
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"/>
                </Helmet>
                <Routes location={location}/>
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
