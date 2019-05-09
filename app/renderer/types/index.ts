import * as ConnectedReactRouter from 'connected-react-router';

export interface RouterState {
  router: ConnectedReactRouter.RouterState;
}

export interface CounterState {
  count: number;
}

export interface StoreState {
  counter: CounterState;
}
