import * as t from './types'

import React from 'react'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import {dom, net} from './reducers'

export const store = createStore(
  combineReducers({
    dom,
    net,
  }),
  applyMiddleware(thunk)
)

const defaultContext: t.AppContext = {
  isMobile: false,
  lang: t.LANG.en,
}

export const Context = React.createContext<t.AppContext>(defaultContext)
