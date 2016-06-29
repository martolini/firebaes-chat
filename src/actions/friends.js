import firebase from 'firebase'

export const sendFriendRequest = (friend) => {
  return (dispatch, getState) => {
    const { auth: { uid, user: { username } }} = getState()
    return firebase.database().ref('firend-requests').child(friend).child(uid).set({
      id: uid,
      username,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    })
  }
}

export const listenToFriends = () => {
  return (dispatch, getState) => {
    const friendsRef = firebase.database().ref('friends').child(getState().auth.uid)
    friendsRef.on('child_added', (snap) => {
      const friend = snap.val()
      dispatch(addFriend(friend))
      dispatch(listenToMessages(friend))
      friendsRef.child(snap.key).on('child_changed', (s) => {
        dispatch(changeFriend({
          id: friend.id,
          key: s.key,
          value: s.val()
        }))
      })
    })
  }
}

const listenToMessages = (friend) => {
  return (dispatch, action) => {
    firebase.database()
      .ref('friend-messages')
      .child(friend.chatroom)
      .orderByChild('createdAt')
      .limitToLast(20)
      .on('child_added', (snap) => {
        dispatch(addMessage(friend.id, snap.val()))
    })
  }
}

export const stopListeningToFriends = () => {
  return (dispatch, getState) => {
    firebase.database.ref('friends').child(getState().auth.uid).off('child_added')
    firebase.database.ref('friends').child(getState().auth.uid).off('child_changed')
  }
}

const addFriend = ({ id, displayName, pending, chatroom }) => ({
  type: 'ADD_FRIEND',
  id,
  displayName,
  pending,
  chatroom
})

const changeFriend = (id, key, value) => ({
  type: 'CHANGE_FRIEND',
  id,
  key,
  value
})

const addMessage = (id, message) => ({
  type: 'ADD_MESSAGE',
  id,
  message
})

export const sendMessage = (chatroom, { text, author }) => {
  return (dispatch, getState) => {
    const messageRef = firebase.database().ref('friend-messages').child(chatroom).push()
    return messageRef.set({
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      id: messageRef.key,
      author,
      text
    })
  }
}
