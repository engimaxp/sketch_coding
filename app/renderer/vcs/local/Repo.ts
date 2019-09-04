import {AccountRepo} from '../../types/Account';
import {Diary} from './Diary';
import {db} from './db';
export class Repo {
    id?: number;
    userId: number;
    repoName: string;
    repoCloneUrl: string;
    repoLocalUrl: string;
    diaries: Diary[];

    constructor(userId: number,
                repoName: string,
                repoCloneUrl: string,
                repoLocalUrl: string,
                id?: number) {
        this.userId = userId;
        this.repoName = repoName;
        this.repoCloneUrl = repoCloneUrl;
        this.repoLocalUrl = repoLocalUrl;
        if (id) {
            this.id = id;
        }
        Object.defineProperties(this, {
            diaries: {value: [], enumerable: false, writable: true },
        });
    }

    async loadNavigationProperties() {
        if (!this.id) {
            return;
        }
        [this.diaries] = await Promise.all([
            db.diaries.where('repoId').equals(this.id).toArray(),
        ]);
    }
}

export const getANewRepo: ((repo: AccountRepo, userId?: number) => Repo|null)
    = (repo: AccountRepo, userId?: number) => {
    if (repo == null) {
        return null;
    }
    if (repo.targetRepo === undefined) {
        return null;
    }
    if (repo.repoUrl === undefined) {
        return null;
    }
    if (repo.localDirectory === undefined) {
        return null;
    }
    return new Repo(
        (userId === undefined ? 0 : userId),
        repo.targetRepo,
        repo.repoUrl,
        repo.localDirectory
    );
};
