import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { Modal } from 'react-bootstrap'
import 'less/chat.less'
import firebase from 'firebase'
import moment from 'moment'

export default class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedFriend: null,
      showAddFriendModal: false,
      view: 'messages'
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.friends.length > 0 && this.state.selectedFriend === null && this.state.view === 'messages') {
      this.setState({selectedFriend: 0})
    }
  }

  render() {
    const { selectedFriend } = this.state
    let content = (
      <Chatroom
        friend={selectedFriend === null ? null : this.props.friends[selectedFriend]}
        user={this.props.user}
        sendMessage={this.props.sendMessage}
      />
    )
    if (this.state.view === 'friendRequests') {
      content = (
        <FriendRequests friendRequests={this.props.friendRequests}
          onChangeView={(view) => this.setState({view})}
          acceptFriendRequest={this.props.acceptFriendRequest}
          declineFriendRequest={this.props.declineFriendRequest}
        />
      )
    }
    return (
      <div className='friends-container'>
        <div className='edgechat clearfix'>
          <FriendsList
            friends={this.props.friends}
            friendRequests={this.props.friendRequests.length}
            onAddFriend={() => this.setState({showAddFriendModal: true})}
            selectedFriend={selectedFriend}
            setSelectedFriend={(selectedFriend) => this.setState({view: 'messages', selectedFriend})}
            onChangeView={(view) => this.setState({view})}
          />
          { content }
        </div>
        <AddFriendModal open={this.state.showAddFriendModal}
          close={() => this.setState({showAddFriendModal: false})}
          sendFriendRequest={this.props.sendFriendRequest} />
      </div>
    )
  }
}

const ChatHeader = (props) => {
  const { title, onChangeView, closeButton } = props
  return (
    <div className='chat-header clearfix'>
      <h4>{ title }</h4>
      { closeButton && <i className='fa fa-2x fa-times' onClick={(e) => onChangeView('messages')}></i>}
    </div>
  )
}

const FriendRequests = (props) => {
  return (
    <div className='chat-container'>
      <ChatHeader title={'Someone wants to be your friend'}
        closeButton
        onChangeView={props.onChangeView}
      />
      <ul className='friend-requests'>
        { props.friendRequests.map((friend) => (
          <li key={friend.id}>
            <p className='lead'>{ friend.displayName } sent you a friend request</p>
            <button className='btn btn-success' onClick={() => props.acceptFriendRequest(friend)}>Accept</button>
            <button className='btn btn-danger' onClick={() => props.declineFriendRequest(friend)}>Decline</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

const FriendsList = (props) => {
  return (
    <div className='friends-list'>
      {( props.friendRequests > 0 && (
        <div className='notification'>
          <i className='fa fa-fw fa-bell-o text-center' onClick={() => props.onChangeView('friendRequests')}></i>
        </div>
      ))}
      <ul className='list'>
        {props.friends.map((friend, i) => (
          <li className={'clearfix' + (props.selectedFriend === i ? ' selected' : null)}
            key={friend.id}
            onClick={() => props.setSelectedFriend(i)}
            >
            <i className={friend.online ? 'fa fa-fw fa-circle online' : 'fa fa-fw fa-circle-o'}></i> {friend.displayName}
          </li>
        ))}
        <li className='clearfix' key={0} onClick={props.onAddFriend}>
          + Add friend
        </li>
      </ul>
    </div>
  )
}

class AddFriendModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: '',
      results: [],
      users: [],
      loading: false
    }
  }

  componentDidMount() {
    this.setState({
      loading: true
    })
    firebase.database().ref('users').once('value')
      .then((snap) => {
        const users = []
        snap.forEach((s) => {
          users.push(s.val())
        })
        this.setState({
          users,
          loading: false
        })
      })
  }

  onChange(e) {
    this.setState({query: e.target.value})
    const val = e.target.value
    if (val.length >= 3) {
      const regexp = new RegExp(val, 'i')
      const results = this.state.users.filter(({displayName}) => {
        return displayName.match(regexp)
      })
      this.setState({results})
    } else {
      this.setState({results: []})
    }
  }

  get content() {
    if (this.state.loading)
      return <i className='fa fa-2x fa-spinner fa-spin'></i>
    return (
      <div>
        <input type='text' value={this.state.query} onChange={this.onChange.bind(this)} />
        <span>Search for a friend</span>
        <h4>Results</h4>
        { this.state.results.map(({ id, displayName }) => (
          <li key={id} onClick={(e) => this.props.sendFriendRequest({id, displayName})}>{ displayName }</li>
        )) }
      </div>
    )
  }

  render() {
    return (
      <Modal show={this.props.open} onHide={this.props.close}>
        <Modal.Header closeButton>
          <Modal.Title>Add a new friend</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.content }
        </Modal.Body>
      </Modal>
    )
  }
}

class Chatroom extends Component {
  render() {
    const { friend } = this.props
    if (!friend) {
      return (
        <div className='chat-container'>
          <ChatHeader title={'Select a chat'}/>
        </div>
      )
    }
    return (
      <div className='chat-container'>
        <ChatHeader title={friend.displayName}/>
        <ChatHistory messages={friend.messages} />
        <ChatInput user={this.props.user} sendMessage={(message) => this.props.sendMessage(friend.chatroom, message)}/>
      </div>
    )
  }
}

class ChatHistory extends Component {

  componentWillUpdate(nextProps, nextState) {
    const node = findDOMNode(this)
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.shouldScrollBottom) {
      const node = findDOMNode(this)
      node.scrollTop = node.scrollHeight
    }
  }

  render() {
    const { messages } = this.props
    return (
      <ul className='chat-history'>
        { messages.map((message, i) => {
          if (message.author === -1) {
            return <SystemMessage key={message.id} text={message.text} createdAt={message.createdAt}/>
          }
          return (
            <Chatmessage
            text={message.text}
            showAuthor={i === 0 || (i > 0 && messages[i-1].author.id !== message.author.id)}
            author={message.author.name}
            createdAt={message.createdAt}
            key={message.id}
            />
          )
        })}
      </ul>
    )

  }
}

const SystemMessage = (props) => {
  const { text, createdAt } = props
  return (
    <li>
      <p className='text-muted'>
        <span className='time'>{ moment(createdAt).format('h:mm a') }</span>
        { text }
      </p>
    </li>
  )
}

const Chatmessage = (props) => {
  const { text, author, showAuthor, createdAt } = props
  return (
    <li className={showAuthor ? '' : 'collapsed'}>
      <span className='time text-muted'>{ moment(createdAt).format('h:mm a')}</span>
      <span className='main'>
        { showAuthor && <span className='author'>{ author }</span> }
        <span className='text'>{ text }</span>
      </span>
    </li>
  )
}

class ChatInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
  }

  onKeyDown(e) {
    if (e.keyCode === 13) { // Pressing ENTER
      e.preventDefault()
      const message = {
        author: {
          id: this.props.user.id,
          name: this.props.user.displayName
        },
        text: e.target.value.trim()
      }
      this.props.sendMessage(message)
      this.setState({text: ''})
    }
  }

  render() {
    return (
      <div className='chat-input'>
        <textarea placeholder='Type your message' rows={3}
        onKeyDown={this.onKeyDown.bind(this)}
        onChange={(e) => this.setState({text: e.target.value})}
        value={this.state.text} />
      </div>
    )
  }
}
