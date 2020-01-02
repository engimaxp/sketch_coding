import {diaryActions} from '../actions/diary';
import {ADD_NEW_DIARY, INITIAL_DIARY_LIST, REFRESH_DIARY, UPDATE_DIARY} from '../actions/diary/action_type';
import {DiaryState} from '../types';

export const INITIAL_STATE: DiaryState = {
  diaries: [],
  tags: []
};

export default function account(state: DiaryState = INITIAL_STATE, action: diaryActions): DiaryState {
  if (action.type === INITIAL_DIARY_LIST) {
    return {
      diaries: action.diaries ? action.diaries : [],
      tags: action.tags ? action.tags : []
    };
  } else if (action.type === ADD_NEW_DIARY) {
    return {
      diaries: [action.newDiary, ... state.diaries],
      tags: action.tags,
    };
  } else if (action.type === UPDATE_DIARY) {
    const originDiary = state.diaries.find(x => x.id === action.updatedDiaryId);
    if (!!originDiary) {
      originDiary.title = action.updatedDiaryTitle;
    }
    return {
      diaries: [... state.diaries],
      tags: state.tags,
    };
  } else if (action.type === REFRESH_DIARY) {
    if (action.diaries.length === 0) {
      return state;
    }
    return {
      diaries: [...action.diaries],
      tags: state.tags
    };
  } else {
    return state;
  }
}
