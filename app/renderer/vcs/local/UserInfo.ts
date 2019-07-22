
/* This is a 'physical' class that is mapped to
    * the users table. We can have methods on it that
    * we could call on retrieved database objects.
    */
import {db} from './db';
import {Repo} from './Repo';

import AccountData from '../../types/Account';
export const getANewAccount: ((account: AccountData) => UserInfo|null) = (account: AccountData) => {
    if (account == null) {
        return null;
    }
    if (account.pinCode === undefined) {
        account.pinCode = '';
    }
    if (account.password === undefined) {
        return null;
    }
    if (account.username === undefined) {
        return null;
    }
    if (account.nickName === undefined) {
        return null;
    }
    if (account.avatar === undefined) {
        return null;
    }
    return new UserInfo(account.pinCode,
        account.password,
        account.username,
        account.nickName,
        account.avatar);
};
export const getAccounts = async (limitNumber: number) => {
    return await db.transaction('r', [db.users, db.repos], async() => {
        const firstUsers: any = await db.users.orderBy('id').limit(limitNumber)
            .toArray();
        await Promise.all (firstUsers.map((user: UserInfo) => user.loadNavigationProperties()));
        return firstUsers;
    });
};
export class UserInfo {
    id: number;
    pinCode: string;
    password: string;
    username: string;
    nickname: string;
    avatar: string;
    repos: Repo[];

    constructor(pinCode: string, password: string, username: string, nickname: string, avatar: string, id?: number) {
        this.pinCode = pinCode;
        this.password = password;
        this.username = username;
        this.nickname = nickname;
        this.avatar = avatar;
        if (id) {
            this.id = id;
        }
        // Define navigation properties.
        // Making them non-enumerable will prevent them from being handled by indexedDB
        // when doing put() or add().
        Object.defineProperties(this, {
            repos: {value: [], enumerable: false, writable: true },
        });
    }

    async loadNavigationProperties() {
        [this.repos] = await Promise.all([
            db.repos.where('userId').equals(this.id).toArray(),
        ]);
    }

    save() {
        return db.transaction('rw', db.users, db.repos, async() => {

            // Add or update our selves. If add, record this.id.
            this.id = await db.users.put(this);

            // Save all navigation properties (arrays of repos and phones)
            // Some may be new and some may be updates of existing objects.
            // put() will handle both cases.
            // (record the result keys from the put() operations into emailIds and phoneIds
            //  so that we can find local deletes)
            const [repoIds] = await Promise.all ([
                Promise.all(this.repos.map(repo => db.repos.put(repo))),
            ]);

            // Was any email or phone number deleted from out navigation properties?
            // Delete any item in DB that reference us, but is not present
            // in our navigation properties:
            await Promise.all([
                db.repos.where('userId').equals(this.id) // references us
                    .and(repo => repoIds.indexOf(repo.id || -1) === -1) // Not anymore in our array
                    .delete(),
            ]);
        });
    }
}
