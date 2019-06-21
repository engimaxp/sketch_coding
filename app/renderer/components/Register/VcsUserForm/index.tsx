import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

interface VcsUserFormProps {
    change: (loginName: string|null, loginPassword: string|null) => void;
}

export default class VcsUserForm extends React.Component<VcsUserFormProps>  {
    loginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.change(event.target.value, null);
    };
    passwordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.change(null, event.target.value);
    };
    render(): React.ReactNode {
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
                            autoComplete="input account email or mobile here"
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
                            fullWidth
                            autoComplete="input password here"
                            onChange={this.passwordChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
                            label="Remember password"
                        />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}
