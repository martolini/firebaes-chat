const chatrooms = (state={}, action) => {
  switch(action.type) {
    case 'ADD_CHATROOM':
    case 'ADD_CHATROOM_MEMBER':
      return {
        ...state,
        [action.id]: chatroom(state[action.id], action)
      }
    default:
      return state
  }
}

const chatroom = (state={}, action) => {
  switch (action.type) {
    case 'ADD_CHATROOM':
      return {
        id: action.chatroom,
        members: [],
        messages: []
      }
    case 'ADD_CHATROOM_MEMBER':
      return {
        ...state,
        members: [...state.members, {
          id: action.userId,
          displayName: action.displayName,
        }]
      }
    default:
      return state
  }
}

export default chatrooms
