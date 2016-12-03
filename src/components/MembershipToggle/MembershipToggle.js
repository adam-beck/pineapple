import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loginAttempt, loginSuccess, logout, registerAttempt } from '../../actions';
import { browserHistory } from 'react-router';

import styles from './MembershipToggle.css';

class MembershipToggle extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loginUsername: '',
      loginPassword: '',
      registerUsername: '',
      registerPassword: '',
      registerEmail: ''
    };

    this.login = this.login.bind(this);
    this.logoutClick = this.logoutClick.bind(this);
    this.register = this.register.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleRegisterUsernameChange = this.handleRegisterUsernameChange.bind(this);
    this.handleRegisterPasswordChange = this.handleRegisterPasswordChange.bind(this);
    this.handleRegisterEmailChange = this.handleRegisterEmailChange.bind(this);
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
        username: this.state.loginUsername,
        password: this.state.loginPassword
      })
    }).then(response => response.json())
      .then(json => {
        const { token } = json;
        if (token) {
          localStorage.setItem('token', token);
          this.props.dispatch(loginSuccess(token));
          browserHistory.push('/');
        }
      });
  }

  register() {
    this.props.dispatch(registerAttempt());
    fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.registerUsername,
        password: this.state.registerPassword,
        email: this.state.registerEmail
      })
    }).then(response => response.json())
    .then(json => {
      const { token } = json;
      if (token) {
        localStorage.setItem('token', token);
        this.props.dispatch(loginSuccess(token));
        browserHistory.push('/');
      }
    });
  }

  logoutClick() {
    localStorage.removeItem('token');
    this.props.dispatch(logout());
  }

  handleUsernameChange(event) {
    this.setState({
      loginUsername: event.target.value
    });
  }

  handlePasswordChange(event) {
    this.setState({
      loginPassword: event.target.value
    });
  }

  handleRegisterUsernameChange(event) {
    this.setState({
      registerUsername: event.target.value
    });
  }

  handleRegisterPasswordChange(event) {
    this.setState({
      registerPassword: event.target.value
    });
  }

  handleRegisterEmailChange(event) {
    this.setState({
      registerEmail: event.target.value
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.section}>
          <h3>Login</h3>

          <input className={styles.input} type="text" value={this.state.loginUsername} onChange={this.handleUsernameChange} placeholder="Username" />
          <input className={styles.input} type="password" value={this.state.loginPassword} onChange={this.handlePasswordChange} placeholder="Password" />
          <button onClick={this.login}>Login</button>
          <button onClick={this.logoutClick}>Logout</button>
        </div>
        <div className={styles.section}>
          <h3>Register</h3>
          <input className={styles.input} type="email" value={this.state.registerEmail} onChange={this.handleRegisterEmailChange} placeholder="Email" />
          <input className={styles.input} type="text" value={this.state.registerUsername} onChange={this.handleRegisterUsernameChange} placeholder="Username" />
          <input className={styles.input} type="password" value={this.stateregisterPassword} onChange={this.handleRegisterPasswordChange} placeholder="Password" />
          <button onClick={this.register}>Register</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

MembershipToggle.propTypes = {
  dispatch: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};


export default connect(mapStateToProps)(MembershipToggle);
