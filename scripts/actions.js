import * as n from './net'
import * as u from './utils'

export const RESIZE = 'RESIZE'
export const resize = geometry => ({
  type: RESIZE,
  geometry,
})

export const REQUEST_TRANSACTIONS = 'REQUEST_TRANSACTIONS'
export const requestTransactions = () => ({
  type: REQUEST_TRANSACTIONS,
})

export const RECEIVE_TRANSACTIONS = 'RECEIVE_TRANSACTIONS'
export const receiveTransactions = transactions => ({
  type: RECEIVE_TRANSACTIONS,
  transactions,
})

export const FETCH_ERROR = 'FETCH_ERROR'
export const fetchError = error => ({
  type: FETCH_ERROR,
  error,
})

export const fetchTransactions = () => dispatch => {
  dispatch(requestTransactions())
  n.authedJsonFetch('/api/transactions')
    .then(transactions => dispatch(receiveTransactions(transactions)))
    .catch(error => dispatch(fetchError(error)))
}

export const TRANSACTION_FORM_CHANGE = 'TRANSACTION_FORM_CHANGE'
export const transactionChange = field => ({
  type: TRANSACTION_FORM_CHANGE,
  field,
})

export const POST_TRANSACTION = 'POST_TRANSACTION'
export const postTransactions = () => ({
  type: POST_TRANSACTION,
})

export const createTransaction = () => (dispatch, getState) => {
  const {net: {transaction}} = getState()
  dispatch(postTransactions())
  n.authedJsonFetch('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(u.formatTransaction(transaction)),
  })
    .then(() => console.info('success'))
}
