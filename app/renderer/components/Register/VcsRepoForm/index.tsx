import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import ReactSelectMaterialUi from 'react-select-material-ui';
import os from 'os';
interface RepoFormProperty {
    repos: string[];
    change: (repoTarget: string|null, localPath: string|null) => void;
    nickName?: string;
}
interface RepoFormState {
    repoTarget: string|null;
    localPath: string|null;
}

const getDefaultLocalPath = (nickName?: string, repoSelect?: string) => {
    return `${os.homedir()}\\${nickName ? nickName : 'sketch_nickName'}_${repoSelect ? repoSelect : 'repo'}`;
};

export default class VcsRepoForm extends React.Component<RepoFormProperty, RepoFormState> {

    constructor(props: Readonly<RepoFormProperty>) {
        super(props);
        const defaultRepo = null;
        const defaultLocalPath = getDefaultLocalPath(this.props.nickName);
        this.state = {
            repoTarget: defaultRepo,
            localPath: defaultLocalPath
        };
    }

    componentDidMount(): void {
        this.props.change(this.state.repoTarget, this.state.localPath);
    }

    handleChange = (value: string) => {
        console.log(value);
        this.setState({repoTarget: value, localPath: getDefaultLocalPath(this.props.nickName, value)});
        this.props.change(value, null);
    };
    localPathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({localPath: event.target.value});
        this.props.change(null, event.target.value);
    };
    render(): React.ReactNode {
        const {repos} = this.props;
        const {localPath} = this.state;
        return (
            <React.Fragment>
                <Typography variant="h6" gutterBottom>
                    Select repo
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <ReactSelectMaterialUi fullWidth
                                               options={repos}
                                               required
                                               SelectProps={{
                                                   isCreatable: false,
                                                   msgNoOptionsAvailable:
                                                       'No repo for this github account, please create one first',
                                                   msgNoOptionsMatchFilter: 'Not fount a matchable repo'
                                               }}
                                               helperText={'select a repo for remote vcs source'}
                                               onChange={this.handleChange} />
                    </Grid>
                </Grid>
                <Typography variant="h6" gutterBottom style={{marginTop: 24}}>
                    Set local path
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="localPath"
                            name="localPath"
                            fullWidth
                            helperText={'local path for vcs control'}
                            onChange={this.localPathChange}
                            value={localPath}
                        />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}
