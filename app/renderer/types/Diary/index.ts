import {Diary} from '../../vcs/local/Diary';
import {Tag} from '../../vcs/local/Tag';

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

export const mapToDiaryData: ((diary: Diary) => DiaryData) = diary => {
    return {
        id: diary.id ? diary.id : 0,
        repoId: diary.repoId,
        title: diary.title,
        storeLocation: diary.storeLocation,
        createTime: diary.createTime,
        lastUpdateTime: diary.lastUpdateTime,
        tags: diary.tags.map(tag => mapToTagData(tag))
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
