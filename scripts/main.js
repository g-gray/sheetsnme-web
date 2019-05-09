import React from 'react'
import {render} from 'react-dom'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {Provider, connect} from 'react-redux'
import thunk from 'redux-thunk'

import * as r from './reducers'
import * as a from './actions'
import * as u from './utils'

import {AppRouter} from './views/routes'

export const store = createStore(combineReducers(r), applyMiddleware(thunk))

class App extends u.ViewComponent {
  constructor(props) {
    super(props)
    props.dispatch(a.init())
  }

  render({props: {isMobile, lang}}) {
    return (
      <u.Context.Provider value={{isMobile, lang}}>
        <AppRouter />
      </u.Context.Provider>
    )
  }
}

const ConnectedApp = connect(state => ({
  isMobile: state.dom.geometry.isMobile,
  lang: state.dom.lang,
}))(App)

const elem = (
  <Provider store={store}>
    <ConnectedApp />
  </Provider>
)

const rootNode = document.getElementById('root')

render(elem, rootNode, initDom)

function initDom() {
  window.addEventListener('resize', () => {
    store.dispatch(a.resize(u.geometry(window.innerWidth)))
  })
}
