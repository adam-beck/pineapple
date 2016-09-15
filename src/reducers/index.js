import { combineReducers } from 'redux';
import jwtDecode from 'jwt-decode';

const initialState = {
  token: null,
  userName: null,
  isAuthenticated: false,
  isAuthenticating: false,
  isRegistering: false,
  statusText: null
};

const auth = (state = initialState, action) => {
  const decoded = action.token ? jwtDecode(action.token) : {};

  switch (action.type) {
    case 'LOGIN_ATTEMPT':
      return Object.assign({}, state, {
        isAuthenticating: true,
        statusText: null
      });
    case 'LOGIN_SUCCESS':
      return Object.assign({}, state, {
        isAuthenticating: false,
        isAuthenticated: true,
        token: action.token,
        userName: decoded.username,
        statusText: 'You have been successfully logged in.'
      });
    case 'LOGIN_RESUME':
      return Object.assign({}, state, {
        isAuthenticating: false,
        isAuthenticated: true,
        token: action.token,
        userName: decoded.username,
        statusText: null
      });
    case 'LOGOUT':
      return Object.assign({}, state, {
        isAuthenticating: false,
        isAuthenticated: false,
        token: null,
        userName: null,
        statusText: 'You have been logged out'
      });
    case 'REGISTER_ATTEMPT':
      return Object.assign({}, state, {
        isRegistering: true
      });
    default:
      return state;
  }
};

const todoApp = combineReducers({
  auth
});

export default todoApp;
