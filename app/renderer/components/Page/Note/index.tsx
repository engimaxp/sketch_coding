import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import CssBaseline from '@material-ui/core/CssBaseline';
import {createStyles, Theme, WithStyles} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import NoteEditor from './NoteEditor';
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
class NotePage extends Component<WithStyles<typeof useStyles>, NotePageState> {

    constructor(props: Readonly<WithStyles<typeof useStyles>>) {
        super(props);
        this.state = {
            inEdit: false
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
      const {inEdit} = this.state;
      return (
          <div style={{height: `calc(100% - ${48}px)`}}>
              <CssBaseline />
              {inEdit ? (<NoteEditor/>) : (
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
