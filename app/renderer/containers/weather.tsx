import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { StoreState} from '../types';
import { startFetchAsync } from '../actions/weather';
import Weather from '../components/Weather';
import {ThunkDispatch} from 'redux-thunk';

const mapStateToProps = (state: StoreState) => ({
  weatherProp: state.weather.weather,
  isFetching: state.weather.isFetching
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  startFetch: () => {
    dispatch(startFetchAsync()).then()
        .catch(reason => {
          console.log(reason);
        }
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Weather);
