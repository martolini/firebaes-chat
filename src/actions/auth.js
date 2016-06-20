export const loginRequest = () => ({
  type: 'LOGIN_REQUEST'
})

export const loginSuccess = (uid) => ({
  type: 'LOGIN_SUCCESS',
  uid
})

export const loginError = (error) => ({
  type: 'LOGIN_ERROR',
  error
})

export const logout = (error) => ({
  type: 'LOG_OUT'
})
