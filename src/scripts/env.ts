import * as t from './types'

import React from 'react'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk, {ThunkMiddleware} from 'redux-thunk'

import {geometry, defMobile} from './geometry/reducers'
import {i18n, defLang} from './i18n/reducers'
import {notifications} from './notifications/reducers'
import {dialogs} from './dialogs/reducers'

import {pending} from './pending/reducers'
import {user} from './user/reducers'

import {categories} from './categories/reducers'
import {accounts} from './accounts/reducers'
import {payees} from './payees/reducers'
import {transactions} from './transactions/reducers'

export const store = createStore(
  combineReducers({
    dom: combineReducers({
      geometry,
      i18n,
      notifications,
      dialogs,
    }),
    net: combineReducers({
      pending,
      user,
      categories,
      accounts,
      payees,
      transactions,
    }),
  }),
  applyMiddleware(thunk as ThunkMiddleware<t.AppState, t.ReduxAction>)
)

export const dispatch = store.dispatch

const defaultContext: t.AppContext = {
  isMobile: defMobile(window.innerWidth),
  lang: defLang(),
}

export const Context = React.createContext<t.AppContext>(defaultContext)
