import {diaryActions} from '../actions/diary';
import {ADD_NEW_DIARY, INITIAL_DIARY_LIST} from '../actions/diary/action_type';
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
  } else {
    return state;
  }
}
