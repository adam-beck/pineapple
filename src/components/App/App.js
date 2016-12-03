import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from '../Header/Header';
import jwtDecode from 'jwt-decode';
import { loginAttempt, loginSuccess, loginResume, logout, registerAttempt } from '../../actions';

class App extends Component {

  constructor(props) {
    super(props);
    const currentToken = localStorage.getItem('token');
    if (!this.props.auth.isAuthenticated && currentToken) {
      const decoded = jwtDecode(currentToken);
      if (decoded.exp >= Date.now()) {
        this.props.dispatch(loginResume(currentToken));
      }
    }
  }

  render() {
    return (
      <div>
        <Header auth={this.props.auth} />
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node
};

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(App);
