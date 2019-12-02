import {searchAndBuildIndexReadme} from './LocalFileLoader';

import path from 'path';
import {retrieveAllInfoFromReadMe, retrieveAllInfoFromTagInfo} from './BasicInfoGenerator';

describe('file only test', () => {
    it('total', async () => {
        const a = await searchAndBuildIndexReadme('sketch', path.resolve('./app/renderer/vcs/file'), 1);
        console.log(a);
    });
    it('test tagFile', async () => {
        // searchAndBuildIndexReadme(); // test path here
        const a = await retrieveAllInfoFromTagInfo(path.resolve('./app/renderer/vcs/file/tag_info.md'), 1);
        console.log(a);
    });
    it('test local file', async () => {
        // searchAndBuildIndexReadme(); // test path here
        const a = await retrieveAllInfoFromReadMe(path.resolve('./app/renderer/vcs/file/README.md'));
        console.log(a);
    });
});
