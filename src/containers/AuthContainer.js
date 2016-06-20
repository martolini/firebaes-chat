import React, { Component } from 'react'
import LoginComponent from 'components/LoginComponent'
import SignupComponent from 'components/SignupComponent'

export default class AuthContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      view: 'login'
    }
    this.changeView = this.changeView.bind(this)
  }

  changeView(view) {
    this.setState({view})
  }

  render() {
    const { view } = this.state
    if (view === 'login') {
      return <LoginComponent changeView={this.changeView}/>
    } else {
      return <SignupComponent changeView={this.changeView}/>
    }
  }
}
