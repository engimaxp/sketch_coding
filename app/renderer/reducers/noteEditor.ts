import NoteEditorStatus, {NoteEditorState} from '../types/NoteEditor';
import {noteActions} from '../actions/note';
import {
  CHANGE_CONTENT,
  CHANGE_EDIT,
  CHANGE_TITLE, CLEAR_ALL,
  EDITOR_CHANGE_EDIT,
  EDITOR_CHANGE_SPLIT
} from '../actions/note/action_type';
import {settings} from '../constants';
import * as moment from 'moment';
export const INITIAL_STATE: NoteEditorStatus = {
  inEdit: false,
  editorStatus: {
    inEdit: true,
    isSplit: false,
    splitPos: settings.markdownEditor.splitView.defaultWidth,
    title: `Sketch_${moment().format('YYMMDD_HHmm')}`,
    content: '',
    contentHtml: '',
  }
};

export default function noteEditor(state: NoteEditorStatus = INITIAL_STATE, action: noteActions): NoteEditorStatus {
  if (action.type === CHANGE_EDIT) {
    return Object.assign({}, state ,  {inEdit: action.inChange});
  } else if (action.type === EDITOR_CHANGE_EDIT) {
    const newNoteEditorState: NoteEditorState = Object.assign({}, state.editorStatus ,  {inEdit: action.inChange});
    return Object.assign({}, state ,  {editorStatus: newNoteEditorState});
  } else if (action.type === EDITOR_CHANGE_SPLIT) {
    const newNoteEditorState: NoteEditorState = Object.assign({}, state.editorStatus ,
        {isSplit: !state.editorStatus.isSplit});
    return Object.assign({}, state ,  {editorStatus: newNoteEditorState});
  } else if (action.type === CHANGE_TITLE) {
    const newNoteEditorState: NoteEditorState = Object.assign({}, state.editorStatus ,  {title: action.title});
    return Object.assign({}, state ,  {editorStatus: newNoteEditorState});
  } else if (action.type === CHANGE_CONTENT) {
    const newNoteEditorState: NoteEditorState = Object.assign({}, state.editorStatus ,  {
      content: action.content,
      contentHtml: action.contentHtml,
    });
    return Object.assign({}, state ,  {editorStatus: newNoteEditorState});
  } else if (action.type === CLEAR_ALL) {
    return Object.assign({}, INITIAL_STATE);
  } else {
    return state;
  }
}
