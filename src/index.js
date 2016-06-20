import React from 'react';
import { render } from 'react-dom';
import Root from 'containers/Root';
import 'config'
import firebase from 'firebase'
import { createStore, combineReducers } from 'redux'
import reducers from 'reducers'
import { loginSuccess } from 'actions/auth'

const rootReducers = combineReducers(reducers)
const store = createStore(rootReducers, window.devToolsExtension && window.devToolsExtension())

const unsub = firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.dispatch(loginSuccess(user.uid))
  }
  unsub()
  render(<Root store={store}/>, document.getElementById('root'));
}, (error) => console.log(error))
