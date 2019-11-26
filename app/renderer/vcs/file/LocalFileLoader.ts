import fs from 'fs';
import path from 'path';

const md = 'README.md';
const excapedNewline = process.platform === 'win32' ? '\r\n' : '\n';

export interface LocalFileInfo {
    year: number;
    month: number;
    fileName: string;
    birthTime: Date;
    id: string;
}

const dirTraverseSync = (filePath: string, subDirectoryFunction: ((subDir: string, dirName: string) => void)) => {
    if (!subDirectoryFunction || !filePath) {
        return;
    }
    const dirs = fs.readdirSync(filePath);
    dirs.forEach((filename) => {
        const filedir = path.join(filePath, filename);
        const stats = fs.statSync(filedir);
        const isDir = stats.isDirectory();
        if (isDir) {
            subDirectoryFunction(filedir, filename);
        }
    });
};
const fileTraverseSync = (filePath: string, fileFunction: ((fileName: string, birthDate: Date) => void)) => {
    if (!fileFunction || !filePath) {
        return;
    }
    const dirs = fs.readdirSync(filePath);
    dirs.forEach((filename) => {
        const filedir = path.join(filePath, filename);
        const stats = fs.statSync(filedir);
        const isFile = stats.isFile();
        if (isFile) {
            fileFunction(filename, stats.birthtime);
        }
    });
};
const filePattern: RegExp = new RegExp(/\s+-\s+\[(.+)\]\(\/(\d+)\/(\d+)\/(.+)\)\s*`(.+)`/);
export const searchAndBuildIndexReadme = async (pathInfo: string) => {
    // read the readme file
    const readmeFilePath: string = path.join(pathInfo, md);
    const originFileInfo: LocalFileInfo[] = [];
    const fileExist: boolean = await fs.existsSync(readmeFilePath);
    if (fileExist) {
        const readmeOrigin: string = await fs.readFileSync(readmeFilePath, {encoding: 'utf-8', flag: 'r'});
        readmeOrigin.split(excapedNewline).map(line => {
            if (filePattern.test(line)) {
                const fileInfoRaw: RegExpExecArray | null = filePattern.exec(line);
                if (!!fileInfoRaw) {
                    originFileInfo.push({
                        fileName: fileInfoRaw[4],
                        year: Number(fileInfoRaw[2]),
                        month: Number(fileInfoRaw[3]),
                        birthTime: new Date(fileInfoRaw[5]),
                        id: fileInfoRaw[2] + fileInfoRaw[3] + fileInfoRaw[4]
                    });
                }
            }
        });
    }
    // traverse the directory structure
    const localFileInfo: LocalFileInfo[] = [];
    await dirTraverseSync(pathInfo, async (yearSubDir, yearDirName) => {
        const year: number = Number(yearDirName);
        if (year > 0) {
            await dirTraverseSync(yearSubDir, async (monthSubDir, monthDirName) => {
                const month: number = Number(monthDirName);
                if (month > 0) {
                    await fileTraverseSync(monthSubDir, async (fileName, birthDate) => {
                        const currentId = year.toString() + month.toString().padStart(2, '0') + fileName;
                        const originItem = originFileInfo.find(x => x.id === currentId);
                        let currentBirthDate = birthDate;
                        if (!!originItem) {
                            currentBirthDate = originItem.birthTime;
                        } else {
                            currentBirthDate.setUTCFullYear(year);
                            currentBirthDate.setMonth(month - 1);
                        }
                        localFileInfo.push({
                            year,
                            month,
                            fileName,
                            birthTime: currentBirthDate,
                            id: currentId
                        });
                    });
                }
            });
        }
    });
    // rewrite to readme file
    if (localFileInfo.length > 0) {
        const readme: string = generateReadmeMarkDown(pathInfo.substring(pathInfo.lastIndexOf('\\') + 1,
            pathInfo.length), localFileInfo);
        await fs.writeFileSync(readmeFilePath, readme, {encoding: 'utf-8'});
    }
};
const generateReadmeMarkDown = (title: string, localFileInfo: LocalFileInfo[]) => {
    let readme: string = `# ${title}` + excapedNewline + excapedNewline;
    let currentYear: number = 0;
    let currentMonth: number = 0;
    localFileInfo.sort((a, b) => ((a.year - b.year) === 0) ? (a.month - b.month) : (a.year - b.year))
        .map(file => {
            if (currentYear !== file.year) {
                currentYear = file.year;
                currentMonth = 0;
                readme += `- ${currentYear}` + excapedNewline;
            }
            if (currentMonth !== file.month) {
                currentMonth = file.month;
                readme += `  - ${currentMonth}` + excapedNewline;
            }
            readme += `    - [${file.fileName.substring(0, file.fileName.length - 3)}]`
                + `(/${currentYear}/${currentMonth}/${file.fileName})`
                + ` \`${file.birthTime.toISOString()}\``
                + excapedNewline;
        });
    return readme;
};
