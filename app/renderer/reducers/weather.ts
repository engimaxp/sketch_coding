import {WeatherState} from '../types';
import {weatherActions} from '../actions/weather';
import {FAIL_FETCH, START_FETCH, SUCCESS_FETCH} from '../actions/weather/action_type';

export const INITIAL_STATE: WeatherState = {
  weather: null,
  isFetching: false,
  fetchSuccess: false,
  errorInfo: null,
};

export default function weather(state: WeatherState = INITIAL_STATE, action: weatherActions): WeatherState {
  if (action.type === SUCCESS_FETCH) {
    return {
      weather: action.weather,
      isFetching: !action.callEnd,
      fetchSuccess: !action.fail,
      errorInfo: action.errorInfo
    };
  } else if (action.type === START_FETCH || action.type === FAIL_FETCH) {
    return {
      weather: state.weather,
      isFetching: !action.callEnd,
      fetchSuccess: !action.fail,
      errorInfo: action.errorInfo
    };
  }
  return state;
}
