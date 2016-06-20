import React from 'react';
import firebase from 'firebase'
import { connect } from 'react-redux'
import { loginRequest, loginSuccess, loginError } from 'actions/auth'

class SignupComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  onSubmit(e) {
    e.preventDefault()
    const { email, password } = this.state
    const { dispatch } = this.props
    dispatch(loginRequest())
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        return firebase.database().ref('users').child(user.uid).set({
          createdAt: firebase.ServerValue.TIMESTAMP,
          username: user.email.split('@')[0]
        }).then(() => dispatch(loginSuccess(user.uid)))
      }).catch((err) => {
        dispatch(loginError(err.message))
      })
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <input type='email'
          onChange={(e) => this.setState({email: e.target.value})}
          placeholder='email'
          required
        />
        <input type='password'
          onChange={(e) => this.setState({password: e.target.value})}
          placeholder='****'
          required
        />
        <button type='submit' disabled={this.props.auth.loading}>Sign up</button>
        { this.props.auth.error && <p>{ this.props.auth.error }</p>}
        <p onClick={() => this.props.changeView('login')}>
          Already have an account? Click here to log in.
        </p>
      </form>
    );
  }

}

export default connect((state) => ({
  auth: state.auth
}))(SignupComponent)
