
/* Just for code completion and compilation - defines
    * the interface of objects stored in the repos table.
    */
export interface Repo {
    id?: number;
    userId: number;
    repoName: string;
    repoCloneUrl: string;
    repoLocalUrl: string;
}
