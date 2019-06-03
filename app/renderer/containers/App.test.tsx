import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import {configureStore, history} from '../store';
import {ConnectedRouter} from 'connected-react-router';
import {Provider} from 'react-redux';
import { shallow , mount } from 'enzyme';
import * as sinon from 'sinon';
import pako from 'pako';
import simplegit from 'simple-git/promise';
import {StatusResult} from 'simple-git/typings/response';

const store = configureStore();
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
      <Provider store={store}>
          <ConnectedRouter history={history}>
              <App />
          </ConnectedRouter>
      </Provider>
      , div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('Enzyme Shallow', () => {
    it('App\'s title should be Todos', () => {
        const app = shallow(<App  store={store}/>);
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
    it('decompress', () => {
        const punzipstr = 'H4sIAAAAAAAAAKtWSs/JT0rM8UxRslIyNDFX0lFKT813TixJTc8vqgSLGgPF' +
            '8hJzU4HM58uXPZ/V/nTTbKBQWmlOjh+a8NMdTUCZVKhwYGZeRmliXnpKYj5I1A2hQalWhwsA0ps4IXoAAAA=';
        console.log(atob(punzipstr));
        const a = pako.ungzip(atob(punzipstr), { to: 'string' } );
        console.log(a);
    });
    it('encompress', () => {
        const punzipstr = '{"globalId":"147","geoCategoryId":"3","name":"秦皇岛",' +
            '"fullName":"秦皇岛市","eName":"Qinhuangdao","eFullName":""},\n';
        const a = pako.gzip(punzipstr, { to: 'string' } );
        console.log(a);
        console.log(btoa(a));
    });
    it('git', () => {
        const git = simplegit();
        git.status().then((status: StatusResult) => {  });
    });
});
