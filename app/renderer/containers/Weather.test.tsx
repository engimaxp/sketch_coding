import configureStore from 'redux-mock-store';
import thunk, {ThunkDispatch} from 'redux-thunk';
import {startFetchAsync, SuccessFetch} from '../actions/weather';
import {INITIAL_STATE} from '../reducers/weather';
import {AnyAction} from 'redux';
import sinon , {SinonFakeServer} from 'sinon';
import {SUCCESS_FETCH} from '../actions/weather/action_type';

const mockStore = configureStore([thunk]);

let server: SinonFakeServer;

describe('Weather test', () => {
    beforeEach(() => {
        server = sinon.fakeServer.create();
    });

    afterEach(() => {
        server.restore();
    });
    it('weather fetch async success', () => {
        // Initialize mockStore with empty state
        const store = mockStore(INITIAL_STATE);
        server.respondWith('GET',
            'https://www.tianqiapi.com/api/?version=v6&cityid=101020100',
            [200, { 'Content-Type': 'application/json' },
                '{\n' +
                '    "cityid": "101020100",\n' +
                '    "date": "2019-05-09",\n' +
                '    "week": "星期四",\n' +
                '    "update_time": "13:25",\n' +
                '    "city": "上海",\n' +
                '    "cityEn": "shanghai",\n' +
                '    "country": "中国",\n' +
                '    "countryEn": "China",\n' +
                '    "wea": "多云",\n' +
                '    "wea_img": "yun",\n' +
                '    "tem": "26",\n' +
                '    "win": "东北风",\n' +
                '    "win_speed": "1级",\n' +
                '    "win_meter": "小于12km/h",\n' +
                '    "humidity": "26%",\n' +
                '    "visibility": "18.2km",\n' +
                '    "pressure": "1009",\n' +
                '    "air": "105",\n' +
                '    "air_pm25": "105",\n' +
                '    "air_level": "轻度污染",\n' +
                '    "air_tips": "儿童、老年人及心脏病、呼吸系统疾病患者应尽量减少体力消耗大的户外活动。",\n' +
                '    "alarm": {\n' +
                '        "alarm_type": "",\n' +
                '        "alarm_level": "",\n' +
                '        "alarm_content": ""\n' +
                '    }\n' +
                '}']);

        // Dispatch the action
        return (store.dispatch as ThunkDispatch<any, any, AnyAction>)(startFetchAsync()).then(() => {

            // Test if your store dispatched the expected actions
            const actions = store.getActions();
            const expectedPayload: SuccessFetch = {
                type: SUCCESS_FETCH,
                weather: {
                    city: '上海',
                    date: '2019-05-09',
                    week: '星期四',
                    weather: '多云',
                    temperature: '26',
                    humidity: '26%',
                    updateTime: '13:25'
                },
                fail: false,
                callEnd: true,
                errorInfo: null
            };
            expect(actions).toEqual([expectedPayload]);
        });

    });
});
