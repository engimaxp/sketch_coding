import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { StoreState} from '../types';
import NoteSelector from '../components/Page/Note/NoteSelector';
import {ThunkDispatch} from 'redux-thunk';
import {changeEdit, scrollChange} from '../actions/note';
import AccountData from '../types/Account';
import DiaryData from '../types/Diary';
import Page from '../vcs/local/Page';
import {query, refreshDiaries} from '../actions/diary';

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
    syncBetweenDBAndFile: async (account: AccountData, diaries: DiaryData[]) => {
        dispatch(await refreshDiaries(account, diaries));
        console.log(account, diaries);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteSelector);
