import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
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
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
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
        backgroundColor: theme.palette.primary.main,
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
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
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
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}>
                    <Avatar src={option.avatar}
                            style={{
                                margin: 10,
                                width: 30,
                                height: 30
                            }}
                    />
                    <Box>{option.nickname}</Box>
                </div>
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
                        <LockOutlinedIcon fontSize={'large'}/>
                    </Avatar>
                    <FormControl variant="filled"
                                 fullWidth
                                 className={classes.formControl}>
                        <InputLabel htmlFor="user-select">select user</InputLabel>
                        <Select
                            name="user"
                            inputProps={{
                                id: 'user-select',
                            }}
                            value={selectedUser}
                            onChange={this.handleChange}
                        >
                            {convertSelectOptionsToMenuItems(userInfos)}
                        </Select>
                    </FormControl>
                    {selectedUser === '' ? (
                            <div
                                style={{
                                    marginTop: 100,
                                    marginBottom: 100
                                }}
                            />)
                        :
                        (<PinCode pinSize={settings.pinSize}
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
                    />)
                    }
                    <Typography variant="body2"
                                color="textSecondary"
                                style={{marginTop: 20}}
                                align="center">
                        {'If you want create a new account , please '}
                        <Link color="secondary" onClick={this.goToRegister}>
                            click here
                        </Link>
                        {' to register a new local account.'}
                    </Typography>
                    <Button variant="contained" color="secondary"
                            style={{marginTop: 20}}
                            onClick={this.clearAccountDB}>
                        Clear All Local User Data
                    </Button>
                </Box>
            </Container>
        );
    }
}

export default withStyles(useStyles)(withError(Login));
