import * as t from './types'

import React from 'react'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import {geometry} from './geometry/reducers'
import {i18n} from './i18n/reducers'
import {notifications} from './notifications/reducers'
import {dialogs} from './dialogs/reducers'

import {net} from './reducers'

export const store = createStore(
  combineReducers({
    dom: combineReducers({
      geometry,
      i18n,
      notifications,
      dialogs,
    }),
    net,
  }),
  applyMiddleware(thunk)
)

const defaultContext: t.AppContext = {
  isMobile: false,
  lang: t.LANG.en,
}

export const Context = React.createContext<t.AppContext>(defaultContext)
