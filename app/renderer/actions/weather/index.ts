import { START_FETCH, SUCCESS_FETCH, FAIL_FETCH } from './action_type';
import WeatherData from '../../types/Weather';
import * as superAgent from 'superagent';
import { Dispatch } from 'redux';
export type weatherActions = StartFetch | SuccessFetch | FailFetch ;
interface BaseFetch {
  fail: boolean;
  callEnd: boolean;
  errorInfo: string | null;
  weather: WeatherData | null;
}

interface StartFetch extends BaseFetch {
  type: START_FETCH;
}
interface SuccessFetch extends BaseFetch {
  type: SUCCESS_FETCH;
}
interface FailFetch extends BaseFetch {
  type: FAIL_FETCH;
}

export const startFetchAsync  = () =>
    (dispatch: Dispatch<weatherActions>): void => {
        dispatch(startFetch());
        superAgent.get('https://www.tianqiapi.com/api/?version=v6&cityid=101020100')
            .then((value => {
                const weather: any = JSON.parse(value.text);
                const newWeatherData: WeatherData = {
                    date: weather.date,
                    week: weather.week,
                    updateTime: weather.update_time,
                    city: weather.city,
                    weather: weather.wea,
                    temperature: weather.tem,
                    humidity: weather.humidity,
                };
                dispatch(successFetch(newWeatherData));
            }))
            .catch(error => {
                dispatch(failFetch(error.message));
            });
    };

const startFetch: () => weatherActions = () => ({
    type: START_FETCH,
    fail: false,
    callEnd: false,
    errorInfo: null,
    weather: null
});

const successFetch: (newWeatherData: WeatherData) => weatherActions =
    (newWeatherData: WeatherData) => ({
        type: SUCCESS_FETCH,
        weather: newWeatherData,
        fail: false,
        callEnd: true,
        errorInfo: null
    });

const failFetch: (error: string) => weatherActions =
    (error: string) => ({
        type: FAIL_FETCH,
        fail: true,
        callEnd: true,
        errorInfo: error,
        weather: null,
    });
