export default interface DiaryData {
    id: number;
    repoId: number;
    title: string;
    storeLocation: string;
    createTime: Date;
    lastUpdateTime: Date;
    tags: TagData[];
    isModified?: boolean;
    isDeleted?: boolean;
}

export interface TagData {
    id: number;
    userId: number;
    parentTagId: number;
    tagName: string;
    tagImage: string;
    childTags: TagData[];
}
