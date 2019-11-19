import { combineReducers } from 'redux';
import counter from './counter';
import weather from './weather';
import account from './account';
import noteEditor from './noteEditor';

const rootReducers = combineReducers({
  counter,
  weather,
  account,
  noteEditor
});

export default rootReducers;
