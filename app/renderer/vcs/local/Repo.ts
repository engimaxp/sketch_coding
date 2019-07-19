
/* Just for code completion and compilation - defines
    * the interface of objects stored in the repos table.
    */
import {AccountRepo} from '../../types/Account';
export interface Repo {
    id?: number;
    userId: number;
    repoName: string;
    repoCloneUrl: string;
    repoLocalUrl: string;
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
    return {userId: (userId === undefined ? 0 : userId),
        repoName: repo.targetRepo,
        repoCloneUrl: repo.repoUrl,
        repoLocalUrl: repo.localDirectory
    };
};
