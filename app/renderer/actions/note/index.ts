import {
  CHANGE_CONTENT,
  CHANGE_EDIT,
  CHANGE_TITLE,
  CLEAR_ALL, CODE_MIRROR_CHANGE_CURSOR, CODE_MIRROR_CHANGE_SCROLL,
  EDITOR_CHANGE_EDIT,
  EDITOR_CHANGE_SPLIT, EDITOR_CHANGE_SPLIT_POS, SCROLL_CHANGE
} from './action_type';
import {CodeMirrorPosition} from '../../types/NoteEditor';

export type noteActions = ChangeEdit |
    EditorChangeEdit |
    EditorChangeSplit|
    ChangeTitle|
    ChangeContent|
    ClearAll|
    ScrollChange|
    CodeMirrorChangeCursor|
    CodeMirrorChangeScroll|
    EditorChangeSplitPos;

interface ChangeEdit {
  type: CHANGE_EDIT;
  inChange: boolean;
}

export const changeEdit = (inChange: boolean): ChangeEdit => ({
  type: CHANGE_EDIT,
  inChange
});

interface EditorChangeEdit {
  type: EDITOR_CHANGE_EDIT;
  inChange: boolean;
}

export const editorChangeEdit = (inChange: boolean): EditorChangeEdit => ({
  type: EDITOR_CHANGE_EDIT,
  inChange
});

interface EditorChangeSplit {
  type: EDITOR_CHANGE_SPLIT;
}

export const editorChangeSplit = (): EditorChangeSplit => ({
  type: EDITOR_CHANGE_SPLIT,
});

interface EditorChangeSplitPos {
  type: EDITOR_CHANGE_SPLIT_POS;
  splitPos: number;
}

export const editorChangeSplitPos = (splitPos: number): EditorChangeSplitPos => ({
  type: EDITOR_CHANGE_SPLIT_POS,
  splitPos
});

interface ChangeTitle {
  type: CHANGE_TITLE;
  title: string;
}

export const changeTitle = (title: string): ChangeTitle => ({
  type: CHANGE_TITLE,
  title
});

interface ChangeContent {
  type: CHANGE_CONTENT;
  content: string;
  contentHtml: string;
}

export const changeContent = (content: string, contentHtml: string): ChangeContent => ({
  type: CHANGE_CONTENT,
  content,
  contentHtml
});

interface ClearAll {
  type: CLEAR_ALL;
}

export const clearAll = (): ClearAll => ({
  type: CLEAR_ALL,
});

interface ScrollChange {
  type: SCROLL_CHANGE;
  top: number;
}

export const scrollChange = (top: number): ScrollChange => ({
  type: SCROLL_CHANGE,
  top
});

interface CodeMirrorChangeCursor {
  type: CODE_MIRROR_CHANGE_CURSOR;
  codeCursor: CodeMirrorPosition;
}

export const codeMirrorChangeCursor = (codeCursor: CodeMirrorPosition): CodeMirrorChangeCursor => ({
  type: CODE_MIRROR_CHANGE_CURSOR,
  codeCursor
});

interface CodeMirrorChangeScroll {
  type: CODE_MIRROR_CHANGE_SCROLL;
  codeTop: number;
}

export const codeMirrorChangeScroll = (codeTop: number): CodeMirrorChangeScroll => ({
  type: CODE_MIRROR_CHANGE_SCROLL,
  codeTop
});
