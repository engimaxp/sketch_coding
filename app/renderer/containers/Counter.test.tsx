// import * as React from 'react';
// import Counter from './counter';
// import { INITIAL_STATE } from '../reducers/counter';
// import {configureStore} from '../store';
// import { shallow , mount } from 'enzyme';
//
// const store = configureStore();
//
// describe('Counter test', () => {
//     it('Initial counter is 1', () => {
//         const wrapper = shallow(<Counter  store={store}/>);
//         expect(wrapper.prop('count')).toEqual(INITIAL_STATE.count);
//     });
//     it('increment act properly', () => {
//         const wrapper = mount(<Counter  store={store}/>);
//         const startCount = store.getState().counter.count;
//         wrapper.find('.increment').simulate('click');
//         expect(store.getState().counter.count).toEqual(startCount + 1);
//     });
//     it('decrement act properly', () => {
//         const wrapper = mount(<Counter  store={store}/>);
//         const startCount = store.getState().counter.count;
//         wrapper.find('.decrement').simulate('click');
//         expect(store.getState().counter.count).toEqual(startCount - 1);
//     });
// });
