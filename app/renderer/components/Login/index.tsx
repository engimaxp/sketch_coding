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
import {getAccountById, UserInfo} from '../../vcs/local/UserInfo';
import {withError, WithErrorsProps} from '../SnackBar/ErrorInfoSnackBar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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

interface LoginWithStyles extends WithStyles<typeof useStyles>, WithErrorsProps {
    successRedirect: () => void;
    redirectToRegister: () => void;
    checkLogin: (account: AccountData) => Promise<UserInfo[]>;
    accountData: AccountData;
}

interface LoginStatus {
    userInfos: UserInfo[];
    selectedUser: string;
    pinCodeValid: string;
    reset: number;
}
const convertSelectOptionsToMenuItems = (options: UserInfo[]) => {
    if (options && options.length > 0) {
        return options.map((option, index) => {
            return (<MenuItem key={index}
                      value={option.id}>
                <Avatar alt="Remy Sharp" src={option.avatar} />
                <Box>{option.nickname}</Box>
            </MenuItem>);
        });
    }
    return null;
};

class Login extends React.Component<LoginWithStyles, LoginStatus> {
    private readonly checkLogin: boolean;
    private readonly error: (error: string) => void;
    constructor(props: LoginWithStyles) {
        super(props);
        this.error = props.error;
        this.checkLogin = false;
        this.state = {
            userInfos: [],
            selectedUser: '',
            pinCodeValid: '',
            reset: 1
        };
    }
    componentWillMount = async () => {
        let dbAccounts: UserInfo[] = [];
        if (!this.checkLogin) {
            dbAccounts = await this.props.checkLogin(this.props.accountData);
        }
        if (dbAccounts && dbAccounts.length > 0) {
            this.setState({userInfos: dbAccounts});
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
    goToRegister = () => {
        if (this.props.redirectToRegister) {
            this.props.redirectToRegister();
        }
    };
    componentDidMount(): void {
    }

    handleChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
        const value = event.target.value as string;
        console.log(value);
        const userInfo = await getAccountById(value);
        if (userInfo) {
            this.setState({
                selectedUser: value,
                pinCodeValid: userInfo.pinCode
            });
        }
    };
    render(): React.ReactNode {
        const {classes, successRedirect} = this.props;
        const {userInfos, pinCodeValid, reset, selectedUser} = this.state;
        return (
            <Container component={'main' as any} maxWidth="xs">
                <CssBaseline/>
                <Box className={classes.paper} height="100%">
                    <Avatar className={classes.avatar}>
                        <FingerprintIcon fontSize={'large'}/>
                    </Avatar>
                    <Typography component={'h4' as any} variant="h5">
                        Select User
                    </Typography>
                    <Select
                        fullWidth
                        value={selectedUser}
                        onChange={this.handleChange}
                    >
                        {convertSelectOptionsToMenuItems(userInfos)}
                    </Select>
                    <Typography component={'h4' as any} variant="h5">
                        Pin Code
                    </Typography>
                    <PinCode pinSize={settings.pinSize}
                             reset={reset}
                             submit={(code: string) => {
                                 console.log(code);
                                 if (code === pinCodeValid) {
                                     successRedirect();
                                 } else {
                                     this.error('Unmatched pin code');
                                     this.setState((prevState: LoginStatus) => {
                                         return {reset: prevState.reset + 1};
                                     });
                                 }
                             }}
                    />
                    <Button variant="contained" color="secondary" onClick={this.clearAccountDB}>
                        Clear All Local Data
                    </Button>
                    <Button variant="contained" color="primary" onClick={this.goToRegister}>
                        Create a new account
                    </Button>
                </Box>
            </Container>
        );
    }
}

export default withStyles(useStyles)(withError(Login));
