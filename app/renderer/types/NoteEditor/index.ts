
import Page from '../../vcs/local/Page';
export default interface NoteEditorStatus {
    inEdit?: boolean;
    editorStatus: NoteEditorState;
    listScrollTop: number;
    page: Page;
}

export interface NoteEditorState {
    inEdit: boolean; // is in preview mode
    editingDiaryId: number;
    isSplit: boolean;
    splitPos: number;
    title: string;
    content: string;
    contentHtml: string;
    codeMirrorEditorState: CodeMirrorEditorState;
}

export interface CodeMirrorEditorState {
    scrollPosition: number;
    cursorPosition: CodeMirrorPosition;
}

export interface CodeMirrorPosition {
    ch: number;
    line: number;
    sticky?: string;
}
