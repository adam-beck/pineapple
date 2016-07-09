import 'whatwg-fetch';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loginAttempt, loginSuccess, loginResume, logout } from '../../actions'
import jwtDecode from 'jwt-decode';

import Header from '../Header';

import styles from './styles.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
    this.logoutClick = this.logoutClick.bind(this);
  }

  componentWillMount() {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      const decoded = jwtDecode(currentToken);
      if (decoded.exp >= Date.now()) {
        this.props.dispatch(loginResume(currentToken));
      }
    }
  }

  login() {
    this.props.dispatch(loginAttempt());
    fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'johnsmith4',
        password: 'helloworld'
      })
    }).then(response => response.json())
      .then(json => {
        const { token } = json;
        localStorage.setItem('token', token);
        this.props.dispatch(loginSuccess(token));
      });
  }

  logoutClick() {
    localStorage.removeItem('token');
    this.props.dispatch(logout());
  }

  // TODO: incorporate this into the Header
  // <div className={styles.main}>
  //   {this.props.auth.isAuthenticated ? 'You are logged in!' : 'Please log in'}
  //   <button onClick={this.login}>Log In</button>
  //   <button onClick={this.logoutClick}>Log Out</button>
  // </div>

  render() {
    return (
      <div>
        <Header />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};


App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(App);
