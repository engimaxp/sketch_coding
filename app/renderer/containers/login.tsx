import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { StoreState} from '../types';
import Login from '../components/Login';
import {ThunkDispatch} from 'redux-thunk';
import { push } from 'connected-react-router';
import {nestedIndexPage} from '../routes/routeMap';
const mapStateToProps = (state: StoreState) => ({
  weatherProp: state.weather.weather,
  isFetching: state.weather.isFetching
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  startFetch: () => {
    dispatch(push(nestedIndexPage.link));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
