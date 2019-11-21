import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { StoreState} from '../types';
import NoteSelector from '../components/Page/Note/NoteSelector';
import {ThunkDispatch} from 'redux-thunk';
import {changeEdit, scrollChange} from '../actions/note';

const mapStateToProps = (state: StoreState) => ({
    inEdit: state.noteEditor.inEdit ?
        state.noteEditor!.inEdit : false,
    listScrollTop: state.noteEditor.listScrollTop ?
        state.noteEditor!.listScrollTop : 0,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
    changeInEdit: (inEdit: boolean) => {
        dispatch(changeEdit(inEdit));
    },
    scrollTop: (top: number) => {
        dispatch(scrollChange(top));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteSelector);
