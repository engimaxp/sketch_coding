import {
  CHANGE_CONTENT,
  CHANGE_EDIT,
  CHANGE_TITLE,
  CLEAR_ALL,
  EDITOR_CHANGE_EDIT,
  EDITOR_CHANGE_SPLIT
} from './action_type';

export type noteActions = ChangeEdit |
    EditorChangeEdit |
    EditorChangeSplit|
    ChangeTitle|
    ChangeContent|
    ClearAll;

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
