import React, { Component } from 'react';
import { connect } from 'react-redux';

class Home extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.auth.isAuthenticated ? `Welcome, ${this.props.auth.userName}` : 'You are not logged in!!'}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(Home);
