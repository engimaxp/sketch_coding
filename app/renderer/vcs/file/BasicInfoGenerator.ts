import fs from 'fs';
import {Stack} from '../../share/Stack';

export const escapedNewline = process.platform === 'win32' ? '\r\n' : '\n';

const compareFn = (a: LocalFileInfo, b: LocalFileInfo) =>
    ((a.year - b.year) === 0) ? (a.month - b.month) : (a.year - b.year);

export interface LocalFileInfo {
    year: number;
    month: number;
    fileName: string;
    birthTime: Date;
    tags: string;
    id: string;
}

export interface LocalTagInfo {
    userId: number;
    tagName: string;
    tagImage: string;
    childTags: LocalTagInfo[];
    index: number;
    diaries: LocalFileInfo[];
}

export const generateReadmeMarkDown = (title: string, localFileInfo: LocalFileInfo[]) => {
    let readme: string = `# ${title}` + escapedNewline + escapedNewline;
    let currentYear: number = 0;
    let currentMonth: number = 0;
    localFileInfo.sort(compareFn)
        .map(file => {
            if (currentYear !== file.year) {
                currentYear = file.year;
                currentMonth = 0;
                readme += `- ${currentYear}` + escapedNewline;
            }
            if (currentMonth !== file.month) {
                currentMonth = file.month;
                readme += `  - ${currentMonth}` + escapedNewline;
            }
            readme += `    - [${file.fileName.substring(0, file.fileName.length - 3)}]`
                + `(/${currentYear}/${currentMonth}/${file.fileName})`
                + ` [${!!file.tags ? file.tags : ''}]`
                + ` \`${file.birthTime.toISOString()}\``
                + escapedNewline;
        });
    return readme;
};

const extracted = (currentIndex: number, x: LocalTagInfo, tagFileMap: { [p: number]: LocalFileInfo[] }) => {
    let tagInfoMd = '';
    tagInfoMd += ''.padStart(currentIndex, ' ') + `- ${x.tagName} \`${x.tagImage}\`` + escapedNewline;
    if (tagFileMap[x.tagName]) {
        tagFileMap[x.tagName]!.map((file: LocalFileInfo) => {
            tagInfoMd += ''.padStart(currentIndex + 2, ' ')
                + `- [${file.fileName.substring(0, file.fileName.length - 3)}]`
                + `(/${file.year}/${file.month.toString().padStart(2, '0')}/${file.fileName})`
                + ` \`${file.birthTime.toISOString()}\``
                + escapedNewline;
        });
    }
    if (!!x.childTags && x.childTags.length > 0) {
        x.childTags.map(y => {
            tagInfoMd += extracted(currentIndex + 2, y, tagFileMap);
        });
    }
    return tagInfoMd;
};

export const generateTagInfoMarkDown = (title: string,
                                        tagFileMap: {[key: number]: LocalFileInfo[]},
                                        tagMap: LocalTagInfo[]) => {
    let tagInfoMd: string = `# ${title} tag info` + escapedNewline + escapedNewline;
    const currentIndex: number = 0;
    tagMap.map((x: LocalTagInfo) => {
        tagInfoMd += extracted(currentIndex, x, tagFileMap);
    });
    const keys: string[] = [];
    for (const key of Object.keys(tagFileMap)) {
        keys.push(key);
    }
    keys.sort()
        .map(k => {
            const fileInfosForCurrentTag = tagFileMap[k];
            tagInfoMd += `- ${k}` + escapedNewline;
            fileInfosForCurrentTag.sort(compareFn).map((file: LocalFileInfo) => {
                tagInfoMd += `  - [${file.fileName.substring(0, file.fileName.length - 3)}]`
                    + `(/${file.year}/${file.month.toString().padStart(2, '0')}/${file.fileName})`
                    + ` \`${file.birthTime.toISOString()}\``
                    + escapedNewline;
            });
        });
    return tagInfoMd;
};

