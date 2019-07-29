import React, {ChangeEvent, RefObject} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {Theme, WithStyles} from '@material-ui/core/styles';
import { createStyles } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

const useStyles = (theme: Theme) => createStyles({
    textField: {
        textAlign: 'center',
    }
});

interface PinStateProperties {
    pinValue: string|null;
    error: boolean;
}

interface PinCodePropsWithStyles extends WithStyles<typeof useStyles> {
    focus: boolean;
    select: boolean;
    index: number;
    submit: (code: string|null) => void;
    totalSize: number;
    val: string;
}
class PinInput extends React.Component<PinCodePropsWithStyles, PinStateProperties> {
    private readonly pinRef!: RefObject<HTMLInputElement>;
    constructor(props: PinCodePropsWithStyles) {
        super(props);
        this.pinRef = React.createRef();
        this.state = {
            pinValue: this.props.val !== '' ? '*' : '',
            error: false,
        };
    }
    componentDidMount(): void {
        if (this.props.focus) {
            this.pinRef!.current!.focus();
        }
        if (this.props.select) {
            this.pinRef!.current!.select();
        }
    }

    componentDidUpdate(prevProps: Readonly<PinCodePropsWithStyles>,
                       prevState: Readonly<PinStateProperties>, snapshot?: any): void {
        if (this.props.focus) {
            this.pinRef!.current!.focus();
        } else {
            this.pinRef!.current!.blur();
        }
        if (this.props.select) {
            this.pinRef!.current!.select();
        }
        if (this.props.val === '' && prevState!.pinValue !== '') {
            this.setState({pinValue: ''});
        }
    }

    handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        let setValue: string = '';
        if (isNaN(Number(event.target.value))) {
            this.setState({
                error: true,
                pinValue: ''
            }, () => {
                this.pinRef!.current!.focus();
                this.pinRef!.current!.select();
            });
        } else {
            console.log(event.target.value);
            if (!!event.target.value && event.target.value.length > 1) {
                setValue = event.target.value[event.target.value.length - 1];
            } else {
                setValue = event.target.value;
            }
            this.setState({
                pinValue: '*',
                error: false
            });
        }
        this.props.submit(setValue);
    };
    render(): React.ReactNode {
        const {classes, index, totalSize} = this.props;
        const {error} = this.state;
        const eachSize = totalSize >= 4 ? 3 : 2;
        return (
            <Grid item xs={eachSize}>
                <TextField
                    error={error ? error : undefined}
                    id={'pin' + index}
                    className={classes.textField}
                    inputProps={{
                        style: {
                            textAlign: 'center',
                            fontSize: 20,
                            fontWeight: 'bold',
                            lineHeight: 20,
                            color: 'transparent',
                            textShadow: '0 0 0 #000'
                        }
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
