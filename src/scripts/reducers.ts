import * as t from './types'

// @ts-ignore
import * as fpx from 'fpx'

import * as a from './actions'
import * as u from './utils'

import * as i18n from './i18n'

const defaultDomState: t.DomState = {
  dialogs: [],
  notifications: [],
  geometry: geometry(window.innerWidth),
  lang: i18n.QUERY_LANG || u.storageRead(['lang']) || i18n.DEFAULT_LANG,
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


    case a.ADD_NOTIFICATION: {
      const {text, timeout, time} = action.payload
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            text,
            timeout,
            time,
          }
        ],
      }
    }

    case a.REMOVE_NOTIFICATION: {
      const {time} = action.payload
      return {
        ...state,
        notifications: fpx.filter(
          state.notifications,
          (notification: t.Notification) => {
            return notification.time !== time
          }
        ),
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
      const {lang} = action.payload
      return {
        ...state,
        lang,
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

    case a.RECEIVE_TRANSACTIONS:
      return {
        ...state,
        transactions: action.transactions,
        transactionsById: fpx.keyBy(action.transactions.items, ({id}) => id),
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
