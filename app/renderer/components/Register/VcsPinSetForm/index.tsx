import React from 'react';
import {settings} from '../../../constants';
import PinCode from '../../PinCode';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
interface PinSetProperty {
    completeSet: (pinCode: string) => void;
}
interface PinSetState {
    again: boolean;
    pinCode?: string;
    reset: number;
}
export default class VcsPinSetForm extends React.Component<PinSetProperty, PinSetState> {

    constructor(props: Readonly<PinSetProperty>) {
        super(props);
        this.state = {
            again: false,
            reset: 1
        };
    }
    submitPinCode = (code: string) => {
        if (!this.state.again) {
            this.setState((prevState: PinSetState) => {
                return {reset: prevState!.reset + 1, pinCode: code, again: true};
            });
        } else {
            if (this.state.pinCode === code) {
                this.props.completeSet(code);
            } else {
                this.setState({pinCode: undefined, again: false});
                this.setState((prevState: PinSetState) => {
                    return {reset: prevState!.reset + 1};
                });
            }
        }
    };
    render() {
        const title = this.state.again ? 'confirm pin code' : 'create pin code';
        const {reset} = this.state;
        let theme = createMuiTheme();
        theme = responsiveFontSizes(theme);
        return (
            <React.Fragment>
                <Typography variant="h6" align={'center'}>
                    {title}
                </Typography>
                <Grid container spacing={3}
                      style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                      }}
                >
                    <Grid item xs={6}
                          style={{
                              marginTop: theme.spacing(1)
                          }}
                    >
                        <Avatar style={{
                            backgroundColor: theme.palette.secondary.main,
                            width: theme.spacing(6),
                            height: theme.spacing(6),
                        }}>
                            <FingerprintIcon fontSize={'large'}/>
                        </Avatar>
                    </Grid>
                    <Grid item xs={6}
                          style={{
                              marginTop: theme.spacing(10)
                          }}
                    >
                        <PinCode
                            pinSize={settings.pinSize}
                            reset={reset}
                            submit={this.submitPinCode}
                        />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}
