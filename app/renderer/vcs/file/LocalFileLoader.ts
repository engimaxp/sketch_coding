import fs from 'fs';
import path from 'path';
import {
    generateReadmeMarkDown,
    generateTagInfoMarkDown,
    LocalFileInfo, LocalTagInfo,
    retrieveAllInfoFromReadMe, retrieveAllInfoFromTagInfo
} from './BasicInfoGenerator';

const md = 'README.md';
const tagInfoMd = 'tag_info.md';

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

export interface FileTag {
    tagMap: LocalTagInfo[];
    localFileInfo: LocalFileInfo[];
}

export const searchAndBuildIndexReadme = async (repoName: string, pathInfo: string, userId: number) => {
    // read the readme file
    const readmeFilePath: string = path.join(pathInfo, md);
    const tagInfoFilePath: string = path.join(pathInfo, tagInfoMd);
    const originFileInfoMap = await retrieveAllInfoFromReadMe(readmeFilePath);
    const tagMap: LocalTagInfo[] = await retrieveAllInfoFromTagInfo(tagInfoFilePath, userId);
    // traverse the directory structure
    const currentFileInfoMap: {[key: string]: LocalFileInfo} = {};
    const tagFileMap: {[key: string]: LocalFileInfo[]} = {};
    const localFileInfo: LocalFileInfo[] = [];
    await dirTraverseSync(pathInfo, async (yearSubDir, yearDirName) => {
        const year: number = Number(yearDirName);
        if (year > 0) {
            await dirTraverseSync(yearSubDir, async (monthSubDir, monthDirName) => {
                const month: number = Number(monthDirName);
                if (month > 0) {
                    await fileTraverseSync(monthSubDir, async (fileName, birthDate) => {
                        const currentId = year.toString() + month.toString().padStart(2, '0') + fileName;
                        const originItem = originFileInfoMap[currentId];
                        let tags = '';
                        let currentBirthDate = birthDate;
                        if (!!originItem) {
                            currentBirthDate = originItem.birthTime;
                            tags = originItem.tags;
                        } else {
                            currentBirthDate.setUTCFullYear(year);
                            currentBirthDate.setMonth(month - 1);
                        }
                        const currentItem = {
                            year,
                            month,
                            fileName,
                            birthTime: currentBirthDate,
                            id: currentId,
                            tags
                        };
                        localFileInfo.push(currentItem);
                        currentFileInfoMap[currentId] = currentItem;
                        if (!!tags) {
                            tags.split(',').map(tag => {
                                if (!tagFileMap[tag]) {
                                    tagFileMap[tag] = [];
                                }
                                tagFileMap[tag].push(currentItem);
                            });
                        }
                    });
                }
            });
        }
    });
    // rewrite to readme and tagInfo file
    if (localFileInfo.length > 0) {
        const readme: string = generateReadmeMarkDown(repoName, localFileInfo);
        await fs.writeFileSync(readmeFilePath, readme, {encoding: 'utf-8'});
    }
    if (!!tagMap && Object.keys(tagMap).length > 0) {
        const tagInfo: string = generateTagInfoMarkDown(repoName, tagFileMap, tagMap);
        await fs.writeFileSync(tagInfoFilePath, tagInfo, {encoding: 'utf-8'});
    }
    return {
        localFileInfo,
        tagMap
    };
};
