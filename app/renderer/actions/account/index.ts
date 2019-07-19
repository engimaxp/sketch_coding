import { SET, CLEAR } from './action_type';
import AccountData from '../../types/Account';

export type accountActions = Set | Clear;

interface Set {
  type: SET;
  account: AccountData;
}

export const set = (account: AccountData): Set => ({
  type: SET,
  account
});

interface Clear {
  type: CLEAR;
}

export function clear(): Clear {
  return {
    type: CLEAR
  };
}
