import React from 'react';
import {createStyles, Theme, WithStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import VcsUserForm from './VcsUserForm';
import VcsRepoForm from './VcsRepoForm';
import VcsPinSetForm from './VcsPinSetForm';
import withStyles from '@material-ui/core/styles/withStyles';
import superagent from 'superagent';
import {Snackbar} from '@material-ui/core';
import MySnackbarContentWrapper from '../Common/MySnackbarContentWrapper';

const useStyles = (theme: Theme) => createStyles({
    layout: {
        width: 'auto',
        marginTop: theme.spacing(6),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
});

const steps = ['Github Account', 'Select Repository', 'Setting Pin Code'];

interface RegisterWithStyles extends WithStyles<typeof useStyles> {
    successRedirect: () => void;
}

interface RegisterFormState {
    activeStep: number;
    errorInfo: string;
    loginName?: string;
    password?: string;
    errorPop: boolean;
    userPublicRepo?: GithubRepo[];
    targetRepo?: GithubRepo;
    loading: boolean;
}
interface GithubRepo {
    private: boolean;
    clone_url: string;
    default_branch: string;
    name: string;
}
class Register extends React.Component<RegisterWithStyles, RegisterFormState> {

    constructor(props: Readonly<RegisterWithStyles>) {
        super(props);
        this.state = {
            activeStep: 0,
            errorInfo: '',
            errorPop: false,
            loading: false
        };
    }
    changeUserInfo = (loginName: string|null, loginPassword: string|null) => {
        if (loginName !== null) {
            this.setState({loginName});
        }
        if (loginPassword !== null) {
            this.setState({password: loginPassword});
        }
    };
    getStepContent = () => {
        switch (this.state.activeStep) {
            case 0:
                return <VcsUserForm change={this.changeUserInfo}/>;
            case 1:
                return <VcsRepoForm />;
            case 2:
                return <VcsPinSetForm />;
            default:
                throw new Error('Unknown step');
        }
    };
    validGithub = async (loginName?: string, loginPassword?: string) => {
        if (loginName === undefined || loginPassword === undefined) {
            this.error('loginName or Password not added');
            return;
        }
        this.setState({loading: true});
        const githubUserResult = await superagent.get('https://api.github.com/user')
            .auth(loginName, loginPassword).timeout({
                response: 5000,  // Wait 5 seconds for the server to start sending,
            });
        if (githubUserResult.status !== 200) {
            this.error('githubUser request to github failure');
            console.log(githubUserResult);
            this.setState({loading: false});
            return;
        }
        const githubUser: any = JSON.parse(githubUserResult.text);
        if (!(githubUser && githubUser.repos_url && githubUser.name && githubUser.avatar_url)) {
            this.error('githubUser request to github no user info');
            console.log(githubUserResult);
            this.setState({loading: false});
            return;
        }
        const githubReposResult = await superagent.get(githubUser.repos_url)
            .auth(loginName, loginPassword).timeout({
                response: 5000,  // Wait 5 seconds for the server to start sending,
            });

        if (githubReposResult.status !== 200) {
            this.error('githubRepos request to github failure');
            console.log(githubReposResult);
            this.setState({loading: false});
            return;
        }
        let githubRepos: GithubRepo[] = JSON.parse(githubReposResult.text);
        if (!(githubRepos && githubRepos.length > 0)) {
            this.error('githubRepos request to github no repos');
            console.log(githubUserResult);
            this.setState({loading: false});
            return;
        }
        githubRepos = githubRepos.filter(value => !value.private);
        if (!(githubRepos && githubRepos.length > 0)) {
            this.error('githubRepos request to github no public repos');
            console.log(githubUserResult);
            this.setState({loading: false});
            return;
        }
        this.setState({loading: false});
        this.setState({userPublicRepo: githubRepos},
            () => {
            console.log(this.state.userPublicRepo);
        });
    };
    error = (error: string) => {
        this.setState({
            errorPop: true,
            errorInfo: error
        });
    };
    handleNext = () => {
        switch (this.state.activeStep) {
            case 0: {
                const {loginName, password} = this.state;
                this.validGithub(loginName, password).then(value => {
                    this.setState((prevState) => {
                        return {activeStep: prevState!.activeStep + 1};
                    });
                });
                break;
            }
            case 1:
                break;
            case 2:
                break;
            default:
                throw new Error('Unknown step');
        }
    };

    handleBack = () => {
        this.setState((prevState) => {
            return {activeStep: prevState!.activeStep - 1};
        });
    };
    handleCloseError = () => {
        this.setState({
            errorPop: false
        });
    };
    render(): React.ReactNode {
        const {classes} = this.props;
        const {activeStep, errorInfo, errorPop, loading} = this.state;
        return (
            <React.Fragment>
                <CssBaseline />
                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h4" align="center">
                            VCS settings
                        </Typography>
                        <Stepper activeStep={activeStep} className={classes.stepper}>
                            {steps.map(label => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <React.Fragment>
                            {activeStep === steps.length ? (
                                <React.Fragment>
                                    <Typography variant="h5" gutterBottom>
                                        Rocket Launch.
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        All set, start launching.
                                    </Typography>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    {this.getStepContent()}
                                    <div className={classes.buttons}>
                                        {activeStep !== 0 && (
                                            <Button onClick={this.handleBack} className={classes.button}>
                                                Back
                                            </Button>
                                        )}
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={this.handleNext}
                                            className={classes.button}
                                        >
                                            {loading ? 'Loading...' : 'Next'}
                                        </Button>
                                    </div>
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    </Paper>
                </main>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    open={errorPop}
                    autoHideDuration={6000}
                    onClose={this.handleCloseError}
                >
                    <MySnackbarContentWrapper
                        onClose={this.handleCloseError}
                        variant="error"
                        message={errorInfo}
                    />
                </Snackbar>
            </React.Fragment>
        );
    }
}

export default withStyles(useStyles)(Register);
