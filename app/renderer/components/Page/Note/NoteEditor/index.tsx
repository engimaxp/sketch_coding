import React, {Component} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {createStyles, Theme, WithStyles} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import {settings} from '../../../../constants';
import CreateIcon from '@material-ui/icons/Create';
import SaveIcon from '@material-ui/icons/Save';
import PageviewIcon from '@material-ui/icons/PageviewOutlined';
import SplitIcon from '@material-ui/icons/VerticalSplitOutlined';
import SplitActiveIcon from '@material-ui/icons/VerticalSplit';
import ReturnIcon from '@material-ui/icons/KeyboardReturn';
import * as moment from 'moment';
import Typography from '@material-ui/core/Typography';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import * as path from 'path';
import {escapeHtml, replaceEntities, unescapeMd} from 'remarkable/lib/common/utils';
import Remarkable from 'remarkable';
import CodeMirrorEditor from '../../../Control/CodeEditor/CodeMirrorEditor';
import SplitPane from 'react-split-pane';
import './SplitPane.css';

const useStyles = (theme: Theme) => createStyles({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    editBox: {
        backgroundColor: theme.palette.common.white,
        flex: 1,
        borderWidth: 0
    },
    buttonBar: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    buttonBar2: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    titleBar: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: settings.markdownEditor.padding,
    },
    title: {
        fontWeight: 'bold',
        color: theme.palette.primary.main,
        paddingLeft: 5
    },
    titleIcon: {
        fontWeight: 'bold',
        color: theme.palette.primary.main
    },
    editWrapper: {
        height: `100%`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    wrapper: {
        height: `100%`
    },
    codeMirrorEditor: {
        borderWidth: 0,
        height: `calc(100% - ${settings.indexPage.titleHeight}px)`,
        width: '100%',
        resize: 'none',
        flex: 1,
        fontFamily: settings.markdownEditor.fontFamily,
        fontSize: settings.markdownEditor.fontSize,
    },
    codeMirrorSplitView: {
        borderWidth: 0,
        width: '100%',
        height: `100%`,
        resize: 'none',
        flex: 1,
        fontFamily: settings.markdownEditor.fontFamily,
        fontSize: settings.markdownEditor.fontSize,
    }
});
interface NoteEditorState {
    inEdit: boolean; // is in preview mode
    isSplit: boolean;
    splitPos: number;
    title: string;
    content: string;
    contentHtml: string;
}
interface NoteEditorProps extends WithStyles<typeof useStyles> {
    submit: (input: string) => void;
    localDirector: string;
}
class NoteEditor extends Component<NoteEditorProps, NoteEditorState> {

