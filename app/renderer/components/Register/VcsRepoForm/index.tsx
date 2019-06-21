import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default class VcsRepoForm extends React.Component {
    render(): React.ReactNode {
        return (
            <React.Fragment>
                <Typography variant="h6" gutterBottom>
                    Select repo
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="account"
                            name="account"
                            fullWidth
                            autoComplete="input account email or mobile here"
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
