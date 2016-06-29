import { combineReducers } from 'redux'

const byId = (state={}, action) => {
  switch(action.type) {
    case 'ADD_FRIEND':
      return {
        ...state,
        [action.id]: friend(undefined, action)
      }
    case 'CHANGE_FRIEND':
      return {
        ...state,
        [action.id]: friend(state[action.id], action)
      }
    case 'ADD_MESSAGE':
      return {
        ...state,
        [action.id]: friend(state[action.id], action)
      }
    default:
      return state
  }
}

const allIds = (state=[], action) => {
  switch(action.type) {
    case 'ADD_FRIEND':
      return [...state, action.id]

    default:
      return state
  }
}

const friend = (state={}, action) => {
  switch(action.type) {
    case 'ADD_FRIEND':
      return {
        id: action.id,
        displayName: action.displayName,
        pending: action.pending,
        chatroom: action.chatroom,
        messages: []
      }
    case 'CHANGE_FRIEND':
      const { key, value } = action
      return {
        ...state,
        [key]: value
      }
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: messages(state.messages, action)
      }
    default:
      return state
  }
}

const messages = (state=[], action) => {
  switch(action.type) {
    case 'ADD_MESSAGE':
      return [...state, action.message]
    default:
      return state
  }
}

export default combineReducers({
  byId,
  allIds
})
