import {Tag} from './Tag';
import {db} from './db';
import Page from './Page';

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
