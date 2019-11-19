import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import CssBaseline from '@material-ui/core/CssBaseline';
import {createStyles, Theme, WithStyles} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import NoteEditor from '../../../containers/noteEditor';
import {settings} from '../../../constants';

const useStyles = (theme: Theme) => createStyles({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    avatar: {
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
            background: theme.palette.primary.light,
        },
    },
    icon: {
        color: theme.palette.common.white
    }
});
interface NotePageState {
    inEdit: boolean;
}
interface NotePageProps extends WithStyles<typeof useStyles> {
    localDirectory: string;
    repoId: number;
    inEdit: boolean;
    changeInEdit: (inEdit: boolean) => void;
}
class NotePage extends Component<NotePageProps, NotePageState> {

    constructor(props: Readonly<NotePageProps>) {
        super(props);
        this.state = {
            inEdit: this.props.inEdit
        };
    }

    createNewNote = () => {
        this.props.changeInEdit(true);
    };
    render() {
      const {classes, inEdit} = this.props;
      return (
          <div style={{height: `calc(100% - ${settings.indexPage.titleHeight}px)`}}>
              <CssBaseline />
              {inEdit ? (<NoteEditor />) : (
                  /* Add a note icon */
                  <IconButton
                      className={classes.avatar}
                      style={{
                          position: 'absolute',
                          right: 20,
                          bottom: 20
                      }}
                      onClick={this.createNewNote}
                  >
                      <AddIcon className={classes.icon}/>
                  </IconButton>
              )}
          </div>
    );
  }
}

export default withStyles(useStyles)(NotePage);
