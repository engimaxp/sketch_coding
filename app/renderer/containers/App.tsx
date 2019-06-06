import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouterState } from '../types';
import Routes from '../routes';
import {Helmet} from 'react-helmet';
import {indexPage} from '../routes/routeMap';
import {Route} from 'react-router';

interface LocationProps {
    location: string;
}

class App extends Component<LocationProps, any> {

    render() {
        const {location} = this.props;
        let item: (JSX.Element | Array<JSX.Element | undefined>);
        if (true) {
            item = (<Route key={indexPage.key} path={indexPage.location}
                           render={() => <indexPage.containerElement />} exact/>);
        } else {
            item = (<Routes location={location}/>);
        }
        return (
            <div>
                <Helmet>
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"/>
                </Helmet>
                {item}
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
