import React, { Component } from 'react';

interface CounterProps {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export default class Counter extends Component<CounterProps> {
  render() {
    const { count, increment, decrement } = this.props;

    return (
      <div>
        <div>Counter: {count}</div>
        <button className="increment" onClick={increment}>+</button>
        <button className="decrement" onClick={decrement}>-</button>
      </div>
    );
  }
}
