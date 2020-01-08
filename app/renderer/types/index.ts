import * as ConnectedReactRouter from 'connected-react-router';
import WeatherData from './Weather';
import AccountData from './Account';
import DiaryData, {TagData} from './Diary';
import NoteEditorStatus from './NoteEditor';

export interface RouterState {
  router: ConnectedReactRouter.RouterState;
}

export interface CounterState {
  count: number;
}

export interface AccountState {
  data: AccountData;
}

export interface DiaryState {
  tags: TagData[];
  diaries: DiaryData[];
  diaryCountTotal: number;
}

export interface StoreState {
  counter: CounterState;
  weather: WeatherState;
  account: AccountState;
  diary: DiaryState;
  noteEditor: NoteEditorStatus;
}

export interface WeatherState {
  weather: WeatherData | null;
  isFetching: boolean;
  fetchSuccess: boolean;
  errorInfo: string | null;
}
