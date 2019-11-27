import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { StoreState} from '../types';
import NoteSelector from '../components/Page/Note/NoteSelector';
import {ThunkDispatch} from 'redux-thunk';
import {changeEdit, scrollChange} from '../actions/note';
import AccountData from '../types/Account';
import DiaryData from '../types/Diary';
import {LocalFileInfo, searchAndBuildIndexReadme} from '../vcs/file/LocalFileLoader';
import Page from '../vcs/local/Page';
import {query} from '../actions/diary';

const mapStateToProps = (state: StoreState) => ({
    inEdit: state.noteEditor.inEdit ?
        state.noteEditor!.inEdit : false,
    listScrollTop: state.noteEditor.listScrollTop ?
        state.noteEditor!.listScrollTop : 0,
    currentPage: state.noteEditor.page,
    account: state.account.data,
    diaries: state.diary.diaries
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
    changeInEdit: (inEdit: boolean) => {
        dispatch(changeEdit(inEdit));
    },
    scrollTop: (top: number) => {
        dispatch(scrollChange(top));
    },
    getFromDB: async (account: AccountData, pageInfo: Page) => {
        dispatch(await query(account!.userId, account!.repo!.repoId, pageInfo));
    },
    syncBetweenDBAndFile: async (account: AccountData, diaries: DiaryData[], pageInfo: Page) => {
        if (!(!!account && !!account.repo && !!account.repo!.localDirectory)) {
            return;
        }
        let filesRefreshed: LocalFileInfo[] = [];
        try {
            filesRefreshed = await searchAndBuildIndexReadme(account.repo!.localDirectory);
        } catch (e) {
            console.log(e);
        }
        if (!!filesRefreshed) {
            // todo: check all local file and refresh to db

            //  then if modified, dispatch to the session store
            // dispatch(refresh(await saveToDB(filesRefreshed, account)));
        }
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteSelector);
