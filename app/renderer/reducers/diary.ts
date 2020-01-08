import {diaryActions} from '../actions/diary';
import {ADD_NEW_DIARY, INITIAL_DIARY_LIST, REFRESH_DIARY, UPDATE_DIARY} from '../actions/diary/action_type';
import {DiaryState} from '../types';

export const INITIAL_STATE: DiaryState = {
  diaries: [],
  tags: [],
  diaryCountTotal: 0
};

export default function account(state: DiaryState = INITIAL_STATE, action: diaryActions): DiaryState {
  if (action.type === INITIAL_DIARY_LIST) {
    return {
      diaries: action.diaries ? action.diaries : [],
      tags: action.tags ? action.tags : [],
      diaryCountTotal: action.diaryCountTotal,
    };
  } else if (action.type === ADD_NEW_DIARY) {
    return {
      diaries: [action.newDiary, ... state.diaries],
      tags: action.tags,
      diaryCountTotal: state.diaryCountTotal + 1,
    };
  } else if (action.type === UPDATE_DIARY) {
    const originDiary = state.diaries.find(x => x.id === action.updatedDiaryId);
    if (!!originDiary) {
      originDiary.title = action.updatedDiaryTitle;
    }
    return {
      diaries: [... state.diaries],
      tags: state.tags,
      diaryCountTotal: state.diaryCountTotal,
    };
  } else if (action.type === REFRESH_DIARY) {
    if (action.diaries.length === 0) {
      return state;
    }
    return {
      diaries: [...action.diaries],
      tags: state.tags,
      diaryCountTotal: action.diaryCountTotal,
    };
  } else {
    return state;
  }
}
