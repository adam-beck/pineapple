import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loginAttempt, loginSuccess, logout } from '../../actions';

import styles from './MembershipToggle.css';

const register = () => {
  alert('registered');
};

class MembershipToggle extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };

    this.login = this.login.bind(this);
    this.logoutClick = this.logoutClick.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
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
        username: this.state.username,
        password: this.state.password
      })
    }).then(response => response.json())
      .then(json => {
        const { token } = json;
        if (token) {
          localStorage.setItem('token', token);
          this.props.dispatch(loginSuccess(token));
        }
      });
  }

  logoutClick() {
    localStorage.removeItem('token');
    this.props.dispatch(logout());
  }

  handleUsernameChange(event) {
    this.setState({
      username: event.target.value
    });
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.section}>
          <h3>Login</h3>

          <input className={styles.input} type="text" value={this.state.username} onChange={this.handleUsernameChange} />
          <input className={styles.input} type="password" value={this.state.password} onChange={this.handlePasswordChange} />
          <button onClick={this.login}>Login</button>
          <button onClick={this.logoutClick}>Logout</button>
        </div>
        <div className={styles.section}>
          <h3>Register</h3>
          <input className={styles.input} type="text" />
          <input className={styles.input} type="password" />
          <button onClick={register}>Register</button>
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
