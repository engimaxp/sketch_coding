import NoteEditorStatus, {CodeMirrorEditorState, NoteEditorState} from '../types/NoteEditor';
import {noteActions} from '../actions/note';
import {
  CHANGE_CONTENT,
  CHANGE_EDIT,
  CHANGE_TITLE, CLEAR_ALL, CODE_MIRROR_CHANGE_CURSOR, CODE_MIRROR_CHANGE_SCROLL,
  EDITOR_CHANGE_EDIT,
  EDITOR_CHANGE_SPLIT, SCROLL_CHANGE
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
    codeMirrorEditorState: {
      scrollPosition: 0,
      cursorPosition: {
        ch: 0,
        line: 0,
        sticky: undefined,
      },
    },
    content: '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。' +
        '你好，订单状态 @{69:订单状态} 。#TXT{Attr:[Color:#2196f3 ],Text:这里' +
        ',Link:} tu:#IMG{Text:tuTxt,Link:hh://end} 请点击链接 #HREF{Text:退订' +
        '链接,Link:http://o.ctrip.com/refund/1}或者联系客服人员 #TEL{Text:1001523525,Link:}。谢谢。',
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
    return Object.assign({}, INITIAL_STATE);
  } else {
    return state;
  }
}
