import React from 'react';
import {settings} from '../../../constants';
import PinCode from '../../PinCode';
import Typography from '@material-ui/core/Typography';
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
        return (
            <React.Fragment>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                <PinCode
                    pinSize={settings.pinSize}
                    reset={reset}
                    submit={this.submitPinCode}
                />
            </React.Fragment>
        );
    }
}
