import React from 'react'
import {render} from 'react-dom'
import {createStore} from 'redux'
import {Provider, connect} from 'react-redux'

import {rootReducer} from './reducers'
import {resize} from './actions'

import * as u from './utils'
import * as p from './pages'

const initialState = {
  dom: {
    geometry: u.geometry(window.innerWidth),
  },
}

export const store = createStore(rootReducer, initialState)

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
