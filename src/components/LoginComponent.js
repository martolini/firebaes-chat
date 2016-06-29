import React from 'react';
import firebase from 'firebase'
import { connect } from 'react-redux'
import { loginRequest, loginSuccess, loginError } from 'actions/auth'

class LoginComponent extends React.Component {
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
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        dispatch(loginSuccess(user.uid))
      }).catch((error => dispatch(loginError(error.message))))
  }

  render() {
    const { loading, error } = this.props.auth
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <input className='form-control' type='email'
          onChange={(e) => this.setState({email: e.target.value})}
          placeholder='email'
          required
        />
        <input className='form-control' type='password'
          onChange={(e) => this.setState({password: e.target.value})}
          placeholder='****'
          required
        />
        <button type='submit' disabled={loading}>Log in</button>
        { error && <p>{ error }</p> }
        <p onClick={() => this.props.changeView('signup')}>
          Don't have an account? Click here to sign up.
        </p>
      </form>
    );
  }

}

export default connect(
  (state) => ({
    auth: state.auth
  })
)(LoginComponent);
