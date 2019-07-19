import {AnyAction} from 'redux';
import {connect} from 'react-redux';
import {ThunkDispatch} from 'redux-thunk';
import AccountData from '../types/Account';
import {set} from '../actions/account';
import Register from '../components/Register';
import {push} from 'connected-react-router';
import {nestedIndexPage} from '../routes/routeMap';
import {db} from '../vcs/local/db';
import {getANewAccount} from '../vcs/local/UserInfo';
import {getANewRepo} from '../vcs/local/Repo';

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return ({
        successRedirect: async (account: AccountData) => {
            const currentAccount = getANewAccount(account);
            if (currentAccount === null) {
                return;
            }
            if (account.repo === undefined) {
                return;
            }
            const currentRepo = getANewRepo(account.repo);
            if (currentRepo === null) {
                return;
            }
            // set account info to current store
            dispatch(set(account));
            // store account info to db
            await db.transaction('rw', db.users, db.repos, async () => {
                currentRepo.userId = await db.users.add(currentAccount);
                await db.repos.add(currentRepo);
            });
            // redirect to default home
            dispatch(push(nestedIndexPage.link));
        }
    });
};

export default connect(null, mapDispatchToProps)(Register);
