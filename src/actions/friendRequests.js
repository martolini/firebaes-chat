import firebase from 'firebase'

export const sendFriendRequest = (friend) => {
  return (dispatch, getState) => {
    const { auth: { user }} = getState()
    const room = firebase.database().ref('friend-messages').push()
    const messageRef = room.push()
    return messageRef.set({
      author: -1,
      text: `Welcome to this room! For now, its just you here - we're waiting for ${friend.displayName} to accept!`,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      id: messageRef.key
    }).then(() => firebase.database().ref('friend-requests').child(friend.id).child(user.id).set({
        id: user.id,
        displayName: user.displayName,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        chatroom: room.key
      })).then(() => firebase.database().ref('friends').child(user.id).child(friend.id).set({
        id: friend.id,
        displayName: friend.displayName,
        pending: true,
        chatroom: room.key
      })).catch(err => console.log(err))
    }
}

export const acceptFriendRequest = (friend) => {
  return (dispatch, getState) => {
    const { auth: { user }} = getState()
    return firebase.database().ref('friend-requests').child(user.id).child(friend.id).remove()
      .then(() => firebase.database().ref('friends').child(friend.id).child(user.id).child('pending').set(false))
      .then(() => firebase.database().ref('friends').child(user.id).child(friend.id).set({
        id: friend.id,
        displayName: friend.displayName,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        chatroom: friend.chatroom
      })).then(() => {
        const messageRef = firebase.database().ref('friend-messages').child(friend.chatroom).push()
        return messageRef.set({
          author: -1,
          text: `${user.displayName} joined this chat`,
          id: messageRef.key,
          createdAt: firebase.database.ServerValue.TIMESTAMP
        })
      })
  }
}

export const declineFriendRequest = (friend) => {
  return (dispatch, getState) => {
    const { auth: { uid }} = getState()
    return firebase.database().ref('friend-requests').child(uid).child(friend.id).remove()
      .then(() => {
        const messageRef = firebase.database().ref('friend-messages').child(friend.chatroom).push()
        return messageRef.set({
          author: -1,
          text: 'Your friend request was denied',
          id: messageRef.key
        })
      })
  }
}

export const listenToFriendRequests = () => {
  return (dispatch, getState) => {
    const { auth: { uid }} = getState()
    firebase.database().ref('friend-requests').child(uid).on('child_added', (snap) =>
      dispatch(receivedFriendRequest(snap.val())))
    firebase.database().ref('friend-requests').child(uid).on('child_removed', (snap) =>
      dispatch(removedFriendRequest(snap.key)))
  }
}

export const stopListeningToFriendRequests = () => {
  return (dispatch, getState) => {
    const { auth: { uid }} = getState()
    firebase.database().ref('friend-requests').child(uid).off('child_added')
    firebase.database().ref('friend-requests').child(uid).off('child_removed')
  }
}

const receivedFriendRequest = ({id, displayName, timestamp, chatroom}) => ({
  type: 'RECEIVED_FRIEND_REQUEST',
  id,
  displayName,
  timestamp,
  chatroom
})

const removedFriendRequest = (id) => ({
  type: 'REMOVED_FRIEND_REQUEST',
  id
})
