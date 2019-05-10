import * as ConnectedReactRouter from 'connected-react-router';
import WeatherData from './Weather';

export interface RouterState {
  router: ConnectedReactRouter.RouterState;
}

export interface CounterState {
  count: number;
}

export interface StoreState {
  counter: CounterState;
  weather: WeatherState;
}

export interface WeatherState {
  weather: WeatherData | null;
  isFetching: boolean;
  fetchSuccess: boolean;
  errorInfo: string | null;
}
