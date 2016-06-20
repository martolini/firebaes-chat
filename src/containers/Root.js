import React, { Component } from 'react'
import AuthContainer from './AuthContainer'
import { Provider } from 'react-redux'
import firebase from 'firebase'
import { connect } from 'react-redux'
import { logout } from 'actions/auth'

class Root extends Component {

  componentDidMount() {
    const { dispatch } = this.props
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        dispatch(logout())
      }
    })
  }

  render() {
    const { uid } = this.props.auth
    let content = <AuthContainer />
    if (uid) {
      content = <div>Chat</div>
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
