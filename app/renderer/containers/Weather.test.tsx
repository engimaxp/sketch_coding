import configureStore from 'redux-mock-store';
import thunk, {ThunkDispatch} from 'redux-thunk';
import {INITIAL_STATE} from '../reducers/weather';
import {AnyAction} from 'redux';
import sinon from 'sinon';
import nock from 'nock';
import {failFetch} from '../actions/weather';

const mockStore = configureStore([thunk]);

describe('Weather test', () => {

    afterEach(() => {
        nock.cleanAll();
        sinon.restore();
    });
    it('weather fetch async success', () => {

        const weatherAction = require('../actions/weather');
        // Initialize mockStore with empty state
        const store = mockStore(INITIAL_STATE);
        nock('https://www.tianqiapi.com')
            .get('/api/?version=v6&cityid=101020100').reply(200, {
            cityid: '101020100',
            date: '2019-05-09',
            week: '星期四',
            update_time: '13:25',
            city: '上海',
            cityEn: 'shanghai',
            country: '中国',
            countryEn: 'China',
            wea: '多云',
            wea_img: 'yun',
            tem: '26',
            win: '东北风',
            win_speed: '1级',
            win_meter: '小于12km/h',
            humidity: '26%',
            visibility: '18.2km',
            pressure: '1009',
            air: '105',
            air_pm25: '105',
            air_level: '轻度污染',
            air_tips: '儿童、老年人及心脏病、呼吸系统疾病患者应尽量减少体力消耗大的户外活动。',
            alarm: {
                alarm_type: '',
                alarm_level: '',
                alarm_content: ''
            }
        }, { 'Content-Type': 'application/json' });

        const callBack = sinon.spy();

        return (store.dispatch as ThunkDispatch<any, any, AnyAction>)(weatherAction
            .startFetchAsync(callBack, failFetch))
            .then(() => {
                // Dispatch the action
                sinon.assert.calledWith(callBack, {
                    city: '上海',
                    date: '2019-05-09',
                    week: '星期四',
                    weather: '多云',
                    temperature: '26',
                    humidity: '26%',
                    updateTime: '13:25'
                });
        });
    });
});
