import firebase from 'firebase'

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

export const logout = (error) => {
  return (dispatch, getState) => {
    const ref = firebase.database().ref('users').child(getState().auth.uid)
    ref.off('value')
    dispatch({
      type: 'LOG_OUT'
    })
  }
}

export const fetchUser = (uid) => {
  return (dispatch, getState) => {
    dispatch(fetchUserRequest())
    const ref = firebase.database().ref('users').child(uid)
    ref.on('value', (snap) => {
      if (!snap.exists())
        return dispatch(loginError('Whaaat?'))
      if (getState().auth.loading) {
        dispatch(userFetched(snap.val()))
      } else {
        dispatch(userChanged(snap.val()))
      }
    })
  }
}

const fetchUserRequest = () => ({
  type: 'FETCH_USER_REQUEST'
})

const userFetched = (user) => ({
  type: 'USER_FETCHED',
  user
})

const userChanged = (user) => ({
  type: 'USER_CHANGED',
  user
})
