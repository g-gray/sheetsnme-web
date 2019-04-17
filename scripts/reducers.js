import * as f from 'fpx'
import * as a from './actions'
import * as u from './utils'

export const dom = (state = {
  dialog: null,
  dialogs: 0,
  notifications: [],
  geometry: u.geometry(window.innerWidth),
}, action) => {
  switch (action.type) {
    case a.SET_DIALOG:
      return {
        ...state,
        dialog: action.dialog,
        dialogs: action.dialog ? state.dialogs + 1 : state.dialogs - 1,
        dialogProps: action.props,
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
}, action) => {
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

    default:
      return state
  }
}
