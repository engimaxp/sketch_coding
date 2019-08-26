import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {createStyles, Theme, WithStyles} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import {settings} from '../../../../constants';
import CreateIcon from '@material-ui/icons/Create';
import * as moment from 'moment';
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
    titleBar: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: settings.markdownEditor.padding,
    },
    title: {
        fontWeight: 'bold',
        color: theme.palette.primary.main
    },
    titleIcon: {
        fontWeight: 'bold',
        color: theme.palette.primary.main
    },
    wrapper: {
        height: `100%`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    }
});
interface NoteEditorState {
    inEdit: boolean;
    title: string;
}
class NoteEditor extends Component<WithStyles<typeof useStyles>, NoteEditorState> {

    constructor(props: Readonly<WithStyles<typeof useStyles>>) {
        super(props);
        this.state = {
            inEdit: false,
            title: `Sketch_${moment().format('YYMMDD_HHmm')}`
        };
    }

    componentDidMount() {

    }
    createNewNote = () => {
        this.setState({
                inEdit: true
            });
    };
  render() {
      const {classes} = this.props;
      const {title} = this.state;
      return (
          <div className={classes.wrapper}>
              <CssBaseline />
              <textarea
                  style={{
                      borderWidth: 0,
                      width: '100%',
                      resize: 'none',
                      flex: 1,
                      paddingTop: settings.markdownEditor.padding,
                      paddingLeft: settings.markdownEditor.padding,
                      fontFamily: settings.markdownEditor.fontFamily,
                      fontSize: settings.markdownEditor.fontSize,
                  }}
                  placeholder={'Type someting here...'}
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
                      <Button color="primary">Preview</Button>
                      <Button color="secondary">Save</Button>
                  </Box>
              </Box>
          </div>
    );
  }
}

export default withStyles(useStyles)(NoteEditor);
