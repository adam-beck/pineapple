import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loginAttempt, loginSuccess, loginResume, logout, registerAttempt } from '../../actions'
import jwtDecode from 'jwt-decode';
import { Link } from 'react-router';

import styles from './AuthControls.css';

class AuthControls extends Component {

  constructor(props) {
    super(props);

    this.logoutClick = this.logoutClick.bind(this);
  }

  logoutClick() {
    localStorage.removeItem('token');
    this.props.dispatch(logout());
  }

  render() {
    return (
      <div className={styles.main}>
        <button className={styles.button}>Register</button>
        {this.props.isAuthenticated ?
          <button className={styles.button} onClick={this.logoutClick}>Log Out</button> :
          <button className={styles.button}><Link to="/login">Log In</Link></button>
        }
      </div>
    );
  }
}

AuthControls.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

export default connect()(AuthControls);

