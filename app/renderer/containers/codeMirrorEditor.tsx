import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { StoreState} from '../types';
import {ThunkDispatch} from 'redux-thunk';
import {CodeMirrorPosition} from '../types/NoteEditor';
import CodeMirrorEditor from '../components/Control/CodeEditor/CodeMirrorEditor';
import {codeMirrorChangeCursor, codeMirrorChangeScroll} from '../actions/note';

const mapStateToProps = (state: StoreState) => ({
    scrollPosition: state.noteEditor.editorStatus.codeMirrorEditorState.scrollPosition,
    cursorPosition: state.noteEditor.editorStatus.codeMirrorEditorState.cursorPosition
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
    changeCursor: (cursor: CodeMirrorPosition) => {
        dispatch(codeMirrorChangeCursor(cursor));
    },
    changeScrollPosition: (scrollPosition: number) => {
        dispatch(codeMirrorChangeScroll(scrollPosition));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CodeMirrorEditor);
