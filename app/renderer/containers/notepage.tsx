import { connect } from 'react-redux';
import { StoreState} from '../types';
import NotePage from '../components/Page/Note';

const mapStateToProps = (state: StoreState) => ({
    inEdit: state.noteEditor.inEdit ?
        state.noteEditor!.inEdit : false,
});

export default connect(mapStateToProps, null)(NotePage);
