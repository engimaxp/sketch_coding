
export default interface AccountData {
    pinCode?: string;
    password?: string;
    username?: string;
    nickName?: string;
    avatar?: string;
    repo?: AccountRepo;
    userId: number;
}

export interface AccountRepo {
    targetRepo: string;
    repoUrl: string;
    localDirectory: string;
    repoId: number;
}
