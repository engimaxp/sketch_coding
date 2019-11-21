/* -- note lister page -- */

// in note list container mode ,user can double click a note or click create note button to enter editor mode
export const CHANGE_EDIT = 'changeEdit';
export type CHANGE_EDIT = typeof CHANGE_EDIT;

// scroll height change
export const SCROLL_CHANGE = 'scrollChange';
export type SCROLL_CHANGE = typeof SCROLL_CHANGE;

/* -- note editor -- */

// in editor mode ,user can switch between preview view and editor view
export const EDITOR_CHANGE_EDIT = 'editorChangeEdit';
export type EDITOR_CHANGE_EDIT = typeof EDITOR_CHANGE_EDIT;

// in editor mode ,user can split the view both containing preview view and editor view
export const EDITOR_CHANGE_SPLIT = 'editorChangeSplit';
export type EDITOR_CHANGE_SPLIT = typeof EDITOR_CHANGE_SPLIT;

// in editor mode ,user can change split position
export const EDITOR_CHANGE_SPLIT_POS = 'editorChangeSplitPos';
export type EDITOR_CHANGE_SPLIT_POS = typeof EDITOR_CHANGE_SPLIT_POS;

// change title
export const CHANGE_TITLE = 'changeTitle';
export type CHANGE_TITLE = typeof CHANGE_TITLE;

// change content
export const CHANGE_CONTENT = 'changeContent';
export type CHANGE_CONTENT = typeof CHANGE_CONTENT;

// clear all state and set to initial
export const CLEAR_ALL = 'clearAll';
export type CLEAR_ALL = typeof CLEAR_ALL;

/* -- code mirror editor -- */

// code mirror change cursor
export const CODE_MIRROR_CHANGE_CURSOR = 'codeMirrorChangeCursor';
export type CODE_MIRROR_CHANGE_CURSOR = typeof CODE_MIRROR_CHANGE_CURSOR;

// code mirror scroll
export const CODE_MIRROR_CHANGE_SCROLL = 'codeMirrorChangeScroll';
export type CODE_MIRROR_CHANGE_SCROLL = typeof CODE_MIRROR_CHANGE_SCROLL;
