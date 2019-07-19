import Dexie from 'dexie';
import {UserInfo} from './UserInfo';
import {Repo} from './Repo';

export class AppDatabase extends Dexie {

    users: Dexie.Table<UserInfo, number>;
    repos: Dexie.Table<Repo, number>;

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

        // Let's physically map UserInfo class to users table.
        // This will make it possible to call loadEmailsAndPhones()
        // directly on retrieved database objects.
        dataBase.users.mapToClass(UserInfo);
    }
}

export const db = new AppDatabase();
