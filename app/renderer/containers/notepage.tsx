import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { StoreState} from '../types';
import {failFetch, startFetchAsync, successFetch} from '../actions/weather';
import NotePage from '../components/Page/Note';
import {ThunkDispatch} from 'redux-thunk';

const mapStateToProps = (state: StoreState) => ({
    localDirectory: state.account.data.repo ? state.account.data.repo!.localDirectory : '',
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
    startFetch: () => {
        dispatch(startFetchAsync(successFetch, failFetch)).then()
            .catch(reason => {
                    console.log(reason);
                }
            );
    },
    saveANewNote: (diaryName: string, diaryLocation: string) => {
        console.log(diaryName);
        console.log(diaryLocation);
        // todo: save to db and sync to local meta info
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(NotePage);
