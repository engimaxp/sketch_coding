import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { StoreState} from '../types';
import NoteEditor from '../components/Page/Note/NoteEditor';
import {ThunkDispatch} from 'redux-thunk';
import mkdirp from 'mkdirp';
import fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import {addDiary, updateDiary} from '../actions/diary';
import {
    changeContent,
    changeEdit,
    changeTitle,
    clearAll,
    editorChangeEdit,
    editorChangeSplit,
    editorChangeSplitPos
} from '../actions/note';
import {getDiary, updateDiaryToDB} from '../vcs/local/Diary';

const mapStateToProps = (state: StoreState) => ({
    editorStatus: state.noteEditor.editorStatus,
    localDirectory: state.account.data.repo ?
        state.account.data.repo!.localDirectory : '',
    repoId: state.account.data.repo ?
        state.account.data.repo!.repoId : 0,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
    changeEditorMode: (inChange: boolean) => {
        dispatch(editorChangeEdit(inChange));
    },
    returnToNoteList: () => {
        dispatch(clearAll());
        dispatch(changeEdit(false));
    },
    changeSplitMode: () => {
        dispatch(editorChangeSplit());
    },
    changeSplitPos: (pos: number) => {
        dispatch(editorChangeSplitPos(pos));
    },
    changeContent: (content: string, contentHtml: string) => {
        dispatch(changeContent(content, contentHtml));
    },
    changeTitle: (title: string) => {
        dispatch(changeTitle(title));
    },
    submit: async (input: string, title: string, rootDir: string, repoId: number, diaryId: number) => {
        const secondaryDir = `${moment().format('YYYY')}\\${moment().format('MM')}`;
        if (!!input && !!title) {
            if (!fs.existsSync(path.join(rootDir, secondaryDir))) {
                mkdirp.sync(path.join(rootDir, secondaryDir));
            }
            // same directory file name can not be same
            let currentFileName = `${title}.md`;
            let count = 1;
            while (fs.existsSync(path.join(rootDir, secondaryDir, currentFileName))) {
                currentFileName = `${title}_${count}.md`;
                count++;
            }
            if (diaryId > 0) {
                // find exact diary item in db use diaryId
                const diaryData = await getDiary(diaryId);
                if (!!diaryData) {
                    // if find one ,update it's title and content
                    const existDiaryDataDirectory = diaryData.storeLocation
                        + `\\${diaryData.createTime.getUTCFullYear()}`
                        + `\\${(diaryData.createTime.getMonth() + 1).toString().padStart(2, '0')}`;
                    if (fs.existsSync(path.join(existDiaryDataDirectory + `\\${diaryData.title}.md`))) {
                        // rename the file
                        fs.renameSync(existDiaryDataDirectory + `\\${diaryData.title}.md`,
                            existDiaryDataDirectory + `\\${currentFileName}`);
                        diaryData.title = currentFileName.substring(0, currentFileName.length - 3);
                        // and update to db
                        await updateDiaryToDB(diaryData);
                        dispatch(updateDiary(diaryData));
                        fs.writeFileSync(existDiaryDataDirectory + `\\${currentFileName}`, input, {encoding: 'UTF-8'});
                    }
                }
                // and rewrite its content instead of create a new one
            } else {
                // insert a new diary
                dispatch(await addDiary({
                    id: 0,
                    repoId,
                    title,
                    storeLocation: secondaryDir,
                    createTime: new Date(),
                    lastUpdateTime: new Date(),
                    tags: [],
                }));
                fs.writeFileSync(path.join(rootDir, secondaryDir, currentFileName), input, {encoding: 'UTF-8'});
            }
        }
        dispatch(clearAll());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteEditor);
