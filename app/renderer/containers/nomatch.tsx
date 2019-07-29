import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import {ThunkDispatch} from 'redux-thunk';
import { push } from 'connected-react-router';
import NoMatch from '../components/Page/NoMatch';
import {indexPage} from '../routes/routeMap';

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  jumpToIndex: () => {
    dispatch(push(indexPage.location));
  }
});

export default connect(null, mapDispatchToProps)(NoMatch);
