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

const store = createStore(rootReducer, initialState)

const PageComponent = connect(state => state)(p.HomePage)

const elem = (
  <div id='root'>
    <Provider store={store}>
      <PageComponent />
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
