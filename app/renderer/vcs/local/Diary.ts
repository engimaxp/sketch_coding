import {Tag} from './Tag';
import {repository} from './repository';
import Page from './Page';
import AccountData from '../../types/Account';
import {LocalFileInfo, LocalTagInfo} from '../file/BasicInfoGenerator';
import {FileTag} from '../file/LocalFileLoader';
import DiaryData, {TagData} from '../../types/Diary';

const loadNavigationProperties = async (diary: Diary) => {
    if (!diary.id) {
        return;
    }
    [diary.tags] = await Promise.all([
        repository.tags.where('id').anyOf(diary.tagsIds).toArray(),
    ]);
};
export class Diary {
    id?: number;
    repoId: number;
    title: string;
    storeLocation: string;
    createTime: Date;
    lastUpdateTime: Date;
    tags: Tag[];
    tagsIds: number[];
    constructor(repoId: number,
                title: string,
                storeLocation: string,
                createTime: Date,
                lastUpdateTime: Date,
                tagsIds: number[],
                id?: number) {
        this.repoId = repoId;
        this.title = title;
        this.storeLocation = storeLocation;
        this.createTime = createTime;
        this.lastUpdateTime = lastUpdateTime;
        this.tagsIds = tagsIds;
        if (id) {
            this.id = id;
        }
        Object.defineProperties(this, {
            tags: {value: [], enumerable: false, writable: true },
        });
    }
}

export const saveDiary = (diary: Diary) => repository.transaction('rw',
    repository.diaries,
    repository.tags,
    async () => {
    const id = await repository.diaries.put(diary);
    diary.id = id;
    [diary.tags] = await Promise.all([
        repository.tags.where('id').anyOf(diary.tagsIds).toArray(),
    ]);
    return diary;
});

export const getDiary = (diaryId: number) => repository.transaction('rw',
    repository.diaries,
    async () => {
    const diary = await repository.diaries.get(diaryId);
    if (!!diary) {
        return mapToDiaryData(diary);
    }
    return null;
});

export const updateDiaryToDB = (diaryData: DiaryData) => repository.transaction('rw',
    repository.diaries,
    async () => {
    const diary = await repository.diaries.get(diaryData.id);
    if (!!diary) {
        diary.title = diaryData.title;
        await repository.diaries.put(diary);
    }
});

export const getDiariesByPage = async (page: Page, repoId: number) => {
    return await repository.transaction('r', [repository.diaries, repository.tags], async() => {
        const thisPageDiaries: any = await repository.diaries
            .where('repoId').equals(repoId)
            .offset((page.index - 1) * page.size)
            .limit(page.size).toArray();
        await Promise.all (thisPageDiaries.map((diary: Diary) => loadNavigationProperties(diary)));
        return thisPageDiaries;
    });
};
export const getAllDiariesCount = async (repoId: number) => {
    return await repository.transaction('r', [repository.diaries, repository.tags], async() => {
        return await repository.diaries
            .where('repoId').equals(repoId).count();
    });
};

export const getAllDiaries = async (repoId: number) => {
    return await repository.transaction('r', [repository.diaries, repository.tags], async() => {
        const thisPageDiaries: any = await repository.diaries
            .where('repoId').equals(repoId).toArray();
        await Promise.all (thisPageDiaries.map((diary: Diary) => loadNavigationProperties(diary)));
        return thisPageDiaries;
    });
};

const mapToDiary = (account: AccountData, file: LocalFileInfo) => {
    return new Diary(account.repo!.repoId,
        file.fileName.replace('.md', ''),
        account.repo!.localDirectory,
        file.birthTime,
        new Date(),
        []);
};

const refreshSaveTagToDB = async (parentTagId: number, tagMap: LocalTagInfo[], account: AccountData) => {
    let currentTagId = 0;
    if (!!tagMap && tagMap.length > 0) {
        return currentTagId;
    }
    await repository.transaction('rw', [repository.tags], async() => {
        tagMap.map(async (x: LocalTagInfo) => {
            await repository.tags.add(new Tag(account.userId, parentTagId, x.tagName, x.tagImage, []));
            const tag = await repository.tags.where('tagName').equals(x.tagName).first();
            if (!!tag) {
                currentTagId = tag!.id!;
            }
            if (!!x.childTags && x.childTags.length > 0) {
                await refreshSaveTagToDB(currentTagId, x.childTags, account);
            }
        });
    });
    return currentTagId;
};

