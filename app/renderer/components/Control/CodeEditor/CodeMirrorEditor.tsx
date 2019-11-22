import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/theme/darcula.css';
import 'codemirror/theme/idea.css';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/continuelist.js';
import 'codemirror/addon/scroll/simplescrollbars.js';
import 'codemirror/addon/selection/active-line.js';

import 'codemirror/lib/codemirror.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/xml-fold.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/markdown-fold.js';
import 'codemirror/addon/fold/comment-fold.js';

import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/search/matchesonscrollbar.css';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/scroll/annotatescrollbar.js';
import 'codemirror/addon/search/matchesonscrollbar.js';
import 'codemirror/addon/search/jump-to-line.js';

import 'codemirror/mode/apl/apl.js';
import 'codemirror/mode/asn.1/asn.1.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/clojure/clojure.js';
import 'codemirror/mode/cmake/cmake.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/d/d.js';
import 'codemirror/mode/dockerfile/dockerfile.js';
import 'codemirror/mode/dylan/dylan.js';
import 'codemirror/mode/ecl/ecl.js';
import 'codemirror/mode/elm/elm.js';
import 'codemirror/mode/fortran/fortran.js';
import 'codemirror/mode/groovy/groovy.js';
import 'codemirror/mode/haml/haml.js';
import 'codemirror/mode/handlebars/handlebars.js';
import 'codemirror/mode/haskell/haskell.js';
import 'codemirror/mode/htmlembedded/htmlembedded.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/mode/http/http.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/jinja2/jinja2.js';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/mode/nginx/nginx.js';
import 'codemirror/mode/octave/octave.js';
import 'codemirror/mode/oz/oz.js';
import 'codemirror/mode/pascal/pascal.js';
import 'codemirror/mode/perl/perl.js';
import 'codemirror/mode/php/php.js';
import 'codemirror/mode/powershell/powershell.js';
import 'codemirror/mode/pug/pug.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/r/r.js';
import 'codemirror/mode/ruby/ruby.js';
import 'codemirror/mode/sass/sass.js';
import 'codemirror/mode/shell/shell.js';
import 'codemirror/mode/smalltalk/smalltalk.js';
import 'codemirror/mode/soy/soy.js';
import 'codemirror/mode/spreadsheet/spreadsheet.js';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/mode/stylus/stylus.js';
import 'codemirror/mode/swift/swift.js';
import 'codemirror/mode/toml/toml.js';
import 'codemirror/mode/tornado/tornado.js';
import 'codemirror/mode/vb/vb.js';
import 'codemirror/mode/vbscript/vbscript.js';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/mode/yaml/yaml.js';
import 'codemirror/addon/scroll/simplescrollbars.js';
import 'codemirror/addon/scroll/simplescrollbars.css';
import './CodeMirrorEditor.css';

import 'codemirror/keymap/sublime.js';
import 'codemirror/keymap/emacs.js';
import 'codemirror/keymap/vim.js';

import React, {Component} from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';
import {settings} from '../../../constants';
import * as codemirror from 'codemirror';
import {CodeMirrorPosition} from '../../../types/NoteEditor';
interface CodeMirrorEditorProps {
    mode: string;
    className: string;
    theme: string;
    content: string;
    onChange: (value: string) => void;
    onPaste: (event: Event) => Promise<string>;
    scrollPosition: number;
    cursorPosition: CodeMirror.Position;
    changeCursor: (cursor: CodeMirrorPosition) => void;
    changeScrollPosition: (scrollPosition: number) => void;
}
interface CodeMirrorEditorStats {
    scrollPosition: number;
    cursorPosition: CodeMirror.Position;
}
export default class CodeMirrorEditor extends Component<CodeMirrorEditorProps, CodeMirrorEditorStats> {

    constructor(props: CodeMirrorEditorProps) {
        super(props);
        this.state = {
            cursorPosition: this.props.cursorPosition,
            scrollPosition: this.props.scrollPosition
        };
    }
    componentWillUnmount(): void {
        console.log(`unmount ${this.state.cursorPosition}, ${this.state.scrollPosition}`);
        this.props.changeCursor(this.state.cursorPosition);
        this.props.changeScrollPosition(this.state.scrollPosition);
    }

    render() {
        const {
            mode, theme, content, className,
            onChange, onPaste
        } = this.props;
        const { cursorPosition, scrollPosition} = this.state;

        return (
            <CodeMirror
                editorDidMount={(editor: codemirror.Editor, value: string, cb: () => void) => {
                    editor.focus();
                    editor.getDoc().setCursor({
                        ch: cursorPosition.ch,
                        line: cursorPosition.line,
                        sticky: cursorPosition.sticky
                    });
                    editor.scrollTo(0, scrollPosition);
                }}
                editorWillUnmount={(lib: any) => {
                }}
                onCursorActivity={(editor: codemirror.Editor) => {
                    this.setState({
                        cursorPosition: (Object.assign({}, editor.getDoc().getCursor())) as CodeMirrorPosition
                    });
                }}
                className={className}
                value={content}
                onScroll={(editor: codemirror.Editor, data: codemirror.ScrollInfo) => {
                    this.setState({scrollPosition: data.top});
                }}
                options={{
                    mode,
                    theme,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                    lineWrapping: true,
                    scrollbarStyle: 'overlay',
                    keyMap: settings.markdownEditor.keyMap,
                    extraKeys: {
                        'Ctrl-Q': (cm: any) => {
                            cm.foldCode(cm.getCursor());
                        },
                        'Alt-F': 'findPersistent',
                    },
                    foldGutter: true,
                    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
                }}
                onBeforeChange={(editor, data, value) => {
                    onChange(value);
                }}
                onChange={(editor, data, value) => {
                    onChange(value);
                }}
                onPaste={async (editor, event) => {
                    const result = await onPaste(event);
                    if (!!result) {
                        editor.getDoc().replaceSelection(result);
                    }
                }}
            />
        );
    }
}
