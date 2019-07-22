import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import Typography from '@material-ui/core/Typography';
import {Theme, WithStyles} from '@material-ui/core/styles';
import { createStyles } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import PinCode from '../PinCode';
import {settings} from '../../constants';
import AccountData from '../../types/Account';
import Button from '@material-ui/core/Button';
import {db} from '../../vcs/local/db';

const useStyles = (theme: Theme) => createStyles({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: 600
    },
    avatar: {
        margin: theme.spacing(9, 1, 4, 1),
        backgroundColor: theme.palette.secondary.main,
        width: theme.spacing(8),
        height: theme.spacing(8),
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    pinContainer: {
        display: 'flex',
        alignItems: 'center',
        flex: 1
    },
    textField: {
        textAlign: 'center'
    }
});

interface LoginWithStyles extends WithStyles<typeof useStyles> {
    successRedirect: () => void;
    redirectToRegister: () => void;
    checkLogin: (account: AccountData) => void;
    accountData: AccountData;
}
class Login extends React.Component<LoginWithStyles> {
    private checkLogin: boolean;
    constructor(props: LoginWithStyles) {
        super(props);
        this.checkLogin = false;
    }
    componentWillMount = async () => {
        if (!this.checkLogin) {
            await this.props.checkLogin(this.props.accountData);
        }
    };
    clearAccountDB = async () => {
        console.log('Clearing database...');
        // await db.delete();
        // await db.open();
        await Promise.all([db.users.clear(), db.repos.clear()]);
        if (this.props.redirectToRegister) {
            this.props.redirectToRegister();
        }
    };
    componentDidMount(): void {
    }

    render(): React.ReactNode {
        const {classes, successRedirect} = this.props;

        return (
            <Container component={'main' as any} maxWidth="xs">
                <CssBaseline/>
                <Box className={classes.paper} height="100%">
                    <Avatar className={classes.avatar}>
                        <FingerprintIcon fontSize={'large'}/>
                    </Avatar>
                    <Typography component={'h1' as any} variant="h4">
                        Pin Code
                    </Typography>
                    <PinCode pinSize={settings.pinSize}
                             submit={(code: string) => {
                                 console.log(code);
                                 successRedirect();
                             }}
                    />
                    <Button variant="contained" color="secondary" onClick={this.clearAccountDB}>
                        Clear All Local Data
                    </Button>
                </Box>
            </Container>
        );
    }
}

export default withStyles(useStyles)(Login);
