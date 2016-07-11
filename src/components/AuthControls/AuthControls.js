import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loginAttempt, loginSuccess, loginResume, logout } from '../../actions'
import jwtDecode from 'jwt-decode';

import styles from './AuthControls.css';

class AuthControls extends Component {

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

  render() {
    return (
      <div className={styles.main}>
        <button className={styles.button}>Register</button>
        {this.props.auth.isAuthenticated ?
          <button className={styles.button} onClick={this.logoutClick}>Log Out</button> :
          <button className={styles.button} onClick={this.login}>Log In</button>
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

AuthControls.propTypes = {
  dispatch: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(AuthControls);

