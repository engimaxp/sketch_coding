import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { StoreState} from '../types';
import NoteSelector from '../components/Page/Note/NoteSelector';
import {ThunkDispatch} from 'redux-thunk';
import {changeEdit, changePage, editEnter, scrollChange} from '../actions/note';
import AccountData from '../types/Account';
import DiaryData from '../types/Diary';
import Page from '../vcs/local/Page';
import {query, refreshDiaries} from '../actions/diary';
import fs from 'fs';

const mapStateToProps = (state: StoreState) => ({
    inEdit: state.noteEditor.inEdit ?
        state.noteEditor!.inEdit : false,
    listScrollTop: state.noteEditor.listScrollTop ?
        state.noteEditor!.listScrollTop : 0,
    currentPage: state.noteEditor.page,
    account: state.account.data,
    diaries: state.diary.diaries,
    diaryCountTotal: state.diary.diaryCountTotal
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
    },
    openSelected: async (diary: DiaryData, account: AccountData) => {
        const fileLocaltion = `${account.repo!.localDirectory}`
            + `\\${diary.createTime.getUTCFullYear()}`
            + `\\${(diary.createTime.getMonth() + 1).toString().padStart(2, '0')}`
            + `\\${diary.title}.md`;
        if (await fs.existsSync(fileLocaltion)) {
            const content = await fs.readFileSync(fileLocaltion, {encoding: 'utf-8', flag: 'r'});
            dispatch(editEnter(diary.title, content, account.repo!.localDirectory, diary.id));
        }
    },
    changePage: async (account: AccountData, pageIndex: number, pageSize: number) => {
        dispatch(changePage(pageIndex, pageSize));
        dispatch(await query(account!.userId, account!.repo!.repoId, new Page(pageIndex, pageSize)));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteSelector);
