import React, { Fragment } from 'react';
import {Route, Switch} from 'react-router';
import NavBar from '../components/NavBar';
import Drawer from '@material-ui/core/Drawer';
import NotificationsIcon from '@material-ui/icons/Notifications';
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
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import {Badge} from '@material-ui/core';
import {findRoute, navRoutes} from './routeMap';
import {connect} from 'react-redux';
import {RouterState} from '../types';
import {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import {push} from 'connected-react-router';

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
        ...theme.mixins.toolbar,
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
        marginRight: 36,
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
    appBarSpacer: theme.mixins.toolbar,
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
    backToIndex: () => void;
}

interface NavBarState {
    open: boolean;
}
const drawerWidth = 240;
class Routes extends React.Component<LocationWithStyles , NavBarState> {
    constructor(props: LocationWithStyles) {
        super(props);
        this.state = {
            open: false
        };
    }
    handleDrawerOpen = () => {
        this.setState({ open: true });
    };
    backToIndex = () => {
        this.props.backToIndex();
    };
    handleDrawerClose = () => {
        this.setState({ open: false });
    };
    render(): React.ReactNode {
        const { classes , pathname} = this.props;
        return (
            <Fragment>
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar
                        position="absolute"
                        className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
                    >
                        <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
                            <IconButton
                                color="inherit"
                                aria-label="Open drawer"
                                onClick={this.handleDrawerOpen}
                                className={classNames(
                                    classes.menuButton,
                                    this.state.open && classes.menuButtonHidden,
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
                            <IconButton color="inherit">
                                <Badge badgeContent={1} color="secondary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <IconButton color="inherit" className={classes.notificationIcon}
                                        onClick={this.backToIndex}
                            >
                                <SettingsIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        variant="permanent"
                        classes={{
                            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
                        }}
                        open={this.state.open}
                    >
                        <div className={classes.toolbarIcon}>
                            <IconButton onClick={this.handleDrawerClose}>
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
const mapStateToProps = (state: RouterState) => ({
    pathname: state.router.location.pathname,
    search: state.router.location.search,
    hash: state.router.location.hash,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
    backToIndex: () => {
        dispatch(push('/'));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Routes));
