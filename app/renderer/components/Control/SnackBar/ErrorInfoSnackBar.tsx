import {Snackbar} from '@material-ui/core';
import MySnackbarContentWrapper from '../Common/MySnackbarContentWrapper';
import React from 'react';

interface WithErrorsStates {
    errorPop: boolean;
    errorInfo: string;
}

export interface WithErrorsProps {
    error: (error: string) => void;
}
// tslint:disable-next-line:no-shadowed-variable
export const withError = <P extends object>(Component: React.ComponentType<P & WithErrorsProps>) => {
    return class WithLoading extends React.Component<P & WithErrorsProps, WithErrorsStates> {

        constructor(props: Readonly<P & WithErrorsProps>) {
            super(props);
            this.state = {
                errorInfo: '',
                errorPop: false,
            };
        }

        error = (error: string) => {
            this.setState({
                errorPop: true,
                errorInfo: error
            });
        };
        handleCloseError = () => {
            this.setState({
                errorPop: false
            });
        };

        render() {
            const {...props} = this.props;
            const {errorPop, errorInfo} = this.state;
            return (
                <div>
                    <Component {...props as P} error={this.error} />
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        open={errorPop}
                        autoHideDuration={6000}
                        onClose={this.handleCloseError}
                    >
                        <MySnackbarContentWrapper
                            onClose={this.handleCloseError}
                            variant="error"
                            message={errorInfo}
                        />
                    </Snackbar>
                </div>
            );
        }
    };
};