const readmeFilePattern: RegExp = new RegExp(/^\s*-\s+\[(.+)\]\(\/(\d+)\/(\d+)\/(.+)\)\s*(\[(.*)\])?\s*`(.+)`/);
export const retrieveAllInfoFromReadMe = async (readmeFilePath: string) => {
    const originFileInfoMap: {[key: string]: LocalFileInfo} = {};
    const readmeFileExist: boolean = await fs.existsSync(readmeFilePath);
    if (readmeFileExist) {
        const readmeOrigin: string = await fs.readFileSync(readmeFilePath, {encoding: 'utf-8', flag: 'r'});
        readmeOrigin.split(escapedNewline).map(line => {
            if (readmeFilePattern.test(line)) {
                const fileInfoRaw: RegExpExecArray | null = readmeFilePattern.exec(line);
                if (!!fileInfoRaw && fileInfoRaw.length > 0) {
                    const key = fileInfoRaw[2] + fileInfoRaw[3] + fileInfoRaw[4];
                    originFileInfoMap[key] = {
                        fileName: fileInfoRaw[4],
                        year: Number(fileInfoRaw[2]),
                        month: Number(fileInfoRaw[3]),
                        birthTime: new Date(fileInfoRaw[7]),
                        id: key,
                        tags: fileInfoRaw[6]
                    };
                }
            }
        });
    }
    return originFileInfoMap;
};

const tagFilePattern: RegExp = new RegExp(/^(\s*)-\s+(.+)\s`(.+)`/);
export const retrieveAllInfoFromTagInfo = async (tagInfoFilePath: string, userId: number) => {
    const originTagInfo: LocalTagInfo[] = [];
    const tagInfoFileExist: boolean = await fs.existsSync(tagInfoFilePath);
    const tagStack: Stack<LocalTagInfo> = new Stack<LocalTagInfo>();
    if (tagInfoFileExist) {
        const tagOrigin: string = await fs.readFileSync(tagInfoFilePath, {encoding: 'utf-8', flag: 'r'});
        let currentTag: (LocalTagInfo|undefined);
        tagOrigin.split(escapedNewline).map(line => {
            // file line regex recognize
            if (readmeFilePattern.test(line)) {
                const fileInfoRaw: RegExpExecArray | null = readmeFilePattern.exec(line);
                if (!!fileInfoRaw && fileInfoRaw.length > 0) {
                    const key = fileInfoRaw[2] + fileInfoRaw[3] + fileInfoRaw[4];
                    if (!!currentTag) {
                        currentTag!.diaries.push({
                            fileName: fileInfoRaw[4],
                            year: Number(fileInfoRaw[2]),
                            month: Number(fileInfoRaw[3]),
                            birthTime: new Date(fileInfoRaw[7]),
                            id: key,
                            tags: fileInfoRaw[6]
                        });
                    }
                }
            } else if (tagFilePattern.test(line)) {// tag line regex recognize
                const fileInfoRaw: RegExpExecArray | null = tagFilePattern.exec(line);
                if (!!fileInfoRaw && fileInfoRaw.length > 0) {
                    currentTag = {
                        tagName: fileInfoRaw[2],
                        tagImage: fileInfoRaw[3],
                        childTags: [],
                        index: (!!fileInfoRaw[1] ? fileInfoRaw[1]!.length : 0),
                        userId,
                        diaries: []
                    };
                    if (!tagStack.isEmpty()) {
                        while (!!tagStack.peek() && tagStack.peek()!.index >= currentTag.index) {
                            tagStack.pop();
                        }
                        if (!!tagStack.peek()) {
                            tagStack.peek()!.childTags.push(currentTag);
                        } else {
                            originTagInfo.push(currentTag);
                        }
                    } else {
                        originTagInfo.push(currentTag);
                    }
                    tagStack.push(currentTag);
                }
            }
        });
    }
    return originTagInfo;
};
