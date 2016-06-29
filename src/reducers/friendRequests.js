const friendRequests = (state=[], action) => {
  switch(action.type) {
    case 'RECEIVED_FRIEND_REQUEST':
      return [...state, {
        id: action.id,
        displayName: action.displayName,
        timestamp: action.timestamp,
        chatroom: action.chatroom
      }]
    case 'REMOVED_FRIEND_REQUEST':
      return state.filter(request => request.id !== action.id)
    default:
      return state
  }
}

export default friendRequests
