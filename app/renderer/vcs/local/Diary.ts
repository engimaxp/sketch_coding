import {Tag} from './Tag';
import {db} from './db';
import Page from './Page';
import AccountData from '../../types/Account';
import {LocalFileInfo} from '../file/BasicInfoGenerator';

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

    async loadNavigationProperties() {
        if (!this.id) {
            return;
        }
        [this.tags] = await Promise.all([
            db.tags.where('id').anyOf(this.tagsIds).toArray(),
        ]);
    }

}

export const saveDiary = (diary: Diary) => db.transaction('rw',
    db.diaries,
    db.tags,
    async () => {
    const id = await db.diaries.put(diary);
    diary.id = id;
    [diary.tags] = await Promise.all([
        db.tags.where('id').anyOf(diary.tagsIds).toArray(),
    ]);
    return diary;
});

export const getDiariesByPage = async (page: Page, repoId: number) => {
    return await db.transaction('r', [db.diaries], async() => {
        const thisPageDiaries: any = await db.diaries
            .where('repoId').equals(repoId)
            .offset((page.index - 1) * page.size)
            .limit(page.size).toArray();
        await Promise.all (thisPageDiaries.map((diary: Diary) => diary.loadNavigationProperties()));
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

export const saveDiariesToDB = async (localFileInfoMap: {[key: string]: LocalFileInfo}, account: AccountData) => {
    await db.transaction('rw', [db.diaries, db.tags], async() => {
        const diariesOrigin =
            await db.diaries
                .where('repoId').equals(account.repo!.repoId).toArray();
        const diariesOriginMap: {[key: string]: Diary} = {};
        const addLocalFileInfo: Diary[] = [];
        const deleteLocalFileInfo: Diary[] = [];
        diariesOrigin.map(origin => {
            const key = `${origin.createTime.getUTCFullYear()}`
                + `${(origin.createTime.getMonth() - 1).toString().padStart(2, '0')}`
                + `${origin.title}.md`;
            diariesOriginMap[key] = origin;
            const fileInfoNew = localFileInfoMap[key];
            if (!fileInfoNew) {
                deleteLocalFileInfo.push(origin);
            }
        });
        const originTags = await db.tags.toArray();
        const originTagMap: {[key: string]: Tag} = {};
        originTags.map(t => {
            originTagMap[t.tagName] = t;
        });
        for (const newKey of Object.keys(localFileInfoMap)) {
            const oldItem = diariesOriginMap[newKey];
            if (!oldItem) {
                const newItem = localFileInfoMap[newKey];
                const diary = mapToDiary(account, newItem);
                if (!!newItem.tags) {
                    newItem.tags.split(',').map(tag => {
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
        const deleteIds = deleteLocalFileInfo.map(item => item.id ? item.id : 0);
        if (!!deleteIds && deleteIds.length > 0) {
            await db.diaries
                .where('id').anyOf(deleteIds)
                .delete();
        }
        // add new diaries
        if (!!addLocalFileInfo && addLocalFileInfo.length > 0) {
            await db.diaries.bulkAdd(addLocalFileInfo);
        }
        // update old tags
        originTags.map(x => x.diaryIds = x.diaries.filter(y => y.id).map(y => y.id!));
        await db.tags.bulkPut(originTags);
    });
};
