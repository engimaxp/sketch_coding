import Dexie from 'dexie';
import {UserInfo} from './UserInfo';
import {Repo} from './Repo';
import {Diary} from './Diary';
import {Tag} from './Tag';

export class AppDatabase extends Dexie {

    users: Dexie.Table<UserInfo, number>;
    repos: Dexie.Table<Repo, number>;
    diaries: Dexie.Table<Diary, number>;
    tags: Dexie.Table<Tag, number>;

    constructor() {

        super('UserSettingDatabase');

        const dataBase = this;

        //
        // Define tables and indexes
        //
        dataBase.version(1).stores({
            users: '++id, pinCode, password, username, nickname, avatar',
            repos: '++id, userId, repoName, repoCloneUrl, repoLocalUrl',
        });
        // When upgrading db version , only add schema not change them (or implement a migrate)
        // And always keep the previous schema
        // see [reference](https://github.com/dfahlander/Dexie.js/issues/156)
        dataBase.version(2).stores({
            users: '++id, pinCode, password, username, nickname, avatar',
            repos: '++id, userId, repoName, repoCloneUrl, repoLocalUrl',
            diaries: '++id, repoId, *tagsIds, title, storeLocation, createTime, lastUpdateTime',
            tags: '++id, userId, *diaryIds, parentTagId, tagName, tagImage',
        });

        // Let's physically map UserInfo class to users table.
        // This will make it possible to call loadEmailsAndPhones()
        // directly on retrieved database objects.
        dataBase.users.mapToClass(UserInfo);
        dataBase.tags.mapToClass(Tag);
    }
}

export const db = new AppDatabase();
