import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router';
import Home from '../components/Home';
import Counter from '../containers/counter';
import Weather from '../containers/weather';
import NavBar from '../components/NavBar';

export default function Routes() {
  return (
    <Fragment>
      <NavBar />
      <Switch>
        <Route path="/counter" component={Counter}></Route>
        <Route path="/weather" component={Weather}></Route>
        <Route path="/" component={Home}></Route>
      </Switch>
    </Fragment>
  );
}
