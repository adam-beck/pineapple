import React, { Component, PropTypes } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import App from '../components/App/App';
import DevTools from './DevTools';

class Root extends Component {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <div>
          <Router history={browserHistory}>
            <Route path="/" component={App} />
          </Router>
          <DevTools />
        </div>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default Root;
