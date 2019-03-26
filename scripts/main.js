import React from 'react'
import {render} from 'react-dom'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {Provider, connect} from 'react-redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

import * as r from './reducers'
import * as a from './actions'

import * as u from './utils'
import * as p from './pages'

// TODO: remove logger middleware from production build
export const store = createStore(combineReducers(r), applyMiddleware(thunk, logger))

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
    store.dispatch(a.resize(u.geometry(window.innerWidth)))
  })
}
