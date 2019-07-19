import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { StoreState} from '../types';
import Login from '../components/Login';
import {ThunkDispatch} from 'redux-thunk';
import { push } from 'connected-react-router';
import {nestedIndexPage, registerPage} from '../routes/routeMap';
import AccountData from '../types/Account';
import {getAccounts} from '../vcs/local/UserInfo';
const mapStateToProps = (state: StoreState) => ({
  accountData: state.account.data,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
    successRedirect: () => {
    dispatch(push(nestedIndexPage.link));
  },
    checkLogin: async (account: AccountData) => {
        if (!!account && !!account.username) {
            dispatch(push(nestedIndexPage.link));
        } else {
            const dbAccounts = await getAccounts(5);
            if (!dbAccounts || dbAccounts.length === 0) {
                // fetch from db check there is account available
                dispatch(push(registerPage.link));
            }
        }
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
