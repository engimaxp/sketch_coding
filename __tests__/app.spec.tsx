import * as ReactDOM from "react-dom";
import * as renderer from 'react-test-renderer';
import * as React from "react";
import { Hello } from "../src/components/Hello";
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
describe('App', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Hello compiler="TypeScript" framework="React"/>, div);
    });

    /**
     * Jest is an e2e test framework
     */
    test('has a valid snapshot', () => {
        const component = renderer.create(
            <Hello compiler="TypeScript" framework="React"/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    /**
     * Enzyme is a unit test framework
     */
    it('shows two items in list', () => {
        const element = Enzyme.shallow(
            <Hello compiler="TypeScript" framework="React"/>
        );

        expect(element.find('h1').length).toBe(1);
    });
});
