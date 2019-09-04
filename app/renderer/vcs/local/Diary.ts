import {Tag} from './Tag';
import {db} from './db';

export class Diary {
    id?: number;
    repoId: number;
    title: string;
    storeLocation: string;
    createTime: string;
    lastUpdateTime: string;
    tags: Tag[];
    tagsIds: number[];
    constructor(repoId: number,
                title: string,
                storeLocation: string,
                createTime: string,
                lastUpdateTime: string,
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
