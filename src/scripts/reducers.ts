import * as t from './types'

// @ts-ignore
import * as f from 'fpx'

import * as a from './actions'
import * as u from './utils'

const defaultDomState: t.DomState = {
  dialogs: [],
  notifications: [],
  geometry: geometry(window.innerWidth),
  lang: u.QUERY_LANG || u.storageRead(['lang']) || u.DEFAULT_LANG,
}

export const dom = (state = defaultDomState, action: a.DomActions) => {
  switch (action.type) {
    case a.ADD_DIALOG:
      return {
        ...state,
        dialogs: f.append(state.dialogs, {
          dialog: action.dialog,
          dialogProps: action.props,
        }),
      }
    case a.REMOVE_DIALOG:
      return {
        ...state,
        dialogs: f.init(state.dialogs),
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
      return {
        ...state,
        notifications: f.filter(
          state.notifications,
          (notification: t.Notification) => {
            return notification.time !== action.payload.time
          }
        ),
      }
    }

    case a.RESIZE:
      return {
        ...state,
        geometry: geometry(action.payload.width),
      }

    case a.NEXT_LANG:
      return {
        ...state,
        lang: action.payload.lang,
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
    case a.RECEIVE_USER:
      return {
        ...state,
        user: action.user,
      }

    case a.RECEIVE_CATEGORIES:
      return {
        ...state,
        categories: action.categories,
        categoriesById: f.keyBy(action.categories, ({id}) => id),
      }

    case a.RECEIVE_ACCOUNTS: {
      const accounts: t.AccountListRes = action.payload.accounts
      return {
        ...state,
        accounts,
        accountsById: f.keyBy(accounts, (account: t.AccountRes) => account.id),
      }
    }

    case a.RECEIVE_PAYEES:
      return {
        ...state,
        payees: action.payees,
        payeesById: f.keyBy(action.payees, ({id}) => id),
      }

    case a.RECEIVE_TRANSACTIONS:
      return {
        ...state,
        transactions: action.transactions,
        transactionsById: f.keyBy(action.transactions.items, ({id}) => id),
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
        pending: f.omitBy(
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
