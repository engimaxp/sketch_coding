import React, {ChangeEvent, RefObject} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {Theme, WithStyles} from '@material-ui/core/styles';
import { createStyles } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

const useStyles = (theme: Theme) => createStyles({
    textField: {
        textAlign: 'center'
    }
});

interface PinStateProperties {
    pinValue: string|null;
}

interface PinCodePropsWithStyles extends WithStyles<typeof useStyles> {
    focus: boolean;
    select: boolean;
    index: number;
    submit: (code: string|null) => void;
    totalSize: number;
}
class PinInput extends React.Component<PinCodePropsWithStyles, PinStateProperties> {
    private readonly pinRef!: RefObject<HTMLInputElement>;
    constructor(props: PinCodePropsWithStyles) {
        super(props);
        this.pinRef = React.createRef();
        this.state = {
            pinValue: '',
        };
    }
    componentDidMount(): void {
        console.log('componentDidMount');
        if (this.props.focus) {
            if (this.pinRef !== null && this.pinRef.current !== null) {
                console.log(this.pinRef.current);
                this.pinRef.current.focus();
            }
        }
        if (this.props.select) {
            if (this.pinRef !== null && this.pinRef.current !== null) {
                console.log(this.pinRef.current);
                this.pinRef.current.select();
            }
        }
    }

    componentDidUpdate(prevProps: Readonly<PinCodePropsWithStyles>,
                       prevState: Readonly<PinStateProperties>, snapshot?: any): void {
        console.log('componentDidUpdate');
        if (this.props.focus) {
            if (this.pinRef !== null && this.pinRef.current !== null) {
                console.log(this.pinRef.current);
                this.pinRef.current.focus();
            }
        } else {
            if (this.pinRef !== null && this.pinRef.current !== null) {
                console.log(this.pinRef.current);
                this.pinRef.current.blur();
            }
        }
        if (this.props.select) {
            if (this.pinRef !== null && this.pinRef.current !== null) {
                console.log(this.pinRef.current);
                this.pinRef.current.select();
            }
        }
    }

    handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target);
        if (!isNaN(Number(event.target.value))) {
            console.log(event.target.value);
            this.setState({pinValue: event.target.value});
            this.props.submit(event.target.value);
        }
    };
    render(): React.ReactNode {
        const {classes, index, totalSize} = this.props;
        const eachSize = totalSize >= 4 ? 3 : 2;
        return (
            <Grid item xs={eachSize}>
                <TextField
                    variant="outlined"
                    required
                    id={'pin' + index}
                    className={classes.textField}
                    inputProps={{
                        style: { textAlign: 'center', color: 'transparent',
                            textShadow: '0 0 0 #000' }
                    }}
                    inputRef={this.pinRef}
                    onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
                        event.target.select();
                    }}
                    name={'pin' + index}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => this.handleInput(e)}
                    value={this.state.pinValue}
                />
            </Grid>
        );
    }
}

export default withStyles(useStyles)(PinInput);
