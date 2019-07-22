import React from 'react';
import {createStyles, Theme, WithStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import Grid from '@material-ui/core/Grid';
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
import fs from 'fs';
import * as git from 'isomorphic-git';
import LinearProgress from '@material-ui/core/LinearProgress';
import AccountData from '../../types/Account';
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

interface RegisterWithStyles extends WithStyles<typeof useStyles> {
    successRedirect: (account: AccountData) => void;
}

interface RegisterFormState {
    activeStep: number;
    errorInfo: string;
    loginName?: string;
    nickName?: string;
    rememberPassword?: boolean;
    avatarImage?: string;
    pinCode?: string;
    password?: string;
    errorPop: boolean;
    userPublicRepo?: GithubRepo[];
    targetRepo?: GithubRepo;
    localPath?: string;
    loading: boolean;
    steps: string[];
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
            loading: false,
            steps: ['Github Account', 'Select Repository', 'Setting Pin Code']
        };
    }
    changeUserInfo = (loginName: string|null, loginPassword: string|null, rememberPassword: boolean|null) => {
        if (loginName !== null) {
            this.setState({loginName});
        }
        if (loginPassword !== null) {
            this.setState({password: loginPassword});
        }
        if (rememberPassword !== null) {
            this.setState({rememberPassword}, () => {
                let steps = this.state.steps;
                if (this.state.rememberPassword && steps.length === 2) {
                    steps.push('Setting Pin Code');
                } else if (this.state.rememberPassword !== undefined
                    && !this.state.rememberPassword && steps.length > 2) {
                    steps = steps.slice(0, 2);
                }
                this.setState({steps});
            });
        }
    };
    changeRepoInfo = (repoTarget: string|null, localPath: string|null) => {
        if (repoTarget !== null) {
            const targetRepo = this.state.userPublicRepo!.find(value => value.name === repoTarget);
            this.setState({targetRepo});
        }
        if (localPath !== null) {
            this.setState({localPath});
        }
    };
    getStepContent = () => {
        switch (this.state.activeStep) {
            case 0:
                return <VcsUserForm
                    change={this.changeUserInfo}
                />;
            case 1:
                return <VcsRepoForm
                    nickName={this.state.nickName}
                    change={this.changeRepoInfo}
                    repos={
                    this.state.userPublicRepo === undefined ? [] :
                        this.state.userPublicRepo!.map(value => value.name)
                }/>;
            case 2:
                return <VcsPinSetForm
                    completeSet={(pinCode: string) => this.setState({pinCode}, () => {
                        console.log(this.state);
                        this.handleNext();
                    })}
                />;
            default:
                throw new Error('Unknown step');
        }
    };

    validGithub = async (loginName?: string, loginPassword?: string) => {
        if (loginName === undefined || loginPassword === undefined) {
            this.error('loginName or Password not added');
            return;
        }
        console.log(`${loginName},${loginPassword}`);
        this.setState({loading: true});
        let githubUserResult: any;
        try {
            githubUserResult = await superagent
                .get('https://api.github.com/user')
                .auth(loginName, loginPassword)
                .set('user-agent', 'node.js')
                .timeout({response: 30000});
        } catch (e) {
            console.log('get user error');
            console.log(e);
            this.setState({loading: false});
            return;
        }
        if (githubUserResult.status !== 200) {
            this.error('githubUser request to github failure');
            console.log(githubUserResult);
            this.setState({loading: false});
            return;
        }
        const githubUser: any = JSON.parse(githubUserResult.text);
        if (!(githubUser && githubUser.repos_url && githubUser.login && githubUser.avatar_url)) {
            this.error('githubUser request to github no user info');
            console.log(githubUserResult);
            this.setState({loading: false});
            return;
        }
        this.setState({
            nickName: githubUser.login,
            avatarImage: githubUser.avatar_url
        });
        let githubReposResult: any;
        try {
            githubReposResult = await superagent
                .get('https://api.github.com/user/repos')
                .auth(loginName, loginPassword)
                .set('user-agent', 'node.js')
                .timeout({response: 30000});
        } catch (e) {
            console.log('get repo error');
            console.log(e);
            this.setState({loading: false});
            return;
        }

        if (githubReposResult.status !== 200) {
            this.error('githubRepos request to github failure');
            console.log(githubReposResult);
            this.setState({loading: false});
            return;
        }
        const githubRepos: GithubRepo[] = JSON.parse(githubReposResult.text);
        if (!(githubRepos && githubRepos.length > 0)) {
            this.error('githubRepos request to github no repos');
            console.log(githubUserResult);
            this.setState({loading: false});
            return;
        }
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
    cloneFromGithub = async (targetRepo?: GithubRepo, localPath?: string) => {
        const {loginName, password, nickName} = this.state;
        if (loginName === undefined || password === undefined) {
            this.error('loginName or Password not added');
            return;
        }
        if (targetRepo === undefined || localPath === undefined) {
            this.error('targetRepo or localPath not defined');
            return;
        }
        this.setState({loading: true});
        const userDir = localPath;
        try {
            git.plugins.set('fs', fs);
            if (!await fs.existsSync(userDir)) {
                await fs.mkdirSync(userDir);
            }
            await git.clone({
                dir: userDir,
                url: targetRepo.clone_url,
                ref: targetRepo.default_branch,
                singleBranch: true,
                depth: 10,
                username: loginName,
                password,
            });
            await git.config({
                dir: userDir,
                path: 'user.name',
                value: nickName
            });
            await git.config({
                dir: userDir,
                path: 'user.email',
                value: loginName
            });
        } catch (e) {
            console.log(e);
            this.error(e.message);
        }
        this.setState({loading: false});
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
            case 1: {
                const {targetRepo, localPath} = this.state;
                this.cloneFromGithub(targetRepo, localPath).then(value => {
                    this.setState((prevState) => {
                        return {activeStep: prevState!.activeStep + 1};
                    });
                });
                break;
            }
            case 2:
                this.setState((prevState) => {
                    return {activeStep: prevState!.activeStep + 1};
                }, async () => await this.props.successRedirect({
                    pinCode: this.state.pinCode,
                    password: this.state.password,
                    username: this.state.loginName,
                    nickName: this.state.nickName,
                    avatar: this.state.avatarImage,
                    repo: {
                        targetRepo: this.state.targetRepo!.name,
                        repoUrl: this.state.targetRepo!.clone_url,
                        localDirectory: (this.state.localPath === undefined ? '' : this.state.localPath),
                    },
                }));
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
        const {activeStep, errorInfo, errorPop, loading, steps} = this.state;
        return (
            <React.Fragment>
                <CssBaseline />
                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Typography component={'h1' as any} variant="h4" align="center">
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
                                    <Grid container spacing={3}
                                          style={{
                                              display: 'flex',
                                              flexDirection: 'column',
                                              alignItems: 'center',
                                          }}
                                    >
                                        <Typography variant="h5"  align="center"
                                                    style={{
                                                        marginTop: 128,
                                                    }}
                                        >
                                            All set, launching...
                                        </Typography>
                                        <LinearProgress style={{
                                            marginTop: 32,
                                            marginBottom: 32,
                                            width: '80%'
                                        }}/>
                                    </Grid>
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
                                        {activeStep !== 2 ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={this.handleNext}
                                            className={classes.button}
                                        >
                                            {loading ? 'Loading...' : 'Next'}
                                        </Button>
                                        ) : null}
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
