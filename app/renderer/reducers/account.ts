import AccountData from '../types/Account';
import {accountActions} from '../actions/account';
import {CLEAR, SET} from '../actions/account/action_type';
import {AccountState} from '../types';

export const INITIAL_STATE: AccountData = {
  pinCode: undefined,
  password: undefined,
  username: undefined,
  nickName: undefined,
  avatar: undefined,
  repo: undefined,
};

export default function account(state: AccountState = {data: INITIAL_STATE}, action: accountActions): AccountState {
  if (action.type === SET) {
    return {
      data: action.account
    };
  } else if (action.type === CLEAR) {
    return {
      data: INITIAL_STATE
    };
  } else {
    return state;
  }
}
