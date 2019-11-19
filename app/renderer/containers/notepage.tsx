import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { StoreState} from '../types';
import NotePage from '../components/Page/Note';
import {ThunkDispatch} from 'redux-thunk';
import {changeEdit} from '../actions/note';

const mapStateToProps = (state: StoreState) => ({
    localDirectory: state.account.data.repo ?
        state.account.data.repo!.localDirectory : '',
    repoId: state.account.data.repo ?
        state.account.data.repo!.repoId : 0,
    inEdit: state.noteEditor.inEdit ?
        state.noteEditor!.inEdit : false
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
    changeInEdit: (inEdit: boolean) => {
        dispatch(changeEdit(inEdit));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(NotePage);
