import { INITIAL_DIARY_LIST,
  ADD_NEW_DIARY,
  UPDATE_DIARY,
  DELETE_DIARY } from './action_type';
import DiaryData, {mapDataToDiary, mapDataToTag, mapToDiaryData, mapToTagData, TagData} from '../../types/Diary';
import {Diary, getDiariesByPage, saveDiary} from '../../vcs/local/Diary';
import Page from '../../vcs/local/Page';
import {settings} from '../../constants';
import {getAllTags, Tag} from '../../vcs/local/Tag';

export type diaryActions = Query | Add | Update | Delete;

interface Query {
  type: INITIAL_DIARY_LIST;
  diaries?: DiaryData[];
  tags?: TagData[];
}

export const query = async (userId: number, repoId: number): Promise<Query> => {
  const diaries: Diary[] = await getDiariesByPage(new Page(1, settings.diaryPageDefaultSize), repoId);
  const diaryDataList: DiaryData[] = diaries.map(diary => mapToDiaryData(diary));
  const tags: Tag[] = await getAllTags(userId);
  const tagDataList: TagData[] = tags.map(tag => mapToTagData(tag));
  return ({
    type: INITIAL_DIARY_LIST,
    diaries: diaryDataList,
    tags: tagDataList
  });
};

interface Add {
  type: ADD_NEW_DIARY;
  newDiary: DiaryData;
  tags: TagData[];
}

export const addDiary = async (diary: DiaryData): Promise<Add> => {
  for (const x of diary.tags
      .filter(tag => !tag.id || tag.id <= 0)) {
    await mapDataToTag(x).save();
  }
  let storeDiary = mapDataToDiary(diary);
  console.log(JSON.stringify(storeDiary));
  storeDiary = await saveDiary(storeDiary);
  let tagsUpdated: Tag[] = [];
  if (diary.tags !== undefined && diary.tags.length > 0) {
    tagsUpdated = await getAllTags(diary.tags[0].userId);
  }
  return ({
    type: ADD_NEW_DIARY,
    newDiary: mapToDiaryData(storeDiary),
    tags: tagsUpdated.map(x => mapToTagData(x))
  });
};

interface Update {
  type: UPDATE_DIARY;
}

interface Delete {
  type: DELETE_DIARY;
}
