import firebase from 'firebase'

const db = firebase.database()

export const addRoom = (id) => ({
  type: 'ADD_ROOM',
  id
})
