import 'whatwg-fetch';

import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader'
import configureStore from './store/configureStore';
import Root from './containers/Root';
import './styles.css';

const store = configureStore();

render(
  <AppContainer>
    <Root store={store} />
  </AppContainer>, document.getElementById('app')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root').default;
    render(
      <AppContainer>
        <NextRoot store={store} />
      </AppContainer>, document.getElementById('app')
    );
  });
}
