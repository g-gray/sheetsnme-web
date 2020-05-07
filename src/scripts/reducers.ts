import * as t from './types'

// @ts-ignore
import * as fpx from 'fpx'

import * as a from './actions'

import * as i18n from './i18n/reducers'
import * as notifications from './notifications/reducers'

const defaultDomState: t.DomState = {
  dialogs: [],
  notifications: notifications.defaultState,
  geometry: geometry(window.innerWidth),
  i18n: i18n.defaultState,
}

export const dom = (state = defaultDomState, action: a.DomActions) => {
  switch (action.type) {
    case a.ADD_DIALOG: {
      const {dialog, dialogProps} = action.payload
      return {
        ...state,
        dialogs: fpx.append(state.dialogs, {
          dialog,
          dialogProps,
        }),
      }
    }

    case a.REMOVE_DIALOG: {
      return {
        ...state,
        dialogs: fpx.init(state.dialogs),
      }
    }


    case a.ADD_NOTIFICATION:
    case a.REMOVE_NOTIFICATION: {
      return {
        ...state,
        notifications: notifications.notifications(state.notifications, action)
      }
    }


    case a.RESIZE: {
      const {width} = action.payload
      return {
        ...state,
        geometry: geometry(width),
      }
    }


    case a.NEXT_LANG: {
      return {
        ...state,
        i18n: i18n.i18n(state.i18n, action)
      }
    }


    default:
      return state
  }
}

export const MOBILE_WIDTH_MAX: number = 980

export function geometry(width: number): t.Geometry {
  return {isMobile: width <= MOBILE_WIDTH_MAX}
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
