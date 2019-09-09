import {db} from './db';
import {Diary} from './Diary';

export interface Tag {
    id?: number;
    userId: number;
    parentTagId: number;
    tagName: string;
    tagImage: string;
    diaries: Diary[];
    diaryIds: number[];
    childTags: Tag[];
}

export class Tag {
    id?: number;
    userId: number;
    parentTagId: number;
    tagName: string;
    tagImage: string;
    diaryIds: number[];
    diaries: Diary[];
    childTags: Tag[];
    constructor(userId: number,
                parentTagId: number,
                tagName: string,
                tagImage: string,
                diaryIds: number[],
                id?: number) {
        this.userId = userId;
        this.parentTagId = parentTagId;
        this.tagName = tagName;
        this.tagImage = tagImage;
        this.diaryIds = diaryIds;
        if (id) {
            this.id = id;
        }
        Object.defineProperties(this, {
            diaries: {value: [], enumerable: false, writable: true },
            childTags: {value: [], enumerable: false, writable: true },
        });
    }

    async loadNavigationProperties() {
        if (!this.id) {
            return;
        }
        const id: number = this.id;
        db.transaction('r', db.tags, db.diaries, async() => {
            [this.childTags, this.diaries] = await Promise.all([
                db.tags.where('parentTagId').equals(id).toArray(),
                db.diaries.where('id').anyOf(this.diaryIds).toArray(),
            ]);
        });
    }

    save() {
        return db.transaction('rw', db.tags, db.diaries, async() => {
            this.id = await db.tags.put(this);

            [this.childTags, this.diaries] = await Promise.all([
                db.tags.where('parentTagId').equals(this.id).toArray(),
                db.diaries.where('id').anyOf(this.diaryIds).toArray(),
            ]);
        });
    }
}

export const getAllTags: (userId: number) => Promise<any> = async (userId: number) => {
    return await db.transaction('r', [db.tags], async() => {
        const thisPageDiaries = await db.tags
            .where('userId').equals(userId).toArray();
        await Promise.all (thisPageDiaries.map((tag: Tag) => tag.loadNavigationProperties()));
        return thisPageDiaries;
    });
};
