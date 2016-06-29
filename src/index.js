import React from 'react';
import 'config'
import { render } from 'react-dom';
import firebase from 'firebase'
import Root from 'containers/Root';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import reducers from 'reducers'
import { loginSuccess } from 'actions/auth'
import thunk from 'redux-thunk'
import devTools from 'remote-redux-devtools';


const rootReducers = combineReducers(reducers)
const store = createStore(
  rootReducers,
  {},
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)

const unsub = firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.dispatch(loginSuccess(user.uid))
  }
  unsub()
  render(<Root store={store}/>, document.getElementById('root'));
}, (error) => console.log(error))
