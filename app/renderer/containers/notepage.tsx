import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { StoreState} from '../types';
import NotePage from '../components/Page/Note';
import {ThunkDispatch} from 'redux-thunk';
import {addDiary} from '../actions/diary';
import DiaryData from '../types/Diary';

const mapStateToProps = (state: StoreState) => ({
    localDirectory: state.account.data.repo ?
        state.account.data.repo!.localDirectory : '',
    repoId: state.account.data.repo ?
        state.account.data.repo!.repoId : 0,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
    saveANewNote: async (diary: DiaryData) => {
        dispatch(await addDiary(diary));
        // todo: save to db and sync to local meta info
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(NotePage);
