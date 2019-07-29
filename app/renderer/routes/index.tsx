import React, { Fragment } from 'react';
import {Route, Switch} from 'react-router';
import NavBar from '../components/NavBar';
import Avatar from '@material-ui/core/Avatar';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import CssBaseline from '@material-ui/core/CssBaseline';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SettingsIcon from '@material-ui/icons/Settings';
import Popover from '@material-ui/core/Popover';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import {findRoute, indexPage, navRoutes} from './routeMap';
import {connect} from 'react-redux';
import {RouterState, StoreState} from '../types';
import {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import {push} from 'connected-react-router';
import {Paper} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        minHeight: 48
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(2),
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    notificationIcon: {
        marginRight: theme.spacing(-2)
    },
    appBarSpacer: {
        minHeight: 48
    },
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
});

interface LocationWithStyles extends WithStyles<typeof styles> {
    pathname: string;
    search: string;
    hash: string;
    avatar: string;
    backToIndex: () => void;
}

interface NavBarState {
    openDrawer: boolean;
    popOverAnchor: HTMLButtonElement|null;
    openPopOver: boolean;
}
const drawerWidth = 240;
class Routes extends React.Component<LocationWithStyles , NavBarState> {
    constructor(props: LocationWithStyles) {
        super(props);
        this.state = {
            openDrawer: false,
            openPopOver: false,
            popOverAnchor: null
        };
    }

    handleDrawerOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        this.setState({
            openDrawer: true,
        });
    };
    backToIndex = () => {
        this.props.backToIndex();
    };
    handleDrawerClose = () => {
        this.setState({
            openDrawer: false,
        });
    };
    handlePopOverClose = () => {
        this.setState({
            openPopOver: false,
            popOverAnchor: null});
    };
    handleAvatarClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.persist();
        this.setState((prevState: Readonly<NavBarState>) => {
            return {
                openPopOver: !prevState.openPopOver,
                popOverAnchor: !!prevState.popOverAnchor ? null : (event.target as HTMLButtonElement)
            };
        });
    };
    render(): React.ReactNode {
        const { classes , pathname, avatar} = this.props;
        const {openDrawer, openPopOver, popOverAnchor} = this.state;
        const id = openPopOver ? 'simple-popover' : undefined;
        return (
            <Fragment>
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar
                        position="absolute"
                        className={classNames(classes.appBar, openDrawer && classes.appBarShift)}
                    >
                        <Toolbar disableGutters={!openDrawer} variant={'dense'} className={classes.toolbar}>
                            <IconButton
                                color="inherit"
                                aria-label="Open drawer"
                                onClick={this.handleDrawerOpen}
                                className={classNames(
                                    classes.menuButton,
                                    this.state.openDrawer && classes.menuButtonHidden,
                                )}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography
                                component={'h1' as any}
                                variant="h6"
                                color="inherit"
                                noWrap
                                className={classes.title}
                            >
                                {findRoute(pathname)}
                            </Typography>
                            <IconButton aria-describedby={id} color="inherit" className={classes.notificationIcon}
                                        onClick={this.handleAvatarClick}
                            >
                                {!!avatar ? (<Avatar src={avatar}
                                                     style={{
                                                         width: 20,
                                                         height: 20
                                                     }}
                                />) : (<SettingsIcon/>)}
                            </IconButton>
                            <Popover
                                id={id}
                                open={openPopOver}
                                onClose={this.handlePopOverClose}
                                anchorEl={popOverAnchor}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <Paper id="menu-list-grow">
                                    <ClickAwayListener onClickAway={this.handlePopOverClose}>
                                        <MenuList>
                                            <MenuItem onClick={this.handlePopOverClose}>Profile</MenuItem>
                                            <MenuItem onClick={this.handlePopOverClose}>My account</MenuItem>
                                            <MenuItem onClick={this.backToIndex}>Logout</MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Popover>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        variant="permanent"
                        classes={{
                            paper: classNames(classes.drawerPaper, !this.state.openDrawer && classes.drawerPaperClose),
                        }}
                        open={this.state.openDrawer}
                    >
                        <div className={classes.toolbarIcon}>
                            <IconButton onClick={this.handleDrawerClose}
                                        size={'small'}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </div>
                        <Divider />
                        <List>
                            <NavBar/>
                        </List>
                    </Drawer>
                    <main className={classes.content}>
                        <div className={classes.appBarSpacer} />
                        <Switch>
                            {navRouteSwitch}
                        </Switch>
                    </main>
                </div>
            </Fragment>
        );
    }
}
const navRouteSwitch = (
    navRoutes.map((value, index) => (
        <Route key={index} path={value.location} component={value.containerElement} exact/>
    ))
);
const mapStateToProps = (state: RouterState & StoreState) => {
    return ({
        pathname: state.router.location.pathname,
        search: state.router.location.search,
        hash: state.router.location.hash,
        avatar: state.account.data.avatar
    });
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
    backToIndex: () => {
        dispatch(push(indexPage.location));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Routes));
