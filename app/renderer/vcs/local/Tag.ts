import {repository} from './repository';
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
        repository.transaction('r', repository.tags, repository.diaries, async() => {
            [this.childTags, this.diaries] = await Promise.all([
                repository.tags.where('parentTagId').equals(id).toArray(),
                repository.diaries.where('id').anyOf(this.diaryIds).toArray(),
            ]);
        });
    }

    save() {
        return repository.transaction('rw', repository.tags, repository.diaries, async() => {
            this.id = await repository.tags.put(this);

            [this.childTags, this.diaries] = await Promise.all([
                repository.tags.where('parentTagId').equals(this.id).toArray(),
                repository.diaries.where('id').anyOf(this.diaryIds).toArray(),
            ]);
        });
    }
}

export const getAllTags: (userId: number) => Promise<any> = async (userId: number) => {
    return await repository.transaction('r', [repository.tags], async() => {
        const thisPageDiaries = await repository.tags
            .where('userId').equals(userId).toArray();
        await Promise.all (thisPageDiaries.map((tag: Tag) => tag.loadNavigationProperties()));
        return thisPageDiaries;
    });
};
