import * as t from './types'

import React from 'react'
import {createStore, combineReducers, applyMiddleware, Store} from 'redux'
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

/**
 * Context
 */

export type AppContext = {
  isMobile: boolean,
  lang    : t.LANG,
}


const defaultContext: AppContext = {
  isMobile: defMobile(window.innerWidth),
  lang: defLang(),
}

export const Context = React.createContext<AppContext>(defaultContext)



/**
 * Store
 */

export type AppState = ReturnType<typeof rootReducer>


const rootReducer = combineReducers({
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
})

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk as ThunkMiddleware<t.AppState, t.ReduxAction>)
)

export const dispatch = store.dispatch



/**
 * Env
 */

declare global {
  interface Window {
    env: {
      VARS: {
        PROD            : boolean,
        COMMIT          : string,
        LANG_HEADER_NAME: string,
      },
      store: Store<AppState>,
    }
  }
}


if (!window.env.VARS.PROD) {
  window.env = {
    ...window.env,
    store,
  }
}
