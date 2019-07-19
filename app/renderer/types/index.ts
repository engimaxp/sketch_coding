import * as ConnectedReactRouter from 'connected-react-router';
import WeatherData from './Weather';
import AccountData from './Account';

export interface RouterState {
  router: ConnectedReactRouter.RouterState;
}

export interface CounterState {
  count: number;
}
export interface AccountState {
  data: AccountData;
}

export interface StoreState {
  counter: CounterState;
  weather: WeatherState;
  account: AccountState;
}

export interface WeatherState {
  weather: WeatherData | null;
  isFetching: boolean;
  fetchSuccess: boolean;
  errorInfo: string | null;
}
