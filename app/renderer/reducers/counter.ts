import { INCREMENT, DECREMENT } from '../actions/counter/action_type';
import { counterActions } from '../actions/counter';
import { CounterState } from '../types';

export const INITIAL_STATE: CounterState = {
  count: 1
};

export default function counter(state: CounterState = INITIAL_STATE, action: counterActions): CounterState {
  switch (action.type) {
    case INCREMENT:
      return {
        count: state.count + 1
      };

    case DECREMENT:
      return {
        count: state.count - 1
      };

    default:
      return state;
  }
}
