import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import CssBaseline from '@material-ui/core/CssBaseline';
import {createStyles, Theme, WithStyles} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import NoteEditor from './NoteEditor';
import {settings} from '../../../constants';
import mkdirp from 'mkdirp';
import fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';

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
    saveANewNote: (diaryName: string, diaryLocation: string) => void;
}
class NotePage extends Component<NotePageProps, NotePageState> {

    constructor(props: Readonly<NotePageProps>) {
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
    getANewNote = (input: string, title: string) => {
        const rootDir = this.props.localDirectory;
        const secondaryDir = `${moment().format('YYYY')}\\${moment().format('MM')}`;
        if (!!input && !!title) {
            if (!fs.existsSync(path.join(rootDir, secondaryDir))) {
                mkdirp.sync(path.join(rootDir, secondaryDir));
            }
            fs.writeFileSync(path.join(rootDir, secondaryDir, `${title}.md`), input, {encoding: 'UTF-8'});
            this.props.saveANewNote(`${title}.md`, secondaryDir);
        }
        this.setState({
            inEdit: false
        });
    };
  render() {
      const {classes, localDirectory} = this.props;
      const {inEdit} = this.state;
      return (
          <div style={{height: `calc(100% - ${settings.indexPage.titleHeight}px)`}}>
              <CssBaseline />
              {inEdit ? (<NoteEditor localDirector={localDirectory}
                  submit={this.getANewNote}/>) : (
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
