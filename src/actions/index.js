export const loginAttempt = () => {
  return {
    type: 'LOGIN_ATTEMPT'
  };
};

export const loginSuccess = (token) => {
  return {
    type: 'LOGIN_SUCCESS',
    token
  };
};

export const loginResume = (token) => {
  return {
    type: 'LOGIN_RESUME',
    token
  }
};

export const logout = () => {
  return {
    type: 'LOGOUT'
  };
};

export const registerAttempt = () => {
  return {
    type: 'REGISTER_ATTEMPT'
  };
}
