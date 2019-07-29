import React from 'react';
import Button from '@material-ui/core/Button';

interface NoMatchProps {
    jumpToIndex: () => void;
}

class NoMatch extends React.Component<NoMatchProps> {

    handleClick = () => {
        this.props.jumpToIndex();
    };

    render(): React.ReactNode {
        return (
            <div>
                No Match Route
                <Button color={'primary'}
                        type="submit"
                        variant="contained"
                        onClick={this.handleClick}
                >
                    Back to index
                </Button>
            </div>
        );
    }
}

export default NoMatch;
