import {WeatherState} from '../types';
import {weatherActions} from '../actions/weather';
import {SUCCESS_FETCH} from '../actions/weather/action_type';

export const INITIAL_STATE: WeatherState = {
  weather: null,
  isFetching: false,
  fetchSuccess: false,
  errorInfo: null,
};

export default function weather(state: WeatherState = INITIAL_STATE, action: weatherActions): WeatherState {
  return action.type === SUCCESS_FETCH ? {
    weather: action.weather,
    isFetching: !action.callEnd,
    fetchSuccess: !action.fail,
    errorInfo: action.errorInfo
  } : {
    weather: state.weather,
    isFetching: !action.callEnd,
    fetchSuccess: !action.fail,
    errorInfo: action.errorInfo
  };
}
