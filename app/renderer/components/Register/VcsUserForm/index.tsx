import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

interface VcsUserFormProps {
    change: (loginName: string|null, loginPassword: string|null, remeberPassword: boolean|null) => void;
}
interface VcsUserFormState {
    userName: string|null;
    password: string|null;
    rememberPassword: boolean;
}
export default class VcsUserForm extends React.Component<VcsUserFormProps, VcsUserFormState>  {

    constructor(props: Readonly<VcsUserFormProps>) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            rememberPassword: true
        };
    }

    loginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ userName: event.target.value});
        this.props.change(event.target.value, null, null);
    };
    passwordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ password: event.target.value });
        this.props.change(null, event.target.value, null);
    };
    changeBoolean = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ rememberPassword: event.target.checked });
        this.props.change(null, null, event.target.checked);
    };
    componentDidMount(): void {
        this.props.change(this.state.userName, this.state.password, this.state.rememberPassword);
    }

    render(): React.ReactNode {
        const {userName, password, rememberPassword} = this.state;
        return (
            <React.Fragment>
                <Typography variant="h6" gutterBottom>
                    Account Email
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="account"
                            name="account"
                            fullWidth
                            helperText="input account email or mobile here"
                            value={userName}
                            onChange={this.loginChange}
                        />
                    </Grid>
                </Grid>
                <Typography variant="h6" gutterBottom style={{marginTop: 24}}>
                    Password
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            fullWidth
                            helperText="input password here"
                            onChange={this.passwordChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox checked={rememberPassword}
                                               onChange={this.changeBoolean}
                                               color="primary" name="saveLoginPassword" value="yes" />}
                            label="Remember password"
                        />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}
