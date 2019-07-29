import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { StoreState} from '../types';
import Login from '../components/Page/Login';
import {ThunkDispatch} from 'redux-thunk';
import { push } from 'connected-react-router';
import {nestedIndexPage, registerPage} from '../routes/routeMap';
import AccountData from '../types/Account';
import {getAccounts, UserInfo} from '../vcs/local/UserInfo';
import {set} from '../actions/account';
const mapStateToProps = (state: StoreState) => ({
  accountData: state.account.data,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
    successRedirect: (account: AccountData) => {
        dispatch(set(account));
        dispatch(push(nestedIndexPage.link));
  },
    checkLogin: async (account: AccountData) => {
        let userInfos: UserInfo[] = [];
        if (!!account && !!account.username) {
            dispatch(push(nestedIndexPage.link));
        } else {
            const dbAccounts = await getAccounts(5);
            console.log(JSON.stringify(dbAccounts));
            if (!dbAccounts || dbAccounts.length === 0) {
                // fetch from db check there is account available
                dispatch(push(registerPage.link));
            }
            userInfos = dbAccounts;
        }
        return userInfos;
    },
    redirectToRegister: () => {
        dispatch(push(registerPage.link));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
