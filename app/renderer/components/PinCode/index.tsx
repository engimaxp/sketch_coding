import React from 'react';
import Grid from '@material-ui/core/Grid';
import {Theme, WithStyles} from '@material-ui/core/styles';
import { createStyles } from '@material-ui/core';
import _ from 'lodash';
import PinInput from './PinInput';
import withStyles from '@material-ui/core/styles/withStyles';

const useStyles = (theme: Theme) => createStyles({
    pinContainer: {
        display: 'flex',
        alignItems: 'center',
        flex: 1
    },
});

interface PinCodePropsWithStyles extends WithStyles<typeof useStyles> {
    pinSize: number;
    submit: (code: string) => void;
}
interface PinCodeState {
    selectArray: boolean[];
    focusArray: boolean[];
    valueArray: string[];
}

class PinCode extends React.Component<PinCodePropsWithStyles, PinCodeState> {

    constructor(props: PinCodePropsWithStyles) {
        super(props);
        const selectArray = _.fill(Array<boolean>(this.props.pinSize), false);
        const focusArray = _.fill(Array<boolean>(this.props.pinSize), false);
        const valueArray = _.fill(Array<boolean>(this.props.pinSize), '');
        focusArray[0] = true;
        this.state = {selectArray, focusArray, valueArray};
    }
    render() {
        const {classes, pinSize} = this.props;
        const {selectArray, focusArray, valueArray} = this.state;
        const pinInputs = (
            _.range(pinSize).map((index) => (
                <PinInput key={index}
                          focus={focusArray[index]}
                          select={selectArray[index]}
                          index={index}
                          submit={
                    (code: string|null) => {
                        const newValueArray = Array.from(valueArray);
                        const newFocusArray = Array.from(focusArray);
                        const newSelectArray = Array.from(selectArray);
                        if (code !== null) {
                            console.log('code:' + code + 'index:' + index);
                            newValueArray[index] = code;
                            newFocusArray[index] = false;
                            newSelectArray[index] = false;
                            if (index < pinSize - 1) {
                                newFocusArray[index + 1] = true;
                                newSelectArray[index + 1] = true;
                            }
                            this.setState({
                                focusArray: newFocusArray,
                                selectArray: newSelectArray,
                                valueArray: newValueArray
                            }, () => {
                                console.log('valueArray:' + this.state.valueArray);
                                console.log('selectArray:' + this.state.selectArray);
                                console.log('focusArray:' + this.state.focusArray);
                            });
                        }
                    }
                } />
            ))
        );
        const eachSize = pinSize >= 4 ? 3 : 2;
        return (
            <Grid className={classes.pinContainer} container spacing={eachSize}>
                {pinInputs}
            </Grid>
        );
    }
  }

export default withStyles(useStyles)(PinCode);