const clearTagDB = async (account: AccountData) => {
    await repository.transaction('rw', [repository.tags], async() => {
        await repository.tags.where('userId').equals(account.userId).delete();
    });
};

const findLocalFileInfoById = (localFileInfoMap: LocalFileInfo[], key: string) => {
    if (!localFileInfoMap || localFileInfoMap.length === 0) {
        return undefined;
    }
    return localFileInfoMap.find(x => x.id === key);
};

export const saveDiariesAndTagsToDB = async (fileTag: FileTag, account: AccountData) => {
    let deleteIds: number[] = [];
    await clearTagDB(account);
    // save tags first
    await refreshSaveTagToDB(0, fileTag.tagMap, account);
    // then save diary
    await repository.transaction('rw', [repository.diaries, repository.tags], async() => {
        const localFileInfoArray = fileTag.localFileInfo;
        const diariesOrigin =
            await repository.diaries
                .where('repoId').equals(account.repo!.repoId).toArray();
        const originTags = await repository.tags.where('userId').equals(account.userId).toArray();
        const originTagMap: {[key: string]: Tag} = {};
        originTags.map((tag: Tag) => {
            originTagMap[tag.tagName] = tag;
        });
        const diariesOriginMap: {[key: string]: Diary} = {};
        const addLocalFileInfo: Diary[] = [];
        const deleteLocalFileInfo: Diary[] = [];
        diariesOrigin.map(origin => {
            const key = `${origin.createTime.getUTCFullYear()}`
                + `${(origin.createTime.getMonth() + 1).toString().padStart(2, '0')}`
                + `${origin.title}.md`;
            diariesOriginMap[key] = origin;
            const fileInfoNew = findLocalFileInfoById(localFileInfoArray, key);
            if (!fileInfoNew) {
                deleteLocalFileInfo.push(origin);
            }
        });
        for (const newItem of localFileInfoArray) {
            const oldItem = diariesOriginMap[newItem.id];
            if (!oldItem) {
                const diary = mapToDiary(account, newItem);
                if (!!newItem.tags) {
                    newItem.tags.split(',').map((tag: string) => {
                        // only exists tag will link to diary
                        if (originTagMap[tag]) {
                            originTagMap[tag].diaries.push(diary);
                            diary.tagsIds.push(originTagMap[tag].id ? originTagMap[tag].id! : 0);
                        }
                    });
                }
                addLocalFileInfo.push(diary);
            }
        }
        // delete old diaries
        deleteIds = deleteLocalFileInfo.map(item => item.id ? item.id : 0);
        if (!!deleteIds && deleteIds.length > 0) {
            await repository.diaries
                .where('id').anyOf(deleteIds)
                .delete();
        }
        // add new diaries
        if (!!addLocalFileInfo && addLocalFileInfo.length > 0) {
            await repository.diaries.bulkAdd(addLocalFileInfo);
        }
        // update old tags
        await repository.tags.bulkPut(originTags);
    });
    return deleteIds;
};
export const mapToDiaryData: ((diary: Diary) => DiaryData) = diary => {
    return {
        id: diary.id ? diary.id : 0,
        repoId: diary.repoId,
        title: diary.title,
        storeLocation: diary.storeLocation,
        createTime: diary.createTime,
        lastUpdateTime: diary.lastUpdateTime,
        tags: (!!diary.tags) ? (diary.tags.map(tag => mapToTagData(tag))) : []
    };
};
export const mapToTagData: ((tag: Tag) => TagData) = tag => {
    return {
        id: tag.id ? tag.id : 0,
        userId: tag.userId,
        tagName: tag.tagName,
        tagImage: tag.tagImage,
        parentTagId: tag.parentTagId,
        childTags: tag.childTags.map((tag2: Tag) => mapToTagData(tag2)),
    };
};
export const mapDataToDiary: ((diary: DiaryData) => Diary) = diary => {
    return new Diary(
        diary.repoId,
        diary.title,
        diary.storeLocation,
        diary.createTime,
        diary.lastUpdateTime,
        diary.tags.map(tag => tag.id),
        diary.id
    );
};
export const mapDataToTag: ((tag: TagData) => Tag) = tag => {
    return new Tag(
        tag.userId,
        tag.parentTagId,
        tag.tagName,
        tag.tagImage,
        [],
        tag.id,
    );
};
