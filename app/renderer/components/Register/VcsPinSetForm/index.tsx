import React from 'react';
import {Theme, WithStyles} from '@material-ui/core/styles';
import { createStyles } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const addresses = ['1 Material-UI Drive', 'Reactville', 'Anytown', '99999', 'USA'];
const payments = [
    { name: 'Card type', detail: 'Visa' },
    { name: 'Card holder', detail: 'Mr John Smith' },
    { name: 'Card number', detail: 'xxxx-xxxx-xxxx-1234' },
    { name: 'Expiry date', detail: '04/2024' },
];

const useStyles = (theme: Theme) => createStyles({
    listItem: {
        padding: theme.spacing(1, 0),
    },
    total: {
        fontWeight: 'bold',
    },
    title: {
        marginTop: theme.spacing(2),
    },
});

interface PinSetFormStyles extends WithStyles<typeof useStyles> {
    successRedirect: () => void;
}
class VcsPinSetForm extends React.Component<PinSetFormStyles> {
    render() {
        const {classes} = this.props;
        return (
            <React.Fragment>
                <Typography variant="h6" gutterBottom>
                    Order summary
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom className={classes.title}>
                            Shipping
                        </Typography>
                        <Typography gutterBottom>John Smith</Typography>
                        <Typography gutterBottom>{addresses.join(', ')}</Typography>
                    </Grid>
                    <Grid item container direction="column" xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom className={classes.title}>
                            Payment details
                        </Typography>
                        <Grid container>
                            {payments.map(payment => (
                                <React.Fragment key={payment.name}>
                                    <Grid item xs={6}>
                                        <Typography gutterBottom>{payment.name}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography gutterBottom>{payment.detail}</Typography>
                                    </Grid>
                                </React.Fragment>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

export default withStyles(useStyles)(VcsPinSetForm);
