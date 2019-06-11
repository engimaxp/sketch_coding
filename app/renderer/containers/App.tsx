import React, { Component } from 'react';
import Routes from '../routes';
import {Helmet} from 'react-helmet';
import {indexPage} from '../routes/routeMap';
import {Switch , Route} from 'react-router';
import noMatch from './nomatch';

class App extends Component {

    render() {
        return (
            <div>
                <Helmet>
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"/>
                </Helmet>
                <Switch>
                    <Route path={indexPage.location}
                           render={() => <indexPage.containerElement />} exact/>
                    <Route path={'/main/:param1'} component={Routes} />
                    <Route component={noMatch}/>
                </Switch>
            </div>
        );
  }
}

export default App;
