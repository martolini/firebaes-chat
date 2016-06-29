import React, { Component } from 'react'
import AuthContainer from './AuthContainer'
import ChatContainer from './ChatContainer'
import { Provider } from 'react-redux'
import firebase from 'firebase'
import { connect } from 'react-redux'
import { logout } from 'actions/auth'
import 'less/main.less'

class Root extends Component {

  componentDidMount() {
    const { dispatch, uid } = this.props
    firebase.auth().onAuthStateChanged((user) => {
      if (!user && uid) {
        dispatch(logout())
      }
    })
  }

  render() {
    const { uid } = this.props.auth
    let content = <AuthContainer />
    if (uid) {
      content = <ChatContainer />
    }
    return (
      <Provider store={this.props.store}>
        { content }
      </Provider>
    )
  }
}

export default connect((state) => ({
  auth: state.auth
}))(Root)
