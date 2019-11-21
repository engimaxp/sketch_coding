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
import CardMedia from '@material-ui/core/CardMedia';
import Hidden from '@material-ui/core/Hidden';
import Container from '@material-ui/core/Container';

import { Scrollbars } from 'react-custom-scrollbars';
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
interface NoteSelectorProps extends WithStyles<typeof useStyles> {
    inEdit: boolean;
    changeInEdit: (inEdit: boolean) => void;
    listScrollTop: number;
    scrollTop: (top: number) => void;
}

interface NoteSelectorState {
    listScrollTop: number;
}

const featuredPosts = [
    {
        title: 'Featured post',
        date: 'Nov 12',
        description:
            'This is a wider card with supporting text below as a natural lead-in to additional content.',
    },
    {
        title: 'Post title1',
        date: 'Nov 11',
        description:
            'This is a wider card with supporting text below as a natural lead-in to additional content.',
    },
    {
        title: 'Post title2',
        date: 'Nov 11',
        description:
            'This is a wider card with supporting text below as a natural lead-in to additional content.',
    },
    {
        title: 'Post title3',
        date: 'Nov 11',
        description:
            'This is a wider card with supporting text below as a natural lead-in to additional content.',
    },
    {
        title: 'Post title4',
        date: 'Nov 11',
        description:
            'This is a wider card with supporting text below as a natural lead-in to additional content.',
    },
    {
        title: 'Post title5',
        date: 'Nov 11',
        description:
            'This is a wider card with supporting text below as a natural lead-in to additional content.',
    },
    {
        title: 'Post title6',
        date: 'Nov 11',
        description:
            'This is a wider card with supporting text below as a natural lead-in to additional content.',
    },
    {
        title: 'Post title7',
        date: 'Nov 11',
        description:
            'This is a wider card with supporting text below as a natural lead-in to additional content.',
    },
];
class NoteSelector extends Component<NoteSelectorProps, NoteSelectorState> {
    private readonly scrollRef!: RefObject<Scrollbars>;
    constructor(props: Readonly<NoteSelectorProps>) {
        super(props);
        this.scrollRef = React.createRef();
        this.state = {
            listScrollTop: this.props.listScrollTop
        };
    }
    componentDidMount(): void {
        this.scrollRef!.current!.scrollTop(this.props.listScrollTop);
    }
    componentWillUnmount(): void {
        this.props.scrollTop(this.state.listScrollTop);
    }

    createNewNote = () => {
        this.props.changeInEdit(true);
    };
    render() {
      const {classes} = this.props;
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
                      <Grid container spacing={4}>
                          {featuredPosts.map(post => (
                              <Grid item key={post.title} xs={12} md={6}>
                                  <CardActionArea component="a" href="#">
                                      <Card className={classes.card}>
                                          <div className={classes.cardDetails}>
                                              <CardContent>
                                                  <Typography component="h2" variant="h5">
                                                      {post.title}
                                                  </Typography>
                                                  <Typography variant="subtitle1" color="textSecondary">
                                                      {post.date}
                                                  </Typography>
                                                  <Typography variant="subtitle1" paragraph>
                                                      {post.description}
                                                  </Typography>
                                                  <Typography variant="subtitle1" color="primary">
                                                      Continue reading...
                                                  </Typography>
                                              </CardContent>
                                          </div>
                                          <Hidden xsDown>
                                              <CardMedia
                                                  className={classes.cardMedia}
                                                  image="https://source.unsplash.com/random"
                                                  title="Image title"
                                              />
                                          </Hidden>
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
