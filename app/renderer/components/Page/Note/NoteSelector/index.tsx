import React, {Component, RefObject} from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import {createStyles, Theme, WithStyles} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import {settings} from '../../../../constants';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import { Scrollbars } from 'react-custom-scrollbars';
import Timeout = NodeJS.Timeout;
import AccountData from '../../../../types/Account';
import DiaryData, {TagData} from '../../../../types/Diary';
import Page from '../../../../vcs/local/Page';
import moment from 'moment';
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
        display: 'flex'
    },
    cardDetails: {
        flex: 1,
    },
    cardContent: {
        padding: theme.spacing(2, 2, 2, 2)
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
        padding: theme.spacing(0, 0, 0, 0)
    }
});
interface NoteSelectorProps extends WithStyles<typeof useStyles> {
    inEdit: boolean;
    changeInEdit: (inEdit: boolean) => void;
    listScrollTop: number;
    scrollTop: (top: number) => void;
    syncBetweenDBAndFile: (account: AccountData, diaries: DiaryData[]) => Promise<void>;
    getFromDB: (account: AccountData, pageInfo: Page) => Promise<void>;
    currentPage: Page;
    account: AccountData;
    diaries: DiaryData[];
    openSelected: (diary: DiaryData, account: AccountData) => Promise<void>;
}

interface NoteSelectorState {
    listScrollTop: number;
}

class NoteSelector extends Component<NoteSelectorProps, NoteSelectorState> {
    private readonly scrollRef!: RefObject<Scrollbars>;
    private timeoutFunction: Timeout;
    constructor(props: Readonly<NoteSelectorProps>) {
        super(props);
        this.scrollRef = React.createRef();
        this.state = {
            listScrollTop: this.props.listScrollTop
        };
    }
    async componentDidMount(): Promise<void> {
        if (!this.props.account || !this.props.account!.repo) {
            return;
        }
        if (!this.props.diaries || this.props.diaries.length === 0) {
            await this.props.getFromDB(this.props.account, this.props.currentPage);
        }
        this.scrollRef!.current!.scrollTop(this.props.listScrollTop);
        await this.props.syncBetweenDBAndFile(this.props.account, []);
        this.timeoutFunction = setInterval(async () => {
            await this.props.syncBetweenDBAndFile(this.props.account, []);
        }, 60000);
    }
    componentWillUnmount(): void {
        this.props.scrollTop(this.state.listScrollTop);
        clearInterval(this.timeoutFunction);
    }

    createNewNote = () => {
        this.props.changeInEdit(true);
    };
    render() {
      const {classes, diaries, openSelected, account} = this.props;
      return (
          <div style={{height: '100%'}}>
              <Scrollbars onScrollStop={() => {
                  this.setState({listScrollTop: this.scrollRef!.current!.getScrollTop()});
              }}
                          ref={this.scrollRef} className={classes.preview}
                          renderView={(props2: any) => (
                              <div {...props2} style={{ ...props2.style, overflowX: 'hidden' }} />
                          )}
                          renderTrackHorizontal=
                              {(props2: any) => <div {...props2}
                                                     style={{display: 'none'}}
                                                     className="track-horizontal"/>}
                          style={{ width: `calc(100%-${settings.markdownEditor.padding}px)`}}>
                  <Container maxWidth="lg" className={classes.listContainer}>
                      <Grid container spacing={0}>
                          {diaries.map((diary: DiaryData) => (
                              <Grid item key={diary.id} xs={12} md={6}>
                                  <CardActionArea component="a" onClick={() => openSelected(diary, account)}>
                                      <Card className={classes.card}
                                            elevation={0}
                                            square={false}
                                      >
                                          <div className={classes.cardDetails}>
                                              <CardContent className={classes.cardContent}>
                                                  <Typography component="div"
                                                              variant="h5"
                                                  >
                                                      {diary.title}
                                                  </Typography>
                                                  <Typography variant="body2">
                                                      {diary.tags.map((y: TagData) => y.tagName).join(',')}
                                                  </Typography>
                                                  <Typography variant="body2" display={'inline'}>
                                                      {moment(diary.createTime).format('MMMM Do YYYY, h:mm:ss a')}
                                                  </Typography>
                                              </CardContent>
                                          </div>
                                      </Card>
                                  </CardActionArea>
                              </Grid>
                          ))}
                      </Grid>
                  </Container>
              </Scrollbars>
              <IconButton
                  className={`${classes.avatar} ${classes.add}`}
                  onClick={this.createNewNote}
              >
                  <AddIcon className={classes.icon}/>
              </IconButton>
          </div>
    );
  }
}

export default withStyles(useStyles)(NoteSelector);
