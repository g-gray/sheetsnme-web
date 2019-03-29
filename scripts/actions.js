import * as n from './net'
import * as u from './utils'

export const RESIZE                 = 'RESIZE'
export const SET_DIALOG             = 'SET_DIALOG'

export const REQUEST_USER           = 'REQUEST_USER'
export const RECEIVE_USER           = 'RECEIVE_USER'
export const REQUEST_CATEGORIES     = 'REQUEST_CATEGORIES'
export const RECEIVE_CATEGORIES     = 'RECEIVE_CATEGORIES'
export const REQUEST_ACCOUNTS       = 'REQUEST_ACCOUNTS'
export const RECEIVE_ACCOUNTS       = 'RECEIVE_ACCOUNTS'
export const REQUEST_PAYEES         = 'REQUEST_PAYEES'
export const RECEIVE_PAYEES         = 'RECEIVE_PAYEES'
export const REQUEST_TRANSACTIONS   = 'REQUEST_TRANSACTIONS'
export const RECEIVE_TRANSACTIONS   = 'RECEIVE_TRANSACTIONS'
export const RECEIVE_TRANSACTION    = 'RECEIVE_TRANSACTION'
export const POST_TRANSACTION       = 'POST_TRANSACTION'
export const REQUEST_ERROR          = 'REQUEST_ERROR'

export const resize = geometry => ({
  type: RESIZE,
  geometry,
})

export const setDialog = dialog => ({
  type: SET_DIALOG,
  dialog,
})

export const requestError = error => dispatch => {
  dispatch({type: REQUEST_ERROR, error})
  throw error
}

export const init = () => dispatch => {
  dispatch(fetchUser())
    .then(() => {
      return window.Promise.all([
        dispatch(fetchCategories()),
        dispatch(fetchAccounts()),
        dispatch(fetchPayees()),
        dispatch(fetchTransactions()),
      ])
    })
    .catch(error => error)
}

export const fetchUser = () => dispatch => {
  dispatch({type: REQUEST_USER})
  return n.authedJsonFetch('/api/user')
    .then(user => dispatch({type: RECEIVE_USER, user}))
    .catch(error => dispatch(requestError(error)))
}

export const fetchCategories  = () => dispatch => {
  dispatch({type: REQUEST_CATEGORIES})
  return n.authedJsonFetch('/api/categories')
    .then(categories => dispatch({type: RECEIVE_CATEGORIES, categories}))
    .catch(error => dispatch(requestError(error)))
}

export const fetchAccounts  = () => dispatch => {
  dispatch({type: REQUEST_ACCOUNTS})
  return n.authedJsonFetch('/api/accounts')
    .then(accounts => dispatch({type: RECEIVE_ACCOUNTS, accounts}))
    .catch(error => dispatch(requestError(error)))
}

export const fetchPayees  = () => dispatch => {
  dispatch({type: REQUEST_PAYEES})
  return n.authedJsonFetch('/api/payees')
    .then(payees => dispatch({type: RECEIVE_PAYEES, payees}))
    .catch(error => dispatch(requestError(error)))
}

export const fetchTransactions = () => dispatch => {
  dispatch({type: REQUEST_TRANSACTIONS})
  return n.authedJsonFetch('/api/transactions')
    .then(transactions => dispatch({type: RECEIVE_TRANSACTIONS, transactions}))
    .catch(error => dispatch(requestError(error)))
}

export const createTransaction = transaction => dispatch => {
  dispatch({type: POST_TRANSACTION})
  return n.authedJsonFetch('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(u.formatTransaction(transaction)),
  })
    .then(() => dispatch({type: RECEIVE_TRANSACTION, transaction}))
    .then(() => dispatch(fetchTransactions()))
    .catch(error => dispatch(requestError(error)))
}
