import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { StoreState} from '../types';
import NotePage from '../components/Page/Note';
import {ThunkDispatch} from 'redux-thunk';
import {changeEdit} from '../actions/note';

const mapStateToProps = (state: StoreState) => ({
    inEdit: state.noteEditor.inEdit ?
        state.noteEditor!.inEdit : false
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
    changeInEdit: (inEdit: boolean) => {
        dispatch(changeEdit(inEdit));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(NotePage);
