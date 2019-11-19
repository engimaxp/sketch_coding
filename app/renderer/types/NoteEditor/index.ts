export default interface NoteEditorStatus {
    inEdit?: boolean;
    editorStatus: NoteEditorState;
}

export interface NoteEditorState {
    inEdit: boolean; // is in preview mode
    isSplit: boolean;
    splitPos: number;
    title: string;
    content: string;
    contentHtml: string;
}