    private initialTitle: string = `Sketch_${moment().format('YYMMDD_HHmm')}`;
    private readonly md: any;
    constructor(props: Readonly<NoteEditorProps>) {
        super(props);
        this.state = {
            inEdit: true,
            isSplit: false,
            splitPos: settings.markdownEditor.splitView.defaultWidth,
            title: this.initialTitle,
            content: '',
            contentHtml: '',
        };

        this.md = new Remarkable({
            highlight: (str: string, lang: string) => {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, str).value;
                    } catch (err) {}
                }

                try {
                    return hljs.highlightAuto(str).value;
                } catch (err) {}

                return ''; // use external default escaping
            }
        });
        overrideMarkdownParseToAdaptLink(this.md, this.props.localDirector);
    }
    preview = () => {
        this.setState({
            inEdit: false,
        });
    };
    split = () => {
        this.setState((prevState: NoteEditorState) => {
            return {
                isSplit: !prevState.isSplit,
            };
        });
    };
    returnEdit = () => {
        this.setState({
            inEdit: true
        });
    };
    save = () => {
        this.props.submit(this.state.content);
    };
    onChange = (value: string) => {
        if (!!value) {
            let firstLine: string = value;
            firstLine = firstLine.slice(0, firstLine.indexOf('\n'));
            if (firstLine.startsWith('#')) {
                firstLine = firstLine.substring(firstLine.indexOf('#') + 1);
            }
            firstLine = firstLine.trim();
            if (firstLine.length > settings.markdownEditor.titleMaxLength) {
                firstLine = firstLine.substring(0, settings.markdownEditor.titleMaxLength);
            }
            if (!!firstLine) {
                this.setState({
                    title: firstLine
                });
            }
        } else {
            this.setState({
                title: this.initialTitle
            });
        }
        let currentHtml = this.state.contentHtml;
        try {
            currentHtml = this.md.render(value);
        } catch (e) {
            console.log(e);
        }
        this.setState({
            content: value,
            contentHtml: currentHtml
        });
    };
    render() {
        const {classes} = this.props;
        const {title, isSplit, inEdit, content, contentHtml, splitPos} = this.state;
        const oneScreenEditDisplay = !isSplit && inEdit;
        const oneScreenPreviewDisplay = !isSplit && !inEdit;
        return (
            <div className={classes.wrapper}>
                {oneScreenEditDisplay ? (/* edit */
                    <div className={classes.editWrapper}>
                        <CssBaseline />
                        <CodeMirrorEditor
                            className={classes.codeMirrorEditor}
                            onChange={this.onChange}
                            onBeforeChange={this.onChange}
                            mode={'markdown'}
                            theme={'idea'}
                            content={content}
                        />
                        <Box
                            className={classes.titleBar}
                        >
                            <Box style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <CreateIcon className={classes.titleIcon}/>
                                <FormLabel className={classes.title}>{title}</FormLabel>
                            </Box>
                            <Box
                                className={classes.buttonBar}
                            >
                                <Button
                                    color="primary"
                                    onClick={this.preview}
                                ><PageviewIcon/></Button>
                                <Button
                                    color="primary"
                                    onClick={this.split}
                                >{isSplit ? <SplitActiveIcon/> : <SplitIcon/>}</Button>
                                <Button
                                    color="secondary"
                                    onClick={this.save}
                                ><SaveIcon/></Button>
                            </Box>
                        </Box>
                    </div>) : null}
                {oneScreenPreviewDisplay ? (/* preview */
                    <div className={classes.editWrapper}>
                        <CssBaseline />
                        <Typography
                            style={{
                                width: '100%',
                                flex: 1,
                                paddingTop: settings.markdownEditor.padding,
                                paddingLeft: settings.markdownEditor.padding,
                                fontFamily: settings.markdownEditor.fontFamily,
                                fontSize: settings.markdownEditor.fontSize,
                                overflowX: 'hidden',
                                height: '100%'
                            }}
                            dangerouslySetInnerHTML={{__html: contentHtml}}
                        />
                        <Box
                            className={classes.buttonBar2}
                        >
                            <Button
                                color="primary"
                                onClick={this.returnEdit}
                            ><ReturnIcon/></Button>
                        </Box>
                    </div>
                ) : null}
                {isSplit ? (
                    <div className={classes.editWrapper}>
                        <CssBaseline />
                        <SplitPane split="vertical"
                                   style={{
                                       position: 'relative'
                                   }}
                                   pane1Style={{
                                       width: `calc(100% - ${splitPos}px)`
                                   }}
                                   pane2Style={{
                                       width: `${splitPos}px`
                                   }}
                                   minSize={settings.markdownEditor.splitView.minWidth}
                                   maxSize={-settings.markdownEditor.splitView.minWidth}
                                   primary="second"
                                   defaultSize={splitPos}
                                   onChange={ size => this.setState({splitPos: size}) }
                                   className={classes.codeMirrorEditor}>
                            <CodeMirrorEditor
                                className={classes.codeMirrorSplitView}
                                onChange={this.onChange}
                                onBeforeChange={this.onChange}
                                mode={'markdown'}
                                theme={'idea'}
                                content={content}
                            />
                            <Typography
                                style={{
                                    width: '100%',
                                    flex: 1,
                                    paddingTop: settings.markdownEditor.padding,
                                    paddingLeft: settings.markdownEditor.padding,
                                    fontFamily: settings.markdownEditor.fontFamily,
                                    fontSize: settings.markdownEditor.fontSize,
                                    overflowX: 'hidden',
                                    height: '100%'
                                }}
                                dangerouslySetInnerHTML={{__html: contentHtml}}
                            />
                        </SplitPane>
                        <Box
                            className={classes.titleBar}
                        >
                            <Box style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <CreateIcon className={classes.titleIcon}/>
                                <FormLabel className={classes.title}>{title}</FormLabel>
                            </Box>
                            <Box
                                className={classes.buttonBar}
                            >
                                <Button
                                    color="primary"
                                    onClick={this.split}
                                >{isSplit ? <SplitActiveIcon/> : <SplitIcon/>}</Button>
                                <Button
                                    color="secondary"
                                    onClick={this.save}
                                ><SaveIcon/></Button>
                            </Box>
                        </Box>
                    </div>
                ) : null}
            </div>
        );
    }
}

const overrideMarkdownParseToAdaptLink = (md: Remarkable, assetDir: string): void => {
    md.renderer.rules.image = (tokens, idx, options /*, env */) => {
        const srcUrl = path.resolve(assetDir, path.basename(tokens[idx].src));

        const src = ' src="' + escapeHtml(srcUrl) + '"';
        const style = ` style="width:100%;padding-right:${settings.markdownEditor.padding}px"`;
        const title = tokens[idx].title ? (' title="' + escapeHtml(replaceEntities(tokens[idx].title)) + '"') : '';
        const alt = ' alt="' + (tokens[idx].alt ? escapeHtml(replaceEntities(unescapeMd(tokens[idx].alt))) : '') + '"';
        const suffix = options!.xhtmlOut ? ' /' : '';

        // noinspection HtmlRequiredAltAttribute
        return '<img' + src + style + alt + title + suffix + '>';
    };
};

export default withStyles(useStyles)(NoteEditor);
