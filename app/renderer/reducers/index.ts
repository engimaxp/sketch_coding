import { combineReducers } from 'redux';
import counter from './counter';
import weather from './weather';
import account from './account';
import diary from './diary';
import noteEditor from './noteEditor';

const rootReducers = combineReducers({
  counter,
  weather,
  account,
  diary,
  noteEditor
});

export default rootReducers;
