import { combineReducers } from 'redux';

const initialState = {
  token: null,
  userName: null,
  isAuthenticated: false,
  isAuthenticating: false,
  statusText: null
};

const auth = (state = initialState, action) => {
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
          userName: 'simpleTestForNow',
          statusText: 'You have been successfully logged in.'
        });
      case 'LOGIN_RESUME':
        return Object.assign({}, state, {
          isAuthenticating: false,
          isAuthenticated: true,
          token: action.token,
          userName: 'simpleTestForNow',
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
      default:
        return state;
  }
};

const todoApp = combineReducers({
  auth
});

export default todoApp;
