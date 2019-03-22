import React from 'react'
import {render} from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import {Provider, connect} from 'react-redux'
import thunk from 'redux-thunk'

import {rootReducer} from './reducers'
import {resize} from './actions'

import * as u from './utils'
import * as p from './pages'
import * as a from './actions'

const initialState = {
  dom: {
    geometry: u.geometry(window.innerWidth),
  },
  net: {
    transactions: null,
    pending: null,
    error: null,
  },
}

export const store = createStore(rootReducer, initialState, applyMiddleware(thunk))

class App extends u.ViewComponent {
  render({props}) {
    return (
      <u.Context.Provider value={{isMobile: props.isMobile}}>
        <p.HomePage />
      </u.Context.Provider>
    )
  }
}

const ConnectedApp = connect(state => ({isMobile: state.dom.geometry.isMobile}))(App)

const elem = (
  <div id='root'>
    <Provider store={store}>
      <ConnectedApp />
    </Provider>
  </div>
)

const rootNode = document.getElementById('root')

render(elem, rootNode, initDom)

function initDom() {
  window.addEventListener('resize', () => {
    store.dispatch(resize(u.geometry(window.innerWidth)))
  })
}
