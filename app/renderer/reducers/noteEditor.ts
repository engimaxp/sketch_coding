import NoteEditorStatus, {CodeMirrorEditorState, NoteEditorState} from '../types/NoteEditor';
import {noteActions} from '../actions/note';
import {
  CHANGE_CONTENT,
  CHANGE_EDIT, CHANGE_PAGE,
  CHANGE_TITLE, CLEAR_ALL, CODE_MIRROR_CHANGE_CURSOR, CODE_MIRROR_CHANGE_SCROLL, EDIT_ENTER,
  EDITOR_CHANGE_EDIT,
  EDITOR_CHANGE_SPLIT, SCROLL_CHANGE
} from '../actions/note/action_type';
import {settings} from '../constants';
import * as moment from 'moment';
import Page from '../vcs/local/Page';
export const INITIAL_STATE: NoteEditorStatus = {
  inEdit: false,
  page: new Page(1, settings.diaryPageDefaultSize),
  editorStatus: {
    inEdit: true,
    editingDiaryId: 0,
    isSplit: false,
    splitPos: settings.markdownEditor.splitView.defaultWidth,
    title: `Sketch_${moment().format('YYMMDD_HHmm')}`,
    codeMirrorEditorState: {
      scrollPosition: 0,
      cursorPosition: {
        ch: 0,
        line: 0,
        sticky: undefined,
      },
    },
    content: '',
    contentHtml: '',
  },
  listScrollTop: 0
};

export default function noteEditor(state: NoteEditorStatus = INITIAL_STATE, action: noteActions): NoteEditorStatus {
  if (action.type === CHANGE_EDIT) {
    return Object.assign({}, state ,  {inEdit: action.inChange});
  } else if (action.type === SCROLL_CHANGE) {
    return Object.assign({}, state ,  {listScrollTop: action.top});
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
  } else if (action.type === CODE_MIRROR_CHANGE_CURSOR) {
    const codeMirrorEditorStateData: CodeMirrorEditorState =
        Object.assign({}, state.editorStatus.codeMirrorEditorState, {
      cursorPosition: action.codeCursor
    });
    const newNoteEditorState: NoteEditorState = Object.assign({}, state.editorStatus ,  {
      codeMirrorEditorState: codeMirrorEditorStateData,
    });
    return Object.assign({}, state ,  {editorStatus: newNoteEditorState});
  } else if (action.type === CODE_MIRROR_CHANGE_SCROLL) {
    const codeMirrorEditorStateData: CodeMirrorEditorState =
        Object.assign({}, state.editorStatus.codeMirrorEditorState, {
      scrollPosition: action.codeTop
    });
    const newNoteEditorState: NoteEditorState = Object.assign({}, state.editorStatus ,  {
      codeMirrorEditorState: codeMirrorEditorStateData,
    });
    return Object.assign({}, state ,  {editorStatus: newNoteEditorState});
  }  else if (action.type === CLEAR_ALL) {
    return Object.assign({}, INITIAL_STATE, {page: state.page});
  } else if (action.type === CHANGE_PAGE) {
    return Object.assign({}, state ,  {page: new Page(action.pageIndex, action.pageSize)});
  } else if (action.type === EDIT_ENTER) {
    const newNoteEditorState: NoteEditorState = Object.assign({}, INITIAL_STATE.editorStatus ,  {
      content: action.content,
      contentHtml: action.contentHtml,
      title: action.title,
      editingDiaryId: action.editingId
    });
    return Object.assign({}, state ,  {editorStatus: newNoteEditorState, inEdit: true});
  } else {
    return state;
  }
}
