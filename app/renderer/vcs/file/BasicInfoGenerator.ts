
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

export const generateTagInfoMarkDown = (title: string, tagFileMap: {[key: number]: LocalFileInfo[]}) => {
    let tagInfoMd: string = `# ${title} tag info` + escapedNewline + escapedNewline;
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
