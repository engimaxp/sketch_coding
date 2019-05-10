import { combineReducers } from 'redux';
import counter from './counter';
import weather from './weather';

const rootReducers = combineReducers({
  counter,
  weather
});

export default rootReducers;
