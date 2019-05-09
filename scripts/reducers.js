import * as f from 'fpx'
import * as a from './actions'
import * as u from './utils'

export const dom = (state = {
  dialogs: [],
  notifications: [],
  geometry: u.geometry(window.innerWidth),
  lang: u.DEFAULT_LANG,
}, action) => {
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

    case a.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.notification],
      }
    case a.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: f.filter(state.notifications, item => item.time !== action.time),
      }

    case a.RESIZE:
      return {
        ...state,
        geometry: action.geometry,
      }

    case a.NEXT_LANG:
      return {
        ...state,
        lang: action.lang,
      }

    default:
      return state
  }
}

export const net = (state = {
  user: {},
  transactions: [],
  transactionsById: {},
  categories: [],
  categoriesById: {},
  accounts: [],
  accountsById: {},
  payees: [],
  payeesById: {},
  pending: {},
}, action) => {
  switch (action.type) {
    case a.RECEIVE_USER:
      return {
        ...state,
        user: action.user,
      }

    case a.RECEIVE_TRANSACTIONS:
      return {
        ...state,
        transactions: action.transactions,
        transactionsById: f.keyBy(action.transactions, ({id}) => id),
      }
    case a.RECEIVE_TRANSACTION:
      return {
        ...state,
        transaction: action.transaction,
      }

    case a.RECEIVE_CATEGORIES:
      return {
        ...state,
        categories: action.categories,
        categoriesById: f.keyBy(action.categories, ({id}) => id),
      }
    case a.RECEIVE_CATEGORY:
      return {
        ...state,
        category: action.category,
      }

    case a.RECEIVE_ACCOUNTS:
      return {
        ...state,
        accounts: action.accounts,
        accountsById: f.keyBy(action.accounts, ({id}) => id),
      }
    case a.RECEIVE_ACCOUNT:
      return {
        ...state,
        account: action.account,
      }

    case a.RECEIVE_PAYEES:
      return {
        ...state,
        payees: action.payees,
        payeesById: f.keyBy(action.payees, ({id}) => id),
      }
    case a.RECEIVE_PAYEE:
      return {
        ...state,
        payee: action.payee,
      }

    case a.REQUEST_START:
      return {
        ...state,
        pending: {...state.pending, ...action.request},
      }
    case a.REQUEST_END:
      return {
        ...state,
        pending: f.pickBy(state.pending, (__, key) => key !== action.name),
      }

    default:
      return state
  }
}
