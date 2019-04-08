import * as ReactDOM from "react-dom";
import { Hello } from "../src/components/Hello";
import * as React from "react";

test('adds 1 + 2 to equal 3', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Hello  compiler="TypeScript" framework="React"/>, div);
});
test('Jest-TypeScript 尝试运行', () => {
    expect(1+1).toBe(2) // Pass
})
