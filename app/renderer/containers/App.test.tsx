import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import {configureStore, history} from '../store';
import {ConnectedRouter} from 'connected-react-router';
import {Provider} from 'react-redux';
import { shallow , mount } from 'enzyme';
import * as sinon from 'sinon';

const store = configureStore();
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('Enzyme Shallow', () => {
    it('App\'s title should be Todos', () => {
        const app = shallow(<Provider store={store}>
            <ConnectedRouter history={history}>
                <App />
            </ConnectedRouter>
        </Provider>);
        expect(app.find('div').length).toEqual(0);
    });
    it('calls componentDidMount', () => {
        sinon.spy(App.prototype, 'componentDidMount');
        mount(<Provider store={store}>
            <ConnectedRouter history={history}>
                <App />
            </ConnectedRouter>
        </Provider>);
        expect(App.prototype.componentDidMount).toHaveProperty('callCount', 1 );
    });
});

// describe('testing', () => {
//   it('App\'s title should be Todos', () => {
//     // const app = shallow(<App/>);
//     expect(1).toEqual(1);
//   });
// }
