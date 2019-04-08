import * as f from 'fpx'
import * as a from './actions'
import * as u from './utils'

export const dom = (state = {
  dialog: null,
  dialogs: 0,
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
  categories: [],
  categoriesById: {},
  accounts: [],
  accountsById: {},
  payees: [],
  payeesById: {},
  pending: [],
  errors: [],
}, action) => {
  switch (action.type) {
    case a.REQUEST_USER:
      return {
        ...state,
        pending: [...state.pending, a.REQUEST_USER],
      }
    case a.RECEIVE_USER:
      return {
        ...state,
        pending: f.filter(state.pending, item => item !== a.REQUEST_USER),
        user: action.user,
      }

    case a.REQUEST_CATEGORIES:
      return {
        ...state,
        pending: [...state.pending, a.REQUEST_CATEGORIES],
      }
    case a.RECEIVE_CATEGORIES:
      return {
        ...state,
        pending: f.filter(state.pending, item => item !== a.REQUEST_CATEGORIES),
        categories: action.categories,
        categoriesById: f.keyBy(action.categories, ({id}) => id),
      }

    case a.POST_CATEGORY:
      return {
        ...state,
        pending: [...state.pending, a.POST_CATEGORY],
      }
    case a.RECEIVE_CATEGORY:
      return {
        ...state,
        pending: f.filter(state.pending, item => item !== a.POST_CATEGORY),
        category: action.category,
      }

    case a.REQUEST_ACCOUNTS:
      return {
        ...state,
        pending: [...state.pending, a.REQUEST_ACCOUNTS],
      }
    case a.RECEIVE_ACCOUNTS:
      return {
        ...state,
        pending: f.filter(state.pending, item => item !== a.REQUEST_ACCOUNTS),
        accounts: action.accounts,
        accountsById: f.keyBy(action.accounts, ({id}) => id),
      }

    case a.POST_ACCOUNT:
      return {
        ...state,
        pending: [...state.pending, a.POST_ACCOUNT],
      }
    case a.RECEIVE_ACCOUNT:
      return {
        ...state,
        pending: f.filter(state.pending, item => item !== a.POST_ACCOUNT),
        account: action.account,
      }

    case a.REQUEST_PAYEES:
      return {
        ...state,
        pending: [...state.pending, a.REQUEST_PAYEES],
      }
    case a.RECEIVE_PAYEES:
      return {
        ...state,
        pending: f.filter(state.pending, item => item !== a.REQUEST_PAYEES),
        payees: action.payees,
        payeesById: f.keyBy(action.payees, ({id}) => id),
      }

    case a.POST_PAYEE:
      return {
        ...state,
        pending: [...state.pending, a.POST_PAYEE],
      }
    case a.RECEIVE_PAYEE:
      return {
        ...state,
        pending: f.filter(state.pending, item => item !== a.POST_PAYEE),
        payee: action.payee,
      }

    case a.REQUEST_TRANSACTIONS:
      return {
        ...state,
        pending: [...state.pending, a.REQUEST_TRANSACTIONS],
      }
    case a.RECEIVE_TRANSACTIONS:
      return {
        ...state,
        pending: f.filter(state.pending, item => item !== a.REQUEST_TRANSACTIONS),
        transactions: action.transactions,
      }

    case a.POST_TRANSACTION:
      return {
        ...state,
        pending: [...state.pending, a.POST_TRANSACTION],
      }
    case a.RECEIVE_TRANSACTION:
      return {
        ...state,
        pending: f.filter(state.pending, item => item !== a.POST_TRANSACTION),
        transaction: action.transaction,
      }

    case a.REQUEST_ERROR:
      return {
        ...state,
        error: [...state.errors, action.error],
      }

    default:
      return state
  }
}
