import 'whatwg-fetch';
import React, { Component } from 'react';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loggedIn: !!localStorage.getItem('token')
    };

    this.login = this.login.bind(this);
    this.logOut = this.logOut.bind(this);

  }

  componentWillMount() {
  }

  storeToken(token) {
    localStorage.setItem('token', token);
    this.setState({
      loggedIn: !!localStorage.getItem('token')
    });
  }

  login() {
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
        this.storeToken(json.token);
      });
  }

  logOut() {
    localStorage.removeItem('token');
    this.setState({
      loggedIn: false
    });
  }

  render() {
    return (
      <div>
        {this.state.loggedIn ? 'You are logged in!' : 'Sorry, you are not logged in'}

        <div>
          <button onClick={this.login}>Log In</button>
          <button onClick={this.logOut}>Log Out</button>
        </div>
      </div>
    );
  }
}

export default App;
