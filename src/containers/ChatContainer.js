import React, { Component } from 'react'
import Chat from 'components/Chat'
import { connect } from 'react-redux'
import { fetchUser } from 'actions/auth'
import {
  listenToFriends,
  stopListeningToFriends,
  sendMessage
} from 'actions/friends'
import {
  listenToFriendRequests,
  stopListeningToFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest
 } from 'actions/friendRequests'

class ChatContainer extends Component {

  componentDidMount() {
    const { auth: { uid } } = this.props
    this.props.fetchUser(uid)
    this.props.startListen()
  }

  componentWillUnmount() {
    this.props.stopListen()
  }

  render() {
    if (this.props.auth.loading || !this.props.auth.user)
      return <div>Loading...</div>
    return (
      <Chat
        user={this.props.auth.user}
        friends={this.props.friends}
        sendFriendRequest={this.props.sendFriendRequest}
        friendRequests={this.props.friendRequests}
        acceptFriendRequest={this.props.acceptFriendRequest}
        declineFriendRequest={this.props.declineFriendRequest}
        sendMessage={this.props.sendMessage}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  friends: state.friends.allIds.map(k => state.friends.byId[k]),
  friendRequests: state.friendRequests
})

const mapDispatchToProps = (dispatch) => ({
  fetchUser(id) { dispatch(fetchUser(id)) },
  startListen() {
    dispatch(listenToFriends())
    dispatch(listenToFriendRequests())
  },
  stopListen() {
    dispatch(stopListeningToFriends())
    dispatch(stopListeningToFriendRequests())
  },
  sendFriendRequest(friend) { dispatch(sendFriendRequest(friend)) },
  acceptFriendRequest(friendId) { dispatch(acceptFriendRequest(friendId)) },
  declineFriendRequest(friendId) { dispatch(declineFriendRequest(friendId)) },
  sendMessage(chatroom, message) { dispatch(sendMessage(chatroom, message))}
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatContainer)
