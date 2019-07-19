import { combineReducers } from 'redux';
import counter from './counter';
import weather from './weather';
import account from './account';

const rootReducers = combineReducers({
  counter,
  weather,
  account
});

export default rootReducers;
