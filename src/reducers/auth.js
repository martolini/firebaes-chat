const initialState = {
  error: null,
  loading: false,
  user: null,
  uid: null
}

export default (state=initialState, action) => {
  switch(action.type) {
    case 'LOGIN_REQUEST':
      return {
        uid: null,
        user: null,
        error: null,
        loading: true
      }
    case 'LOGIN_SUCCESS':
      return {
        uid: action.uid,
        error: null,
        user: null,
        loading: false
      }
    case 'LOGIN_ERROR':
      return {
        error: action.error,
        user: null,
        loading: false,
        uid: null
      }
    case 'LOG_OUT':
      return initialState
    case 'FETCH_USER_REQUEST':
      return {
        ...state,
        loading: true
      }
    case 'USER_FETCHED':
      return {
        ...state,
        loading: false,
        user: action.user
      }
    case 'USER_CHANGED':
      return {
        ...state,
        user: action.user
      }
    default:
      return state
  }
}
