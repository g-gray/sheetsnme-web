import * as t from './types'

// @ts-ignore
import * as fpx from 'fpx'

import * as a from './actions'

import * as gr from './geometry/reducers'
import * as i18nr from './i18n/reducers'
import * as nr from './notifications/reducers'
import * as dr from './dialogs/reducers'

const defaultDomState: t.DomState = {
  geometry: gr.defaultState,
  i18n: i18nr.defaultState,
  notifications: nr.defaultState,
  dialogs: dr.defaultState,
}

export const dom = (state = defaultDomState, action: a.DomActions) => {
  switch (action.type) {
    case a.RESIZE: {
      return {
        ...state,
        geometry: gr.geometry(state.geometry, action)
      }
    }

    case a.NEXT_LANG: {
      return {
        ...state,
        i18n: i18nr.i18n(state.i18n, action)
      }
    }

    case a.ADD_NOTIFICATION:
    case a.REMOVE_NOTIFICATION: {
      return {
        ...state,
        notifications: nr.notifications(state.notifications, action)
      }
    }

    case a.ADD_DIALOG:
    case a.REMOVE_DIALOG: {
      return {
        ...state,
        dialogs: dr.dialogs(state.dialogs, action)
      }
    }

    default:
      return state
  }
}



const defaultNetState: t.NetState = {
  user: {},
  transactions: {},
  transactionsById: {},
  categories: [],
  categoriesById: {},
  accounts: [],
  accountsById: {},
  payees: [],
  payeesById: {},
  pending: {},
}

export const net = (state = defaultNetState, action: a.NetAction) => {
  switch (action.type) {
    case a.RECEIVE_USER: {
      const {user} = action.payload
      return {
        ...state,
        user,
      }
    }

    case a.RECEIVE_CATEGORIES: {
      const {categories} = action.payload
      return {
        ...state,
        categories,
        categoriesById: fpx.keyBy(categories, (category: t.CategoryRes) => category.id),
      }
    }

    case a.RECEIVE_ACCOUNTS: {
      const {accounts} = action.payload
      return {
        ...state,
        accounts,
        accountsById: fpx.keyBy(accounts, (account: t.AccountRes) => account.id),
      }
    }

    case a.RECEIVE_PAYEES: {
      const {payees} = action.payload
      return {
        ...state,
        payees,
        payeesById: fpx.keyBy(payees, (payee: t.PayeeRes) => payee.id),
      }
    }

    case a.RECEIVE_TRANSACTIONS: {
      const {transactions} = action.payload
      return {
        ...state,
        transactions,
        transactionsById: fpx.keyBy(
          transactions.items,
          (transaction: t.TransactionRes) => transaction.id
        ),
      }
    }

    case a.REQUEST_START:
      return {
        ...state,
        pending: {
          ...state.pending,
          [action.payload.requestName]: true,
        },
      }
    case a.REQUEST_END:
      return {
        ...state,
        pending: fpx.omitBy(
          state.pending,
          (__: boolean, requestName: string) => {
            return requestName === action.payload.requestName
          }
        ),
      }

    default:
      return state
  }
}
