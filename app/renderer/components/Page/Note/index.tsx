import React, {Component} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {createStyles, Theme, WithStyles} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import NoteEditor from '../../../containers/noteEditor';
import {settings} from '../../../constants';
import NoteSelector from '../../../containers/noteSelector';
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
    },
    add: {
        position: 'absolute',
        right: 20,
        bottom: 20
    },
    card: {
        display: 'flex',
    },
    cardDetails: {
        flex: 1,
    },
    cardMedia: {
        width: 160,
    },
    preview: {
        width: '100%',
        flex: 1,
        height: `calc(100% - ${settings.indexPage.titleHeight}px)`
    },
    listContainer: {
        paddingTop: `${settings.indexPage.titleHeight / 3}px`,
    }
});
interface NotePageProps extends WithStyles<typeof useStyles> {
    inEdit: boolean;
}

class NotePage extends Component<NotePageProps> {
    constructor(props: Readonly<NotePageProps>) {
        super(props);
    }
    render() {
      const {inEdit} = this.props;
      return (
          <div style={{height: `calc(100% - ${settings.indexPage.titleHeight}px)`}}>
              <CssBaseline />
              {inEdit ? (<NoteEditor />) : (<NoteSelector />)}
          </div>
    );
  }
}

export default withStyles(useStyles)(NotePage);
