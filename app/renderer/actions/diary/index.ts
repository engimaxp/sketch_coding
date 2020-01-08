import {
  INITIAL_DIARY_LIST,
  ADD_NEW_DIARY,
  UPDATE_DIARY,
  DELETE_DIARY, REFRESH_DIARY
} from './action_type';
import DiaryData, {TagData} from '../../types/Diary';
import {
  Diary, getAllDiariesCount,
  getDiariesByPage,
  mapDataToDiary,
  mapDataToTag, mapToDiaryData, mapToTagData,
  saveDiariesAndTagsToDB,
  saveDiary
} from '../../vcs/local/Diary';
import Page from '../../vcs/local/Page';
import {getAllTags, Tag} from '../../vcs/local/Tag';
import AccountData from '../../types/Account';
import {FileTag, searchAndBuildIndexReadme} from '../../vcs/file/LocalFileLoader';

export type diaryActions = Query | Add | Update | Delete | RefreshDiary;

interface Query {
  type: INITIAL_DIARY_LIST;
  diaries?: DiaryData[];
  tags?: TagData[];
  diaryCountTotal: number;
}

export const query = async (userId: number, repoId: number, pageInfo: Page): Promise<Query> => {
  if (!userId || !repoId || !pageInfo) {
    return ({
      type: INITIAL_DIARY_LIST,
      diaries: undefined,
      tags: undefined,
      diaryCountTotal: 0
    });
  }
  const diaries: Diary[] = await getDiariesByPage(pageInfo, repoId);
  const diaryDataList: DiaryData[] = diaries.map(diary => mapToDiaryData(diary));
  const tags: Tag[] = await getAllTags(userId);
  const tagDataList: TagData[] = tags.map(tag => mapToTagData(tag));
  const diaryCountTotal = await getAllDiariesCount(repoId);
  return ({
    type: INITIAL_DIARY_LIST,
    diaries: diaryDataList,
    tags: tagDataList,
    diaryCountTotal
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
  updatedDiaryId: number;
  updatedDiaryTitle: string;
}

export const updateDiary: (diary: DiaryData) => Update = (diary: DiaryData) => {
  return {
    type: UPDATE_DIARY,
    updatedDiaryId: diary.id,
    updatedDiaryTitle: diary.title,
  };
};

interface Delete {
  type: DELETE_DIARY;
}

interface RefreshDiary {
  type: REFRESH_DIARY;
  diaries: DiaryData[];
  diaryCountTotal: number;
}

export const refreshDiaries = async (account: AccountData, diaries: DiaryData[]): Promise<RefreshDiary> => {
  if (!(!!account && !!account.repo && !!account.repo!.localDirectory)) {
    return {
      type: REFRESH_DIARY,
      diaries: [],
      diaryCountTotal: 0
    };
  }
  let filesRefreshed: FileTag = {
    localFileInfo: [],
    tagMap: [],
  };
  try {
    filesRefreshed = await searchAndBuildIndexReadme(account.repo!.targetRepo,
        account.repo!.localDirectory,
        account.userId);
  } catch (e) {
    console.log(e);
  }
  if (!!filesRefreshed) {
    // refresh to indexed db
    const deletedIds = await saveDiariesAndTagsToDB(filesRefreshed, account);
    //  then if modified, dispatch to the session store
    if (!!diaries && diaries.length > 0 && !!deletedIds && deletedIds.length > 0) {
      const temp: DiaryData[] = [];
      diaries.filter(x => deletedIds.indexOf(x.id) >= 0)
          .forEach(x => {
            if (deletedIds.indexOf(x.id) >= 0) {
              temp.push(Object.assign({}, x, {isDeleted: true}));
            } else {
              temp.push(Object.assign({}, x));
            }
          });
    }
  }
  const diaryCountTotal = await getAllDiariesCount(account.repo.repoId);
  return {
    type: REFRESH_DIARY,
    diaries,
    diaryCountTotal
  };
};
