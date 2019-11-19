import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { StoreState} from '../types';
import NoteEditor from '../components/Page/Note/NoteEditor';
import {ThunkDispatch} from 'redux-thunk';
import mkdirp from 'mkdirp';
import fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import {addDiary} from '../actions/diary';
import {changeContent, changeEdit, changeTitle, clearAll, editorChangeEdit, editorChangeSplit} from '../actions/note';

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
        dispatch(changeEdit(false));
    },
    changeSplitMode: () => {
        dispatch(editorChangeSplit());
    },
    changeContent: (content: string, contentHtml: string) => {
        dispatch(changeContent(content, contentHtml));
    },
    changeTitle: (title: string) => {
        dispatch(changeTitle(title));
    },
    submit: async (input: string, title: string, rootDir: string, repoId: number) => {
        const secondaryDir = `${moment().format('YYYY')}\\${moment().format('MM')}`;
        if (!!input && !!title) {
            if (!fs.existsSync(path.join(rootDir, secondaryDir))) {
                mkdirp.sync(path.join(rootDir, secondaryDir));
            }
            fs.writeFileSync(path.join(rootDir, secondaryDir, `${title}.md`), input, {encoding: 'UTF-8'});
            dispatch(await addDiary({
                id: 0,
                repoId,
                title: `${title}.md`,
                storeLocation: secondaryDir,
                createTime: new Date(),
                lastUpdateTime: new Date(),
                tags: [],
            }));
        }
        dispatch(clearAll());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteEditor);
